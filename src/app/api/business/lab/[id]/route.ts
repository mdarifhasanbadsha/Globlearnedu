import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizTestSessions, bizTestMessages } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { runLabTurn, type LabMode } from "@/lib/business/lab";
import { and, eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function loadSession(businessId: string, id: string) {
  const [s] = await db
    .select()
    .from(bizTestSessions)
    .where(and(eq(bizTestSessions.businessId, businessId), eq(bizTestSessions.id, id)))
    .limit(1);
  return s ?? null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const businessId = getBusinessId();

  const session = await loadSession(businessId, id);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const messages = await db
    .select()
    .from(bizTestMessages)
    .where(eq(bizTestMessages.sessionId, id))
    .orderBy(asc(bizTestMessages.createdAt))
    .limit(200);

  return NextResponse.json({
    session: { id: session.id, title: session.title, mode: session.mode, persona: session.persona },
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      body: m.body,
      meta: m.meta,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}

/** Send a student message to the sandbox. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const businessId = getBusinessId();

  const session = await loadSession(businessId, id);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

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

  await db.insert(bizTestMessages).values({
    sessionId: id,
    businessId,
    role: "user",
    body: message,
  });

  const result = await runLabTurn({
    sessionId: id,
    businessId,
    mode: session.mode as LabMode,
    message,
  });

  if (result.ok) {
    await db.insert(bizTestMessages).values({
      sessionId: id,
      businessId,
      role: "assistant",
      body: result.reply,
      meta: {
        knowledgeUsed: result.knowledgeUsed,
        styleUsed: result.styleUsed,
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        latencyMs: result.latencyMs,
      },
    });
  }

  await db
    .update(bizTestSessions)
    .set({ updatedAt: new Date() })
    .where(eq(bizTestSessions.id, id));

  return NextResponse.json({
    ok: result.ok,
    reply: result.reply,
    error: result.error,
    knowledgeUsed: result.knowledgeUsed,
    styleUsed: result.styleUsed,
    latencyMs: result.latencyMs,
    tokens: result.promptTokens + result.completionTokens,
  });
}

/** Delete a sandbox session and its messages. */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const businessId = getBusinessId();

  const session = await loadSession(businessId, id);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  await db.delete(bizTestMessages).where(eq(bizTestMessages.sessionId, id));
  await db.delete(bizTestSessions).where(eq(bizTestSessions.id, id));

  return NextResponse.json({ ok: true });
}
