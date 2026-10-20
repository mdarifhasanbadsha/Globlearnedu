-- ─────────────────────────────────────────────────────────────
-- 0008_lead_intelligence.sql
-- Turns imported conversation history into a scored, categorised
-- pipeline with next actions and priority.
-- Additive only; existing lead rows are backfilled in place.
-- ─────────────────────────────────────────────────────────────

-- Contact signal: did the student already share a reachable channel?
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "has_contact" boolean DEFAULT false NOT NULL;
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "contact_channel" varchar(30);
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "contact_note" varchar(255);

-- Lead quality, derived deterministically then reviewable.
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "score" integer DEFAULT 0 NOT NULL;
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "priority" varchar(20) DEFAULT 'cold' NOT NULL;
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "category" varchar(40) DEFAULT 'unclassified' NOT NULL;

-- Why the AI/engine assigned this category, so it is auditable.
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "reasoning" text;
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "intent_signals" jsonb DEFAULT '{}';
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "last_inbound_at" timestamp;
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "inbound_count" integer DEFAULT 0 NOT NULL;

-- Next action + when it is due.
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "next_action" varchar(200);
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "next_action_at" timestamp;
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "ignored" boolean DEFAULT false NOT NULL;
ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "ignore_reason" varchar(100);

CREATE INDEX IF NOT EXISTS "biz_leads_priority_idx"
  ON "biz_leads" ("business_id", "priority", "score");
CREATE INDEX IF NOT EXISTS "biz_leads_next_action_idx"
  ON "biz_leads" ("business_id", "next_action_at");
CREATE INDEX IF NOT EXISTS "biz_leads_category_idx"
  ON "biz_leads" ("business_id", "category");
