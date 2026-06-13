/**
 * Backfill: populate application_universities from selectedUniversities JSONB
 * for applications that were submitted before the new target-tracking columns existed.
 *
 * Run: npx tsx scripts/backfill-targets.ts
 */

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as path from "path";
import * as ws from "ws";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
(globalThis as any).WebSocket = ws.default ?? ws;

const sql = neon(process.env.DATABASE_URL!);

async function run() {
  console.log("Backfilling applicationUniversities from selectedUniversities JSONB...\n");

  const apps = await sql`
    SELECT id, application_number, selected_universities
    FROM applications
    WHERE selected_universities IS NOT NULL
      AND jsonb_array_length(selected_universities::jsonb) > 0
  `;

  console.log(`Found ${apps.length} applications with selectedUniversities data.`);

  let inserted = 0;
  let skipped = 0;

  for (const app of apps) {
    const unis: Array<{
      universityId?: string;
      universityName?: string;
      programName?: string;
      expectedMajor?: string;
    }> = Array.isArray(app.selected_universities) ? app.selected_universities : [];

    for (let i = 0; i < unis.length; i++) {
      const u = unis[i];

      // Check if this target already exists (avoid duplicates on re-run)
      const exists = await sql`
        SELECT id FROM application_universities
        WHERE application_id = ${app.id}
          AND (
            university_id = ${u.universityId ?? null}
            OR university_name = ${u.universityName ?? null}
          )
        LIMIT 1
      `;

      if (exists.length > 0) {
        // Row exists — backfill any missing fields
        await sql`
          UPDATE application_universities
          SET
            university_name  = COALESCE(university_name,  ${u.universityName ?? null}),
            program_name     = COALESCE(program_name,     ${u.programName ?? null}),
            expected_major   = COALESCE(expected_major,   ${u.expectedMajor ?? null}),
            "order"          = COALESCE("order",          ${i + 1}),
            priority         = COALESCE(priority,         ${i + 1})
          WHERE id = ${exists[0].id}
        `;
        skipped++;
      } else {
        // Insert new row
        await sql`
          INSERT INTO application_universities
            (application_id, university_id, university_name, program_name, expected_major, "order", priority, target_status, status, updated_at)
          VALUES
            (${app.id}, ${u.universityId ?? null}, ${u.universityName ?? null}, ${u.programName ?? null}, ${u.expectedMajor ?? null}, ${i + 1}, ${i + 1}, 'pending', 'submitted', NOW())
        `;
        inserted++;
      }
    }
  }

  console.log(`\n✅ Done.`);
  console.log(`   Inserted: ${inserted} new target rows`);
  console.log(`   Updated:  ${skipped} existing rows (backfilled missing fields)`);
}

run().catch((e) => {
  console.error("Backfill failed:", e);
  process.exit(1);
});
