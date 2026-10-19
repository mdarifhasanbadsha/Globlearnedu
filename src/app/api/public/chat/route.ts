import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations, bizMessages, bizAiRuns } from "@/lib/db/schema.business";
import { bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { deepseekChat, isDeepSeekConfigured, estimateCostMicros } from "@/lib/business/deepseek";
import {
  buildCounselingMessages,
  loadApprovedKnowledge,
  parseCounselingReply,
  sanitizeExtracted,
} from "@/lib/business/counseling";
import { isRateLimited, newGuestToken, isValidGuestToken } from "@/lib/business/chat-guard";
import { eq, and, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/public/chat — start a conversation or send a message.
export async function POST(req: Request) {
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

  let token: string = isValidGuestToken(payload?.token) ? payload.token : "";
  const isNew = token === "";

  // Per-IP and per-session limits.
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (await isRateLimited(`ip:${ip}`, 20)) {
    return NextResponse.json({ error: "Too many messages. Please wait a moment." }, { status: 429 });
  }
  if (token && (await isRateLimited(`sess:${token}`, 15))) {
    return NextResponse.json({ error: "Too many messages in this chat." }, { status: 429 });
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
    token = newGuestToken();
    const [created] = await db
      .insert(bizConversations)
      .values({ businessId, visitorId: token, status: "open", aiState: "active", channel: "website" })
      .returning({ id: bizConversations.id });
    conversationId = created.id;
  }

  // Persist the inbound message before any AI work.
  await db.insert(bizMessages).values({
    businessId,
    conversationId,
    direction: "in",
    authorKind: "student",
    body: message,
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
    .limit(40);

  const knowledge = await loadApprovedKnowledge(businessId, message);

  const messages = buildCounselingMessages({
    history: history.slice(0, -1),
    latestMessage: message,
    knowledge,
  });

  // Generous ceiling: the model emits reasoning tokens before the JSON reply.
  const result = await deepseekChat({
    messages,
    maxTokens: 3000,
    timeoutMs: 30_000,
    jsonMode: true,
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

  // Explicit request for a human pauses automation.
  if (wantsHandoff) {
    await db
      .update(bizConversations)
      .set({ aiState: "handoff_requested", handoffAt: new Date(), updatedAt: new Date() })
      .where(eq(bizConversations.id, conversationId));
  }

  return NextResponse.json({
    token,
    conversationId,
    aiEnabled: true,
    reply,
    aiError: result.ok ? null : result.error,
    status: conversationStatus,
  });
}
