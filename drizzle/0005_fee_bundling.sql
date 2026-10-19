-- ─────────────────────────────────────────────────────────────
-- 0005_fee_bundling.sql
-- Real brochures differ in how they present fees:
--   * some quote tuition and hostel separately
--   * some bundle tuition + hostel into one figure
--   * some omit the application fee entirely (filled in later)
-- Additive only.
-- ─────────────────────────────────────────────────────────────

-- When the brochure gives ONE combined figure for tuition + hostel.
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "combined_fee_amount" integer;
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "combined_fee_period" varchar(20);
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "combined_fee_includes" varchar(100);

-- Text exactly as printed, kept for audit when the brochure is ambiguous.
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "fee_note_raw" text;

-- Marks fields the owner knows are missing and will fill in later,
-- so the AI can say "not yet confirmed" instead of "no fee".
ALTER TABLE "biz_knowledge_entries" ADD COLUMN IF NOT EXISTS "data_completeness" varchar(20)
  DEFAULT 'partial' NOT NULL;

CREATE INDEX IF NOT EXISTS "biz_knowledge_completeness_idx"
  ON "biz_knowledge_entries" ("business_id", "data_completeness");
