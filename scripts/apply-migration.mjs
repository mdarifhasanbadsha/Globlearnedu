import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}
const sql = neon(url);

const file = process.argv[2];
if (!file) {
  console.error("usage: node --env-file=.env.local scripts/apply-migration.mjs <file.sql>");
  process.exit(1);
}

const raw = readFileSync(file, "utf8");
// neon() http driver runs one statement per call; split on semicolons
// at line ends, ignoring comment-only lines.
const statements = raw
  .split(/;\s*(?:\r?\n|$)/)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

console.log(`Applying ${file} — ${statements.length} statement(s)`);

try {
  for (const stmt of statements) {
    const head = stmt.split("\n")[0].slice(0, 70);
    await sql.query(stmt);
    console.log("  ok:", head);
  }
  console.log("DONE");
} catch (e) {
  console.error("FAILED:", e.message);
  process.exit(1);
}
