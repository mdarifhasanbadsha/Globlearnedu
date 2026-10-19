-- Rollback for 0003_business_crm_phases.sql
-- Drops ONLY tables/columns added by this migration.
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "visitor_name";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "handoff_at";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "channel";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "lead_id";

DROP TABLE IF EXISTS "biz_rate_limits";
DROP TABLE IF EXISTS "biz_oauth_states";
DROP TABLE IF EXISTS "biz_channel_connections";
DROP TABLE IF EXISTS "biz_followups";
DROP TABLE IF EXISTS "biz_leads";
DROP TABLE IF EXISTS "biz_knowledge_entries";
DROP TABLE IF EXISTS "biz_knowledge_sources";
