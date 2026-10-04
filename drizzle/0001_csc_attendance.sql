CREATE TABLE IF NOT EXISTS "csc_attendance_students" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(120) NOT NULL,
  "phone" varchar(30) NOT NULL UNIQUE,
  "phone_last4" varchar(4) NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csc_attendance_student_name_idx" ON "csc_attendance_students" ("name");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "csc_attendance_records" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "student_id" uuid NOT NULL REFERENCES "csc_attendance_students"("id") ON DELETE CASCADE,
  "attendance_at" timestamp DEFAULT now() NOT NULL,
  "attendance_day" varchar(10) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "csc_attendance_student_day_uq" ON "csc_attendance_records" ("student_id","attendance_day");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csc_attendance_at_idx" ON "csc_attendance_records" ("attendance_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "csc_attendance_student_idx" ON "csc_attendance_records" ("student_id");
