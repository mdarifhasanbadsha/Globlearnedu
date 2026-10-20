-- ─────────────────────────────────────────────────────────────
-- 0012_contact_identity.sql
-- The inbox showed "Messenger t_647061" instead of a person. Meta
-- already provides the real name, photo and locale, plus ad referral
-- data on the live webhook event. Capture it.
-- Additive only.
-- ─────────────────────────────────────────────────────────────

-- Full identity for a conversation participant.
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_name" varchar(200);
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_picture" text;
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_locale" varchar(20);
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "profile_synced_at" timestamp;

-- Where the conversation came from: ad, post, ref link, or organic.
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_kind" varchar(30);
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_ref" varchar(200);
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_ad_id" varchar(100);
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_post_id" varchar(100);
ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_url" text;

CREATE INDEX IF NOT EXISTS "biz_conv_source_idx"
  ON "biz_conversations" ("business_id", "source_kind");
