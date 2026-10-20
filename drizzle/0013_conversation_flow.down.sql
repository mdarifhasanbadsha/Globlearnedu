-- Rollback for 0013_conversation_flow.sql
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "pending_quote_at";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "pending_quote";
