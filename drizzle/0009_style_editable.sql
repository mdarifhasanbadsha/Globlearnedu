-- ─────────────────────────────────────────────────────────────
-- 0009_style_editable.sql
-- Make the brand voice hand-editable, and let a Test & Train finding
-- be promoted into the voice so testing actually teaches.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

-- Owner's own instruction, always appended after the learned guide.
ALTER TABLE "biz_style_guides" ADD COLUMN IF NOT EXISTS "custom_rules" text;
-- Marks a guide the owner typed or edited, so regeneration does not
-- silently overwrite their work.
ALTER TABLE "biz_style_guides" ADD COLUMN IF NOT EXISTS "edited_by_owner" boolean DEFAULT false NOT NULL;
ALTER TABLE "biz_style_guides" ADD COLUMN IF NOT EXISTS "version" integer DEFAULT 1 NOT NULL;

-- A finding can be promoted into the voice or into knowledge.
ALTER TABLE "biz_test_findings" ADD COLUMN IF NOT EXISTS "promoted_to" varchar(30);
ALTER TABLE "biz_test_findings" ADD COLUMN IF NOT EXISTS "promoted_at" timestamp;
