-- Rollback for 0006_style_and_import.sql
DROP INDEX IF EXISTS "biz_messages_external_idx";
ALTER TABLE "biz_messages" DROP COLUMN IF EXISTS "external_id";
ALTER TABLE "biz_messages" DROP COLUMN IF EXISTS "transcript";
ALTER TABLE "biz_messages" DROP COLUMN IF EXISTS "media_kind";
ALTER TABLE "biz_messages" DROP COLUMN IF EXISTS "media_url";
DROP TABLE IF EXISTS "biz_import_runs";
DROP TABLE IF EXISTS "biz_style_guides";
