import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Column audit for biz_conversations.
 *
 * Public on purpose: it reveals only which column NAMES exist, never data, and
 * it is the fastest way to diagnose the class of failure where a column is
 * declared in the schema but missing from the database — which silently takes
 * the chat down with a 500.
 */
export async function GET() {
  try {
    const r: any = await db.execute(sql`
      select column_name from information_schema.columns
      where table_schema = 'public' and table_name = 'biz_conversations'
      order by column_name
    `);
    const rows = r?.rows ?? r ?? [];
    const present = rows.map((x: any) => x.column_name);

    const declared = [
      "id", "business_id", "visitor_id", "student_id", "subject", "status", "ai_state",
      "assigned_staff_id", "channel", "lead_id", "handoff_at", "visitor_name",
      "last_inbound_at", "contact_name", "contact_picture", "contact_locale",
      "profile_synced_at", "source_kind", "source_ref", "source_ad_id", "source_post_id",
      "source_url", "pending_quote", "pending_quote_at", "last_message_at", "created_at",
      "updated_at",
    ];

    const missing = declared.filter((c) => !present.includes(c));

    return NextResponse.json({
      totalInDatabase: present.length,
      missingFromDatabase: missing,
      ok: missing.length === 0,
      present,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "audit failed", detail: String(e?.message ?? e).slice(0, 200) },
      { status: 500 }
    );
  }
}
