import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations, bizMessages, bizAiRuns } from "@/lib/db/schema.business";
import { bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { deepseekChatWithRetry, isDeepSeekConfigured, estimateCostMicros } from "@/lib/business/deepseek";
import {
  buildCounselingMessages,
  loadApprovedKnowledge,
  parseCounselingReply,
  sanitizeExtracted,
} from "@/lib/business/counseling";
import { isRateLimited, newGuestToken, isValidGuestToken } from "@/lib/business/chat-guard";
import { loadActiveStyleGuide, formatStyleGuide } from "@/lib/business/style";
import { eq, and, asc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Restore a visitor's own conversation when they come back later.
 *
 * The token is an unguessable 128-bit value held in their browser, so a
 * caller who does not hold it cannot read anyone else's thread. Only the
 * visitor's own messages plus AI/staff replies are returned.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";

  if (!isValidGuestToken(token)) {
    return NextResponse.json({ messages: [] });
  }

  const businessId = getBusinessId();

  const [conv] = await db
    .select({ id: bizConversations.id, status: bizConversations.status })
    .from(bizConversations)
    .where(
      and(
        eq(bizConversations.businessId, businessId),
        eq(bizConversations.channel, "website"),
        eq(bizConversations.visitorId, token)
      )
    )
    .limit(1);

  if (!conv) return NextResponse.json({ messages: [], found: false });

  const rows = await db
    .select({
      direction: bizMessages.direction,
      authorKind: bizMessages.authorKind,
      body: bizMessages.body,
      createdAt: bizMessages.createdAt,
    })
    .from(bizMessages)
    .where(eq(bizMessages.conversationId, conv.id))
    .orderBy(asc(bizMessages.createdAt))
    .limit(50);

  return NextResponse.json({
    found: true,
    status: conv.status,
    messages: rows
      .filter((r) => r.body.trim().length > 0 && r.body !== "[voice message]")
      .map((r) => ({
        role: r.direction === "in" ? "user" : "assistant",
        text: r.body,
        createdAt: r.createdAt.toISOString(),
      })),
  });
}

// POST /api/public/chat — start a conversation or send a message.
export async function POST(req: Request) {
  try {
    return await handlePost(req);
  } catch (e: any) {
    // Surface the reason instead of an opaque 500. This route is public, so
    // only the message is exposed, never a stack trace or env value.
    console.error("[chat] unhandled:", e?.message);
    return NextResponse.json(
      {
        error: "Chat failed",
        // Drizzle wraps the driver error, and the wrapper text alone hides
        // which column or table actually failed. The cause message is the
        // one that names it, so both are surfaced (and truncated).
        detail: String(e?.message ?? e).slice(0, 300),
        cause: String((e as any)?.cause?.message ?? "").slice(0, 300),
      },
      { status: 500 }
    );
  }
}

async function handlePost(req: Request) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  if (message.length === 0 || message.length > 2000) {
    return NextResponse.json({ error: "Message must be 1-2000 characters" }, { status: 400 });
  }

  // Classify BEFORE spending a model call. Greetings, thanks, off-topic chat
  // and attempts to break scope get a short scripted answer instead, which
  // protects the API budget and keeps the conversation on track. A student is
  // never punished for being confusing — only clear abuse and clear attempts
  // to misuse the assistant are refused, and even then politely.
  const { classifyMessage } = await import("@/lib/business/intent");
  const intent = classifyMessage(message);

  // A bare "ok" gets no reply. The widget shows nothing, which is exactly what
  // a person does. Without this the message fell through to the model and came
  // back with a paragraph restating the plan.
  if (intent.intent === "acknowledgement") {
    return NextResponse.json({
      token: isValidGuestToken(payload?.token) ? payload.token : "",
      reply: null,
      aiEnabled: true,
      intent: "acknowledgement",
      cards: [],
      quickReplies: [],
      typingMs: 0,
    });
  }

  if (intent.handled && intent.reply) {
    return NextResponse.json({
      token: isValidGuestToken(payload?.token) ? payload.token : "",
      reply: intent.reply,
      aiEnabled: true,
      intent: intent.intent,
      cards: [],
      quickReplies: [],
      typingMs: 900,
    });
  }

  let token: string = isValidGuestToken(payload?.token) ? payload.token : "";
  const isNew = token === "";

  // Per-IP and per-session limits.
  //
  // The IP bucket must be generous: an office, a campus and a mobile carrier
  // can all put many students behind one address, and a student retrying a
  // slow message looks like abuse. Twenty a minute silently cut people off
  // mid-conversation, which reads as "the chat forgot everything" because the
  // client gets 429 and starts a new thread.
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (await isRateLimited(`ip:${ip}`, 120)) {
    return NextResponse.json(
      { error: "Too many messages right now. Please try again in a minute.", token },
      { status: 429 }
    );
  }
  if (token && (await isRateLimited(`sess:${token}`, 40))) {
    return NextResponse.json(
      { error: "This chat is going very fast — give us a moment.", token },
      { status: 429 }
    );
  }

  const businessId = getBusinessId();

  // Resolve or create the conversation.
  let conversationId: string | null = null;
  let conversationStatus = "open";
  let aiState = "active";

  if (token) {
    const [conv] = await db
      .select({
        id: bizConversations.id,
        status: bizConversations.status,
        aiState: bizConversations.aiState,
      })
      .from(bizConversations)
      .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.visitorId, token)))
      .limit(1);

    if (conv) {
      conversationId = conv.id;
      conversationStatus = conv.status;
      aiState = conv.aiState;
      // A new message reopens a resolved conversation.
      if (conv.status === "resolved") {
        await db
          .update(bizConversations)
          .set({ status: "open", updatedAt: new Date(), lastMessageAt: new Date() })
          .where(eq(bizConversations.id, conv.id));
        conversationStatus = "open";
      }
    }
  }

  if (!conversationId) {
    // The browser lost its token. Rather than starting a blank conversation —
    // which silently wipes everything the student already told us — adopt the
    // newest open website thread from this IP in the last hour, and hand its
    // token back. Only genuinely new visitors get a new thread.
    if (!token && ip !== "unknown") {
      try {
        const recent = await db.execute(
          sql`select id, visitor_id from biz_conversations
              where business_id = ${businessId} and channel = 'website'
                and status = 'open' and last_message_at > now() - interval '1 hour'
                and exists (select 1 from biz_messages m
                            where m.conversation_id = biz_conversations.id
                              and m.meta->>'ip' = ${ip})
              order by last_message_at desc limit 1`
        );
        const row: any = (recent as any)?.rows?.[0] ?? (recent as any)?.[0];
        if (row?.id && row?.visitor_id) {
          conversationId = row.id;
          token = row.visitor_id;
        }
      } catch {
        /* fall through to a new conversation */
      }
    }

    if (!conversationId) {
      token = newGuestToken();
      const [created] = await db
        .insert(bizConversations)
        .values({ businessId, visitorId: token, status: "open", aiState: "active", channel: "website" })
        .returning({ id: bizConversations.id });
      conversationId = created.id;
    }
  }

  // Persist the inbound message before any AI work.
  // The IP is stored (never shown to anyone) so a lost token can be matched
  // back to the right thread instead of starting a blank one.
  await db.insert(bizMessages).values({
    businessId,
    conversationId,
    direction: "in",
    authorKind: "student",
    body: message,
    meta: { source: "website", ip },
  });

  await db
    .update(bizConversations)
    .set({ lastMessageAt: new Date(), updatedAt: new Date() })
    .where(eq(bizConversations.id, conversationId));

  // AI is skipping when a human owns the thread.
  if (!isDeepSeekConfigured() || aiState !== "active") {
    return NextResponse.json({
      token,
      conversationId,
      status: conversationStatus,
      aiEnabled: false,
      reply: null,
    });
  }

  // Bounded history + approved knowledge only.
  const history = await db
    .select({ direction: bizMessages.direction, body: bizMessages.body })
    .from(bizMessages)
    .where(eq(bizMessages.conversationId, conversationId))
    .orderBy(asc(bizMessages.createdAt))
    .limit(60);

  // Scope knowledge to the student's level once it is known, so a Bachelor
  // student is never shown Diploma material.
  const { knownFacts: factsFor } = await import("@/lib/business/conversation-flow");
  const knowledge = await loadApprovedKnowledge(businessId, message, 12, {
    level: factsFor([...history, { direction: "in", body: message }])?.degree_level ?? null,
  });

  // Learn-from-history layer: our approved house style, if published.
  const style = await loadActiveStyleGuide(businessId);

  // What the student has ALREADY told us, read from the transcript. Without
  // this the model re-asks questions it has the answers to — "which subject?"
  // one message after the student named the subject.
  const { knownFacts, conversationRecap } = await import("@/lib/business/conversation-flow");

  const messages = buildCounselingMessages({
    history: history.slice(0, -1),
    latestMessage: message,
    knowledge,
    styleGuide: style ? formatStyleGuide(style) : null,
    leadContext: knownFacts(history),
    recap: conversationRecap(history),
  });

  // Same guidance the Messenger path gets: answer their question first, never
  // repeat yourself, and — once the conversation is long enough — wrap up with
  // a gentle, optional invitation instead of demanding a phone number.
  try {
    const { decideTurn, closingInstruction, ANSWER_FIRST_INSTRUCTION } = await import(
      "@/lib/business/handover"
    );
    const sys = messages[messages.length - 1];
    if (sys?.role === "system") {
      sys.content += ANSWER_FIRST_INSTRUCTION;

      const studentTurns = history.filter((h) => h.direction === "in").length;
      const decision = decideTurn({
        studentTurns,
        hasContact: Boolean(knownFacts(history)?.phone),
        strongIntent: false,
      });
      if (decision.close) {
        sys.content += closingInstruction(decision.askContact);
        console.log(`[chat] closing turn: ${decision.reason}`);
      }
    }
  } catch {
    /* guidance is additive; the reply must go out regardless */
  }

  // Generous ceiling: the model emits reasoning tokens before the JSON reply.
  //
  // jsonMode is deliberately OFF here. With response_format=json_object the
  // model intermittently returns whitespace-only content on the 2nd and later
  // turns (measured 6/6 empty) while putting the whole reply in
  // reasoning_content. Without it, the same request succeeded 6/6. The prompt
  // still demands JSON and parseCounselingReply() extracts it from prose.
  const result = await deepseekChatWithRetry({
    messages,
    maxTokens: 3000,
    timeoutMs: 30_000,
    jsonMode: false,
    temperature: 0.4,
  });

  const started = Date.now();
  let reply: string | null = null;
  let wantsHandoff = false;
  let extracted: Record<string, unknown> = {};

  if (result.ok && result.content) {
    const parsed = parseCounselingReply(result.content, message);
    reply = parsed.reply;
    wantsHandoff = parsed.wantsHumanHandoff;
    extracted = sanitizeExtracted(parsed.extracted);
  }

  // A visitor must never be left with an empty bubble. If the provider
  // failed after retries, say so plainly and hand off to a human.
  if (!reply) {
    reply =
      "Sorry — I couldn't put an answer together just now. " +
      "Please try again in a moment, or share your WhatsApp number and our counselor will reply.";
    wantsHandoff = true;
  }

  // Apply every policy rule before the student sees it.
  //
  // This is the only enforcement point, and it was missing: the rules existed
  // but nothing ran them, which is how "আমাদের ডেটাবেসে ... নেই" kept reaching
  // students after it was banned.
  if (reply) {
    const { enforceReply, isRepeated, DUPLICATE_INSTEAD } = await import("@/lib/business/enforce");
    const enforced = enforceReply(reply, { question: message });
    reply = enforced.reply;

    // Do not send the same paragraph twice. A student asking twice should get
    // something that moves them forward, not a copy.
    const earlier = history
      .filter((h) => h.direction === "out")
      .map((h) => h.body)
      .slice(-6);
    if (isRepeated(reply, earlier)) {
      console.log("[chat] duplicate answer replaced");
      reply = DUPLICATE_INSTEAD;
    }
  }

  // Log usage honestly (cost unknown when prices are unset).
  await db.insert(bizAiRuns).values({
    businessId,
    conversationId,
    model: result.model ?? (process.env.DEEPSEEK_MODEL || "deepseek-chat"),
    promptTokens: result.promptTokens,
    completionTokens: result.completionTokens,
    costMicros: estimateCostMicros(result.promptTokens, result.completionTokens),
    status: result.ok ? "ok" : "error",
    errorMessage: result.ok ? null : result.error,
    latencyMs: result.latencyMs,
  });

  if (reply) {
    await db.insert(bizMessages).values({
      businessId,
      conversationId,
      direction: "out",
      authorKind: "ai",
      body: reply,
    });
  }

  // Upsert lead fields that were clearly provided.
  let existingLead: {
    degreeLevel: string | null;
    gpaValue: string | null;
    phone: string | null;
  } | null = null;

  if (Object.keys(extracted).length > 0) {
    const existing = await db
      .select({ id: bizLeads.id })
      .from(bizLeads)
      .where(and(eq(bizLeads.businessId, businessId), eq(bizLeads.conversationId, conversationId)))
      .limit(1);

    const patch: Record<string, unknown> = {};
    if (extracted.full_name) patch.fullName = extracted.full_name;
    if (extracted.phone) patch.phone = extracted.phone;
    if (extracted.email) patch.email = extracted.email;
    if (extracted.degree_level) patch.degreeLevel = extracted.degree_level;
    if (extracted.subject_interest) patch.subjectInterest = extracted.subject_interest;
    if (extracted.gpa_value != null) patch.gpaValue = String(extracted.gpa_value);
    if (extracted.gpa_scale != null) patch.gpaScale = String(extracted.gpa_scale);
    if (extracted.budget_amount != null) patch.budgetAmount = extracted.budget_amount;
    if (extracted.budget_currency) patch.budgetCurrency = extracted.budget_currency;
    if (extracted.intake_target) patch.intakeTarget = extracted.intake_target;
    if (extracted.language_test) patch.languageTest = extracted.language_test;
    if (extracted.nationality) patch.nationality = extracted.nationality;

    if (Object.keys(patch).length > 0) {
      if (existing.length > 0) {
        await db
          .update(bizLeads)
          .set({ ...patch, updatedAt: new Date() })
          .where(eq(bizLeads.id, existing[0].id));
      } else {
        await db.insert(bizLeads).values({
          businessId,
          conversationId,
          source: "website_chat",
          ...patch,
        });
      }
    }
  }

  // Whatever the lead already knows, so quick replies stay relevant.
  {
    const [leadRow] = await db
      .select({
        degreeLevel: bizLeads.degreeLevel,
        gpaValue: bizLeads.gpaValue,
        phone: bizLeads.phone,
      })
      .from(bizLeads)
      .where(and(eq(bizLeads.businessId, businessId), eq(bizLeads.conversationId, conversationId)))
      .limit(1);
    existingLead = leadRow ?? null;
  }

  // Explicit request for a human pauses automation.
  if (wantsHandoff) {
    await db
      .update(bizConversations)
      .set({ aiState: "handoff_requested", handoffAt: new Date(), updatedAt: new Date() })
      .where(eq(bizConversations.id, conversationId));
  }

  // Keep the pipeline honest and alert someone when a lead turns hot.
  try {
    const { onStudentReplied, onStaffReplied } = await import("@/lib/business/stage-automation");
    await onStudentReplied({ businessId, conversationId });
    if (reply) await onStaffReplied({ businessId, conversationId });

    const { alertIfHot } = await import("@/lib/business/alerts");
    await alertIfHot({ businessId, conversationId });
  } catch (e) {
    console.error("[workflow] post-reply automation failed:", (e as Error)?.message);
  }

  // Structured extras for the widget.
  const { toCards, suggestQuickReplies } = await import("@/lib/business/chat-cards");
  const { planPacing, remainingDelay } = await import("@/lib/business/pacing");
  const { decideCards } = await import("@/lib/business/card-policy");

  // Cards are shown sparingly: a counselor talks, they do not paste a catalogue.
  const alreadyShownCard = history.some(
    (h) => h.direction === "out" && /per semester|per year|per month/i.test(h.body)
  );
  const cardDecision = decideCards({
    reply: reply ?? "",
    question: message,
    candidates: toCards(knowledge),
    turnIndex: history.filter((h) => h.direction === "in").length - 1,
    alreadyShownCard,
  });

  const quickReplies = suggestQuickReplies({
    askedAboutFee: /tuition|fee|taka|koto|খরচ|ফি|টাকা/i.test(history.map((h) => h.body).join(" ")),
    hasDegree: !!(extracted.degree_level || existingLead?.degreeLevel),
    hasGpa: extracted.gpa_value != null || !!existingLead?.gpaValue,
    hasContact: !!(extracted.phone || existingLead?.phone),
  });

  // Believable pacing: the model is fast, a human counselor is not.
  const pacing = planPacing(message, result.latencyMs);
  const waitMs = remainingDelay(pacing, result.latencyMs);

  return NextResponse.json({
    token,
    conversationId,
    aiEnabled: true,
    reply,
    aiError: result.ok ? null : result.error,
    status: conversationStatus,
    cards: cardDecision.cards,
    cardsReason: cardDecision.reason,
    quickReplies,
    // The widget keeps the typing indicator up for this long before
    // revealing the reply, so a 1s answer does not look robotic.
    typingMs: waitMs,
    modelMs: result.latencyMs,
  });
}
