-- ─────────────────────────────────────────────────────────────
-- 0004_brochure_fields.sql
-- Adds the fields real GL Education brochures actually contain:
-- per-semester fees, hostel, application/insurance fees, fees timing,
-- T-visa flag, and language->degree progression.
-- Additive only. Existing rows keep NULL for the new columns.
-- Rollback: 0004_brochure_fields.down.sql
-- ─────────────────────────────────────────────────────────────

ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "university_name_cn" varchar(255);
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "province" varchar(100);
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "university_type" varchar(50);

ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "tuition_period" varchar(20);
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "hostel_amount" integer;
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "hostel_period" varchar(20);
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "application_fee" integer;
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "insurance_fee" integer;

ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "intake_text" varchar(100);
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "t_visa_after_one_semester" boolean;
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "language_to_degree" varchar(100);
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "fee_payment_note" text;

-- Keep source page context so a reviewer can trace a fact back to its brochure.
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "source_page" integer;
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "brochure_name" varchar(255);
