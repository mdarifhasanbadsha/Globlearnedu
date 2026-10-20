-- ─────────────────────────────────────────────────────────────
-- 0014_rest_mode.sql
-- Lets the assistant step away from a conversation that has stopped
-- being productive, then return after a cool-off period.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

-- When the assistant may speak again. NULL means not resting.
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "resting_until" timestamp;

-- Consecutive non-genuine turns. One genuine question resets it.
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "strike_count" integer DEFAULT 0 NOT NULL;
