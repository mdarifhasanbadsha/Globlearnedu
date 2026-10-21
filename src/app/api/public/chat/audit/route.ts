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


      // Proof that the policy layer is actually wired in production.
      //
      // The rules existed for a week without being executed, so this endpoint
      // reports what enforcement does with deliberately bad input. If
      // enforcementOk is false, the deployed code is stale.
      let enforcement: any = null;
      try {
        const { enforceReply } = await import("@/lib/business/enforce");
        const cases = [
          "আমাদের ডেটাবেসে Diploma-র এন্ট্রি নেই।",
          "We do not have any universities for that.",
          "আমাদের কাছে কোনো অপশন নেই।",
          "CST-তে Bachelor — ঠিক আছে। আপনার HSC রেজাল্ট কত?",
        ];
        const rows = cases.map((input) => {
          const e = enforceReply(input);
          return { input, replaced: e.replaced, output: e.reply.slice(0, 120) };
        });
        enforcement = {
          ok: rows[0].replaced && rows[1].replaced && rows[2].replaced && !rows[3].replaced,
          rows,
        };
      } catch (e: any) {
        enforcement = { ok: false, error: String(e?.message ?? e).slice(0, 160) };
      }

    return NextResponse.json({
      enforcement,
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
