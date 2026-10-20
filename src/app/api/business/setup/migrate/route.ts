import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireBusinessUser } from "@/lib/business/guard";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Apply the small, additive column changes this build depends on.
 *
 * Exists because a schema file may declare a column before the migration
 * has been run against the live database, which makes every insert on that
 * table fail. Idempotent: safe to call repeatedly.
 */
export async function POST() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const applied: string[] = [];
  const failed: string[] = [];

  const statements: [string, string][] = [
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
  ];

  for (const [name, stmt] of statements) {
    try {
      await db.execute(sql.raw(stmt));
      applied.push(name);
    } catch (e: any) {
      failed.push(`${name}: ${e?.message ?? "failed"}`);
    }
  }

  // Report any column the schema expects but the database lacks.
  const [{ rows }] = (await db.execute(sql`
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ('biz_conversations', 'biz_leads', 'biz_lead_notes', 'biz_lead_activity', 'biz_tasks', 'biz_outbound_sends')
    order by table_name, column_name
  `)) as any as [{ rows: any[] }];

  const tables = new Set(rows?.map((r) => r.table_name));

  return NextResponse.json({
    applied: applied.length,
    failed,
    tablesPresent: [...tables],
  });
}

/** Read-only check of which columns exist right now. */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const [{ rows }] = (await db.execute(sql`
    select column_name
    from information_schema.columns
    where table_schema = 'public' and table_name = 'biz_conversations'
    order by column_name
  `)) as any as [{ rows: any[] }];

  const cols = (rows ?? []).map((r) => r.column_name);
  const required = ["pending_quote", "pending_quote_at", "last_inbound_at", "contact_name"];
  return NextResponse.json({
    columns: cols,
    missing: required.filter((c) => !cols.includes(c)),
  });
}
