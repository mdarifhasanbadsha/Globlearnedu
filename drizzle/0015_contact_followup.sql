-- ─────────────────────────────────────────────────────────────
-- 0015_contact_followup.sql
-- Tracks the post-handoff follow-up sequence: did the team actually call,
-- is the number right, and has a human taken over.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

-- none | awaiting_call | awaiting_number | final_wait | handed_off
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "followup_stage" varchar(20);

-- When the next follow-up message becomes due.
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "followup_due_at" timestamp;

-- When the current stage began, for the grace window before a human replies.
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "followup_stage_at" timestamp;

CREATE INDEX IF NOT EXISTS "biz_conv_followup_idx"
  ON "biz_conversations" ("business_id", "followup_due_at");
