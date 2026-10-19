-- ─────────────────────────────────────────────────────────────
-- 0003_business_crm_phases.sql
-- Additive only. Extends the /business area.
-- Never alters universities, programs, applications, payments, users.
-- Rollback: 0003_business_crm_phases.down.sql
-- ─────────────────────────────────────────────────────────────

-- ── KNOWLEDGE (Phase B) ─────────────────────────────────────
-- Source documents the owner uploads (brochures, photos, PDFs).
CREATE TABLE IF NOT EXISTS "biz_knowledge_sources" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "title" varchar(255) NOT NULL,
  "kind" varchar(20) DEFAULT 'image' NOT NULL,
  "file_key" text,
  "mime_type" varchar(100),
  "size_bytes" integer,
  "status" varchar(20) DEFAULT 'uploaded' NOT NULL,
  "extraction_error" text,
  "raw_text" text,
  "uploaded_by" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_knowledge_sources_biz_idx"
  ON "biz_knowledge_sources" ("business_id", "created_at");

-- Structured, human-approved facts extracted from a source.
-- Only status='approved' rows may be cited by the AI.
CREATE TABLE IF NOT EXISTS "biz_knowledge_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "source_id" uuid,
  "university_name" varchar(255),
  "city" varchar(100),
  "program_name" varchar(255),
  "level" varchar(50),
  "duration" varchar(50),
  "teaching_language" varchar(50),
  "tuition_amount" integer,
  "tuition_currency" varchar(8),
  "intake_months" jsonb DEFAULT '[]',
  "application_deadline" varchar(60),
  "requirements" jsonb DEFAULT '{}',
  "scholarships" jsonb DEFAULT '[]',
  "notes" text,
  "confidence" varchar(20) DEFAULT 'draft',
  "status" varchar(20) DEFAULT 'draft' NOT NULL,
  "approved_by" uuid,
  "approved_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_knowledge_entries_status_idx"
  ON "biz_knowledge_entries" ("business_id", "status");
CREATE INDEX IF NOT EXISTS "biz_knowledge_entries_source_idx"
  ON "biz_knowledge_entries" ("source_id");

-- ── LEADS (Phase D) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "biz_leads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "conversation_id" uuid,
  "full_name" varchar(200),
  "phone" varchar(40),
  "email" varchar(255),
  "nationality" varchar(100),
  "degree_level" varchar(50),
  "subject_interest" varchar(200),
  "gpa_value" numeric(4,2),
  "gpa_scale" numeric(4,2),
  "budget_amount" integer,
  "budget_currency" varchar(8),
  "intake_target" varchar(50),
  "language_test" varchar(100),
  "stage" varchar(30) DEFAULT 'new' NOT NULL,
  "stage_reason" text,
  "assigned_staff_id" uuid,
  "consent_contact" boolean DEFAULT false NOT NULL,
  "source" varchar(40) DEFAULT 'website_chat' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_leads_biz_stage_idx"
  ON "biz_leads" ("business_id", "stage", "created_at");
CREATE INDEX IF NOT EXISTS "biz_leads_conv_idx" ON "biz_leads" ("conversation_id");
CREATE INDEX IF NOT EXISTS "biz_leads_phone_idx" ON "biz_leads" ("business_id", "phone");

-- ── FOLLOWUPS (Phase E) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS "biz_followups" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "lead_id" uuid,
  "conversation_id" uuid,
  "channel" varchar(20) DEFAULT 'in_app' NOT NULL,
  "body" text NOT NULL,
  "due_at" timestamp NOT NULL,
  "status" varchar(20) DEFAULT 'pending' NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "last_error" text,
  "stop_reason" varchar(50),
  "created_by" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_followups_due_idx"
  ON "biz_followups" ("business_id", "status", "due_at");
CREATE INDEX IF NOT EXISTS "biz_followups_lead_idx" ON "biz_followups" ("lead_id");

-- ── CHANNEL CONNECTIONS (Phase G-1) ─────────────────────────
-- Credentials stored encrypted (AES-GCM); never returned to browser.
CREATE TABLE IF NOT EXISTS "biz_channel_connections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "channel" varchar(30) NOT NULL,
  "external_id" varchar(200),
  "display_name" varchar(255),
  "credentials_enc" text,
  "scopes" jsonb DEFAULT '[]',
  "status" varchar(20) DEFAULT 'disconnected' NOT NULL,
  "last_checked_at" timestamp,
  "last_error" text,
  "connected_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "biz_channel_biz_channel_idx"
  ON "biz_channel_connections" ("business_id", "channel", "external_id");

-- OAuth state / PKCE, single-use and expiring.
CREATE TABLE IF NOT EXISTS "biz_oauth_states" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "channel" varchar(30) NOT NULL,
  "state" varchar(128) NOT NULL UNIQUE,
  "code_verifier" text,
  "created_by" uuid,
  "expires_at" timestamp NOT NULL,
  "consumed_at" timestamp
);

-- ── CONVERSATION EXTENSIONS ─────────────────────────────────
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "lead_id" uuid;
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "channel" varchar(30) DEFAULT 'website' NOT NULL;
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "handoff_at" timestamp;
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "visitor_name" varchar(200);

-- Staff/visitor-id scoped rate limiting.
CREATE TABLE IF NOT EXISTS "biz_rate_limits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "bucket_key" varchar(200) NOT NULL,
  "window_start" timestamp NOT NULL,
  "count" integer DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "biz_rate_bucket_idx"
  ON "biz_rate_limits" ("bucket_key", "window_start");
