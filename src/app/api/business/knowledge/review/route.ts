import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizKnowledgeEntries } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Approve, reject, edit or delete extracted knowledge entries.
 * Only "approved" entries are ever cited by the counseling brain.
 */
export async function PATCH(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const ids: string[] = Array.isArray(payload?.ids)
    ? payload.ids.filter((i: unknown) => typeof i === "string").slice(0, 200)
    : typeof payload?.id === "string"
      ? [payload.id]
      : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "No entry id provided" }, { status: 400 });
  }

  const action = payload?.action;
  const businessId = getBusinessId();
  const scope = and(
    eq(bizKnowledgeEntries.businessId, businessId),
    inArray(bizKnowledgeEntries.id, ids)
  );

  if (action === "approve" || action === "reject") {
    const status = action === "approve" ? "approved" : "rejected";
    await db
      .update(bizKnowledgeEntries)
      .set({
        status,
        approvedBy: action === "approve" ? guard.userId : null,
        approvedAt: action === "approve" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(scope);
    return NextResponse.json({ ok: true, updated: ids.length, status });
  }

  if (action === "delete") {
    await db.delete(bizKnowledgeEntries).where(scope);
    return NextResponse.json({ ok: true, deleted: ids.length });
  }

  if (action === "edit") {
    const f = payload?.fields ?? {};
    const patch: Record<string, unknown> = { updatedAt: new Date() };

    // Only allow known, safe fields to be patched.
    if (typeof f.universityName === "string") patch.universityName = f.universityName.slice(0, 255);
    if (typeof f.city === "string") patch.city = f.city.slice(0, 100);
    if (typeof f.programName === "string") patch.programName = f.programName.slice(0, 255);
    if (typeof f.level === "string") patch.level = f.level.slice(0, 50);
    if (typeof f.duration === "string") patch.duration = f.duration.slice(0, 50);
    if (typeof f.teachingLanguage === "string") patch.teachingLanguage = f.teachingLanguage.slice(0, 50);
    if (typeof f.applicationDeadline === "string") patch.applicationDeadline = f.applicationDeadline.slice(0, 60);
    if (typeof f.tuitionCurrency === "string") patch.tuitionCurrency = f.tuitionCurrency.toUpperCase().slice(0, 8);
    if (f.tuitionAmount === null) patch.tuitionAmount = null;
    else if (typeof f.tuitionAmount === "number" && Number.isFinite(f.tuitionAmount) && f.tuitionAmount >= 0) {
      patch.tuitionAmount = Math.round(f.tuitionAmount);
    }
    if (Array.isArray(f.intakeMonths)) {
      patch.intakeMonths = f.intakeMonths.filter((m: unknown) => typeof m === "string").slice(0, 12);
    }

    // Any edit invalidates prior approval — it must be re-approved.
    patch.status = "draft";
    patch.approvedBy = null;
    patch.approvedAt = null;

    await db.update(bizKnowledgeEntries).set(patch).where(scope);
    return NextResponse.json({ ok: true, updated: ids.length, status: "draft" });
  }

  return NextResponse.json(
    { error: "action must be approve, reject, edit or delete" },
    { status: 400 }
  );
}
