-- Rollback for 0009_style_editable.sql
ALTER TABLE "biz_test_findings" DROP COLUMN IF EXISTS "promoted_at";
ALTER TABLE "biz_test_findings" DROP COLUMN IF EXISTS "promoted_to";
ALTER TABLE "biz_style_guides" DROP COLUMN IF EXISTS "version";
ALTER TABLE "biz_style_guides" DROP COLUMN IF EXISTS "edited_by_owner";
ALTER TABLE "biz_style_guides" DROP COLUMN IF EXISTS "custom_rules";
