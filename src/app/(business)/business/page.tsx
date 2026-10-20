import Link from "next/link";
import { db } from "@/lib/db";
import { bizConversations, bizMessages, bizAiRuns } from "@/lib/db/schema.business";
import { bizLeads, bizKnowledgeEntries, bizStyleGuides, bizFollowups } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { isDeepSeekConfigured } from "@/lib/business/deepseek";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import { PageHeader, StatCard, Card, Pill, Alert, EmptyState } from "./_ui";

export const dynamic = "force-dynamic";

export default async function BusinessDashboard() {
  const businessId = getBusinessId();
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [convStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      open: sql<number>`count(*) filter (where ${bizConversations.status} = 'open')::int`,
      handoff: sql<number>`count(*) filter (where ${bizConversations.aiState} in ('handoff_requested','human_owned'))::int`,
    })
    .from(bizConversations)
    .where(eq(bizConversations.businessId, businessId));

  const [msgStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      last24: sql<number>`count(*) filter (where ${bizMessages.createdAt} >= ${since24h})::int`,
    })
    .from(bizMessages)
    .where(eq(bizMessages.businessId, businessId));

  const [leadStats] = await db
    .select({
      fresh: sql<number>`count(*) filter (where ${bizLeads.stage} = 'new')::int`,
      week: sql<number>`count(*) filter (where ${bizLeads.createdAt} >= now() - interval '7 days')::int`,
    })
    .from(bizLeads)
    .where(eq(bizLeads.businessId, businessId));

  const [knStats] = await db
    .select({
      approved: sql<number>`count(*) filter (where ${bizKnowledgeEntries.status} = 'approved')::int`,
      draft: sql<number>`count(*) filter (where ${bizKnowledgeEntries.status} = 'draft')::int`,
    })
    .from(bizKnowledgeEntries)
    .where(eq(bizKnowledgeEntries.businessId, businessId));

  const [styleRow] = await db
    .select({ id: bizStyleGuides.id })
    .from(bizStyleGuides)
    .where(and(eq(bizStyleGuides.businessId, businessId), eq(bizStyleGuides.status, "approved")))
    .limit(1);

  const [dueRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizFollowups)
    .where(and(eq(bizFollowups.businessId, businessId), eq(bizFollowups.status, "pending")));

  const [aiSince] = await db
    .select({
      runs: sql<number>`count(*)::int`,
      errors: sql<number>`count(*) filter (where ${bizAiRuns.status} <> 'ok')::int`,
    })
    .from(bizAiRuns)
    .where(and(eq(bizAiRuns.businessId, businessId), gte(bizAiRuns.createdAt, since24h)));

  const recent = await db
    .select({
      id: bizConversations.id,
      visitorId: bizConversations.visitorId,
      channel: bizConversations.channel,
      status: bizConversations.status,
      aiState: bizConversations.aiState,
      leadName: bizLeads.fullName,
    })
    .from(bizConversations)
    .leftJoin(bizLeads, eq(bizLeads.conversationId, bizConversations.id))
    .where(eq(bizConversations.businessId, businessId))
    .orderBy(desc(bizConversations.lastMessageAt))
    .limit(6);

  const aiReady = isDeepSeekConfigured();
  const knowledgeReady = (knStats?.approved ?? 0) > 0;

  const todo: { text: string; href: string; cta: string; tone: "warn" | "info" }[] = [];
  if (!aiReady) {
    todo.push({
      text: "The AI provider is not reachable, so automatic replies are off.",
      href: "/business/setup",
      cta: "Check health",
      tone: "warn",
    });
  }
  if (!knowledgeReady) {
    todo.push({
      text: "No university data approved yet — the AI cannot quote fees.",
      href: "/business/knowledge",
      cta: "Approve data",
      tone: "warn",
    });
  }
  if (!styleRow) {
    todo.push({
      text: "Brand voice not approved — replies still sound generic.",
      href: "/business/style",
      cta: "Review voice",
      tone: "info",
    });
  }
  if ((convStats?.handoff ?? 0) > 0) {
    todo.push({
      text: `${convStats.handoff} conversation(s) want a human.`,
      href: "/business/inbox",
      cta: "Open inbox",
      tone: "info",
    });
  }
  if ((dueRow?.n ?? 0) > 0) {
    todo.push({
      text: `${dueRow.n} followup(s) pending.`,
      href: "/business/followups",
      cta: "View",
      tone: "info",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Everything here is read live from your database." />

      {todo.length > 0 && (
        <Card title="Needs your attention" padded={false}>
          <ul className="divide-y divide-slate-100">
            {todo.map((t, i) => (
              <li key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      t.tone === "warn" ? "bg-amber-500" : "bg-sky-500"
                    }`}
                    aria-hidden
                  />
                  <span className="text-sm text-slate-800">{t.text}</span>
                </div>
                <Link
                  href={t.href}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0F2A52] text-white hover:bg-[#1B3A6B]"
                >
                  {t.cta}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Open chats"
          value={convStats?.open ?? 0}
          hint={`${convStats?.total ?? 0} total`}
          href="/business/inbox"
        />
        <StatCard
          label="New leads"
          value={leadStats?.fresh ?? 0}
          hint={`${leadStats?.week ?? 0} this week`}
          href="/business/leads"
        />
        <StatCard
          label="Messages"
          value={(msgStats?.total ?? 0).toLocaleString()}
          hint={`${msgStats?.last24 ?? 0} in 24h`}
        />
        <StatCard
          label="Universities live"
          value={knStats?.approved ?? 0}
          hint={(knStats?.draft ?? 0) > 0 ? `${knStats?.draft} awaiting review` : "all reviewed"}
          tone={(knStats?.draft ?? 0) > 0 ? "warn" : "good"}
          href="/business/knowledge"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card
            title="Recent conversations"
            padded={false}
            action={
              <Link
                href="/business/inbox"
                className="text-xs font-semibold text-[#29ABE2] hover:underline"
              >
                Open inbox →
              </Link>
            }
          >
            {recent.length === 0 ? (
              <EmptyState
                title="No conversations yet"
                hint="Messages from the website chat widget and Messenger will appear here."
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {recent.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/business/inbox?c=${c.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#0F2A52] truncate">
                          {c.leadName ?? `Visitor ${c.visitorId.slice(-6)}`}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {c.channel === "messenger" ? "Messenger" : "Website chat"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {c.aiState === "handoff_requested" && <Pill tone="bad">needs human</Pill>}
                        {c.aiState === "human_owned" && <Pill tone="info">with staff</Pill>}
                        {c.aiState === "active" && <Pill tone="good">AI replying</Pill>}
                        {c.status === "resolved" && <Pill tone="neutral">resolved</Pill>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="AI status">
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Provider</span>
                {aiReady ? <Pill tone="good">connected</Pill> : <Pill tone="bad">unreachable</Pill>}
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="text-slate-600">University data</span>
                {knowledgeReady ? (
                  <Pill tone="good">{knStats?.approved} approved</Pill>
                ) : (
                  <Pill tone="warn">none approved</Pill>
                )}
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Brand voice</span>
                {styleRow ? <Pill tone="good">in use</Pill> : <Pill tone="warn">not set</Pill>}
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Replies (24h)</span>
                <span className="tabular-nums font-semibold text-[#0F2A52]">
                  {aiSince?.runs ?? 0}
                </span>
              </li>
            </ul>
            {(aiSince?.errors ?? 0) > 0 && (
              <div className="mt-3">
                <Alert tone="warn">{aiSince?.errors} AI call(s) failed in the last 24h.</Alert>
              </div>
            )}
          </Card>

          <Card title="Quick actions">
            <div className="grid grid-cols-1 gap-2">
              {[
                { href: "/business/knowledge", label: "Add a university brochure" },
                { href: "/business/inbox", label: "Reply to students" },
                { href: "/business/style", label: "Review brand voice" },
                { href: "/business/connections", label: "Connect a channel" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="text-sm px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-[#29ABE2] hover:text-[#0F2A52] transition-colors"
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
