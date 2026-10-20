// ─────────────────────────────────────────────────────────────
// Messenger send.
//
// Two hard platform rules drive this:
//
//  1. The 24-hour window. A Page may send free-form text only within 24
//     hours of the person's last message. Outside that, only an approved
//     message tag or template is allowed. We refuse rather than let Meta
//     reject it silently.
//
//  2. Sends can fail. Every attempt is recorded so a failure stays visible
//     instead of vanishing. An ambiguous timeout is marked unknown, never
//     retried blindly, because a retry could duplicate a real message.
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizOutboundSends } from "@/lib/db/schema.business2";
import { bizMessages, bizConversations } from "@/lib/db/schema.business";
import { eq, and, desc } from "drizzle-orm";

export const WINDOW_HOURS = 24;

export interface SendResult {
  ok: boolean;
  status: "sent" | "failed" | "deferred" | "unknown";
  providerId?: string;
  errorCode?: string;
  errorMessage?: string;
  /** Human explanation when we did not attempt the send. */
  skipped?: string;
}

function token(): string | null {
  const t = process.env.META_PAGE_ACCESS_TOKEN?.trim();
  return t && t.length > 0 ? t : null;
}

function graphBase(): string {
  const v = process.env.META_GRAPH_VERSION?.trim() || "v23.0";
  return `https://graph.facebook.com/${v}`;
}

/** Is free-form messaging still allowed for this conversation? */
export function windowOpen(lastInboundAt: Date | null, now = new Date()): boolean {
  if (!lastInboundAt) return false;
  const ageMs = now.getTime() - new Date(lastInboundAt).getTime();
  return ageMs >= 0 && ageMs < WINDOW_HOURS * 3600_000;
}

export function windowClosesAt(lastInboundAt: Date | null): Date | null {
  if (!lastInboundAt) return null;
  return new Date(new Date(lastInboundAt).getTime() + WINDOW_HOURS * 3600_000);
}

interface SendArgs {
  businessId: string;
  conversationId: string;
  recipientId: string;
  body: string;
  /** When true, only record the attempt if a real send happens. */
  messageId?: string;
  now?: Date;
}

/**
 * Send a free-form text message to a Messenger PSID.
 * Returns a result instead of throwing, so callers can log and move on.
 */
export async function sendMessengerText(args: SendArgs): Promise<SendResult> {
  const { businessId, conversationId, recipientId, body } = args;
  const now = args.now ?? new Date();

  const pageToken = token();
  if (!pageToken) {
    // Record it: a silent failure here is how "nobody answered" becomes
    // unexplainable later.
    await db.insert(bizOutboundSends).values({
      businessId,
      conversationId,
      messageId: args.messageId ?? null,
      channel: "messenger",
      recipientId,
      body,
      status: "failed",
      errorCode: "NO_TOKEN",
      errorMessage: "META_PAGE_ACCESS_TOKEN is not configured",
    });

    return {
      ok: false,
      status: "failed",
      errorCode: "NO_TOKEN",
      errorMessage: "META_PAGE_ACCESS_TOKEN is not configured",
    };
  }

  // Check the window before spending an API call.
  const [conv] = await db
    .select({ lastInboundAt: bizConversations.lastInboundAt })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, conversationId)))
    .limit(1);

  if (!windowOpen(conv?.lastInboundAt ?? null, now)) {
    const closes = windowClosesAt(conv?.lastInboundAt ?? null);
    const [row] = await db
      .insert(bizOutboundSends)
      .values({
        businessId,
        conversationId,
        messageId: args.messageId ?? null,
        channel: "messenger",
        recipientId,
        body,
        status: "deferred",
        deferredReason: closes
          ? `24h window closed at ${closes.toISOString()}`
          : "no inbound message from this person yet",
      })
      .returning({ id: bizOutboundSends.id });

    return {
      ok: false,
      status: "deferred",
      skipped: closes
        ? "Outside Meta's 24-hour window — an approved template is required."
        : "The student has not messaged recently, so a template is required.",
      errorCode: "WINDOW_CLOSED",
      providerId: row?.id,
    };
  }

  const [attempt] = await db
    .insert(bizOutboundSends)
    .values({
      businessId,
      conversationId,
      messageId: args.messageId ?? null,
      channel: "messenger",
      recipientId,
      body,
      status: "pending",
      attempts: 1,
    })
    .returning({ id: bizOutboundSends.id });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(`${graphBase()}/me/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        messaging_type: "RESPONSE",
        message: { text: body.slice(0, 2000) },
        access_token: pageToken,
      }),
      signal: controller.signal,
    });

    const json: any = await res.json().catch(() => ({}));

    if (res.ok) {
      await db
        .update(bizOutboundSends)
        .set({
          status: "sent",
          providerId: json?.message_id ?? null,
          sentAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(bizOutboundSends.id, attempt.id));

      return { ok: true, status: "sent", providerId: json?.message_id };
    }

    const code = String(json?.error?.code ?? res.status);
    const msg = json?.error?.message ?? `HTTP ${res.status}`;

    await db
      .update(bizOutboundSends)
      .set({
        status: "failed",
        errorCode: code,
        errorMessage: msg.slice(0, 500),
        updatedAt: new Date(),
      })
      .where(eq(bizOutboundSends.id, attempt.id));

    return { ok: false, status: "failed", errorCode: code, errorMessage: msg };
  } catch (e: any) {
    // Timeout or network drop: we do not know whether Meta delivered it.
    // Mark unknown rather than retrying, which could duplicate the message.
    const aborted = e?.name === "AbortError";
    await db
      .update(bizOutboundSends)
      .set({
        status: "unknown",
        errorMessage: aborted ? "timeout" : (e?.message ?? "network error"),
        updatedAt: new Date(),
      })
      .where(eq(bizOutboundSends.id, attempt.id));

    return {
      ok: false,
      status: "unknown",
      errorCode: aborted ? "TIMEOUT" : "NETWORK",
      errorMessage: aborted ? "Send timed out; delivery unknown." : (e?.message ?? "network error"),
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Find the Messenger PSID behind a conversation. */
export async function messengerRecipient(
  businessId: string,
  conversationId: string
): Promise<string | null> {
  const [row] = await db
    .select({ visitorId: bizConversations.visitorId, channel: bizConversations.channel })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, conversationId)))
    .limit(1);

  if (!row || row.channel !== "messenger") return null;
  return row.visitorId;
}

/** Recent send attempts, for the health/visibility views. */
export async function recentSends(businessId: string, limit = 20) {
  return db
    .select()
    .from(bizOutboundSends)
    .where(eq(bizOutboundSends.businessId, businessId))
    .orderBy(desc(bizOutboundSends.createdAt))
    .limit(limit);
}
