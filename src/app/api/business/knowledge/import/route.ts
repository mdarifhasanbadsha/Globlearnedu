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

  // Cap the work per request so a big file cannot exhaust the Worker and return
  // an empty body. The caller splits larger imports; telling them so is better
  // than dying silently halfway through.
  const MAX_PER_REQUEST = 40;
  const batch = raw.slice(0, MAX_PER_REQUEST);
  const remaining = raw.length - batch.length;

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const problems: string[] = [];

  // Read every existing entry once, then write in batches.
  //
  // The previous version ran two queries per programme. With 67 programmes that
  // is ~134 round trips inside one Cloudflare Worker request, which hits the
  // CPU/subrequest limit — the Worker was killed mid-request, the browser got
  // an empty body, and the screen said "Unexpected end of JSON input". The file
  // was fine; the import was simply doing too much work.
  const existingRows = await db
    .select({
      id: bizKnowledgeEntries.id,
      universityName: bizKnowledgeEntries.universityName,
      programName: bizKnowledgeEntries.programName,
      intakeText: bizKnowledgeEntries.intakeText,
    })
    .from(bizKnowledgeEntries)
    .where(eq(bizKnowledgeEntries.businessId, businessId));

  const keyOf = (name: string | null, program: string | null, intake: string) =>
    `${(name ?? "").toLowerCase()}|${(program ?? "").toLowerCase()}|${intake.toLowerCase()}`;

  const existingByKey = new Map<string, string>();
  for (const row of existingRows) {
    existingByKey.set(
      keyOf(row.universityName, row.programName, row.intakeText ?? ""),
      row.id
    );
  }

  const toInsert: any[] = [];
  const toUpdate: { id: string; values: any }[] = [];

  for (const u of batch) {
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

      // The level is what makes a programme meaningful to a student, so an
      // entry with no level is skipped rather than imported as a guess.
      const programName = `${level.charAt(0).toUpperCase()}${level.slice(1)} programmes`;

      const majors = Array.isArray(p?.majors)
        ? p.majors.map((m: any) => scrub(String(m))).filter(Boolean)
        : [];

      const intakeText = scrub(p?.intake ?? null);

      const notesParts: string[] = [];
      if (majors.length) notesParts.push(`Majors: ${majors.join(", ")}`);
      if (p?.tuition) notesParts.push(`Tuition: ${p.tuition}`);
      if (p?.hostel) notesParts.push(`Hostel: ${p.hostel}`);
      if (p?.scholarship) notesParts.push(`Scholarship: ${String(p.scholarship).replace(/\s+/g, " ").trim()}`);
      if (p?.duration_years) notesParts.push(`Duration: ${p.duration_years} years`);
      if (p?.age_limit) notesParts.push(`Age: ${p.age_limit}`);
      if (ranking) notesParts.push(`Ranking: ${ranking}`);
      if (p?.notes) notesParts.push(String(p.notes));
      const notes = scrub(notesParts.join("\n"));

      const docs = Array.isArray(p?.requirements)
        ? p.requirements.map((r: any) => scrub(String(r))).filter(Boolean)
        : [];
      const requirements = docs.length > 0 ? { documents: docs } : {};

      const key = keyOf(universityName, programName, intakeText ?? "");
      const existingId = existingByKey.get(key);

      const values = {
        city,
        level,
        notes,
        requirements,
        intakeText,
        teachingLanguage: scrub(p?.teaching_language ?? null),
        dataCompleteness: "partial" as const,
        status: "draft" as const,
      };

      if (existingId) {
        toUpdate.push({ id: existingId, values: { ...values, province, updatedAt: new Date() } });
        updated++;
      } else {
        toInsert.push({ businessId, universityName, province, programName, ...values });
        created++;
      }
    }
  }

  // Few queries regardless of file size: one insert, a handful of updates.
  if (toInsert.length > 0) {
    for (let i = 0; i < toInsert.length; i += 40) {
      await db.insert(bizKnowledgeEntries).values(toInsert.slice(i, i + 40));
    }
  }
  for (const u of toUpdate) {
    await db.update(bizKnowledgeEntries).set(u.values).where(eq(bizKnowledgeEntries.id, u.id));
  }

  // How much is now waiting for approval?
  const [pending] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizKnowledgeEntries)
    .where(and(eq(bizKnowledgeEntries.businessId, businessId), eq(bizKnowledgeEntries.status, "draft")));

  return NextResponse.json({
    created,
    remaining,
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
