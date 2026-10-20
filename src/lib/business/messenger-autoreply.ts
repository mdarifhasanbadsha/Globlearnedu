// ─────────────────────────────────────────────────────────────────────
// Messenger auto-reply.
//
// Inbound message -> persist -> wait for the student to stop typing ->
// answer the whole burst once -> send.
//
// Design rules:
//   - the typing indicator runs first, so the wait reads as a person
//     composing, not a machine pausing
//   - several messages in one burst become ONE reply, not one each
//   - a quoted message is passed to the model so "ai ta koto?" is anchored
//   - junk replies are blocked before they reach the student
//   - a human always wins: takeover, pause, opt-out and handoff all stop it
// ─────────────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizConversations, bizMessages } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { isDeepSeekConfigured, deepseekChatWithRetry } from "@/lib/business/deepseek";
import {
  buildCounselingMessages,
  loadApprovedKnowledge,
  parseCounselingReply,
} from "@/lib/business/counseling";
import { loadActiveStyleGuide, formatStyleGuide } from "@/lib/business/style";
import { sendMessengerText, windowOpen } from "@/lib/business/messenger-send";
import {
  sendTypingOn,
  sendTypingOff,
  recentInboundBurst,
  burstSettled,
  joinBurst,
  BATCH_QUIET_MS,
} from "@/lib/business/conversation-flow";
import { isUsableReply } from "@/lib/business/reply-quality";
import { and, eq, asc, sql } from "drizzle-orm";

export interface AutoReplyOutcome {
  attempted: boolean;
  reason: string;
  sent?: boolean;
  error?: string;
  batched?: number;
}

const OPT_OUT = /(stop|unsubscribe|don'?t message|message koro na|মেসেজ করবেন না|বন্ধ করুন)/i;

export async function autoReplyToMessenger(
  conversationId: string,
  opts: { waitForQuiet?: boolean } = {}
): Promise<AutoReplyOutcome> {
  const businessId = getBusinessId();

  const [conv] = await db
    .select({
      id: bizConversations.id,
      visitorId: bizConversations.visitorId,
      channel: bizConversations.channel,
      aiState: bizConversations.aiState,
      handoffAt: bizConversations.handoffAt,
      lastInboundAt: bizConversations.lastInboundAt,
    })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, conversationId)))
    .limit(1);

  if (!conv) return { attempted: false, reason: "conversation not found" };
  if (conv.channel !== "messenger") return { attempted: false, reason: "not a messenger conversation" };
  if (conv.aiState === "paused") {
    // A human explicitly paused automation. Only they should resume it.
    return { attempted: false, reason: "ai paused by staff" };
  }

  if (conv.aiState === "handoff_requested") {
    // Offering a human must not silence the thread forever. If no staff
    // member has actually taken over and the student keeps writing, the AI
    // resumes so they are never left with silence.
    const since = conv.handoffAt ? new Date(conv.handoffAt).getTime() : 0;
    const RESUME_AFTER_MS = 2 * 60 * 1000;

    if (Date.now() - since < RESUME_AFTER_MS) {
      return { attempted: false, reason: "handoff pending, waiting for a human" };
    }

    await db
      .update(bizConversations)
      .set({ aiState: "active", updatedAt: new Date() })
      .where(eq(bizConversations.id, conversationId));
    console.log("[messenger] handoff aged out — AI resumed");
  } else if (conv.aiState !== "active") {
    return { attempted: false, reason: `ai is ${conv.aiState}` };
  }
  if (!isDeepSeekConfigured()) return { attempted: false, reason: "AI key not configured" };
  if (!windowOpen(conv.lastInboundAt ?? null)) return { attempted: false, reason: "24h window closed" };

  // ── batching: wait until the student has stopped typing ──
  const burst = await recentInboundBurst(conversationId);
  if (burst.length === 0) return { attempted: false, reason: "no inbound message" };

  const newest = burst[burst.length - 1];
  if (opts.waitForQuiet !== false && !burstSettled(newest.createdAt)) {
    // Still typing. The client re-invokes shortly via the settle endpoint.
    return { attempted: false, reason: "student still typing" };
  }

  if (OPT_OUT.test(joinBurst(burst))) {
    await db
      .update(bizConversations)
      .set({ aiState: "paused", updatedAt: new Date() })
      .where(eq(bizConversations.id, conversationId));
    return { attempted: false, reason: "student asked to stop" };
  }

  // ── typing indicator BEFORE we think ──
  const psid = conv.visitorId;
  await sendTypingOn(psid);

  const history = await db
    .select({ direction: bizMessages.direction, body: bizMessages.body })
    .from(bizMessages)
    .where(eq(bizMessages.conversationId, conversationId))
    .orderBy(asc(bizMessages.createdAt))
    .limit(30);

  const burstText = joinBurst(burst);

  // Earlier inbound messages are context, not new questions.
  const burstIds = new Set(burst.map((b) => b.id));
  const historyBeforeBurst = history.slice(0, Math.max(0, history.length - burst.length));

  const knowledge = await loadApprovedKnowledge(businessId, burstText);
  const style = await loadActiveStyleGuide(businessId);

  const messages = buildCounselingMessages({
    history: historyBeforeBurst,
    latestMessage: burstText,
    knowledge,
    styleGuide: style ? formatStyleGuide(style) : null,
  });

  // Read the quote defensively: the column only exists after the schema
  // catch-up has run, and the reply must work either way.
  let quotedMessage: string | null = null;
  try {
    const rows: any[] = await db
      .execute(
        sql`select pending_quote from biz_conversations where id = ${conversationId} limit 1`
      )
      .then((r: any) => r?.rows ?? r ?? []);
    quotedMessage = rows?.[0]?.pending_quote ?? null;
  } catch {
    quotedMessage = null;
  }

  if (quotedMessage) {
    messages.splice(
      1,
      0,
      {
        role: "system",
        content: `The student is replying to this earlier message: "${quotedMessage.slice(0, 400)}". Interpret their question in that context.`,
      }
    );
    try {
      await db
        .update(bizConversations)
        .set({ updatedAt: new Date() })
        .where(eq(bizConversations.id, conversationId));
      await db.execute(
        sql`update biz_conversations set pending_quote = null, pending_quote_at = null where id = ${conversationId}`
      );
    } catch {
      /* clearing the quote is best effort */
    }
  }

  // Tell the model when several messages form one thought.
  if (burst.length > 1) {
    messages.splice(1, 0, {
      role: "system",
      content:
        `The student sent ${burst.length} short messages in quick succession. ` +
        "Treat them as ONE single message and answer them together in one reply. " +
        "Do not answer each one separately.",
    });
  }
  void burstIds;

  const result = await deepseekChatWithRetry({
    messages,
    maxTokens: 2500,
    timeoutMs: 30_000,
    jsonMode: false,
    temperature: 0.4,
  });

  await sendTypingOff(psid);

  let reply: string | null = null;
  let wantsHandoff = false;

  if (result.ok && result.content) {
    const parsed = parseCounselingReply(result.content, burstText);
    reply = parsed.reply;
    wantsHandoff = parsed.wantsHumanHandoff;
  }

  if (!reply) return { attempted: false, reason: result.error ?? "AI returned no reply", batched: burst.length };

  // Never send junk. A bad reply is worse than a short wait.
  const usable = isUsableReply(reply, burstText);
  if (!usable.ok) {
    console.error(`[messenger] blocked unusable reply: ${usable.reason} | "${reply.slice(0, 80)}"`);
    return { attempted: false, reason: `blocked reply: ${usable.reason}`, batched: burst.length };
  }

  const [saved] = await db
    .insert(bizMessages)
    .values({
      businessId,
      conversationId,
      direction: "out",
      authorKind: "ai",
      body: reply,
      meta: { source: "messenger_auto_reply", batched: burst.length, quietMs: BATCH_QUIET_MS },
    })
    .returning({ id: bizMessages.id });

  const sent = await sendMessengerText({
    businessId,
    conversationId,
    recipientId: psid,
    body: reply,
    messageId: saved?.id,
  });

  if (wantsHandoff) {
    await db
      .update(bizConversations)
      .set({ aiState: "handoff_requested", handoffAt: new Date(), updatedAt: new Date() })
      .where(eq(bizConversations.id, conversationId));
  }

  return {
    attempted: true,
    reason: sent.ok ? "sent" : (sent.skipped ?? sent.errorMessage ?? "send failed"),
    sent: sent.ok,
    error: sent.ok ? undefined : sent.errorCode,
    batched: burst.length,
  };
}
