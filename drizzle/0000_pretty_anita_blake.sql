CREATE TYPE "public"."application_status" AS ENUM('submitted', 'under_review', 'documents_approved', 'applied_per_university', 'processing', 'interview', 'pre_admission', 'student_confirms', 'university_deposit', 'final_admission', 'student_accepts', 'service_charge_payment', 'jw202_issued', 'complete', 'withdrawn', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published', 'scheduled', 'in_review');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('email', 'whatsapp', 'in_portal');--> statement-breakpoint
CREATE TYPE "public"."page_type" AS ENUM('general_yearly', 'university_admission', 'intl_student_admission', 'program_yearly');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('deposit', 'university_deposit', 'service_charge');--> statement-breakpoint
CREATE TYPE "public"."program_level" AS ENUM('bachelor', 'master', 'phd', 'language', 'diploma', 'foundation', 'short_course', 'mbbs');--> statement-breakpoint
CREATE TYPE "public"."scholarship_type" AS ENUM('csc', 'university', 'provincial', 'self_sponsored');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('admin', 'application_manager', 'content_manager', 'support_agent', 'finance');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'partner', 'staff', 'admin');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"application_id" uuid,
	"action" varchar(255) NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb,
	"ip_address" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admission_year_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(500) NOT NULL,
	"year" integer NOT NULL,
	"page_type" "page_type" NOT NULL,
	"university_id" uuid,
	"program_type" varchar(100),
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"disclaimer_active" boolean DEFAULT true,
	"fees_verified" boolean DEFAULT false,
	"fees_verified_at" timestamp,
	"dates_verified" boolean DEFAULT false,
	"dates_verified_at" timestamp,
	"programs_verified" boolean DEFAULT false,
	"programs_verified_at" timestamp,
	"verified_by" uuid,
	"page_data" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admission_year_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "application_universities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"university_id" uuid,
	"university_name" varchar(255),
	"program_name" varchar(255),
	"expected_major" varchar(255),
	"intake" varchar(50),
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"target_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"admission_notice_url" varchar(500),
	"jw202_url" varchar(500),
	"interview_details" jsonb DEFAULT '{}'::jsonb,
	"priority" integer DEFAULT 1,
	"order" integer DEFAULT 1,
	"added_by_staff_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_number" varchar(20) NOT NULL,
	"student_id" uuid NOT NULL,
	"partner_id" uuid,
	"assigned_staff_id" uuid,
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"scholarship_type" "scholarship_type" DEFAULT 'csc' NOT NULL,
	"selected_universities" jsonb DEFAULT '[]'::jsonb,
	"program_level" "program_level",
	"passport_surname" varchar(100),
	"passport_given_name" varchar(100),
	"date_of_birth" varchar(20),
	"gender" varchar(20),
	"nationality" varchar(100),
	"passport_number" varchar(50),
	"passport_expiry" varchar(20),
	"religion" varchar(50),
	"phone" varchar(30),
	"email" varchar(255),
	"address_detailed" text,
	"address_city" varchar(100),
	"address_postcode" varchar(20),
	"address_country" varchar(100),
	"parent_info" jsonb DEFAULT '{}'::jsonb,
	"sponsor_info" jsonb DEFAULT '{}'::jsonb,
	"academic_history" jsonb DEFAULT '[]'::jsonb,
	"work_experience" jsonb DEFAULT '[]'::jsonb,
	"english_proficiency" jsonb DEFAULT '{}'::jsonb,
	"chinese_proficiency" jsonb DEFAULT '{}'::jsonb,
	"is_currently_in_china" boolean DEFAULT false,
	"china_status" jsonb DEFAULT '{}'::jsonb,
	"documents" jsonb DEFAULT '{}'::jsonb,
	"internal_notes" jsonb DEFAULT '[]'::jsonb,
	"is_urgent" boolean DEFAULT false,
	"deposit_paid" boolean DEFAULT false,
	"deposit_paid_at" timestamp,
	"service_charge_paid" boolean DEFAULT false,
	"service_charge_paid_at" timestamp,
	"notify_partner_email" boolean DEFAULT true,
	"notify_partner_whatsapp" boolean DEFAULT false,
	"withdrawn_at" timestamp,
	"withdrawn_reason" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "applications_application_number_unique" UNIQUE("application_number")
);
--> statement-breakpoint
CREATE TABLE "blog_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"parent_id" uuid,
	"author_name" varchar(100) NOT NULL,
	"author_email" varchar(255),
	"author_country" varchar(100),
	"content" text NOT NULL,
	"is_official" boolean DEFAULT false,
	"is_approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"content" text,
	"featured_image_url" varchar(500),
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"author_name" varchar(100) DEFAULT 'GloblearnEdu Team',
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"scheduled_at" timestamp,
	"view_count" integer DEFAULT 0,
	"reading_time_minutes" integer,
	"meta_title" varchar(200),
	"meta_description" text,
	"focus_keyword" varchar(100),
	"related_universities" jsonb DEFAULT '[]'::jsonb,
	"related_programs" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"body_html" text NOT NULL,
	"body_text" text,
	"category" varchar(100),
	"trigger_event" varchar(100),
	"is_auto_trigger" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"send_to_student" boolean DEFAULT true,
	"send_to_partner" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"application_id" uuid,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"is_read" boolean DEFAULT false,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"agency_name" varchar(255),
	"agency_country" varchar(100),
	"agency_website" varchar(255),
	"is_approved" boolean DEFAULT false NOT NULL,
	"approved_at" timestamp,
	"approved_by" uuid,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "payment_type" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'CNY',
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"stripe_payment_intent_id" varchar(255),
	"manual_slip_url" varchar(500),
	"invoice_url" varchar(500),
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"university_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"level" "program_level" NOT NULL,
	"duration" varchar(50),
	"teaching_language" varchar(50) DEFAULT 'English',
	"tuition_fee" numeric(10, 2),
	"application_deadline" varchar(100),
	"intake_months" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"scholarships_available" jsonb DEFAULT '[]'::jsonb,
	"requirements" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_id" uuid NOT NULL,
	"referred_user_id" uuid,
	"referral_code" varchar(20) NOT NULL,
	"commission_amount" numeric(10, 2),
	"commission_paid" boolean DEFAULT false,
	"commission_paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text,
	"label" varchar(255),
	"description" text,
	"category" varchar(50) DEFAULT 'general',
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"staff_role" "staff_role" DEFAULT 'support_agent' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"name_cn" varchar(255),
	"city" varchar(100),
	"province" varchar(100),
	"country" varchar(100) DEFAULT 'China',
	"tier_985" boolean DEFAULT false,
	"tier_211" boolean DEFAULT false,
	"qs_ranking" integer,
	"founded" integer,
	"total_students" integer,
	"international_students" integer,
	"website" varchar(255),
	"logo_url" varchar(500),
	"hero_image_url" varchar(500),
	"gallery_images" jsonb DEFAULT '[]'::jsonb,
	"description" text,
	"is_partner" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"data_confidence" varchar(20) DEFAULT 'unverified',
	"csc_agency_number" varchar(50),
	"meta_title" varchar(200),
	"meta_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "universities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"password_hash" varchar(255),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"name" varchar(255),
	"image" varchar(500),
	"phone" varchar(30),
	"country" varchar(100),
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"referral_code" varchar(20),
	"referred_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_year_pages" ADD CONSTRAINT "admission_year_pages_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_year_pages" ADD CONSTRAINT "admission_year_pages_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_universities" ADD CONSTRAINT "application_universities_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_universities" ADD CONSTRAINT "application_universities_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_universities" ADD CONSTRAINT "application_universities_added_by_staff_id_users_id_fk" FOREIGN KEY ("added_by_staff_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_assigned_staff_id_users_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "app_student_idx" ON "applications" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "app_partner_idx" ON "applications" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "app_status_idx" ON "applications" USING btree ("status");