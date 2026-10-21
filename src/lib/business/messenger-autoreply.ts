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
  knownFacts,
  conversationRecap,
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

  // Classify before spending a model call. Greetings, thanks, off-topic chat
  // and attempts to break scope get a short scripted answer instead. Clear
  // abuse is answered calmly and never reaches the model.
  const { classifyMessage } = await import("@/lib/business/intent");
  const burstTextForIntent = joinBurst(burst);
  const intent = classifyMessage(burstTextForIntent);

  // ── rest mode ──
  // After several non-genuine turns in a row, step away for fifteen minutes
  // rather than keep answering. A genuine question always wins over the timer.
  //
  // Read defensively: if the resting_until column has not been added yet, a
  // failed select here would throw and abort the entire reply, leaving the
  // student with silence — exactly what happened once in production. A broken
  // rest feature must never stop a normal answer.
  const rest = await import("@/lib/business/rest-mode");
  let restingUntil: Date | null = null;
  try {
    const rows: any[] = await db
      .execute(
        sql`select resting_until from biz_conversations where id = ${conversationId} limit 1`
      )
      .then((r: any) => r?.rows ?? r ?? []);
    restingUntil = rows?.[0]?.resting_until ? new Date(rows[0].resting_until) : null;
  } catch {
    restingUntil = null;
  }
  const decision = rest.decideRest(burstTextForIntent, restingUntil);

  if (decision.silent) {
    // Never leave the student with nothing. Answer the moment they arrive,
    // then say a short goodbye and step away. Silence reads as a dead chat
    // and loses the student even when the chat was nonsense.
    const psidQuiet = conv.visitorId;
    const goodbye = rest.REST_REPLY;
    await sendTypingOn(psidQuiet);
    const [savedQuiet] = await db
      .insert(bizMessages)
      .values({
        businessId,
        conversationId,
        direction: "out",
        authorKind: "ai",
        body: goodbye,
        meta: { source: "messenger_auto_reply", intent: "rest_farewell" },
      })
      .returning({ id: bizMessages.id });
    const sentQuiet = await sendMessengerText({
      businessId,
      conversationId,
      recipientId: psidQuiet,
      body: goodbye,
      messageId: savedQuiet?.id,
    });
    console.log(`[messenger] resting ${decision.minutes}m — sent a goodbye, not silence`);
    return {
      attempted: true,
      reason: `resting (${decision.minutes}m left): ${sentQuiet.ok ? "farewell sent" : "failed"}`,
      sent: sentQuiet.ok,
      batched: burst.length,
    };
  }

  if (decision.resuming) {
    await rest.leaveRest(conversationId);
    console.log("[messenger] genuine question — resumed early");
  }

  // ── the student is answering a follow-up ──
  // This is a conversation about whether we kept our promise, not a counselling
  // question, so it is scripted rather than handed to the model.
  const { handleFollowupAnswer } = await import("@/lib/business/followup-reply");
  const followupAnswer = await handleFollowupAnswer({
    businessId,
    conversationId,
    visitorId: conv.visitorId,
    message: burstTextForIntent,
  });
  if (followupAnswer) {
    return {
      attempted: true,
      reason: followupAnswer.reason,
      sent: followupAnswer.sent,
      batched: burst.length,
    };
  }

  // A bare "ok" needs no answer. Saying nothing is what a person does; the four
  // identical paragraphs in production were every one of them a reply to "Ok".
  if (intent.intent === "acknowledgement") {
    console.log("[messenger] acknowledgement — staying quiet");
    return { attempted: false, reason: "acknowledgement, no reply needed", batched: burst.length };
  }

  if (intent.handled && intent.reply) {
    const strikes = await rest.bumpStrikes(conversationId, intent.intent);

    // Enough. Exit once, politely, and stay quiet for the rest period.
    if (rest.shouldRest(strikes)) {
      await rest.enterRest(conversationId);
      const psidRest = conv.visitorId;
      await sendTypingOn(psidRest);
      const [savedRest] = await db
        .insert(bizMessages)
        .values({
          businessId,
          conversationId,
          direction: "out",
          authorKind: "ai",
          body: rest.REST_REPLY,
          meta: { source: "messenger_auto_reply", intent: "rest_start" },
        })
        .returning({ id: bizMessages.id });
      const sentRest = await sendMessengerText({
        businessId,
        conversationId,
        recipientId: psidRest,
        body: rest.REST_REPLY,
        messageId: savedRest?.id,
      });
      console.log(`[messenger] entering ${rest.REST_MINUTES}m rest after ${strikes} strikes`);
      return {
        attempted: true,
        reason: `rest started after ${strikes} strikes: ${sentRest.ok ? "sent" : "failed"}`,
        sent: sentRest.ok,
        batched: burst.length,
      };
    }

    const psidForIntent = conv.visitorId;
    await sendTypingOn(psidForIntent);
    const [savedIntent] = await db
      .insert(bizMessages)
      .values({
        businessId,
        conversationId,
        direction: "out",
        authorKind: "ai",
        body: intent.reply,
        meta: { source: "messenger_auto_reply", intent: intent.intent },
      })
      .returning({ id: bizMessages.id });

    const sentIntent = await sendMessengerText({
      businessId,
      conversationId,
      recipientId: psidForIntent,
      body: intent.reply,
      messageId: savedIntent?.id,
    });

    return {
      attempted: true,
      reason: `${intent.intent}: ${sentIntent.ok ? "sent" : (sentIntent.errorCode ?? "failed")}`,
      sent: sentIntent.ok,
      batched: burst.length,
    };
  }

  // A genuine question resets the strike counter.
  await rest.bumpStrikes(conversationId, "genuine");

  // ── typing indicator BEFORE we think ──
  const psid = conv.visitorId;
  await sendTypingOn(psid);

  const history = await db
    .select({ direction: bizMessages.direction, body: bizMessages.body })
    .from(bizMessages)
    .where(eq(bizMessages.conversationId, conversationId))
    .orderBy(asc(bizMessages.createdAt))
    .limit(60);

  const burstText = joinBurst(burst);

  // Earlier inbound messages are context, not new questions.
  const historyBeforeBurst = history.slice(0, Math.max(0, history.length - burst.length));

  // Facts come from the WHOLE conversation, including the message just
  // received.
  //
  // This used to read historyBeforeBurst, so a student who wrote
  // "ami age diploma korbo vabsilam, but HSC ache tai family bollo CST niye
  // bachelor koro" had that decision removed from the facts — the model then
  // answered with the old Diploma plan. A student changing their mind is the
  // most important fact in the thread, and it must never be the one dropped.
  const allHistory = [...historyBeforeBurst, ...burst.map((b) => ({ direction: "in", body: b.body }))];

  // Facts first, then knowledge scoped to the student's level, so a
  // Bachelor student is never handed Diploma material.
  const facts = knownFacts(allHistory);
  const knowledge = await loadApprovedKnowledge(businessId, burstText, 12, {
    level: facts?.degree_level ?? null,
  });
  const style = await loadActiveStyleGuide(businessId);

  const messages = buildCounselingMessages({
    history: historyBeforeBurst,
    latestMessage: burstText,
    knowledge,
    styleGuide: style ? formatStyleGuide(style) : null,
    leadContext: facts,
    recap: conversationRecap(historyBeforeBurst),
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
    // Start the contact follow-up: half an hour from now we ask whether the
    // team actually called. A promise to call must be checked, not assumed.
    const { firstDueAt } = await import("@/lib/business/followup-engine");
    await db.execute(
      sql`update biz_conversations set followup_stage = ${'awaiting_call'}, followup_due_at = ${firstDueAt()}, followup_stage_at = now(), ai_state = ${'handoff_requested'}, updated_at = now() where id = ${conversationId}`
    );
    console.log("[messenger] follow-up scheduled in 30 minutes");
  }

  return {
    attempted: true,
    reason: sent.ok ? "sent" : (sent.skipped ?? sent.errorMessage ?? "send failed"),
    sent: sent.ok,
    error: sent.ok ? undefined : sent.errorCode,
    batched: burst.length,
  };
}
