import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizTestFindings, bizTestSessions } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const VERDICTS = new Set(["accurate", "wrong", "incomplete", "unclear"]);

/**
 * Grade one answer so accuracy becomes measurable.
 * A "wrong" verdict usually means missing or wrong knowledge, which is
 * exactly what the owner then fixes on the Universities page.
 */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionId = typeof payload?.sessionId === "string" ? payload.sessionId : "";
  const verdict = typeof payload?.verdict === "string" ? payload.verdict : "";

  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  if (!VERDICTS.has(verdict)) {
    return NextResponse.json(
      { error: "verdict must be accurate, wrong, incomplete or unclear" },
      { status: 400 }
    );
  }

  const businessId = getBusinessId();

  const [session] = await db
    .select({ id: bizTestSessions.id })
    .from(bizTestSessions)
    .where(and(eq(bizTestSessions.businessId, businessId), eq(bizTestSessions.id, sessionId)))
    .limit(1);

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const trunc = (v: unknown, n: number) =>
    typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, n) : null;

  await db.insert(bizTestFindings).values({
    sessionId,
    businessId,
    messageId: trunc(payload?.messageId, 64),
    verdict,
    question: trunc(payload?.question, 2000),
    answer: trunc(payload?.answer, 4000),
    expected: trunc(payload?.expected, 2000),
    note: trunc(payload?.note, 2000),
    createdBy: guard.userId,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

/** Remove a finding. */
export async function DELETE(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const businessId = getBusinessId();
  await db
    .delete(bizTestFindings)
    .where(and(eq(bizTestFindings.businessId, businessId), eq(bizTestFindings.id, id)));

  return NextResponse.json({ ok: true });
}
