import Link from "next/link";
import {
  FileText,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  ChevronRight,
} from "lucide-react";

const RECENT_APPS = [
  { id: "MB20260602001", student: "Rahima Hossain", program: "MBBS / Medicine", university: "Wuhan University", country: "Bangladesh", status: "Processing Visa", date: "2026-06-02" },
  { id: "B20260528003", student: "Kwame Asante", program: "Bachelor's Degree", university: "Zhejiang University", country: "Ghana", status: "Documents Approved", date: "2026-05-28" },
  { id: "M20260520002", student: "Sunita Patel", program: "Master's Degree", university: "Fudan University", country: "India", status: "Admitted", date: "2026-05-20" },
  { id: "MB20260515004", student: "Ahmed Khan", program: "MBBS / Medicine", university: "Wuhan University", country: "Pakistan", status: "Under Review", date: "2026-05-15" },
  { id: "L20260510001", student: "Maria Santos", program: "Language Program", university: "BLCU", country: "Philippines", status: "Under Review", date: "2026-05-10" },
  { id: "MB20260501002", student: "Fatimah Al-Rashidi", program: "MBBS / Medicine", university: "China Medical Univ.", country: "Saudi Arabia", status: "Processing Visa", date: "2026-05-01" },
  { id: "B20260425001", student: "Jean-Pierre Nkurunziza", program: "Bachelor's Degree", university: "Huazhong Univ.", country: "Burundi", status: "Documents Required", date: "2026-04-25" },
  { id: "DN20260420001", student: "Priya Sharma", program: "Dentistry", university: "Wuhan University", country: "India", status: "Admitted", date: "2026-04-20" },
];

const STATUS_CONFIG: Record<string, { bg: string; color: string }> = {
  "Under Review": { bg: "#FEF9C3", color: "#854D0E" },
  "Admitted": { bg: "#DCFCE7", color: "#166534" },
  "Processing Visa": { bg: "#DBEAFE", color: "#1E40AF" },
  "Documents Approved": { bg: "#D1FAE5", color: "#065F46" },
  "Documents Required": { bg: "#FFEDD5", color: "#9A3412" },
  "Complete": { bg: "#F0FDF4", color: "#14532D" },
  "Rejected": { bg: "#FEE2E2", color: "#991B1B" },
  "Applied": { bg: "#F1F5F9", color: "#475569" },
};

const TOP_PARTNERS = [
  { name: "South Asia Study Abroad", country: "India", students: 31, admitted: 26 },
  { name: "Ahmed Counseling Services", country: "Nigeria", students: 24, admitted: 19 },
  { name: "Africa Education Hub", country: "Ghana", students: 18, admitted: 14 },
  { name: "Gulf Education Partners", country: "UAE", students: 12, admitted: 9 },
  { name: "Dhaka Education Consultants", country: "Bangladesh", students: 15, admitted: 11 },
];

const PROGRAM_BREAKDOWN = [
  { name: "MBBS / Medicine", count: 84, color: "#C8102E" },
  { name: "Bachelor's Degree", count: 63, color: "#1B3A6B" },
  { name: "Master's Degree", count: 47, color: "#29ABE2" },
  { name: "Dentistry", count: 21, color: "#7C3AED" },
  { name: "PhD / Doctorate", count: 14, color: "#D97706" },
  { name: "Language Program", count: 11, color: "#059669" },
  { name: "Others", count: 7, color: "#94A3B8" },
];

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>
            Admin Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {today}
          </p>
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
      <div className="grid gap-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Total Applications", value: "247", sub: "+23 this month", icon: FileText, color: "#1B3A6B", bg: "#EEF4FF" },
          { label: "Admitted", value: "42", sub: "17% admit rate", icon: CheckCircle2, color: "#166534", bg: "#DCFCE7" },
          { label: "Active Partners", value: "18", sub: "↑ 3 this quarter", icon: Briefcase, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Universities Listed", value: "20", sub: "280+ network-wide", icon: Building2, color: "#C8102E", bg: "#FEF2F2" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-5 border"
              style={{ borderColor: "#E2E8F0" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: card.bg }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-3xl font-black" style={{ color: "#0A1628" }}>
                {card.value}
              </p>
              <p className="text-sm font-semibold mt-1" style={{ color: "#475569" }}>
                {card.label}
              </p>
              <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
                {card.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status breakdown */}
      <div
        className="bg-white rounded-2xl p-5 border"
        style={{ borderColor: "#E2E8F0" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>
          Application Status Breakdown
        </p>
        <div className="grid gap-3" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {[
            { label: "Under Review", count: 89, bg: "#FEF9C3", color: "#854D0E" },
            { label: "Docs Required", count: 38, bg: "#FFEDD5", color: "#9A3412" },
            { label: "Processing Visa", count: 31, bg: "#DBEAFE", color: "#1E40AF" },
            { label: "Admitted", count: 42, bg: "#DCFCE7", color: "#166534" },
            { label: "Docs Approved", count: 12, bg: "#D1FAE5", color: "#065F46" },
            { label: "Complete", count: 17, bg: "#F0FDF4", color: "#14532D" },
            { label: "Rejected", count: 18, bg: "#FEE2E2", color: "#991B1B" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: s.bg }}
            >
              <p className="text-2xl font-black" style={{ color: s.color }}>
                {s.count}
              </p>
              <p className="text-[11px] font-semibold mt-1 leading-tight" style={{ color: s.color }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 2-column: recent apps + quick stats */}
      <div
        className="gap-6"
        style={{ display: "grid", gridTemplateColumns: "1fr 300px" }}
      >
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <p className="text-sm font-bold" style={{ color: "#0A1628" }}>
              Recent Applications
            </p>
            <Link
              href="/admin/applications"
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#29ABE2" }}
            >
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {["App ID", "Student", "Program", "Country", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold"
                      style={{ color: "#94A3B8" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_APPS.map((app, i) => {
                  const s = STATUS_CONFIG[app.status] ?? { bg: "#F1F5F9", color: "#475569" };
                  return (
                    <tr
                      key={app.id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: i < RECENT_APPS.length - 1 ? "1px solid #F8FAFC" : "none" }}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: "#1B3A6B" }}>
                        {app.id}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#0A1628", maxWidth: 140 }}>
                        <span className="truncate block">{app.student}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                        {app.program}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                        {app.country}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: s.bg, color: s.color }}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#94A3B8" }}>
                        {app.date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: program breakdown + top partners */}
        <div className="flex flex-col gap-4">
          {/* Program breakdown */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>
              By Program
            </p>
            <div className="space-y-3">
              {PROGRAM_BREAKDOWN.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold" style={{ color: "#0A1628" }}>
                      {p.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: p.color }}>
                      {p.count}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: "#F1F5F9" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${Math.round((p.count / 247) * 100)}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top partners */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>
                Top Partners
              </p>
              <Link href="/admin/partners" className="text-xs font-semibold" style={{ color: "#29ABE2" }}>
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {TOP_PARTNERS.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ backgroundColor: i === 0 ? "#FFD700" : i === 1 ? "#94A3B8" : "#C8102E" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#0A1628" }}>
                      {p.name}
                    </p>
                    <p className="text-[11px]" style={{ color: "#94A3B8" }}>
                      {p.students} students · {p.admitted} admitted
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
