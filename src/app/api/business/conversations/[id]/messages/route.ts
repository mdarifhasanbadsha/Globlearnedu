import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations, bizMessages, bizAiRuns } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { deepseekChat, estimateCostMicros, isDeepSeekConfigured } from "@/lib/business/deepseek";
import { eq, and, asc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function loadThread(businessId: string, conversationId: string) {
  return db
    .select({
      id: bizMessages.id,
      direction: bizMessages.direction,
      authorKind: bizMessages.authorKind,
      body: bizMessages.body,
      createdAt: bizMessages.createdAt,
    })
    .from(bizMessages)
    .where(and(eq(bizMessages.businessId, businessId), eq(bizMessages.conversationId, conversationId)))
    .orderBy(asc(bizMessages.createdAt))
    .limit(100);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const businessId = getBusinessId();

  const [conv] = await db
    .select({ id: bizConversations.id })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, id)))
    .limit(1);

  if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const rows = await loadThread(businessId, id);
  return NextResponse.json({
    messages: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const businessId = getBusinessId();

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const body = typeof payload?.body === "string" ? payload.body.trim() : "";
  if (body.length === 0) return NextResponse.json({ error: "Message is empty" }, { status: 400 });
  if (body.length > 4000) {
    return NextResponse.json({ error: "Message too long (max 4000)" }, { status: 400 });
  }

  const [conv] = await db
    .select({
      id: bizConversations.id,
      aiState: bizConversations.aiState,
      channel: bizConversations.channel,
      visitorId: bizConversations.visitorId,
    })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, id)))
    .limit(1);

  if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  // 1. Persist the staff message first — the reply must never depend on AI success.
  const [saved] = await db
    .insert(bizMessages)
    .values({
      businessId,
      conversationId: id,
      direction: "out",
      authorKind: "staff",
      authorId: guard.userId,
      body,
    })
    .returning({ id: bizMessages.id });

  // 1a. A staff member replying means a human owns this thread now. Pause the
  // AI immediately and keep it paused until that person hands it back — the
  // student must not get an AI answer on top of a human one.
  // Deliberately NOT on "seen": reading a thread is not a commitment to reply,
  // and pausing on sight would leave the student with no answer at all.
  try {
    await db.execute(
      sql`update biz_conversations
          set ai_state = ${"human_owned"},
              handoff_at = coalesce(handoff_at, now()),
              updated_at = now()
          where id = ${id}`
    );
  } catch {
    /* the staff message is saved either way */
  }

  // 1b. Actually deliver it when this is a Messenger thread.
  // A saved-but-undelivered message is worse than an error, so the
  // delivery result is reported back to the inbox.
  let delivery: {
    channel: string;
    status: string;
    note?: string;
  } = { channel: conv.channel, status: "stored" };

  if (conv.channel === "messenger") {
    const { sendMessengerText } = await import("@/lib/business/messenger-send");
    const result = await sendMessengerText({
      businessId,
      conversationId: id,
      recipientId: conv.visitorId,
      body,
      messageId: saved?.id,
    });

    delivery = {
      channel: "messenger",
      status: result.status,
      note: result.ok
        ? undefined
        : (result.skipped ?? result.errorMessage ?? "Delivery failed"),
    };
  }

  let aiError: string | null = null;

  // 2. Optional AI comment, only when configured and AI still owns the thread.
  if (payload?.askAi === true && isDeepSeekConfigured() && conv.aiState === "active") {
    const history = await loadThread(businessId, id);

    const messages = [
      {
        role: "system" as const,
        content:
          "You are the assistant for Globlearn Education, a Study in China consultancy. " +
          "Be concise, respectful and neutral in Bangla or English, matching the user's language. " +
          "Never guarantee scholarships, visa approval, admission, or deadlines. " +
          "Visa matters are guidance only — the Chinese Embassy decides. " +
          "If you are unsure of a fact, say verification is needed instead of guessing.",
      },
      ...history.slice(-20).map((m) => ({
        role: (m.direction === "out" ? "assistant" : "user") as "assistant" | "user",
        content: m.body,
      })),
    ];

    const result = await deepseekChat({ messages, maxTokens: 500, timeoutMs: 25_000 });

    if (result.ok && result.content) {
      await db.insert(bizMessages).values({
        businessId,
        conversationId: id,
        direction: "out",
        authorKind: "ai",
        body: result.content,
      });
    } else {
      aiError = result.error ?? "AI did not return a response";
    }

    await db.insert(bizAiRuns).values({
      businessId,
      conversationId: id,
      model: result.model ?? (process.env.DEEPSEEK_MODEL || "deepseek-chat"),
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      costMicros: estimateCostMicros(result.promptTokens, result.completionTokens),
      status: result.ok ? "ok" : "error",
      errorMessage: result.ok ? null : result.error,
      latencyMs: result.latencyMs,
    });
  }

  const rows = await loadThread(businessId, id);
  return NextResponse.json({
    messages: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    aiError,
    delivery,
  });
}
