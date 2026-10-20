-- Rollback for 0004_brochure_fields.sql
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "brochure_name";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "source_page";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "fee_payment_note";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "language_to_degree";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "t_visa_after_one_semester";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "intake_text";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "insurance_fee";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "application_fee";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "hostel_period";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "hostel_amount";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "tuition_period";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "university_type";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "province";
ALTER TABLE "biz_knowledge_entries" DROP COLUMN IF EXISTS "university_name_cn";
