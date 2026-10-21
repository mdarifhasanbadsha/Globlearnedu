-- 0016_unread_flag.sql
-- Marks a thread that needs a human's eyes.
--
-- When the AI answers, the thread stays flagged so a staff member knows a
-- student wrote in and nobody has looked yet. Opening the conversation clears
-- it. Without this, an AI-handled enquiry was invisible: no badge, no
-- unread count, nothing to tell the team a real person had messaged.
--
-- Additive only, and the code reads it defensively so chat never depends on it.

ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "needs_review" boolean DEFAULT false NOT NULL;
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "last_ai_reply_at" timestamp;

CREATE INDEX IF NOT EXISTS "biz_conv_review_idx"
  ON "biz_conversations" ("business_id", "needs_review");
