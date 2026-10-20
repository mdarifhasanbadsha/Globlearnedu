// ─────────────────────────────────────────────────────────────
// Meta (Messenger) event ingestion.
//
// Responsibilities:
//   - map a Facebook PSID to a biz_conversation (channel='messenger')
//   - persist inbound student messages
//   - persist our own sends (message_echoes) so history is complete
//   - never reply to our own echo  (infinite AI loop prevention)
//   - be idempotent: Meta redelivers on non-2xx or timeouts
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizConversations, bizMessages } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { VOICE_PLACEHOLDER } from "@/lib/business/voice";
import { and, eq, desc } from "drizzle-orm";

interface MetaMessage {
  mid?: string;
  text?: string;
  is_echo?: boolean;
  app_id?: number;
  attachments?: { type?: string; payload?: { url?: string } }[];
}

interface MetaEntry {
  id?: string;
  time?: number;
  messaging?: {
    sender?: { id?: string };
    recipient?: { id?: string };
    timestamp?: number;
    message?: MetaMessage;
    postback?: { title?: string; payload?: string };
  }[];
  changes?: {
    field?: string;
    value?: Record<string, unknown>;
  }[];
}

const PAGE_ID = () => process.env.META_PAGE_ID?.trim() ?? "";

/** Find or create the conversation for a Messenger PSID. */
async function conversationForPsid(businessId: string, psid: string): Promise<string> {
  const [existing] = await db
    .select({ id: bizConversations.id })
    .from(bizConversations)
    .where(
      and(
        eq(bizConversations.businessId, businessId),
        eq(bizConversations.channel, "messenger"),
        eq(bizConversations.visitorId, psid)
      )
    )
    .orderBy(desc(bizConversations.lastMessageAt))
    .limit(1);

  if (existing) return existing.id;

  const [created] = await db
    .insert(bizConversations)
    .values({
      businessId,
      visitorId: psid,
      channel: "messenger",
      status: "open",
      aiState: "active",
      subject: "Messenger conversation",
    })
    .returning({ id: bizConversations.id });

  return created.id;
}

async function storeMessage(args: {
  businessId: string;
  conversationId: string;
  direction: "in" | "out";
  authorKind: "student" | "staff" | "system";
  body: string;
  meta: Record<string, unknown>;
}) {
  await db.insert(bizMessages).values({
    businessId: args.businessId,
    conversationId: args.conversationId,
    direction: args.direction,
    authorKind: args.authorKind,
    body: args.body,
    meta: args.meta,
  });
}

/** Persist and return how many messages were stored. */
export async function routeMetaEvent(payload: unknown): Promise<number> {
  const obj = payload as { object?: string; entry?: MetaEntry[] };
  if (obj?.object !== "page" || !Array.isArray(obj.entry)) return 0;

  const businessId = getBusinessId();
  const pageId = PAGE_ID();
  let stored = 0;

  for (const entry of obj.entry) {
    // Ignore traffic for a different Page (defensive).
    if (pageId && entry.id && entry.id !== pageId) continue;

    for (const ev of entry.messaging ?? []) {
      const psid = ev.sender?.id;
      if (!psid) continue;

      const msg = ev.message;

      if (msg) {
        const isEcho = msg.is_echo === true;

        // Echo of our own send: record it once, never treat it as inbound.
        if (isEcho) {
          const convId = await conversationForPsid(businessId, ev.recipient?.id ?? psid);
          const body = msg.text ?? "";
          // Skip empty echoes (e.g. pure attachments already logged on send).
          if (body.trim().length > 0) {
            await storeMessage({
              businessId,
              conversationId: convId,
              direction: "out",
              authorKind: "staff",
              body,
              meta: { source: "messenger_echo", mid: msg.mid ?? null },
            });
            stored++;
          }
          continue;
        }

        const convId = await conversationForPsid(businessId, psid);

        // Attachment-first: a voice note has no text, so we must not store
        // an empty body and must not let the AI invent what was said.
        const audio = msg.attachments?.find((a) => {
          const url = a.payload?.url ?? "";
          return /audio|voice/i.test(a.type ?? "") || /audioclip/i.test(url);
        });

        let body = msg.text ?? "";
        let mediaUrl: string | null = null;
        let mediaKind: string | null = null;

        if (audio) {
          mediaKind = "audio";
          mediaUrl = audio.payload?.url ?? null;
          // No ASR provider wired for live traffic yet: store an explicit
          // placeholder that the AI is instructed to recognise.
          if (!body) body = VOICE_PLACEHOLDER;
        } else if (!body && msg.attachments?.length) {
          const kinds = msg.attachments.map((a) => a.type ?? "attachment").join(", ");
          body = `[${kinds}]`;
        }

        if (!body) continue;

        await db.insert(bizMessages).values({
          businessId,
          conversationId: convId,
          direction: "in",
          authorKind: "student",
          body,
          mediaUrl,
          mediaKind,
          meta: { source: "messenger", mid: msg.mid ?? null },
        });

        await db
          .update(bizConversations)
          .set({
            lastMessageAt: new Date(),
            // Opens Meta's 24-hour free-messaging window.
            lastInboundAt: new Date(),
            updatedAt: new Date(),
            status: "open",
          })
          .where(eq(bizConversations.id, convId));

        // Reply automatically when the AI still owns the thread. This only
        // runs for live webhook traffic; the history import calls its own
        // path so thousands of old messages never trigger replies.
        if (process.env.META_AUTOREPLY !== "off") {
          try {
            const { autoReplyToMessenger } = await import("@/lib/business/messenger-autoreply");
            const outcome = await autoReplyToMessenger(convId);
            console.log(
              `[messenger] auto-reply ${outcome.sent ? "sent" : "skipped"}: ${outcome.reason}`
            );
          } catch (e) {
            console.error("[messenger] auto-reply crashed:", (e as Error)?.message);
          }
        }

        // Keep the pipeline honest: a student replying means the lead is alive.
        try {
          const { onStudentReplied } = await import("@/lib/business/stage-automation");
          const adv = await onStudentReplied({ businessId, conversationId: convId });
          if (adv.moved) {
            console.log(`[workflow] lead stage ${adv.from} -> ${adv.to}`);
          }
        } catch (e) {
          console.error("[workflow] stage automation failed:", (e as Error)?.message);
        }

        // Capture who this is, and where they came from.
        // A name in the inbox turns "Messenger t_647061" into a person.
        try {
          const { syncConversationProfile, referralFields } = await import(
            "@/lib/business/profile"
          );

          const [c] = await db
            .select({ name: bizConversations.contactName })
            .from(bizConversations)
            .where(eq(bizConversations.id, convId))
            .limit(1);

          // Fetch the profile once per thread unless it is still unknown.
          if (!c?.name) {
            const synced = await syncConversationProfile(businessId, convId);
            if (synced.ok) console.log(`[profile] ${synced.name ?? "unknown"}`);
          }

          // Referral is only delivered on the live event, so store it now.
          const src = referralFields((ev as any).referral);
          if (Object.keys(src).length > 0) {
            await db.update(bizConversations).set(src).where(eq(bizConversations.id, convId));
            console.log(`[source] ${String((src as any).sourceKind)}`);
          }
        } catch (e) {
          console.error("[profile] sync failed:", (e as Error)?.message);
        }

        stored++;
        continue;
      }

      // Postback (button tap) arrives without a message object.
      if (ev.postback) {
        const convId = await conversationForPsid(businessId, psid);
        await storeMessage({
          businessId,
          conversationId: convId,
          direction: "in",
          authorKind: "student",
          body: `[button] ${ev.postback.title ?? ev.postback.payload ?? ""}`.trim(),
          meta: { source: "messenger_postback" },
        });
        stored++;
      }
    }

    // Page-feed style changes (lead forms etc.) are acknowledged but not
    // stored yet; they need their own mapper and are intentionally inert.
    void entry.changes;
  }

  return stored;
}
