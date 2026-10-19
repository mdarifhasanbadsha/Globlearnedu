import Link from "next/link";
import { db } from "@/lib/db";
import { bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { eq, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const STAGES = [
  { key: "new", label: "New", tone: "bg-slate-100 text-slate-700" },
  { key: "profile_pending", label: "Profile pending", tone: "bg-amber-100 text-amber-800" },
  { key: "qualified", label: "Qualified", tone: "bg-sky-100 text-sky-800" },
  { key: "counseling_booked", label: "Counseling booked", tone: "bg-indigo-100 text-indigo-800" },
  { key: "considering", label: "Considering", tone: "bg-violet-100 text-violet-800" },
  { key: "closed", label: "Closed", tone: "bg-slate-200 text-slate-600" },
] as const;

function toneFor(stage: string) {
  return STAGES.find((s) => s.key === stage)?.tone ?? "bg-slate-100 text-slate-700";
}

export default async function LeadsPage() {
  const businessId = getBusinessId();

  const leads = await db
    .select()
    .from(bizLeads)
    .where(eq(bizLeads.businessId, businessId))
    .orderBy(desc(bizLeads.createdAt))
    .limit(200);

  const counts = await db
    .select({ stage: bizLeads.stage, n: sql<number>`count(*)::int` })
    .from(bizLeads)
    .where(eq(bizLeads.businessId, businessId))
    .groupBy(bizLeads.stage);

  const countMap = new Map(counts.map((c) => [c.stage, c.n]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Leads</h1>
        <p className="text-sm text-slate-600 mt-1">
          Collected automatically from conversations. Fields appear only when a student
          clearly provided them.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGES.map((s) => (
          <div key={s.key} className="bg-white rounded-xl border border-slate-200 px-3 py-2.5">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">{s.label}</div>
            <div className="text-xl font-bold text-[#1B3A6B]">{countMap.get(s.key) ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-600">No leads yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Leads are created automatically when visitors chat on the website.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Contact</th>
                  <th className="px-3 py-2 font-medium">Interest</th>
                  <th className="px-3 py-2 font-medium">GPA</th>
                  <th className="px-3 py-2 font-medium">Intake</th>
                  <th className="px-3 py-2 font-medium">Stage</th>
                  <th className="px-3 py-2 font-medium">Chat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-[#1B3A6B] whitespace-nowrap">
                      {l.fullName ?? <span className="text-slate-400">Unknown</span>}
                    </td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                      {l.phone ?? l.email ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {[l.degreeLevel, l.subjectInterest].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                      {l.gpaValue && l.gpaScale ? `${l.gpaValue}/${l.gpaScale}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                      {l.intakeTarget ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full font-medium ${toneFor(l.stage)}`}
                      >
                        {l.stage.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {l.conversationId ? (
                        <Link
                          href={`/business/inbox?c=${l.conversationId}`}
                          className="text-[#29ABE2] hover:underline text-xs"
                        >
                          Open
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
