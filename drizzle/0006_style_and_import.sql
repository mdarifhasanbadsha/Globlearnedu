-- ─────────────────────────────────────────────────────────────
-- 0006_style_and_import.sql
-- Stores a versioned "house style" distilled from real conversations,
-- plus import bookkeeping for channel history pulls.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "biz_style_guides" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "summary" text,
  "tone" jsonb DEFAULT '[]',
  "greeting_patterns" jsonb DEFAULT '[]',
  "pricing_phrases" jsonb DEFAULT '[]',
  "followup_phrases" jsonb DEFAULT '[]',
  "avoid_phrases" jsonb DEFAULT '[]',
  "language_mix" varchar(200),
  "sample_count" integer DEFAULT 0 NOT NULL,
  "status" varchar(20) DEFAULT 'draft' NOT NULL,
  "approved_by" uuid,
  "approved_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_style_guides_biz_idx"
  ON "biz_style_guides" ("business_id", "status", "updated_at");

-- One import run per channel pull, so re-runs are traceable and idempotent.
CREATE TABLE IF NOT EXISTS "biz_import_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "channel" varchar(30) NOT NULL,
  "status" varchar(20) DEFAULT 'running' NOT NULL,
  "conversations_seen" integer DEFAULT 0 NOT NULL,
  "conversations_created" integer DEFAULT 0 NOT NULL,
  "messages_imported" integer DEFAULT 0 NOT NULL,
  "messages_skipped" integer DEFAULT 0 NOT NULL,
  "voice_found" integer DEFAULT 0 NOT NULL,
  "voice_transcribed" integer DEFAULT 0 NOT NULL,
  "error" text,
  "started_at" timestamp DEFAULT now() NOT NULL,
  "finished_at" timestamp
);
CREATE INDEX IF NOT EXISTS "biz_import_runs_biz_idx"
  ON "biz_import_runs" ("business_id", "started_at");

-- Voice messages: link the attachment and its transcript to a message.
ALTER TABLE "biz_messages" ADD COLUMN IF NOT EXISTS "media_url" text;
ALTER TABLE "biz_messages" ADD COLUMN IF NOT EXISTS "media_kind" varchar(20);
ALTER TABLE "biz_messages" ADD COLUMN IF NOT EXISTS "transcript" text;
ALTER TABLE "biz_messages" ADD COLUMN IF NOT EXISTS "external_id" varchar(200);

CREATE UNIQUE INDEX IF NOT EXISTS "biz_messages_external_idx"
  ON "biz_messages" ("business_id", "external_id")
  WHERE "external_id" IS NOT NULL;
