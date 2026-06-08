import {
  pgTable, uuid, text, varchar, integer, boolean,
  timestamp, jsonb, numeric, pgEnum, index, primaryKey,
} from "drizzle-orm/pg-core";

// ── ENUMS ────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["student", "partner", "staff", "admin"]);
export const staffRoleEnum = pgEnum("staff_role", ["admin", "application_manager", "content_manager", "support_agent", "finance"]);
export const applicationStatusEnum = pgEnum("application_status", [
  "submitted", "under_review", "documents_approved", "applied_per_university",
  "processing", "interview", "pre_admission", "student_confirms",
  "university_deposit", "final_admission", "student_accepts",
  "service_charge_payment", "jw202_issued", "complete", "withdrawn", "cancelled",
]);
export const scholarshipTypeEnum = pgEnum("scholarship_type", ["csc", "university", "provincial", "self_sponsored"]);
export const programLevelEnum = pgEnum("program_level", ["bachelor", "master", "phd", "language", "diploma", "mba", "ai"]);
export const blogStatusEnum = pgEnum("blog_status", ["draft", "published", "scheduled", "in_review"]);
export const pageTypeEnum = pgEnum("page_type", ["general_yearly", "university_admission", "intl_student_admission", "program_yearly"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);
export const paymentTypeEnum = pgEnum("payment_type", ["deposit", "university_deposit", "service_charge"]);
export const notificationChannelEnum = pgEnum("notification_channel", ["email", "whatsapp", "in_portal"]);

// ── USERS ────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  passwordHash: varchar("password_hash", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 500 }),
  phone: varchar("phone", { length: 30 }),
  country: varchar("country", { length: 100 }),
  role: userRoleEnum("role").notNull().default("student"),
  isActive: boolean("is_active").notNull().default(true),
  referralCode: varchar("referral_code", { length: 20 }).unique(),
  referredBy: uuid("referred_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── STAFF ────────────────────────────────────────────────
export const staff = pgTable("staff", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  staffRole: staffRoleEnum("staff_role").notNull().default("support_agent"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── PARTNERS ─────────────────────────────────────────────
export const partners = pgTable("partners", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  agencyName: varchar("agency_name", { length: 255 }),
  agencyCountry: varchar("agency_country", { length: 100 }),
  agencyWebsite: varchar("agency_website", { length: 255 }),
  isApproved: boolean("is_approved").notNull().default(false),
  approvedAt: timestamp("approved_at"),
  approvedBy: uuid("approved_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── UNIVERSITIES ─────────────────────────────────────────
export const universities = pgTable("universities", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameCn: varchar("name_cn", { length: 255 }),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }),
  country: varchar("country", { length: 100 }).default("China"),
  tier985: boolean("tier_985").default(false),
  tier211: boolean("tier_211").default(false),
  qsRanking: integer("qs_ranking"),
  founded: integer("founded"),
  totalStudents: integer("total_students"),
  internationalStudents: integer("international_students"),
  website: varchar("website", { length: 255 }),
  logoUrl: varchar("logo_url", { length: 500 }),
  heroImageUrl: varchar("hero_image_url", { length: 500 }),
  galleryImages: jsonb("gallery_images").default([]),
  description: text("description"),
  isPartner: boolean("is_partner").default(false),
  isActive: boolean("is_active").default(true),
  dataConfidence: varchar("data_confidence", { length: 20 }).default("unverified"),
  cscAgencyNumber: varchar("csc_agency_number", { length: 50 }),
  metaTitle: varchar("meta_title", { length: 200 }),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── PROGRAMS ─────────────────────────────────────────────
export const programs = pgTable("programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  universityId: uuid("university_id").notNull().references(() => universities.id),
  name: varchar("name", { length: 255 }).notNull(),
  level: programLevelEnum("level").notNull(),
  duration: varchar("duration", { length: 50 }),
  teachingLanguage: varchar("teaching_language", { length: 50 }).default("English"),
  tuitionFee: numeric("tuition_fee", { precision: 10, scale: 2 }),
  applicationDeadline: varchar("application_deadline", { length: 100 }),
  intakeMonths: jsonb("intake_months").default([]),
  isActive: boolean("is_active").default(true),
  scholarshipsAvailable: jsonb("scholarships_available").default([]),
  requirements: jsonb("requirements").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── APPLICATIONS ─────────────────────────────────────────
export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationNumber: varchar("application_number", { length: 20 }).notNull().unique(),
  studentId: uuid("student_id").notNull().references(() => users.id),
  partnerId: uuid("partner_id").references(() => partners.id),
  assignedStaffId: uuid("assigned_staff_id").references(() => users.id),
  status: applicationStatusEnum("status").notNull().default("submitted"),
  scholarshipType: scholarshipTypeEnum("scholarship_type").notNull().default("csc"),
  selectedUniversities: jsonb("selected_universities").default([]),
  programLevel: programLevelEnum("program_level"),
  // Personal info
  passportSurname: varchar("passport_surname", { length: 100 }),
  passportGivenName: varchar("passport_given_name", { length: 100 }),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  gender: varchar("gender", { length: 20 }),
  nationality: varchar("nationality", { length: 100 }),
  passportNumber: varchar("passport_number", { length: 50 }),
  passportExpiry: varchar("passport_expiry", { length: 20 }),
  religion: varchar("religion", { length: 50 }),
  // Contact
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 255 }),
  addressDetailed: text("address_detailed"),
  addressCity: varchar("address_city", { length: 100 }),
  addressPostcode: varchar("address_postcode", { length: 20 }),
  addressCountry: varchar("address_country", { length: 100 }),
  // Family + academic
  parentInfo: jsonb("parent_info").default({}),
  sponsorInfo: jsonb("sponsor_info").default({}),
  academicHistory: jsonb("academic_history").default([]),
  workExperience: jsonb("work_experience").default([]),
  englishProficiency: jsonb("english_proficiency").default({}),
  chineseProficiency: jsonb("chinese_proficiency").default({}),
  // China status
  isCurrentlyInChina: boolean("is_currently_in_china").default(false),
  chinaStatus: jsonb("china_status").default({}),
  // Documents (R2 URLs stored as JSON object)
  documents: jsonb("documents").default({}),
  // Admin
  internalNotes: jsonb("internal_notes").default([]),
  isUrgent: boolean("is_urgent").default(false),
  depositPaid: boolean("deposit_paid").default(false),
  depositPaidAt: timestamp("deposit_paid_at"),
  serviceChargePaid: boolean("service_charge_paid").default(false),
  serviceChargePaidAt: timestamp("service_charge_paid_at"),
  notifyPartnerEmail: boolean("notify_partner_email").default(true),
  notifyPartnerWhatsapp: boolean("notify_partner_whatsapp").default(false),
  withdrawnAt: timestamp("withdrawn_at"),
  withdrawnReason: text("withdrawn_reason"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  studentIdx: index("app_student_idx").on(t.studentId),
  partnerIdx: index("app_partner_idx").on(t.partnerId),
  statusIdx: index("app_status_idx").on(t.status),
}));

// ── APPLICATION UNIVERSITIES ──────────────────────────────
export const applicationUniversities = pgTable("application_universities", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").notNull().references(() => applications.id),
  universityId: uuid("university_id").notNull().references(() => universities.id),
  programName: varchar("program_name", { length: 255 }),
  status: applicationStatusEnum("status").notNull().default("submitted"),
  admissionNoticeUrl: varchar("admission_notice_url", { length: 500 }),
  jw202Url: varchar("jw202_url", { length: 500 }),
  interviewDetails: jsonb("interview_details").default({}),
  order: integer("order").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── NOTIFICATIONS ────────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  applicationId: uuid("application_id").references(() => applications.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  channel: notificationChannelEnum("channel").notNull(),
  isRead: boolean("is_read").default(false),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── PAYMENTS ─────────────────────────────────────────────
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").notNull().references(() => applications.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: paymentTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("CNY"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  manualSlipUrl: varchar("manual_slip_url", { length: 500 }),
  invoiceUrl: varchar("invoice_url", { length: 500 }),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── REFERRALS ────────────────────────────────────────────
export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  referrerId: uuid("referrer_id").notNull().references(() => users.id),
  referredUserId: uuid("referred_user_id").references(() => users.id),
  referralCode: varchar("referral_code", { length: 20 }).notNull(),
  commissionAmount: numeric("commission_amount", { precision: 10, scale: 2 }),
  commissionPaid: boolean("commission_paid").default(false),
  commissionPaidAt: timestamp("commission_paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── BLOG POSTS ───────────────────────────────────────────
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  featuredImageUrl: varchar("featured_image_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").default([]),
  authorName: varchar("author_name", { length: 100 }).default("GloblearnEdu Team"),
  status: blogStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  viewCount: integer("view_count").default(0),
  readingTimeMinutes: integer("reading_time_minutes"),
  metaTitle: varchar("meta_title", { length: 200 }),
  metaDescription: text("meta_description"),
  focusKeyword: varchar("focus_keyword", { length: 100 }),
  relatedUniversities: jsonb("related_universities").default([]),
  relatedPrograms: jsonb("related_programs").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── BLOG COMMENTS ────────────────────────────────────────
export const blogComments = pgTable("blog_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull().references(() => blogPosts.id),
  parentId: uuid("parent_id"),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }),
  authorCountry: varchar("author_country", { length: 100 }),
  content: text("content").notNull(),
  isOfficial: boolean("is_official").default(false),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── ADMISSION YEAR PAGES ─────────────────────────────────
export const admissionYearPages = pgTable("admission_year_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  year: integer("year").notNull(),
  pageType: pageTypeEnum("page_type").notNull(),
  universityId: uuid("university_id").references(() => universities.id),
  programType: varchar("program_type", { length: 100 }),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  disclaimerActive: boolean("disclaimer_active").default(true),
  feesVerified: boolean("fees_verified").default(false),
  feesVerifiedAt: timestamp("fees_verified_at"),
  datesVerified: boolean("dates_verified").default(false),
  datesVerifiedAt: timestamp("dates_verified_at"),
  programsVerified: boolean("programs_verified").default(false),
  programsVerifiedAt: timestamp("programs_verified_at"),
  verifiedBy: uuid("verified_by").references(() => users.id),
  pageData: jsonb("page_data").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── EMAIL TEMPLATES ──────────────────────────────────────
export const emailTemplates = pgTable("email_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  bodyHtml: text("body_html").notNull(),
  bodyText: text("body_text"),
  category: varchar("category", { length: 100 }),
  triggerEvent: varchar("trigger_event", { length: 100 }),
  isAutoTrigger: boolean("is_auto_trigger").default(false),
  isActive: boolean("is_active").default(true),
  sendToStudent: boolean("send_to_student").default(true),
  sendToPartner: boolean("send_to_partner").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── ACTIVITY LOG ─────────────────────────────────────────
export const activityLog = pgTable("activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  applicationId: uuid("application_id").references(() => applications.id),
  action: varchar("action", { length: 255 }).notNull(),
  details: jsonb("details").default({}),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── SETTINGS ─────────────────────────────────────────────
export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  label: varchar("label", { length: 255 }),
  description: text("description"),
  category: varchar("category", { length: 50 }).default("general"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: uuid("updated_by").references(() => users.id),
});

// ── NEXTAUTH REQUIRED TABLES ──────────────────────────────
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })]
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).notNull().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);
