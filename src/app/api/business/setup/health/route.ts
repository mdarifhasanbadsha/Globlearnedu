import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Full-system health check.
 *
 * One read-only call that answers "is everything actually working": tables
 * present, columns present, data populated, and the AI reachable. Built
 * because a missing column once broke replies silently and nobody could see
 * it from the UI.
 */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  const rowsOf = async (q: ReturnType<typeof sql>): Promise<any[]> => {
    try {
      const r: any = await db.execute(q);
      if (Array.isArray(r)) return r;
      return r?.rows ?? [];
    } catch {
      return [];
    }
  };

  // 1. Tables the app needs.
  const expectedTables = [
    "biz_conversations",
    "biz_messages",
    "biz_leads",
    "biz_knowledge_entries",
    "biz_knowledge_sources",
    "biz_style_guides",
    "biz_followups",
    "biz_ai_runs",
    "biz_channel_connections",
    "biz_lead_notes",
    "biz_lead_activity",
    "biz_tasks",
    "biz_outbound_sends",
  ];
  const tableRows = await rowsOf(sql`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_name like 'biz%'
  `);
  const present = new Set(tableRows.map((r) => r.table_name));
  const missingTables = expectedTables.filter((t) => !present.has(t));

  // 2. Columns the latest code expects.
  const colRows = await rowsOf(sql`
    select table_name, column_name from information_schema.columns
    where table_schema = 'public' and table_name = 'biz_conversations'
  `);
  const convCols = new Set(colRows.map((r) => r.column_name));
  const requiredConvCols = [
    "last_inbound_at",
    "contact_name",
    "contact_picture",
    "source_kind",
    "pending_quote",
    "resting_until",
    "strike_count",
  ];
  const missingColumns = requiredConvCols.filter((c) => !convCols.has(c));

  // 3. Data actually present.
  const counts = await rowsOf(sql`
    select
      (select count(*)::int from biz_conversations where business_id = ${businessId}) as conversations,
      (select count(*)::int from biz_messages where business_id = ${businessId}) as messages,
      (select count(*)::int from biz_leads where business_id = ${businessId}) as leads,
      (select count(*)::int from biz_knowledge_entries where business_id = ${businessId} and status = 'approved') as knowledge_approved,
      (select count(*)::int from biz_knowledge_entries where business_id = ${businessId} and status = 'draft') as knowledge_draft,
      (select count(distinct university_name)::int from biz_knowledge_entries where business_id = ${businessId} and status = 'approved' and university_name is not null) as knowledge_universities,
      (select count(*)::int from biz_followups where business_id = ${businessId}) as followups,
      (select count(*)::int from biz_lead_activity where business_id = ${businessId}) as activity,
      (select count(*)::int from biz_outbound_sends where business_id = ${businessId}) as outbound_sends,
      (select count(*)::int from biz_conversations where business_id = ${businessId} and resting_until > now()) as resting_now
  `).catch(async () => await rowsOf(sql`select 0 as conversations`));
  const c = counts[0] ?? {};

  // 4. Recent failures.
  const failedSends = await rowsOf(sql`
    select status, count(*)::int as n from biz_outbound_sends
    where business_id = ${businessId} group by status
  `);

  const aiRuns = await rowsOf(sql`
    select count(*)::int as n from biz_ai_runs where business_id = ${businessId}
  `);

  return NextResponse.json({
    ok: missingTables.length === 0 && missingColumns.length === 0,
    schema: { missingTables, missingColumns },
    data: {
      conversations: Number(c.conversations ?? 0),
      messages: Number(c.messages ?? 0),
      leads: Number(c.leads ?? 0),
      knowledgeApproved: Number(c.knowledge_approved ?? 0),
      knowledgeDraft: Number(c.knowledge_draft ?? 0),
      knowledgeUniversities: Number(c.knowledge_universities ?? 0),
      followups: Number(c.followups ?? 0),
      activity: Number(c.activity ?? 0),
      outboundSends: Number(c.outbound_sends ?? 0),
      restingNow: Number(c.resting_now ?? 0),
      aiRuns: Number(aiRuns[0]?.n ?? 0),
    },
    outbound: Object.fromEntries(failedSends.map((r) => [r.status, r.n])),
  });
}
