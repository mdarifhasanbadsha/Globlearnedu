-- Rollback for 0016_unread_flag.sql
DROP INDEX IF EXISTS "biz_conv_review_idx";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "last_ai_reply_at";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "needs_review";
