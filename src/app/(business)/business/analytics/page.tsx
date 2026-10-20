import { db } from "@/lib/db";
import { bizLeads } from "@/lib/db/schema.business2";
import { bizConversations, bizMessages, bizAiRuns } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { eq, sql, and, gte } from "drizzle-orm";
import { PageHeader, StatCard, Card, Pill } from "../_ui";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  language_program: "Language program",
  degree_program: "Degree program",
  mbbs: "MBBS / Medicine",
  scholarship: "Scholarship",
  visa_and_application: "Visa + application",
  contact_shared: "Contact shared",
  general_enquiry: "General enquiry",
  no_real_intent: "No real intent",
  no_student_message: "No student message",
};

function Bar({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-40 shrink-0 text-xs text-slate-600 truncate">{label}</div>
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
      <div className="w-16 text-right text-xs tabular-nums text-slate-700">
        {value} <span className="text-slate-400">({pct}%)</span>
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const businessId = getBusinessId();
  const since30 = new Date(Date.now() - 30 * 86_400_000);

  const [conv] = await db
    .select({
      total: sql<number>`count(*)::int`,
      messenger: sql<number>`count(*) filter (where ${bizConversations.channel}='messenger')::int`,
      website: sql<number>`count(*) filter (where ${bizConversations.channel}='website')::int`,
      handoff: sql<number>`count(*) filter (where ${bizConversations.aiState}='handoff_requested')::int`,
    })
    .from(bizConversations)
    .where(eq(bizConversations.businessId, businessId));

  const [leads] = await db
    .select({
      total: sql<number>`count(*)::int`,
      hot: sql<number>`count(*) filter (where ${bizLeads.priority}='hot')::int`,
      warm: sql<number>`count(*) filter (where ${bizLeads.priority}='warm')::int`,
      cold: sql<number>`count(*) filter (where ${bizLeads.priority}='cold')::int`,
      ignore: sql<number>`count(*) filter (where ${bizLeads.priority}='ignore')::int`,
      contact: sql<number>`count(*) filter (where ${bizLeads.hasContact})::int`,
      converted: sql<number>`count(*) filter (where ${bizLeads.stage} in ('counseling_booked','counseling_completed','considering'))::int`,
    })
    .from(bizLeads)
    .where(eq(bizLeads.businessId, businessId));

  const byCategory = await db
    .select({ category: bizLeads.category, n: sql<number>`count(*)::int` })
    .from(bizLeads)
    .where(eq(bizLeads.businessId, businessId))
    .groupBy(bizLeads.category)
    .orderBy(sql`count(*) desc`);

  const [ai] = await db
    .select({
      runs: sql<number>`count(*)::int`,
      errors: sql<number>`count(*) filter (where ${bizAiRuns.status} <> 'ok')::int`,
      tokens: sql<number>`coalesce(sum(${bizAiRuns.promptTokens} + ${bizAiRuns.completionTokens}),0)::int`,
    })
    .from(bizAiRuns)
    .where(eq(bizAiRuns.businessId, businessId));

  const [msg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      inbound: sql<number>`count(*) filter (where ${bizMessages.direction}='in')::int`,
      last30: sql<number>`count(*) filter (where ${bizMessages.createdAt} >= ${since30})::int`,
    })
    .from(bizMessages)
    .where(eq(bizMessages.businessId, businessId));

  const totalLeads = leads?.total ?? 0;
  const actionable = (leads?.hot ?? 0) + (leads?.warm ?? 0) + (leads?.cold ?? 0);

  const answerRate =
    conv && conv.total > 0
      ? Math.round(((conv.total - (conv.handoff ?? 0)) / conv.total) * 100)
      : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Statistics"
        subtitle="How the workflow is actually performing across every channel."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total leads" value={totalLeads} />
        <StatCard label="Actionable" value={actionable} hint="hot + warm + cold" tone="good" />
        <StatCard label="Ignored" value={leads?.ignore ?? 0} hint="low value or no intent" />
        <StatCard label="Contact shared" value={leads?.contact ?? 0} hint="now in WhatsApp/call" tone="info" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Lead priority mix">
          <Bar label="Hot — call today" value={leads?.hot ?? 0} total={totalLeads} tone="bg-[#C8102E]" />
          <Bar label="Warm — follow up" value={leads?.warm ?? 0} total={totalLeads} tone="bg-amber-500" />
          <Bar label="Cold — nurture" value={leads?.cold ?? 0} total={totalLeads} tone="bg-sky-500" />
          <Bar label="Ignore" value={leads?.ignore ?? 0} total={totalLeads} tone="bg-slate-400" />
          <p className="text-xs text-slate-500 mt-3">
            {leads?.converted ?? 0} lead(s) have reached a counseling stage.
          </p>
        </Card>

        <Card title="Interest breakdown">
          {byCategory.length === 0 ? (
            <p className="text-sm text-slate-500">No leads yet.</p>
          ) : (
            byCategory.map((c) => (
              <Bar
                key={c.category}
                label={CATEGORY_LABEL[c.category] ?? c.category}
                value={c.n}
                total={totalLeads}
                tone="bg-[#0F2A52]"
              />
            ))
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Channels">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-slate-600">Messenger threads</span>
              <span className="tabular-nums font-semibold">{conv?.messenger ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Website chat threads</span>
              <span className="tabular-nums font-semibold">{conv?.website ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Escalated to a human</span>
              <span className="tabular-nums font-semibold">{conv?.handoff ?? 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-slate-600">Handled without escalation</span>
              <Pill tone={answerRate >= 80 ? "good" : "warn"}>{answerRate}%</Pill>
            </li>
          </ul>
        </Card>

        <Card title="AI usage">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-slate-600">Total calls</span>
              <span className="tabular-nums font-semibold">{ai?.runs ?? 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Tokens used</span>
              <span className="tabular-nums font-semibold">{(ai?.tokens ?? 0).toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-slate-600">Failures</span>
              <Pill tone={(ai?.errors ?? 0) === 0 ? "good" : "warn"}>{ai?.errors ?? 0}</Pill>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Messages stored</span>
              <span className="tabular-nums font-semibold">{(msg?.total ?? 0).toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600">Last 30 days</span>
              <span className="tabular-nums font-semibold">{msg?.last30 ?? 0}</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
