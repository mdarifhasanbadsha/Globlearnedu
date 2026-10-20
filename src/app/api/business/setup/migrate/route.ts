import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireBusinessUser } from "@/lib/business/guard";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * The columns this build depends on. Additive and idempotent: running this
 * twice changes nothing.
 */
const CHANGES: [string, string][] = [
  ["biz_conversations.pending_quote", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "pending_quote" text`],
  ["biz_conversations.pending_quote_at", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "pending_quote_at" timestamp`],
  ["biz_conversations.last_inbound_at", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "last_inbound_at" timestamp`],
  ["biz_conversations.contact_name", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_name" varchar(200)`],
  ["biz_conversations.contact_picture", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_picture" text`],
  ["biz_conversations.contact_locale", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "contact_locale" varchar(20)`],
  ["biz_conversations.profile_synced_at", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "profile_synced_at" timestamp`],
  ["biz_conversations.source_kind", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_kind" varchar(30)`],
  ["biz_conversations.source_ref", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_ref" varchar(200)`],
  ["biz_conversations.source_ad_id", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_ad_id" varchar(100)`],
  ["biz_conversations.source_post_id", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_post_id" varchar(100)`],
  ["biz_conversations.source_url", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "source_url" text`],
  ["biz_leads.alerted_at", `ALTER TABLE "biz_leads" ADD COLUMN IF NOT EXISTS "alerted_at" timestamp`],
  ["biz_conversations.resting_until", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "resting_until" timestamp`],
  ["biz_conversations.strike_count", `ALTER TABLE "biz_conversations" ADD COLUMN IF NOT EXISTS "strike_count" integer DEFAULT 0 NOT NULL`],
  ["biz_lead_notes", `CREATE TABLE IF NOT EXISTS "biz_lead_notes" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL, "lead_id" uuid NOT NULL, "body" text NOT NULL,
      "kind" varchar(20) DEFAULT 'note' NOT NULL, "outcome" varchar(40),
      "author_id" uuid, "created_at" timestamp DEFAULT now() NOT NULL)`],
  ["biz_lead_activity", `CREATE TABLE IF NOT EXISTS "biz_lead_activity" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL, "lead_id" uuid NOT NULL,
      "kind" varchar(40) NOT NULL, "summary" varchar(300) NOT NULL,
      "detail" jsonb, "actor_id" uuid,
      "actor_kind" varchar(20) DEFAULT 'system' NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL)`],
  ["biz_tasks", `CREATE TABLE IF NOT EXISTS "biz_tasks" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL, "lead_id" uuid, "title" varchar(300) NOT NULL,
      "notes" text, "due_at" timestamp, "status" varchar(20) DEFAULT 'open' NOT NULL,
      "assigned_to" uuid, "priority" varchar(20) DEFAULT 'normal' NOT NULL,
      "created_by" uuid, "completed_at" timestamp,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL)`],
  ["biz_outbound_sends", `CREATE TABLE IF NOT EXISTS "biz_outbound_sends" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL, "conversation_id" uuid, "message_id" uuid,
      "channel" varchar(30) NOT NULL, "recipient_id" varchar(200) NOT NULL,
      "body" text NOT NULL, "status" varchar(20) DEFAULT 'pending' NOT NULL,
      "provider_id" varchar(200), "error_code" varchar(50), "error_message" text,
      "deferred_reason" varchar(80), "attempts" integer DEFAULT 0 NOT NULL,
      "sent_at" timestamp, "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL)`],
];

const REQUIRED = ["pending_quote", "pending_quote_at", "last_inbound_at", "contact_name"];

/**
 * drizzle's db.execute returns different shapes across drivers, so read the
 * rows defensively rather than assuming `.rows`.
 */
async function rowsOf(query: ReturnType<typeof sql>): Promise<any[]> {
  const result: any = await db.execute(query);
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.rows)) return result.rows;
  return [];
}

async function columnsOn(table: string): Promise<string[]> {
  const rows = await rowsOf(sql`
    select column_name from information_schema.columns
    where table_schema = 'public' and table_name = ${table}
  `);
  return rows.map((r) => r.column_name).filter(Boolean);
}

async function snapshot() {
  const cols = await columnsOn("biz_conversations");
  return {
    missing: REQUIRED.filter((c) => !cols.includes(c)),
    columns: cols.sort(),
  };
}

/** Read-only: what is missing right now? */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  try {
    return NextResponse.json(await snapshot());
  } catch (e: any) {
    return NextResponse.json(
      { missing: [], columns: [], error: String(e?.message ?? e).slice(0, 300) },
      { status: 200 }
    );
  }
}

/** Apply. Idempotent, and reports each statement honestly. */
export async function POST() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const applied: string[] = [];
  const failed: string[] = [];

  for (const [name, stmt] of CHANGES) {
    try {
      await db.execute(sql.raw(stmt));
      applied.push(name);
    } catch (e: any) {
      failed.push(`${name}: ${String(e?.message ?? e).slice(0, 160)}`);
    }
  }

  let after: { missing: string[]; columns: string[] } = { missing: [], columns: [] };
  try {
    after = await snapshot();
  } catch {
    /* the write results already tell the story */
  }

  return NextResponse.json({
    applied: applied.length,
    appliedNames: applied,
    failed,
    missingAfter: after.missing,
  });
}
