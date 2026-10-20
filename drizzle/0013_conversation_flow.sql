-- ─────────────────────────────────────────────────────────────
-- 0013_conversation_flow.sql
-- Supports quoted-message context and burst batching.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

-- The message a student is replying to, held until the batched reply runs.
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "pending_quote" text;
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "pending_quote_at" timestamp;
