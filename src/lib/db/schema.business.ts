// ─────────────────────────────────────────────────────────────
// BUSINESS CRM SCHEMA (/business)
// Additive only — no existing tables are altered by this file.
// Every table is prefixed biz_ and carries business_id for a
// future multi-business boundary.
// ─────────────────────────────────────────────────────────────

import {
  pgTable, uuid, text, varchar, integer, boolean,
  timestamp, jsonb, index, uniqueIndex,
} from "drizzle-orm/pg-core";

// ── CONVERSATIONS ────────────────────────────────────────────
export const bizConversations = pgTable(
  "biz_conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    // Website chat supports guest sessions; studentId links after verification.
    visitorId: varchar("visitor_id", { length: 64 }).notNull(),
    studentId: uuid("student_id"),
    subject: varchar("subject", { length: 255 }),
    status: varchar("status", { length: 20 }).notNull().default("open"),
    // AI ownership is independent of conversation status (spec F17).
    aiState: varchar("ai_state", { length: 20 }).notNull().default("active"),
    assignedStaffId: uuid("assigned_staff_id"),
    // Added by 0003 — channel origin and handoff tracking.
    channel: varchar("channel", { length: 30 }).notNull().default("website"),
    leadId: uuid("lead_id"),
    handoffAt: timestamp("handoff_at"),
    visitorName: varchar("visitor_name", { length: 200 }),
    // Added by 0010 — drives Meta's 24-hour messaging window.
    lastInboundAt: timestamp("last_inbound_at"),
    contactName: varchar("contact_name", { length: 200 }),
    contactPicture: text("contact_picture"),
    contactLocale: varchar("contact_locale", { length: 20 }),
    profileSyncedAt: timestamp("profile_synced_at"),
    sourceKind: varchar("source_kind", { length: 30 }),
    sourceRef: varchar("source_ref", { length: 200 }),
    sourceAdId: varchar("source_ad_id", { length: 100 }),
    sourcePostId: varchar("source_post_id", { length: 100 }),
    sourceUrl: text("source_url"),
    // Added by 0013 — quoted-message context for the batched reply.
    pendingQuote: text("pending_quote"),
    pendingQuoteAt: timestamp("pending_quote_at"),
    // Added by 0014 - cool-off after a conversation stops being productive.
    restingUntil: timestamp("resting_until"),
    strikeCount: integer("strike_count").notNull().default(0),
    lastMessageAt: timestamp("last_message_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("biz_conv_business_idx").on(t.businessId, t.lastMessageAt),
    index("biz_conv_visitor_idx").on(t.visitorId),
    index("biz_conv_status_idx").on(t.businessId, t.status),
  ]
);

export const bizMessages = pgTable(
  "biz_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    conversationId: uuid("conversation_id").notNull(),
    direction: varchar("direction", { length: 10 }).notNull(),
    // Author is explicit: ai | staff | student | system (spec F02).
    authorKind: varchar("author_kind", { length: 12 }).notNull(),
    authorId: uuid("author_id"),
    body: text("body").notNull(),
    meta: jsonb("meta"),
    // Added by 0006 — imported media, transcripts and provider ids.
    mediaUrl: text("media_url"),
    mediaKind: varchar("media_kind", { length: 20 }),
    transcript: text("transcript"),
    externalId: varchar("external_id", { length: 200 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("biz_msg_conv_idx").on(t.conversationId, t.createdAt),
    index("biz_msg_business_idx").on(t.businessId, t.createdAt),
  ]
);

// ── AI USAGE LEDGER ──────────────────────────────────────────
export const bizAiRuns = pgTable(
  "biz_ai_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    conversationId: uuid("conversation_id"),
    model: varchar("model", { length: 60 }).notNull(),
    promptTokens: integer("prompt_tokens").notNull().default(0),
    completionTokens: integer("completion_tokens").notNull().default(0),
    // Money in integer minor units with explicit currency (spec §5).
    costMicros: integer("cost_micros").notNull().default(0),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    status: varchar("status", { length: 20 }).notNull().default("ok"),
    errorMessage: text("error_message"),
    latencyMs: integer("latency_ms"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("biz_ai_business_idx").on(t.businessId, t.createdAt),
    index("biz_ai_conv_idx").on(t.conversationId),
  ]
);

// ── BUSINESS SETTINGS ────────────────────────────────────────
export const bizSettings = pgTable(
  "biz_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    key: varchar("key", { length: 100 }).notNull(),
    value: text("value"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("biz_settings_business_key_idx").on(t.businessId, t.key)]
);
