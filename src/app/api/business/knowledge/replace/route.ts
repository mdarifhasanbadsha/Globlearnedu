import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizKnowledgeEntries } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const LEVELS = new Set(["bachelor", "master", "phd", "language", "foundation", "diploma"]);

/**
 * Replace the entire university knowledge base with the supplied set.
 *
 * The owner asked for this plainly: delete the old records and load the new
 * ones, approved and ready. Deleting knowledge is destructive, so it is
 * deliberately one explicit call with an acknowledgement field, never a side
 * effect of importing.
 *
 * Entries without a level are skipped: a programme with no level cannot be
 * matched to a student, so importing it would only create noise.
 */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (payload?.confirmReplace !== true) {
    return NextResponse.json(
      { error: "Send { confirmReplace: true } to delete existing knowledge first." },
      { status: 400 }
    );
  }

  const raw: any[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.universities)
      ? payload.universities
      : [];

  if (raw.length === 0) {
    return NextResponse.json(
      { error: "No universities found. Expected { universities: [...] }" },
      { status: 400 }
    );
  }

  // Build rows first, so a bad payload fails before anything is deleted.
  const rows: any[] = [];
  const problems: string[] = [];

  for (const u of raw) {
    const name = String(u?.name ?? "").trim();
    if (name.length < 4) {
      problems.push(`skipped unnamed entry`);
      continue;
    }
    const city = u?.city ? String(u.city).trim() : null;
    const province = u?.province ? String(u.province).trim() : null;

    const programs = Array.isArray(u?.programs) ? u.programs : [];
    if (programs.length === 0) {
      problems.push(`${name}: no programmes`);
      continue;
    }

    for (const p of programs) {
      const level = String(p?.level ?? "").toLowerCase();
      if (!LEVELS.has(level)) {
        problems.push(`${name}: unknown level "${p?.level}"`);
        continue;
      }

      const majors: string[] = Array.isArray(p?.majors)
        ? p.majors.map((m: any) => String(m).trim()).filter(Boolean)
        : [];
      if (majors.length === 0) {
        problems.push(`${name} (${level}): no majors`);
        continue;
      }

      const programName = `${level.charAt(0).toUpperCase()}${level.slice(1)} programmes`;

      const parts: string[] = [`Majors: ${majors.join(", ")}`];
      if (p?.duration_years) parts.push(`Duration: ${p.duration_years} years`);
      if (p?.scholarship) parts.push(String(p.scholarship).replace(/\s+/g, " ").trim());

      rows.push({
        businessId,
        universityName: name,
        city,
        province,
        programName,
        level,
        notes: parts.join("\n").slice(0, 4000),
        requirements: Array.isArray(p?.requirements) ? p.requirements : {},
        intakeText: p?.intake ? String(p.intake) : null,
        teachingLanguage: p?.teaching_language ? String(p.teaching_language) : null,
        dataCompleteness: "partial",
        status: "approved",
        approvedBy: guard.userId,
        approvedAt: new Date(),
      });
    }
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "Nothing usable to import", problems }, { status: 400 });
  }

  // Delete, then insert fresh.
  const before = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizKnowledgeEntries)
    .where(eq(bizKnowledgeEntries.businessId, businessId));

  await db.delete(bizKnowledgeEntries).where(eq(bizKnowledgeEntries.businessId, businessId));

  for (let i = 0; i < rows.length; i += 40) {
    await db.insert(bizKnowledgeEntries).values(rows.slice(i, i + 40));
  }

  const distinct = new Set(rows.map((r) => r.universityName)).size;

  return NextResponse.json({
    deletedEntries: before[0]?.n ?? 0,
    insertedEntries: rows.length,
    distinctUniversities: distinct,
    approved: true,
    problems: problems.slice(0, 25),
  });
}
