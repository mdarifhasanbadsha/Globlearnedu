-- Rollback for 0005_fee_bundling.sql
DROP INDEX IF EXISTS "biz_knowledge_completeness_idx";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "data_completeness";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "fee_note_raw";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "combined_fee_includes";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "combined_fee_period";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "combined_fee_amount";
