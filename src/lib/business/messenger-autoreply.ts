// ─────────────────────────────────────────────────────────────
// Messenger auto-reply.
//
// Inbound message -> persist -> decide whether AI should answer ->
// generate a grounded reply -> send it back through the Graph API.
//
// Deliberately conservative. The AI does NOT reply when:
//   - a human owns the thread (takeover)
//   - the AI is paused or a handoff was requested
//   - the person opted out
//   - the 24-hour window has closed (Meta would reject anyway)
//   - the message is an echo of our own send
// Every outcome is recorded, so "why did nobody answer?" is answerable.
// ─────────────────────────────────────────────────────────────

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
import { and, eq, asc } from "drizzle-orm";

export interface AutoReplyOutcome {
  attempted: boolean;
  reason: string;
  sent?: boolean;
  error?: string;
}

const OPT_OUT = /(stop|unsubscribe|don'?t message|message koro na|মেসেজ করবেন না|বন্ধ করুন)/i;

export async function autoReplyToMessenger(conversationId: string): Promise<AutoReplyOutcome> {
  const businessId = getBusinessId();

  const [conv] = await db
    .select()
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, conversationId)))
    .limit(1);

  if (!conv) return { attempted: false, reason: "conversation not found" };
  if (conv.channel !== "messenger") {
    return { attempted: false, reason: "not a messenger conversation" };
  }
  if (conv.aiState !== "active") {
    return { attempted: false, reason: `ai is ${conv.aiState}` };
  }
  if (!isDeepSeekConfigured()) {
    return { attempted: false, reason: "AI key not configured" };
  }
  if (!windowOpen(conv.lastInboundAt ?? null)) {
    return { attempted: false, reason: "24h window closed" };
  }

  // Bounded recent history for context.
  const history = await db
    .select({ direction: bizMessages.direction, body: bizMessages.body })
    .from(bizMessages)
    .where(eq(bizMessages.conversationId, conversationId))
    .orderBy(asc(bizMessages.createdAt))
    .limit(30);

  const inbound = history.filter((h) => h.direction === "in");
  const latest = inbound[inbound.length - 1];
  if (!latest) return { attempted: false, reason: "no inbound message" };

  // Opt-out must win over any automation.
  if (OPT_OUT.test(latest.body)) {
    await db
      .update(bizConversations)
      .set({ aiState: "paused", updatedAt: new Date() })
      .where(eq(bizConversations.id, conversationId));
    return { attempted: false, reason: "student asked to stop" };
  }

  const knowledge = await loadApprovedKnowledge(businessId, latest.body);
  const style = await loadActiveStyleGuide(businessId);

  const messages = buildCounselingMessages({
    history: history.slice(0, -1),
    latestMessage: latest.body,
    knowledge,
    styleGuide: style ? formatStyleGuide(style) : null,
  });

  const result = await deepseekChatWithRetry({
    messages,
    maxTokens: 2500,
    timeoutMs: 30_000,
    jsonMode: false,
    temperature: 0.4,
  });

  let reply: string | null = null;
  let wantsHandoff = false;

  if (result.ok && result.content) {
    const parsed = parseCounselingReply(result.content, latest.body);
    reply = parsed.reply;
    wantsHandoff = parsed.wantsHumanHandoff;
  }

  if (!reply) {
    return { attempted: false, reason: result.error ?? "AI returned no reply" };
  }

  // Persist the AI reply first, so the transcript stays truthful even if
  // the network send fails.
  const [saved] = await db
    .insert(bizMessages)
    .values({
      businessId,
      conversationId,
      direction: "out",
      authorKind: "ai",
      body: reply,
      meta: { source: "messenger_auto_reply" },
    })
    .returning({ id: bizMessages.id });

  const sent = await sendMessengerText({
    businessId,
    conversationId,
    recipientId: conv.visitorId,
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
  };
}
