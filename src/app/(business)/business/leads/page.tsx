import Link from "next/link";
import { db } from "@/lib/db";
import { bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { eq, desc, and, sql } from "drizzle-orm";
import { PageHeader, StatCard, Card, Pill, EmptyState } from "../_ui";

export const dynamic = "force-dynamic";

const PRIORITY_TONE: Record<string, "bad" | "warn" | "info" | "neutral"> = {
  hot: "bad",
  warm: "warn",
  cold: "info",
  ignore: "neutral",
};

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
  unclassified: "Unclassified",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string; c?: string }>;
}) {
  const businessId = getBusinessId();
  const { p, c } = await searchParams;

  const priority = ["hot", "warm", "cold", "ignore"].includes(p ?? "") ? p! : "hot";

  const where =
    c && c !== "all"
      ? and(
          eq(bizLeads.businessId, businessId),
          eq(bizLeads.priority, priority),
          eq(bizLeads.category, c)
        )
      : and(eq(bizLeads.businessId, businessId), eq(bizLeads.priority, priority));

  const rows = await db
    .select()
    .from(bizLeads)
    .where(where)
    .orderBy(desc(bizLeads.score), desc(bizLeads.updatedAt))
    .limit(150);

  const [counts] = await db
    .select({
      hot: sql<number>`count(*) filter (where ${bizLeads.priority}='hot')::int`,
      warm: sql<number>`count(*) filter (where ${bizLeads.priority}='warm')::int`,
      cold: sql<number>`count(*) filter (where ${bizLeads.priority}='cold')::int`,
      ignore: sql<number>`count(*) filter (where ${bizLeads.priority}='ignore')::int`,
      withContact: sql<number>`count(*) filter (where ${bizLeads.hasContact})::int`,
      dueNow: sql<number>`count(*) filter (where ${bizLeads.nextActionAt} is not null and ${bizLeads.nextActionAt} <= now() and not ${bizLeads.ignored})::int`,
    })
    .from(bizLeads)
    .where(eq(bizLeads.businessId, businessId));

  const catRows = await db
    .select({ category: bizLeads.category, n: sql<number>`count(*)::int` })
    .from(bizLeads)
    .where(and(eq(bizLeads.businessId, businessId), eq(bizLeads.priority, priority)))
    .groupBy(bizLeads.category)
    .orderBy(desc(sql`count(*)`));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        subtitle="Every conversation is scored and categorised, with a recommended next action and the reason behind it."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Hot — call today" value={counts?.hot ?? 0} tone="bad" href="/business/leads?p=hot" />
        <StatCard label="Warm — follow up" value={counts?.warm ?? 0} tone="warn" href="/business/leads?p=warm" />
        <StatCard label="Cold — nurture" value={counts?.cold ?? 0} tone="info" href="/business/leads?p=cold" />
        <StatCard label="Ignored" value={counts?.ignore ?? 0} tone="neutral" href="/business/leads?p=ignore" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Card>
          <div className="text-xs text-slate-500">Already shared a phone number</div>
          <div className="text-xl font-bold text-[#0F2A52]">
            {counts?.withContact ?? 0}
            <span className="text-xs font-normal text-slate-500 ml-2">
              in WhatsApp/call — do not cold-message
            </span>
          </div>
        </Card>
        <Card>
          <div className="text-xs text-slate-500">Next actions due now</div>
          <div className="text-xl font-bold text-[#0F2A52]">{counts?.dueNow ?? 0}</div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Show</span>
          {(["hot", "warm", "cold", "ignore"] as const).map((k) => (
            <Link
              key={k}
              href={`/business/leads?p=${k}`}
              className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                priority === k ? "bg-[#0F2A52] text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {k}
            </Link>
          ))}
          <span className="text-xs text-slate-400 ml-auto">{rows.length} shown</span>
        </div>

        {catRows.length > 0 && (
          <div className="px-4 py-2 border-b border-slate-100 flex flex-wrap gap-1.5">
            <Link
              href={`/business/leads?p=${priority}`}
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                !c || c === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              All
            </Link>
            {catRows.map((r) => (
              <Link
                key={r.category}
                href={`/business/leads?p=${priority}&c=${r.category}`}
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  c === r.category ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {CATEGORY_LABEL[r.category] ?? r.category} ({r.n})
              </Link>
            ))}
          </div>
        )}

        {rows.length === 0 ? (
          <EmptyState
            title="No leads in this group"
            hint="Leads are built from your conversation history and scored automatically."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {rows.map((l) => (
              <li key={l.id}>
                <Link href={`/business/leads/${l.id}`} className="block px-4 py-3 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#0F2A52]">
                          {l.fullName ?? `Thread ${(l.conversationId ?? l.id).slice(0, 8)}`}
                        </span>
                        <Pill tone={PRIORITY_TONE[l.priority] ?? "neutral"}>
                          {l.priority} · {l.score}
                        </Pill>
                        <Pill tone="neutral">{CATEGORY_LABEL[l.category] ?? l.category}</Pill>
                        {l.hasContact && <Pill tone="good">contact shared</Pill>}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{l.reasoning}</p>
                      {l.nextAction && (
                        <p className="text-xs text-[#0F2A52] mt-1">
                          <span className="font-semibold">Next:</span> {l.nextAction}
                          {l.nextActionAt && (
                            <span className="text-slate-500">
                              {" "}
                              · due {new Date(l.nextActionAt).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      )}
                      {l.ignoreReason && (
                        <p className="text-xs text-slate-500 mt-0.5 italic">
                          Ignored: {l.ignoreReason}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[11px] text-slate-400">{l.inboundCount} msgs</div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {l.source.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
