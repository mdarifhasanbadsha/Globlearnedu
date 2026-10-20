// Import the verified university data as APPROVED knowledge entries.
// Owner rule: these are EXAMPLES from our database, never "found only for you".
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const sql = neon(process.env.DATABASE_URL);
const BIZ = "18a043a9-0160-4e2f-800a-413f6ff8de6f";
const data = JSON.parse(readFileSync("scripts/_final.json", "utf8"));

function fmt(p) {
  const bits = [];
  if (p.duration_years) bits.push(`Duration ${p.duration_years} years`);
  if (p.teaching_language) bits.push(`Taught in ${p.teaching_language}`);
  if (p.intake) bits.push(`Intake ${p.intake}`);
  if (p.age_limit) bits.push(`Age ${p.age_limit}`);
  if (p.tuition) bits.push(`Tuition ${p.tuition}`);
  if (p.hostel) bits.push(`Accommodation ${p.hostel}`);
  if (p.scholarship) bits.push(`Scholarship ${p.scholarship}`);
  if (p.notes) bits.push(String(p.notes).slice(0, 400));
  return bits.join(". ");
}

let inserted = 0, updated = 0, skipped = 0;

for (const u of data) {
  for (const p of u.programs) {
    const majors = (p.majors ?? []).filter(Boolean);
    if (majors.length === 0 && !p.tuition) {
      skipped++;
      continue;
    }

    // One entry per level per university, listing that level's majors.
    const programName = `${p.level.charAt(0).toUpperCase() + p.level.slice(1)} programmes`;
    const details = [
      fmt(p),
      majors.length ? `Majors: ${majors.join("; ")}` : null,
      u.ranking ? `Ranking: ${u.ranking}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    if (!details.trim()) {
      skipped++;
      continue;
    }

    const requirements = (p.requirements ?? []).filter(Boolean).join("; ") || null;

    // Avoid duplicate rows for the same university + level + intake.
    const [existing] = await sql`
      select id from biz_knowledge_entries
      where business_id = ${BIZ}
        and university_name = ${u.name}
        and program_name = ${programName}
        and coalesce(intake_text, '') = ${p.intake ?? ""}
      limit 1`;

    // Column names are "notes" (text) and "requirements" (jsonb) — the
    // schema has no "details" column.
    const reqJson = requirements ? JSON.stringify({ documents: requirements }) : null;

    if (existing) {
      await sql`
        update biz_knowledge_entries set
          city = ${u.city}, level = ${p.level}, notes = ${details},
          requirements = coalesce(${reqJson}::jsonb, requirements),
          intake_text = ${p.intake ?? null},
          teaching_language = ${p.teaching_language ?? null},
          status = 'approved', updated_at = now()
        where id = ${existing.id}`;
      updated++;
    } else {
      await sql`
        insert into biz_knowledge_entries
          (business_id, university_name, city, program_name, level, notes,
           requirements, intake_text, teaching_language, status)
        values (${BIZ}, ${u.name}, ${u.city}, ${programName}, ${p.level}, ${details},
                ${reqJson}::jsonb, ${p.intake ?? null},
                ${p.teaching_language ?? null}, 'approved')`;
      inserted++;
    }
  }
}

const [{ n }] = await sql`
  select count(*)::int n from biz_knowledge_entries
  where business_id=${BIZ} and status='approved'`;
const [{ u: unis }] = await sql`
  select count(distinct university_name)::int u from biz_knowledge_entries
  where business_id=${BIZ} and status='approved'`;

console.log(`inserted ${inserted}, updated ${updated}, skipped ${skipped}`);
console.log(`approved entries: ${n} across ${unis} universities`);
