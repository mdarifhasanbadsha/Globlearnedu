// ─────────────────────────────────────────────────────────────
// BUSINESS CRM — phase 2 tables (/business)
// Additive only. Existing app tables remain untouched and unread.
// ─────────────────────────────────────────────────────────────

import {
  pgTable, uuid, text, varchar, integer, boolean,
  timestamp, jsonb, numeric, index, uniqueIndex,
} from "drizzle-orm/pg-core";

// ── KNOWLEDGE ────────────────────────────────────────────────
export const bizKnowledgeSources = pgTable(
  "biz_knowledge_sources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    kind: varchar("kind", { length: 20 }).notNull().default("image"),
    fileKey: text("file_key"),
    mimeType: varchar("mime_type", { length: 100 }),
    sizeBytes: integer("size_bytes"),
    status: varchar("status", { length: 20 }).notNull().default("uploaded"),
    extractionError: text("extraction_error"),
    rawText: text("raw_text"),
    uploadedBy: uuid("uploaded_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("biz_knowledge_sources_biz_idx").on(t.businessId, t.createdAt)]
);

export const bizKnowledgeEntries = pgTable(
  "biz_knowledge_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    sourceId: uuid("source_id"),
    universityName: varchar("university_name", { length: 255 }),
    city: varchar("city", { length: 100 }),
    programName: varchar("program_name", { length: 255 }),
    level: varchar("level", { length: 50 }),
    duration: varchar("duration", { length: 50 }),
    teachingLanguage: varchar("teaching_language", { length: 50 }),
    tuitionAmount: integer("tuition_amount"),
    tuitionCurrency: varchar("tuition_currency", { length: 8 }),
    // Added by 0004 — fields that real GL Education brochures contain.
    universityNameCn: varchar("university_name_cn", { length: 255 }),
    province: varchar("province", { length: 100 }),
    universityType: varchar("university_type", { length: 50 }),
    tuitionPeriod: varchar("tuition_period", { length: 20 }),
    // Added by 0005 — brochures that bundle tuition + hostel into one figure.
    combinedFeeAmount: integer("combined_fee_amount"),
    combinedFeePeriod: varchar("combined_fee_period", { length: 20 }),
    combinedFeeIncludes: varchar("combined_fee_includes", { length: 100 }),
    feeNoteRaw: text("fee_note_raw"),
    dataCompleteness: varchar("data_completeness", { length: 20 }).notNull().default("partial"),
    hostelAmount: integer("hostel_amount"),
    hostelPeriod: varchar("hostel_period", { length: 20 }),
    applicationFee: integer("application_fee"),
    insuranceFee: integer("insurance_fee"),
    intakeText: varchar("intake_text", { length: 100 }),
    tVisaAfterOneSemester: boolean("t_visa_after_one_semester"),
    languageToDegree: varchar("language_to_degree", { length: 100 }),
    feePaymentNote: text("fee_payment_note"),
    sourcePage: integer("source_page"),
    brochureName: varchar("brochure_name", { length: 255 }),
    intakeMonths: jsonb("intake_months").default([]),
    applicationDeadline: varchar("application_deadline", { length: 60 }),
    requirements: jsonb("requirements").default({}),
    scholarships: jsonb("scholarships").default([]),
    notes: text("notes"),
    confidence: varchar("confidence", { length: 20 }).default("draft"),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    approvedBy: uuid("approved_by"),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("biz_knowledge_entries_status_idx").on(t.businessId, t.status),
    index("biz_knowledge_entries_source_idx").on(t.sourceId),
  ]
);

// ── LEADS ────────────────────────────────────────────────────
export const bizLeads = pgTable(
  "biz_leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    conversationId: uuid("conversation_id"),
    fullName: varchar("full_name", { length: 200 }),
    phone: varchar("phone", { length: 40 }),
    email: varchar("email", { length: 255 }),
    nationality: varchar("nationality", { length: 100 }),
    degreeLevel: varchar("degree_level", { length: 50 }),
    subjectInterest: varchar("subject_interest", { length: 200 }),
    gpaValue: numeric("gpa_value", { precision: 4, scale: 2 }),
    gpaScale: numeric("gpa_scale", { precision: 4, scale: 2 }),
    budgetAmount: integer("budget_amount"),
    budgetCurrency: varchar("budget_currency", { length: 8 }),
    intakeTarget: varchar("intake_target", { length: 50 }),
    languageTest: varchar("language_test", { length: 100 }),
    stage: varchar("stage", { length: 30 }).notNull().default("new"),
    stageReason: text("stage_reason"),
    assignedStaffId: uuid("assigned_staff_id"),
    consentContact: boolean("consent_contact").notNull().default(false),
    source: varchar("source", { length: 40 }).notNull().default("website_chat"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("biz_leads_biz_stage_idx").on(t.businessId, t.stage, t.createdAt),
    index("biz_leads_conv_idx").on(t.conversationId),
    index("biz_leads_phone_idx").on(t.businessId, t.phone),
  ]
);

// ── FOLLOWUPS ────────────────────────────────────────────────
export const bizFollowups = pgTable(
  "biz_followups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    leadId: uuid("lead_id"),
    conversationId: uuid("conversation_id"),
    channel: varchar("channel", { length: 20 }).notNull().default("in_app"),
    body: text("body").notNull(),
    dueAt: timestamp("due_at").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("last_error"),
    stopReason: varchar("stop_reason", { length: 50 }),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("biz_followups_due_idx").on(t.businessId, t.status, t.dueAt),
    index("biz_followups_lead_idx").on(t.leadId),
  ]
);

// ── CHANNELS ─────────────────────────────────────────────────
export const bizChannelConnections = pgTable(
  "biz_channel_connections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    channel: varchar("channel", { length: 30 }).notNull(),
    externalId: varchar("external_id", { length: 200 }),
    displayName: varchar("display_name", { length: 255 }),
    credentialsEnc: text("credentials_enc"),
    scopes: jsonb("scopes").default([]),
    status: varchar("status", { length: 20 }).notNull().default("disconnected"),
    lastCheckedAt: timestamp("last_checked_at"),
    lastError: text("last_error"),
    connectedAt: timestamp("connected_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("biz_channel_biz_channel_idx").on(t.businessId, t.channel, t.externalId),
  ]
);

export const bizOauthStates = pgTable("biz_oauth_states", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").notNull(),
  channel: varchar("channel", { length: 30 }).notNull(),
  state: varchar("state", { length: 128 }).notNull().unique(),
  codeVerifier: text("code_verifier"),
  createdBy: uuid("created_by"),
  expiresAt: timestamp("expires_at").notNull(),
  consumedAt: timestamp("consumed_at"),
});

export const bizRateLimits = pgTable(
  "biz_rate_limits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bucketKey: varchar("bucket_key", { length: 200 }).notNull(),
    windowStart: timestamp("window_start").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [uniqueIndex("biz_rate_bucket_idx").on(t.bucketKey, t.windowStart)]
);

// ── HOUSE STYLE (learned from real conversations) ────────────
export const bizStyleGuides = pgTable(
  "biz_style_guides",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    summary: text("summary"),
    tone: jsonb("tone").default([]),
    greetingPatterns: jsonb("greeting_patterns").default([]),
    pricingPhrases: jsonb("pricing_phrases").default([]),
    followupPhrases: jsonb("followup_phrases").default([]),
    avoidPhrases: jsonb("avoid_phrases").default([]),
    languageMix: text("language_mix"),
    sampleCount: integer("sample_count").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    approvedBy: uuid("approved_by"),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("biz_style_guides_biz_idx").on(t.businessId, t.status, t.updatedAt)]
);

export const bizImportRuns = pgTable(
  "biz_import_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    channel: varchar("channel", { length: 30 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("running"),
    conversationsSeen: integer("conversations_seen").notNull().default(0),
    conversationsCreated: integer("conversations_created").notNull().default(0),
    messagesImported: integer("messages_imported").notNull().default(0),
    messagesSkipped: integer("messages_skipped").notNull().default(0),
    voiceFound: integer("voice_found").notNull().default(0),
    voiceTranscribed: integer("voice_transcribed").notNull().default(0),
    error: text("error"),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    finishedAt: timestamp("finished_at"),
  },
  (t) => [index("biz_import_runs_biz_idx").on(t.businessId, t.startedAt)]
);

// ── TEST LAB (sandbox; never mixes with real conversations) ──
export const bizTestSessions = pgTable(
  "biz_test_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    persona: varchar("persona", { length: 40 }).notNull().default("student"),
    mode: varchar("mode", { length: 30 }).notNull().default("live"),
    status: varchar("status", { length: 20 }).notNull().default("open"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("biz_test_sessions_biz_idx").on(t.businessId, t.createdAt)]
);

export const bizTestMessages = pgTable(
  "biz_test_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id").notNull(),
    businessId: uuid("business_id").notNull(),
    role: varchar("role", { length: 12 }).notNull(),
    body: text("body").notNull(),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("biz_test_messages_session_idx").on(t.sessionId, t.createdAt)]
);

export const bizTestFindings = pgTable(
  "biz_test_findings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id").notNull(),
    businessId: uuid("business_id").notNull(),
    messageId: uuid("message_id"),
    verdict: varchar("verdict", { length: 20 }).notNull(),
    question: text("question"),
    answer: text("answer"),
    expected: text("expected"),
    note: text("note"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("biz_test_findings_biz_idx").on(t.businessId, t.verdict, t.createdAt)]
);
