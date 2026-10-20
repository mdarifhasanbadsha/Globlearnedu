-- Rollback for 0010_outbound_sends.sql
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "last_inbound_at";
DROP TABLE IF EXISTS "biz_outbound_sends";
