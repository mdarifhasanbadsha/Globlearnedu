import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizKnowledgeEntries } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Text that must never reach a student. */
const AGENCY_SCRUB = [
  /rk\s*education/gi,
  /rk\s*edu\w*/gi,
  /rk-?\s*edu/gi,
  /(www\.)?\s*the\s*rk\s*edu\s*\.?\s*com/gi,
  /[\w.+-]+\s*@\s*[\w.-]+\s*\.\s*[\w.]+/g,
  /\b(wechat|whatsapp|telegram)\b[^\n]*/gi,
  /\+?\d[\d\s()-]{8,}/g,
];

function scrub(value: string | null | undefined): string | null {
  if (!value) return null;
  let out = String(value);
  for (const rx of AGENCY_SCRUB) out = out.replace(rx, " ");
  out = out.replace(/[ \t]{2,}/g, " ").trim();
  return out.length > 0 ? out : null;
}

const LEVELS = new Set(["bachelor", "master", "phd", "language", "foundation", "diploma"]);

/**
 * Import universities as DRAFTS.
 *
 * Nothing imported is visible to the AI until it is approved, so a bad
 * file cannot corrupt live answers. Re-importing the same university,
 * level and intake updates the draft instead of duplicating it.
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

  // Accept { universities: [...] } or a bare array.
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
  if (raw.length > 500) {
    return NextResponse.json({ error: "Too many universities in one import (max 500)" }, { status: 400 });
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const problems: string[] = [];

  for (const u of raw) {
    const universityName = scrub(u?.name ?? u?.university_name ?? u?.universityName);
    if (!universityName || universityName.length < 4) {
      skipped++;
      continue;
    }

    const city = scrub(u?.city ?? null);
    const province = scrub(u?.province ?? null);
    const ranking = scrub(u?.ranking ?? null);

    const programs = Array.isArray(u?.programs) ? u.programs : [];
    if (programs.length === 0) {
      skipped++;
      problems.push(`${universityName}: no programmes listed`);
      continue;
    }

    for (const p of programs) {
      const level = String(p?.level ?? "").toLowerCase();
      if (!LEVELS.has(level)) {
        skipped++;
        problems.push(`${universityName}: unknown level "${p?.level}"`);
        continue;
      }

      const majors = (Array.isArray(p?.majors) ? p.majors : [])
        .map((m: any) => scrub(String(m)))
        .filter((m: string | null): m is string => !!m);

      // Build the human-readable block the AI will actually read.
      const bits: string[] = [];
      if (p?.duration_years) bits.push(`Duration ${p.duration_years} years`);
      if (p?.teaching_language) bits.push(`Taught in ${scrub(p.teaching_language)}`);
      if (p?.intake) bits.push(`Intake ${scrub(p.intake)}`);
      if (p?.age_limit) bits.push(`Age ${scrub(p.age_limit)}`);
      if (p?.tuition) bits.push(`Tuition ${scrub(p.tuition)}`);
      if (p?.hostel) bits.push(`Accommodation ${scrub(p.hostel)}`);
      if (p?.scholarship) bits.push(`Scholarship ${scrub(p.scholarship)}`);
      if (majors.length > 0) bits.push(`Majors: ${majors.join("; ")}`);
      if (ranking) bits.push(`Ranking: ${ranking}`);
      if (p?.notes) bits.push(scrub(p.notes) ?? "");

      const notes = bits.filter(Boolean).join("\n");
      if (!notes) {
        skipped++;
        continue;
      }

      const programName = `${level.charAt(0).toUpperCase()}${level.slice(1)} programmes`;
      const intakeText = scrub(p?.intake ?? null);
      const docs = (Array.isArray(p?.requirements) ? p.requirements : [])
        .map((r: any) => scrub(String(r)))
        .filter((r: string | null): r is string => !!r);
      const reqJson = docs.length > 0 ? JSON.stringify({ documents: docs }) : null;

      const [existing] = await db
        .select({ id: bizKnowledgeEntries.id })
        .from(bizKnowledgeEntries)
        .where(
          and(
            eq(bizKnowledgeEntries.businessId, businessId),
            eq(bizKnowledgeEntries.universityName, universityName),
            eq(bizKnowledgeEntries.programName, programName),
            sql`coalesce(${bizKnowledgeEntries.intakeText}, '') = ${intakeText ?? ""}`
          )
        )
        .limit(1);

      if (existing) {
        await db
          .update(bizKnowledgeEntries)
          .set({
            city,
            level,
            notes,
            requirements: reqJson ? JSON.parse(reqJson) : undefined,
            intakeText,
            teachingLanguage: scrub(p?.teaching_language ?? null),
            // Re-imported data goes back to draft so it is reviewed again.
            status: "draft",
            dataCompleteness: "partial",
            updatedAt: new Date(),
          })
          .where(eq(bizKnowledgeEntries.id, existing.id));
        updated++;
      } else {
        await db.insert(bizKnowledgeEntries).values({
          businessId,
          universityName,
          city,
          province,
          programName,
          level,
          notes,
          requirements: reqJson ? JSON.parse(reqJson) : {},
          intakeText,
          teachingLanguage: scrub(p?.teaching_language ?? null),
          dataCompleteness: "partial",
          status: "draft",
        });
        created++;
      }
    }
  }

  // How much is now waiting for approval?
  const [pending] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizKnowledgeEntries)
    .where(and(eq(bizKnowledgeEntries.businessId, businessId), eq(bizKnowledgeEntries.status, "draft")));

  return NextResponse.json({
    created,
    updated,
    skipped,
    pendingApproval: pending?.n ?? 0,
    problems: problems.slice(0, 20),
  });
}

/** What was imported most recently, so the review screen can show it. */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  const drafts = await db
    .select({
      id: bizKnowledgeEntries.id,
      universityName: bizKnowledgeEntries.universityName,
      city: bizKnowledgeEntries.city,
      programName: bizKnowledgeEntries.programName,
      level: bizKnowledgeEntries.level,
      intakeText: bizKnowledgeEntries.intakeText,
      notes: bizKnowledgeEntries.notes,
      status: bizKnowledgeEntries.status,
    })
    .from(bizKnowledgeEntries)
    .where(eq(bizKnowledgeEntries.businessId, businessId))
    .orderBy(desc(bizKnowledgeEntries.updatedAt))
    .limit(100);

  const [counts] = await db
    .select({
      draft: sql<number>`count(*) filter (where ${bizKnowledgeEntries.status} = 'draft')::int`,
      approved: sql<number>`count(*) filter (where ${bizKnowledgeEntries.status} = 'approved')::int`,
    })
    .from(bizKnowledgeEntries)
    .where(eq(bizKnowledgeEntries.businessId, businessId));

  return NextResponse.json({
    counts: { draft: counts?.draft ?? 0, approved: counts?.approved ?? 0 },
    entries: drafts,
  });
}
