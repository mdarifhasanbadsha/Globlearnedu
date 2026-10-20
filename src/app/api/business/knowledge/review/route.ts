import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizKnowledgeEntries } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { checkEntry } from "@/lib/business/sanity";
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

  const businessId = getBusinessId();
  const action = payload?.action;

  // Fast path after an import: approve every draft in one action, so a
  // 60-entry import does not need 60 clicks. Still an explicit decision by
  // the owner, and it is recorded with their user id.
  if (action === "approve" && payload?.all === true) {
    const approved = await db
      .update(bizKnowledgeEntries)
      .set({
        status: "approved",
        approvedBy: guard.userId,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(bizKnowledgeEntries.businessId, businessId),
          eq(bizKnowledgeEntries.status, "draft")
        )
      )
      .returning({ id: bizKnowledgeEntries.id });

    return NextResponse.json({ ok: true, updated: approved.length, status: "approved" });
  }

  if (ids.length === 0) {
    return NextResponse.json({ error: "No entry id provided" }, { status: 400 });
  }

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
    const strFields: [string, number][] = [
      ["universityName", 255],
      ["universityNameCn", 255],
      ["city", 100],
      ["province", 100],
      ["universityType", 50],
      ["programName", 255],
      ["level", 50],
      ["duration", 50],
      ["teachingLanguage", 50],
      ["applicationDeadline", 60],
      ["intakeText", 100],
      ["languageToDegree", 100],
      ["feePaymentNote", 2000],
      ["notes", 2000],
    ];
    for (const [key, max] of strFields) {
      if (typeof f[key] === "string") patch[key] = f[key].slice(0, max);
    }

    if (typeof f.tuitionCurrency === "string") {
      patch.tuitionCurrency = f.tuitionCurrency.toUpperCase().slice(0, 8);
    }

    const periodFields = ["tuitionPeriod", "hostelPeriod"];
    for (const key of periodFields) {
      if (f[key] === null || f[key] === "") patch[key] = null;
      else if (["semester", "year", "month"].includes(f[key])) patch[key] = f[key];
    }

    const intFields = ["tuitionAmount", "hostelAmount", "applicationFee", "insuranceFee"];
    for (const key of intFields) {
      if (f[key] === null || f[key] === "") patch[key] = null;
      else if (typeof f[key] === "number" && Number.isFinite(f[key]) && f[key] >= 0) {
        patch[key] = Math.round(f[key]);
      }
    }

    if (typeof f.tVisaAfterOneSemester === "boolean") {
      patch.tVisaAfterOneSemester = f.tVisaAfterOneSemester;
    }

    if (Array.isArray(f.intakeMonths)) {
      patch.intakeMonths = f.intakeMonths.filter((m: unknown) => typeof m === "string").slice(0, 12);
    }

    // Any edit invalidates prior approval — it must be re-approved.
    patch.status = "draft";
    patch.approvedBy = null;
    patch.approvedAt = null;

    await db.update(bizKnowledgeEntries).set(patch).where(scope);

    // Surface issues so the editor can warn before the owner approves.
    const [row] = await db
      .select()
      .from(bizKnowledgeEntries)
      .where(scope)
      .limit(1);

    const issues = row
      ? checkEntry({
          intakeText: row.intakeText,
          applicationDeadline: row.applicationDeadline,
          tuitionAmount: row.tuitionAmount,
          tuitionPeriod: row.tuitionPeriod,
        })
      : [];

    return NextResponse.json({ ok: true, updated: ids.length, status: "draft", issues });
  }

  return NextResponse.json(
    { error: "action must be approve, reject, edit or delete" },
    { status: 400 }
  );
}
