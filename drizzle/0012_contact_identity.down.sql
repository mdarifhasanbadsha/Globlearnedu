-- Rollback for 0012_contact_identity.sql
DROP INDEX IF EXISTS "biz_conv_source_idx";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "source_url";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "source_post_id";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "source_ad_id";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "source_ref";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "source_kind";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "profile_synced_at";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "contact_locale";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "contact_picture";
ALTER TABLE "biz_conversations" DROP COLUMN IF EXISTS "contact_name";
