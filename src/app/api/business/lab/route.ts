import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizTestSessions, bizTestMessages, bizTestFindings } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { runLabTurn, type LabMode } from "@/lib/business/lab";
import { and, eq, asc, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const MODES = new Set<LabMode>(["live", "no_knowledge", "no_style", "bare"]);

/** List sandbox sessions with their findings. */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  const sessions = await db
    .select()
    .from(bizTestSessions)
    .where(eq(bizTestSessions.businessId, businessId))
    .orderBy(desc(bizTestSessions.createdAt))
    .limit(50);

  const findings = await db
    .select()
    .from(bizTestFindings)
    .where(eq(bizTestFindings.businessId, businessId))
    .orderBy(desc(bizTestFindings.createdAt))
    .limit(100);

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      title: s.title,
      persona: s.persona,
      mode: s.mode,
      createdAt: s.createdAt.toISOString(),
    })),
    findings: findings.map((f) => ({
      id: f.id,
      sessionId: f.sessionId,
      verdict: f.verdict,
      question: f.question,
      answer: f.answer,
      expected: f.expected,
      note: f.note,
      createdAt: f.createdAt.toISOString(),
    })),
  });
}

/** Start a new sandbox session. */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const mode = MODES.has(payload?.mode) ? (payload.mode as LabMode) : "live";
  const title = (typeof payload?.title === "string" ? payload.title : "").trim() || "Test session";
  const persona = typeof payload?.persona === "string" ? payload.persona.slice(0, 40) : "student";

  const businessId = getBusinessId();

  const [row] = await db
    .insert(bizTestSessions)
    .values({
      businessId,
      title: title.slice(0, 200),
      persona,
      mode,
      createdBy: guard.userId,
    })
    .returning({ id: bizTestSessions.id });

  return NextResponse.json({ id: row.id }, { status: 201 });
}
