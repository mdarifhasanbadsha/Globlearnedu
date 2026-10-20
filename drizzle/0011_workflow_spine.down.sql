-- Rollback for 0011_workflow_spine.sql
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "alerted_at";
DROP TABLE IF EXISTS "biz_tasks";
DROP TABLE IF EXISTS "biz_lead_activity";
DROP TABLE IF EXISTS "biz_lead_notes";
