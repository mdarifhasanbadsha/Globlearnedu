import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, applications, partners, universities } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";
import {
  FileText,
  Building2,
  Briefcase,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ── Display helpers ───────────────────────────────────────────────────────────

const PROGRAM_LABELS: Record<string, string> = {
  mbbs:        "MBBS / Medicine",
  bachelor:    "Bachelor's Degree",
  master:      "Master's Degree",
  phd:         "PhD / Doctorate",
  language:    "Language Program",
  diploma:     "Diploma",
  foundation:  "Foundation",
  short_course:"Short Course",
};

const PROGRAM_COLORS: Record<string, string> = {
  mbbs:        "#C8102E",
  bachelor:    "#1B3A6B",
  master:      "#29ABE2",
  phd:         "#7C3AED",
  language:    "#059669",
  diploma:     "#D97706",
  foundation:  "#64748B",
  short_course:"#94A3B8",
};

const STATUS_DISPLAY: Record<string, { label: string; bg: string; color: string }> = {
  submitted:             { label: "Submitted",     bg: "#F1F5F9", color: "#475569" },
  under_review:          { label: "Under Review",  bg: "#FEF9C3", color: "#854D0E" },
  documents_approved:    { label: "Docs Approved", bg: "#D1FAE5", color: "#065F46" },
  applied_per_university:{ label: "Applied",       bg: "#EDE9FE", color: "#5B21B6" },
  processing:            { label: "Processing",    bg: "#DBEAFE", color: "#1E40AF" },
  interview:             { label: "Interview",     bg: "#FEF3C7", color: "#92400E" },
  pre_admission:         { label: "Pre-Admission", bg: "#DCFCE7", color: "#166534" },
  student_confirms:      { label: "Confirmed",     bg: "#D1FAE5", color: "#065F46" },
  university_deposit:    { label: "Uni Deposit",   bg: "#FEE2E2", color: "#9A3412" },
  final_admission:       { label: "Final Adm.",    bg: "#DCFCE7", color: "#14532D" },
  student_accepts:       { label: "Accepted",      bg: "#F0FDF4", color: "#14532D" },
  service_charge_payment:{ label: "Svc Charge",    bg: "#FFEDD5", color: "#9A3412" },
  jw202_issued:          { label: "JW202 Issued",  bg: "#EDE9FE", color: "#6D28D9" },
  complete:              { label: "Complete",      bg: "#F0FDF4", color: "#14532D" },
  withdrawn:             { label: "Withdrawn",     bg: "#FEE2E2", color: "#991B1B" },
  cancelled:             { label: "Cancelled",     bg: "#FEE2E2", color: "#7F1D1D" },
};

// Dashboard status tiles — logical groupings
const TILE_GROUPS = [
  { key: "new",       label: "Submitted",   statuses: ["submitted"],       bg: "#F1F5F9", color: "#475569" },
  { key: "review",    label: "Under Review",statuses: ["under_review"],    bg: "#FEF9C3", color: "#854D0E" },
  { key: "docs",      label: "Docs Approved",statuses:["documents_approved","applied_per_university"], bg: "#D1FAE5", color: "#065F46" },
  { key: "processing",label: "Processing",  statuses: ["processing","interview","pre_admission"], bg: "#DBEAFE", color: "#1E40AF" },
  { key: "admitted",  label: "Admitted",    statuses: ["student_confirms","university_deposit","final_admission","student_accepts","service_charge_payment","jw202_issued"], bg: "#DCFCE7", color: "#166534" },
  { key: "complete",  label: "Complete",    statuses: ["complete"],        bg: "#F0FDF4", color: "#14532D" },
  { key: "withdrawn", label: "Withdrawn",   statuses: ["withdrawn","cancelled"], bg: "#FEE2E2", color: "#991B1B" },
];

export default async function AdminDashboard() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user?.id || !["admin", "staff"].includes(role)) redirect("/sign-in");

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // ── DB queries ─────────────────────────────────────────────────────────────

  const [kpiRow] = await db.execute(sql`
    SELECT
      COUNT(*)::int                                                                                         AS total,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::int                                AS this_month,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()) - INTERVAL '1 month'
                         AND created_at < date_trunc('month', NOW()))::int                                 AS last_month,
      COUNT(*) FILTER (WHERE status IN ('final_admission','student_accepts','service_charge_payment','jw202_issued','complete'))::int AS admitted
    FROM applications
  `).then(r => r.rows as any[]);

  const [partnerRow] = await db.execute(sql`
    SELECT COUNT(*)::int AS count FROM partners WHERE is_approved = TRUE
  `).then(r => r.rows as any[]);

  const [uniRow] = await db.execute(sql`
    SELECT COUNT(*)::int AS count FROM universities WHERE is_active = TRUE
  `).then(r => r.rows as any[]);

  const statusRows = await db.execute(sql`
    SELECT status::text AS status, COUNT(*)::int AS count FROM applications GROUP BY status
  `).then(r => r.rows as any[]);

  const programRows = await db.execute(sql`
    SELECT program_level::text AS level, COUNT(*)::int AS count
    FROM applications WHERE program_level IS NOT NULL
    GROUP BY program_level ORDER BY count DESC
  `).then(r => r.rows as any[]);

  const recentRows = await db.execute(sql`
    SELECT a.id, a.application_number, a.status::text, a.program_level::text,
           a.nationality, a.created_at, u.first_name, u.last_name, u.email
    FROM applications a
    JOIN users u ON u.id = a.student_id
    ORDER BY a.created_at DESC LIMIT 8
  `).then(r => r.rows as any[]);

  const partnerRows = await db.execute(sql`
    SELECT p.id, p.agency_name, p.agency_country, u.first_name, u.last_name,
      COUNT(a.id)::int AS student_count,
      COUNT(a.id) FILTER (WHERE a.status IN ('final_admission','student_accepts','service_charge_payment','jw202_issued','complete'))::int AS admitted_count
    FROM partners p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN applications a ON a.partner_id = p.id
    WHERE p.is_approved = TRUE
    GROUP BY p.id, p.agency_name, p.agency_country, u.first_name, u.last_name
    ORDER BY student_count DESC LIMIT 5
  `).then(r => r.rows as any[]);

  // ── Derived data ───────────────────────────────────────────────────────────

  const kpi = kpiRow ?? { total: 0, this_month: 0, last_month: 0, admitted: 0 };
  const total = kpi.total ?? 0;

  const monthDiff = (kpi.this_month ?? 0) - (kpi.last_month ?? 0);
  const monthLabel = kpi.last_month > 0
    ? `${monthDiff >= 0 ? "+" : ""}${monthDiff} vs last month`
    : `${kpi.this_month ?? 0} this month`;

  const admitRate = total > 0 ? Math.round(((kpi.admitted ?? 0) / total) * 100) : 0;

  const statusMap: Record<string, number> = {};
  for (const r of statusRows) statusMap[r.status] = r.count;

  const tiles = TILE_GROUPS.map(g => ({
    ...g,
    count: g.statuses.reduce((s, k) => s + (statusMap[k] ?? 0), 0),
  }));

  const programs = programRows.map((r: any) => ({
    level: r.level,
    label: PROGRAM_LABELS[r.level] ?? r.level,
    count: r.count,
    color: PROGRAM_COLORS[r.level] ?? "#94A3B8",
  }));

  const recent = recentRows.map((r: any) => ({
    id: r.id,
    appNum: r.application_number,
    status: r.status,
    programLevel: r.program_level,
    nationality: r.nationality ?? "—",
    createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString("en-GB") : "—",
    studentName: [r.first_name, r.last_name].filter(Boolean).join(" ") || r.email || "—",
  }));

  const topPartners = partnerRows.map((r: any) => ({
    id: r.id,
    name: r.agency_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "Unknown",
    country: r.agency_country ?? "",
    students: r.student_count ?? 0,
    admitted: r.admitted_count ?? 0,
  }));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Admin Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>{today}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/applications"
            className="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors"
            style={{ borderColor: "#E2E8F0", color: "#475569", backgroundColor: "white" }}
          >
            View All Applications
          </Link>
          <Link
            href="/admin/universities/new"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#C8102E" }}
          >
            + Add University
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Applications",
            value: total.toLocaleString(),
            sub: monthLabel,
            icon: FileText,
            color: "#1B3A6B", bg: "#EEF4FF",
          },
          {
            label: "Admitted / Complete",
            value: (kpi.admitted ?? 0).toLocaleString(),
            sub: `${admitRate}% admission rate`,
            icon: CheckCircle2,
            color: "#166534", bg: "#DCFCE7",
          },
          {
            label: "Active Partners",
            value: (partnerRow?.count ?? 0).toLocaleString(),
            sub: "approved agencies",
            icon: Briefcase,
            color: "#7C3AED", bg: "#F5F3FF",
          },
          {
            label: "Universities Listed",
            value: (uniRow?.count ?? 0).toLocaleString(),
            sub: "active in database",
            icon: Building2,
            color: "#C8102E", bg: "#FEF2F2",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 border" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-3xl font-black" style={{ color: "#0A1628" }}>{card.value}</p>
              <p className="text-sm font-semibold mt-1" style={{ color: "#475569" }}>{card.label}</p>
              <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Status breakdown tiles */}
      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: "#E2E8F0" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>
          Application Pipeline
        </p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${tiles.length}, 1fr)`, display: "grid" }}>
          {tiles.map((t) => (
            <div key={t.key} className="rounded-xl p-3 text-center" style={{ backgroundColor: t.bg }}>
              <p className="text-2xl font-black" style={{ color: t.color }}>{t.count}</p>
              <p className="text-[11px] font-semibold mt-1 leading-tight" style={{ color: t.color }}>{t.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 2-column */}
      <div className="gap-6" style={{ display: "grid", gridTemplateColumns: "1fr 300px" }}>
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <p className="text-sm font-bold" style={{ color: "#0A1628" }}>Recent Applications</p>
            <Link href="/admin/applications" className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#29ABE2" }}>
              View all <ChevronRight size={13} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No applications yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    {["App ID", "Student", "Program", "Country", "Status", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#94A3B8" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((app, i) => {
                    const s = STATUS_DISPLAY[app.status] ?? { bg: "#F1F5F9", color: "#475569" };
                    return (
                      <tr
                        key={app.id}
                        className="transition-colors hover:bg-gray-50"
                        style={{ borderBottom: i < recent.length - 1 ? "1px solid #F8FAFC" : "none" }}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: "#1B3A6B" }}>{app.appNum}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "#0A1628", maxWidth: 140 }}>
                          <span className="truncate block">{app.studentName}</span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                          {PROGRAM_LABELS[app.programLevel] ?? app.programLevel ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>{app.nationality}</td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.color }}>
                            {STATUS_DISPLAY[app.status]?.label ?? app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#94A3B8" }}>{app.createdAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Program breakdown */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>By Program</p>
            {programs.length === 0 ? (
              <p className="text-xs text-gray-400">No data yet</p>
            ) : (
              <div className="space-y-3">
                {programs.map((p) => (
                  <div key={p.level}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold" style={{ color: "#0A1628" }}>{p.label}</span>
                      <span className="text-xs font-bold" style={{ color: p.color }}>{p.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: "#F1F5F9" }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: total > 0 ? `${Math.round((p.count / total) * 100)}%` : "0%", backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top partners */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Top Partners</p>
              <Link href="/admin/partners" className="text-xs font-semibold" style={{ color: "#29ABE2" }}>View all</Link>
            </div>
            {topPartners.length === 0 ? (
              <p className="text-xs text-gray-400">No approved partners yet</p>
            ) : (
              <div className="space-y-3">
                {topPartners.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                      style={{ backgroundColor: i === 0 ? "#FFD700" : i === 1 ? "#94A3B8" : "#C8102E" }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "#0A1628" }}>{p.name}</p>
                      <p className="text-[11px]" style={{ color: "#94A3B8" }}>
                        {p.students} students · {p.admitted} admitted
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
