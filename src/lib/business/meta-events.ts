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
import { quotedFromEvent } from "@/lib/business/conversation-flow";
import { and, eq, desc, gte, gt } from "drizzle-orm";

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

          // We already stored this message when we sent it, so Meta echoing
          // it back must not create a second bubble in the thread.
          //
          // Meta also echoes messages a HUMAN typed in the Page inbox, which
          // we have never seen and must store. So the test is not "did we
          // send something" but "is this exact text already the most recent
          // outbound message here". Comparing against the latest row also
          // avoids depending on clock skew between Meta and Neon, which is
          // why the timestamp-window version let duplicates through.
          if (body.trim().length > 0) {
            const [last] = await db
              .select({ body: bizMessages.body })
              .from(bizMessages)
              .where(
                and(eq(bizMessages.conversationId, convId), eq(bizMessages.direction, "out"))
              )
              .orderBy(desc(bizMessages.createdAt))
              .limit(1);

            const normalise = (s: string) => s.replace(/\s+/g, " ").trim();
            const isDupe = !!last && normalise(last.body) === normalise(body);

            if (!isDupe) {
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
          }
          continue;
        }

        const convId = await conversationForPsid(businessId, psid);

        // A student must never be shown our own words as their own.
        //
        // Messenger does not reliably set is_echo (and postback/attachment
        // events never carry it), so an outgoing reply could be re-ingested
        // as an inbound message. In production this looped: the AI read its
        // own reply, repeated it, and each copy became a 5,000-character
        // "student" message.
        //
        // So BEFORE treating anything as student text, check whether it is
        // already one of our recent outbound messages.
        const inboundCandidate = (msg.text ?? "").trim();
        if (inboundCandidate.length > 0) {
          const recentOut = await db
            .select({ body: bizMessages.body })
            .from(bizMessages)
            .where(
              and(
                eq(bizMessages.conversationId, convId),
                eq(bizMessages.direction, "out"),
                gt(bizMessages.createdAt, new Date(Date.now() - 10 * 60 * 1000))
              )
            )
            .orderBy(desc(bizMessages.createdAt))
            .limit(8);

          const norm = (s: string) => s.replace(/\s+/g, " ").trim();
          const incoming = norm(inboundCandidate);
          const isOurOwnText = recentOut.some((o) => {
            const mine = norm(o.body);
            if (!mine) return false;
            // Exact match, or the incoming text is our own reply repeated.
            return (
              incoming === mine ||
              (incoming.length > 60 && (incoming.includes(mine) || mine.includes(incoming)))
            );
          });

          if (isOurOwnText) {
            console.log("[messenger] dropped re-ingested outbound text");
            continue;
          }
        }

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

        // Everything a student message must trigger: identity, auto-reply
        // and pipeline movement. Shared with the postback branch so a
        // button tap is never silently left unanswered.
        await afterInbound({
          businessId,
          conversationId: convId,
          psid,
          quoted: quotedFromEvent(ev)?.text ?? null,
        });

        stored++;
        continue;
      }

      // Postback (button tap) arrives without a message object.
      if (ev.postback) {
        const convId = await conversationForPsid(businessId, psid);

        // A button tap is still a student speaking to us: it must open the
        // 24h window and it must be answerable, exactly like text.
        const pbText = ev.postback.title ?? ev.postback.payload ?? "";
        await storeMessage({
          businessId,
          conversationId: convId,
          direction: "in",
          authorKind: "student",
          body: pbText.length > 0 ? pbText : "[button]",
          meta: { source: "messenger_postback", payload: ev.postback.payload ?? null },
        });

        await db
          .update(bizConversations)
          .set({
            lastMessageAt: new Date(),
            lastInboundAt: new Date(),
            updatedAt: new Date(),
            status: "open",
          })
          .where(eq(bizConversations.id, convId));

        await afterInbound({ businessId, conversationId: convId, psid });
        stored++;
      }
    }

    // Page-feed style changes (lead forms etc.) are acknowledged but not
    // stored yet; they need their own mapper and are intentionally inert.
    void entry.changes;
  }

  return stored;
}

/**
 * Everything that must happen after a student message, regardless of
 * whether it arrived as text, an attachment or a button tap.
 *
 * Keeping this in one place is what stopped postbacks from silently
 * receiving no reply.
 */
async function afterInbound(args: {
  businessId: string;
  conversationId: string;
  psid: string;
  /** The earlier message this one replies to, if any. */
  quoted?: string | null;
}): Promise<void> {
  const { businessId, conversationId, psid } = args;

  // Remember the quote so the settled (batched) reply can use it too.
  // Wrapped because the column may not exist until the schema catch-up has
  // run; a missing column must never stop the reply itself.
  if (args.quoted) {
    try {
      await db
        .update(bizConversations)
        .set({
          pendingQuote: args.quoted.slice(0, 400),
          pendingQuoteAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(bizConversations.id, conversationId));
    } catch {
      /* the reply still works without the quote */
    }
  } else {
    // Nothing quoted: clear any stale quote from an earlier message so it is
    // not applied to this one. Best effort only.
    try {
      await db
        .update(bizConversations)
        .set({ pendingQuote: null, pendingQuoteAt: null })
        .where(eq(bizConversations.id, conversationId));
    } catch {
      /* ignore */
    }
  }

  // 1. Identity: name and photo, retried until we have a name.
  try {
    const [c] = await db
      .select({ name: bizConversations.contactName })
      .from(bizConversations)
      .where(eq(bizConversations.id, conversationId))
      .limit(1);

    if (!c?.name) {
      const { syncConversationProfile } = await import("@/lib/business/profile");
      const synced = await syncConversationProfile(businessId, conversationId);
      console.log(`[profile] ${synced.ok ? synced.name : "failed: " + synced.error}`);
    }
  } catch (e) {
    console.error("[profile] sync failed:", (e as Error)?.message);
  }

  // 2. Auto-reply, if the AI still owns the thread.
  //
  // A student often sends several short messages in a few seconds. We show
  // the typing indicator immediately (so they know we are there), then wait
  // for them to stop before answering the whole burst as one turn.
  if (process.env.META_AUTOREPLY !== "off") {
    try {
      const { sendTypingOn, BATCH_QUIET_MS } = await import("@/lib/business/conversation-flow");
      const { autoReplyToMessenger } = await import("@/lib/business/messenger-autoreply");

      // Immediate feedback: "typing…" appears while they are still typing.
      await sendTypingOn(psid);

      const first = await autoReplyToMessenger(conversationId, { waitForQuiet: false });
      if (first.attempted) {
        console.log(`[messenger] auto-reply ${first.sent ? "sent" : "skipped"}: ${first.reason}`);
      } else if (first.reason === "student still typing") {
        // Let the burst settle, then answer once. waitUntil keeps the
        // Worker alive after the HTTP response so Meta does not retry.
        const settle = (async () => {
          await new Promise((r) => setTimeout(r, BATCH_QUIET_MS + 1500));
          const outcome = await autoReplyToMessenger(conversationId, { waitForQuiet: true });
          console.log(
            `[messenger] batched reply ${outcome.sent ? "sent" : "skipped"}: ${outcome.reason} ` +
              `(${outcome.batched ?? 0} messages)`
          );
        })();

        const exec = (globalThis as any).ctx?.waitUntil;
        if (typeof exec === "function") exec.call((globalThis as any).ctx, settle);
        else void settle;
      } else {
        console.log(`[messenger] auto-reply skipped: ${first.reason}`);
      }
    } catch (e) {
      console.error("[messenger] auto-reply crashed:", (e as Error)?.message);
    }
  }

  // 3. Pipeline: a student replying means the lead is alive.
  try {
    const { onStudentReplied } = await import("@/lib/business/stage-automation");
    const adv = await onStudentReplied({ businessId, conversationId });
    if (adv.moved) console.log(`[workflow] lead stage ${adv.from} -> ${adv.to}`);
  } catch (e) {
    console.error("[workflow] stage automation failed:", (e as Error)?.message);
  }
}
