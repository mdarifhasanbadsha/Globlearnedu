/**
 * Migration: Add target-tracking columns to application_universities
 * and create new tables for the review workflow.
 *
 * Run: npx tsx scripts/migrate-schema-v2.ts
 */

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as path from "path";
import * as ws from "ws";

// Load env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Neon serverless needs ws in Node.js
(globalThis as any).WebSocket = ws.default ?? ws;

const sql = neon(process.env.DATABASE_URL!);

async function run() {
  console.log("Running migration v2...");

  // ── 1. Extend application_universities ──────────────────
  console.log("\n[1/6] Extending application_universities...");
  await sql`
    ALTER TABLE application_universities
      ADD COLUMN IF NOT EXISTS university_name  VARCHAR(255),
      ADD COLUMN IF NOT EXISTS expected_major   VARCHAR(255),
      ADD COLUMN IF NOT EXISTS intake           VARCHAR(50),
      ADD COLUMN IF NOT EXISTS target_status    VARCHAR(50) NOT NULL DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS priority         INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS added_by_staff_id UUID REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS updated_at       TIMESTAMP DEFAULT NOW()
  `;
  // Make university_id nullable (was NOT NULL)
  await sql`
    ALTER TABLE application_universities
      ALTER COLUMN university_id DROP NOT NULL
  `;
  console.log("  ✓ application_universities extended");

  // ── 2. application_status_history ──────────────────────
  console.log("\n[2/6] Creating application_status_history...");
  await sql`
    CREATE TABLE IF NOT EXISTS application_status_history (
      id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id        UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      target_id             UUID REFERENCES application_universities(id) ON DELETE CASCADE,
      previous_status       VARCHAR(50),
      new_status            VARCHAR(50) NOT NULL,
      student_visible_remark TEXT,
      internal_note         TEXT,
      visible_to_student    BOOLEAN NOT NULL DEFAULT TRUE,
      changed_by_staff_id   UUID REFERENCES users(id),
      changed_by_staff_name VARCHAR(255),
      created_at            TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log("  ✓ application_status_history created");

  // ── 3. status_attachments ───────────────────────────────
  console.log("\n[3/6] Creating status_attachments...");
  await sql`
    CREATE TABLE IF NOT EXISTS status_attachments (
      id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      status_history_id   UUID NOT NULL REFERENCES application_status_history(id) ON DELETE CASCADE,
      application_id      UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      file_name           VARCHAR(255) NOT NULL,
      file_url            VARCHAR(500) NOT NULL,
      file_type           VARCHAR(100),
      document_category   VARCHAR(100),
      visible_to_student  BOOLEAN NOT NULL DEFAULT TRUE,
      uploaded_by_staff_id UUID REFERENCES users(id),
      created_at          TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log("  ✓ status_attachments created");

  // ── 4. modification_requests ────────────────────────────
  console.log("\n[4/6] Creating modification_requests...");
  await sql`
    CREATE TABLE IF NOT EXISTS modification_requests (
      id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id          UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      requested_by_staff_id   UUID REFERENCES users(id),
      message                 TEXT NOT NULL,
      sections_to_modify      JSONB,
      documents_to_reupload   JSONB,
      is_payment_issue        BOOLEAN DEFAULT FALSE,
      status                  VARCHAR(30) NOT NULL DEFAULT 'pending',
      resolved_at             TIMESTAMP,
      created_at              TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log("  ✓ modification_requests created");

  // ── 5. application_edit_logs ────────────────────────────
  console.log("\n[5/6] Creating application_edit_logs...");
  await sql`
    CREATE TABLE IF NOT EXISTS application_edit_logs (
      id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id        UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      edited_by_staff_id    UUID REFERENCES users(id),
      edited_by_staff_name  VARCHAR(255),
      field_changed         VARCHAR(100),
      old_value             TEXT,
      new_value             TEXT,
      created_at            TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log("  ✓ application_edit_logs created");

  // ── 6. email_logs ───────────────────────────────────────
  console.log("\n[6/6] Creating email_logs...");
  await sql`
    CREATE TABLE IF NOT EXISTS email_logs (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      recipient_email  VARCHAR(255) NOT NULL,
      subject          VARCHAR(500),
      body             TEXT,
      template_name    VARCHAR(100),
      application_id   UUID REFERENCES applications(id),
      status           VARCHAR(30) DEFAULT 'sent',
      error_message    TEXT,
      created_at       TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
  console.log("  ✓ email_logs created");

  // ── 7. applicationMode column on applications ───────────
  console.log("\n[+] Adding application_mode to applications...");
  await sql`
    ALTER TABLE applications
      ADD COLUMN IF NOT EXISTS application_mode VARCHAR(20) NOT NULL DEFAULT 'submitted',
      ADD COLUMN IF NOT EXISTS last_resubmitted_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP
  `;
  console.log("  ✓ application_mode added");

  console.log("\n✅ Migration complete.\n");
}

run().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
