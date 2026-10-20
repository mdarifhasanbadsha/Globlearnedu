import Link from "next/link";
import { db } from "@/lib/db";
import { bizConversations, bizMessages, bizAiRuns } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { isDeepSeekConfigured } from "@/lib/business/deepseek";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export const dynamic = "force-dynamic";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-[#1B3A6B] mt-1">{value}</div>
      {hint ? <div className="text-xs text-slate-500 mt-1">{hint}</div> : null}
    </div>
  );
}

export default async function BusinessOverview() {
  const businessId = getBusinessId();

  const [convCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizConversations)
    .where(eq(bizConversations.businessId, businessId));

  const [msgCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizMessages)
    .where(eq(bizMessages.businessId, businessId));

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [aiToday] = await db
    .select({
      runs: sql<number>`count(*)::int`,
      tokens: sql<number>`coalesce(sum(${bizAiRuns.promptTokens} + ${bizAiRuns.completionTokens}), 0)::int`,
    })
    .from(bizAiRuns)
    .where(and(eq(bizAiRuns.businessId, businessId), gte(bizAiRuns.createdAt, since)));

  const recent = await db
    .select({
      id: bizConversations.id,
      visitorId: bizConversations.visitorId,
      status: bizConversations.status,
      aiState: bizConversations.aiState,
      lastMessageAt: bizConversations.lastMessageAt,
    })
    .from(bizConversations)
    .where(eq(bizConversations.businessId, businessId))
    .orderBy(desc(bizConversations.lastMessageAt))
    .limit(8);

  const aiReady = isDeepSeekConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Overview</h1>
        <p className="text-sm text-slate-600 mt-1">
          Internal operations for GL Education. All figures read live from the database.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Conversations" value={String(convCount?.n ?? 0)} />
        <Stat label="Messages" value={String(msgCount?.n ?? 0)} />
        <Stat
          label="AI runs (24h)"
          value={String(aiToday?.runs ?? 0)}
          hint={`${aiToday?.tokens ?? 0} tokens`}
        />
        <Stat
          label="AI provider"
          value={aiReady ? "Configured" : "Not configured"}
          hint={aiReady ? "DeepSeek key present" : "Set DEEPSEEK_API_KEY"}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-[#1B3A6B] text-sm">Recent conversations</h2>
          <Link href="/business/inbox" className="text-xs text-[#29ABE2] hover:underline">
            Open inbox
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-600">No conversations yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Messages from the website chat will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/business/inbox?c=${c.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                >
                  <span className="text-sm text-[#1B3A6B] font-medium truncate">
                    Visitor {c.visitorId.slice(0, 8)}
                  </span>
                  <span className="text-xs text-slate-500 shrink-0 ml-3">
                    {c.status} · AI {c.aiState}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
