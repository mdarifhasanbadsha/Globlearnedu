-- ─────────────────────────────────────────────────────────────
-- 0010_outbound_sends.sql
-- Every attempt to send a message to an external channel is recorded,
-- because a send can fail, be rate limited, or land outside the
-- platform's messaging window and must stay visible.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "biz_outbound_sends" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "business_id" uuid NOT NULL,
  "conversation_id" uuid,
  "message_id" uuid,
  "channel" varchar(30) NOT NULL,
  "recipient_id" varchar(200) NOT NULL,
  "body" text NOT NULL,
  "status" varchar(20) DEFAULT 'pending' NOT NULL,
  "provider_id" varchar(200),
  "error_code" varchar(50),
  "error_message" text,
  -- Anything the platform refused to deliver yet, e.g. window closed.
  "deferred_reason" varchar(80),
  "attempts" integer DEFAULT 0 NOT NULL,
  "sent_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "biz_outbound_conv_idx"
  ON "biz_outbound_sends" ("conversation_id", "created_at");
CREATE INDEX IF NOT EXISTS "biz_outbound_status_idx"
  ON "biz_outbound_sends" ("business_id", "status", "created_at");

-- Track when the student last wrote, so the 24-hour window can be checked
-- without scanning the message table on every send.
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "last_inbound_at" timestamp;
