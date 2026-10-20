// Rebuild the import JSON with:
//  - every university, INCLUDING those with only a city (no name)
//  - a neutral placeholder name where the source printed no name
//  - city and province kept, since the team relays the name anyway
import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync("scripts/_final.json", "utf8"));

// The owner's rule: if a university's name is not printed, we still keep the
// record so the team can supply the name. Nothing is invented.
let unnamed = 0;

const universities = data.map((u) => {
  let name = (u.name ?? "").trim();
  const city = (u.city ?? "").trim() || null;

  // Drop obvious non-university artefacts from earlier parsing.
  const junk = /^(visit|more|see|contact|table of|index)/i;
  if (junk.test(name)) name = "";

  if (!name || name.length < 4) {
    unnamed++;
    name = city ? `University in ${city.replace(/\s*City$/i, "")} (name to confirm)` : "University (name to confirm)";
  }

  return {
    name,
    city: city ? city.replace(/\s*City$/i, "") : null,
    province: (u.province ?? "").trim() || null,
    ranking: (u.ranking ?? "").trim() || null,
    programs: (u.programs ?? []).map((p) => ({
      level: p.level,
      teaching_language: p.teaching_language ?? null,
      duration_years: p.duration_years ?? null,
      intake: p.intake ?? null,
      age_limit: p.age_limit ?? null,
      tuition: p.tuition ?? null,
      hostel: p.hostel ?? null,
      scholarship: p.scholarship ?? null,
      majors: (p.majors ?? []).filter(Boolean),
      requirements: (p.requirements ?? []).filter(Boolean),
      notes: p.notes ?? null,
    })),
  };
});

// Merge entries that ended up with the same placeholder plus city.
const merged = new Map();
for (const u of universities) {
  const key = `${u.name}|${u.city ?? ""}`;
  if (!merged.has(key)) {
    merged.set(key, { ...u, programs: [...u.programs] });
  } else {
    const m = merged.get(key);
    m.programs.push(...u.programs);
    if (!m.ranking && u.ranking) m.ranking = u.ranking;
    if (!m.province && u.province) m.province = u.province;
  }
}

const out = { universities: [...merged.values()] };

// Deduplicate programmes within a university by level + intake + majors.
for (const u of out.universities) {
  const seen = new Set();
  u.programs = u.programs.filter((p) => {
    const k = `${p.level}|${p.intake ?? ""}|${(p.majors ?? []).join(",")}|${p.tuition ?? ""}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const totalPrograms = out.universities.reduce((n, u) => n + u.programs.length, 0);
const withCity = out.universities.filter((u) => u.city).length;
const named = out.universities.filter((u) => !/name to confirm/.test(u.name)).length;

writeFileSync("data/universities-import.json", JSON.stringify(out, null, 1));

const blob = JSON.stringify(out);
const residue = blob.match(/RK\s*Edu\w*|therkedu|rk-?edu|@[\w.-]+\.\w+/gi);

console.log(`universities: ${out.universities.length}`);
console.log(`  with a printed name: ${named}`);
console.log(`  name to confirm:     ${out.universities.length - named} (was ${unnamed} before merge)`);
console.log(`  with a city:         ${withCity}`);
console.log(`programmes:            ${totalPrograms}`);
console.log(`agency residue:        ${residue ? residue.join(", ") : "NONE"}`);
console.log("\nfirst 10 entries:");
for (const u of out.universities.slice(0, 10)) {
  console.log(`  ${u.name} | ${u.city ?? "?"} | ${u.programs.length} prog`);
}
