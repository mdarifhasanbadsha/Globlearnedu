-- ─────────────────────────────────────────────────────────────
-- 0007_test_lab.sql
-- A sandbox for talking to the AI as a student, checking accuracy,
-- and capturing what it gets wrong so it can be taught.
-- Test sessions NEVER mix with real student conversations.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "biz_test_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "title" varchar(200) NOT NULL,
  "persona" varchar(40) DEFAULT 'student' NOT NULL,
  -- Which knowledge/voice the sandbox may use: live, no-knowledge, no-style
  "mode" varchar(30) DEFAULT 'live' NOT NULL,
  "status" varchar(20) DEFAULT 'open' NOT NULL,
  "created_by" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_test_sessions_biz_idx"
  ON "biz_test_sessions" ("business_id", "created_at");

CREATE TABLE IF NOT EXISTS "biz_test_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "session_id" uuid NOT NULL,
  "business_id" uuid NOT NULL,
  "role" varchar(12) NOT NULL,
  "body" text NOT NULL,
  "meta" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_test_messages_session_idx"
  ON "biz_test_messages" ("session_id", "created_at");

-- A grading verdict on one assistant reply: accurate / wrong / incomplete.
CREATE TABLE IF NOT EXISTS "biz_test_findings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "session_id" uuid NOT NULL,
  "business_id" uuid NOT NULL,
  "message_id" uuid,
  "verdict" varchar(20) NOT NULL,
  "question" text,
  "answer" text,
  "expected" text,
  "note" text,
  "created_by" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "biz_test_findings_biz_idx"
  ON "biz_test_findings" ("business_id", "verdict", "created_at");
