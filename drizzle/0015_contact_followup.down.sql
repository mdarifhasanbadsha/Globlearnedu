-- Rollback for 0015_contact_followup.sql
DROP INDEX IF EXISTS "biz_conv_followup_idx";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "followup_stage_at";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "followup_due_at";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "followup_stage";
