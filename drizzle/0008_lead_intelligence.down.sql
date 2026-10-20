-- Rollback for 0008_lead_intelligence.sql
DROP INDEX IF EXISTS "biz_leads_category_idx";
DROP INDEX IF EXISTS "biz_leads_next_action_idx";
DROP INDEX IF EXISTS "biz_leads_priority_idx";

ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "ignore_reason";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "ignored";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "next_action_at";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "next_action";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "inbound_count";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "last_inbound_at";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "intent_signals";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "reasoning";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "category";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "priority";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "score";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "contact_note";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "contact_channel";
ALTER TABLE "biz_leads" DROP COLUMN IF EXISTS "has_contact";
