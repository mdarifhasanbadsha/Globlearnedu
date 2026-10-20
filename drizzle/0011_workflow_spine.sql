-- ─────────────────────────────────────────────────────────────
-- 0011_workflow_spine.sql
-- The missing middle of the agency workflow: what happened to a lead,
-- who said what, and what happens next.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

-- A staff note on a lead: call outcome, objection, next step.
CREATE TABLE IF NOT EXISTS "biz_lead_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "lead_id" uuid NOT NULL,
  "body" text NOT NULL,
  -- call | whatsapp | messenger | email | note
  "kind" varchar(20) DEFAULT 'note' NOT NULL,
  "outcome" varchar(40),
  "author_id" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_lead_notes_lead_idx"
  ON "biz_lead_notes" ("lead_id", "created_at");

-- Append-only timeline: every meaningful change, so the story is readable
-- and nothing is silently rewritten.
CREATE TABLE IF NOT EXISTS "biz_lead_activity" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "lead_id" uuid NOT NULL,
  -- created | stage_changed | assigned | note_added | score_changed |
  -- inbound | outbound | followup_scheduled | followup_done
  "kind" varchar(40) NOT NULL,
  "summary" varchar(300) NOT NULL,
  "detail" jsonb,
  "actor_id" uuid,
  -- "staff" | "system" | "student"
  "actor_kind" varchar(20) DEFAULT 'system' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_lead_activity_lead_idx"
  ON "biz_lead_activity" ("lead_id", "created_at");
CREATE INDEX IF NOT EXISTS "biz_lead_activity_biz_idx"
  ON "biz_lead_activity" ("business_id", "created_at");

-- A day-to-day task for a staff member.
CREATE TABLE IF NOT EXISTS "biz_tasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "lead_id" uuid,
  "title" varchar(300) NOT NULL,
  "notes" text,
  "due_at" timestamp,
  "status" varchar(20) DEFAULT 'open' NOT NULL,
  "assigned_to" uuid,
  "priority" varchar(20) DEFAULT 'normal' NOT NULL,
  "created_by" uuid,
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_tasks_assignee_idx"
  ON "biz_tasks" ("business_id", "status", "due_at");
CREATE INDEX IF NOT EXISTS "biz_tasks_lead_idx" ON "biz_tasks" ("lead_id");

-- Remember when we last alerted, so a hot lead is not announced repeatedly.
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "alerted_at" timestamp;
