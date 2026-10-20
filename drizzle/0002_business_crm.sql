-- ─────────────────────────────────────────────────────────────
-- 0002_business_crm.sql
-- Additive only. Creates the /business tables.
-- Does NOT alter, drop, or backfill any existing table.
-- Reversible: see 0002_business_crm.down.sql
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "biz_conversations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "visitor_id" varchar(64) NOT NULL,
  "student_id" uuid,
  "subject" varchar(255),
  "status" varchar(20) DEFAULT 'open' NOT NULL,
  "ai_state" varchar(20) DEFAULT 'active' NOT NULL,
  "assigned_staff_id" uuid,
  "last_message_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "biz_conv_business_idx"
  ON "biz_conversations" ("business_id", "last_message_at");
CREATE INDEX IF NOT EXISTS "biz_conv_visitor_idx"
  ON "biz_conversations" ("visitor_id");
CREATE INDEX IF NOT EXISTS "biz_conv_status_idx"
  ON "biz_conversations" ("business_id", "status");

CREATE TABLE IF NOT EXISTS "biz_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "conversation_id" uuid NOT NULL,
  "direction" varchar(10) NOT NULL,
  "author_kind" varchar(12) NOT NULL,
  "author_id" uuid,
  "body" text NOT NULL,
  "meta" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "biz_msg_conv_idx"
  ON "biz_messages" ("conversation_id", "created_at");
CREATE INDEX IF NOT EXISTS "biz_msg_business_idx"
  ON "biz_messages" ("business_id", "created_at");

CREATE TABLE IF NOT EXISTS "biz_ai_runs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "conversation_id" uuid,
  "model" varchar(60) NOT NULL,
  "prompt_tokens" integer DEFAULT 0 NOT NULL,
  "completion_tokens" integer DEFAULT 0 NOT NULL,
  "cost_micros" integer DEFAULT 0 NOT NULL,
  "currency" varchar(3) DEFAULT 'USD' NOT NULL,
  "status" varchar(20) DEFAULT 'ok' NOT NULL,
  "error_message" text,
  "latency_ms" integer,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "biz_ai_business_idx"
  ON "biz_ai_runs" ("business_id", "created_at");
CREATE INDEX IF NOT EXISTS "biz_ai_conv_idx"
  ON "biz_ai_runs" ("conversation_id");

CREATE TABLE IF NOT EXISTS "biz_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "key" varchar(100) NOT NULL,
  "value" text,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "biz_settings_business_key_idx"
  ON "biz_settings" ("business_id", "key");
