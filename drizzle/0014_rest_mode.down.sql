-- Rollback for 0014_rest_mode.sql
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "strike_count";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "resting_until";
