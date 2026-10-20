-- Rollback for 0002_business_crm.sql
-- Drops ONLY the tables created by the business CRM migration.
-- No existing table is touched.
DROP TABLE IF EXISTS "biz_settings";
DROP TABLE IF EXISTS "biz_ai_runs";
DROP TABLE IF EXISTS "biz_messages";
DROP TABLE IF EXISTS "biz_conversations";
