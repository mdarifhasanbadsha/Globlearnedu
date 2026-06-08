"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Download, Eye, Edit2 } from "lucide-react";

type AppStatus =
  | "Under Review"
  | "Admitted"
  | "Processing Visa"
  | "Documents Approved"
  | "Documents Required"
  | "Complete"
  | "Rejected"
  | "Applied";

interface Application {
  id: string;
  student: string;
  program: string;
  university: string;
  country: string;
  partner: string;
  status: AppStatus;
  date: string;
}

const STATUS_CONFIG: Record<AppStatus, { bg: string; color: string }> = {
  "Under Review":       { bg: "#FEF9C3", color: "#854D0E" },
  "Admitted":           { bg: "#DCFCE7", color: "#166534" },
  "Processing Visa":    { bg: "#DBEAFE", color: "#1E40AF" },
  "Documents Approved": { bg: "#D1FAE5", color: "#065F46" },
  "Documents Required": { bg: "#FFEDD5", color: "#9A3412" },
  "Complete":           { bg: "#F0FDF4", color: "#14532D" },
  "Rejected":           { bg: "#FEE2E2", color: "#991B1B" },
  "Applied":            { bg: "#F1F5F9", color: "#475569" },
};

const ALL_APPS: Application[] = [
  { id: "MB20260602001", student: "Rahima Hossain",         program: "MBBS / Medicine",          university: "Wuhan University",              country: "Bangladesh",  partner: "Ahmed Counseling",          status: "Processing Visa",    date: "2026-06-02" },
  { id: "B20260528003",  student: "Kwame Asante",           program: "Bachelor's Degree",         university: "Zhejiang University",           country: "Ghana",       partner: "Africa Education Hub",      status: "Documents Approved", date: "2026-05-28" },
  { id: "B20260525001",  student: "Amara Mensah",           program: "Bachelor's Degree",         university: "Sun Yat-sen University",        country: "Ghana",       partner: "Africa Education Hub",      status: "Admitted",           date: "2026-05-25" },
  { id: "M20260520002",  student: "Sunita Patel",           program: "Master's Degree",           university: "Fudan University",              country: "India",       partner: "South Asia Study Abroad",   status: "Admitted",           date: "2026-05-20" },
  { id: "MB20260515004", student: "Ahmed Khan",             program: "MBBS / Medicine",          university: "Wuhan University",              country: "Pakistan",    partner: "South Asia Study Abroad",   status: "Under Review",       date: "2026-05-15" },
  { id: "L20260510001",  student: "Maria Santos",           program: "Language Program",          university: "BLCU",                          country: "Philippines", partner: "—",                         status: "Under Review",       date: "2026-05-10" },
  { id: "M20260505001",  student: "Emmanuel Osei",          program: "Master's Degree",           university: "Tongji University",             country: "Ghana",       partner: "Africa Education Hub",      status: "Admitted",           date: "2026-05-05" },
  { id: "MB20260501002", student: "Fatimah Al-Rashidi",    program: "MBBS / Medicine",          university: "China Medical University",      country: "Saudi Arabia",partner: "Gulf Education Partners",   status: "Processing Visa",    date: "2026-05-01" },
  { id: "B20260425001",  student: "Jean-Pierre Nkurunziza",program: "Bachelor's Degree",         university: "Huazhong University",           country: "Burundi",     partner: "East Africa Study Group",   status: "Documents Required", date: "2026-04-25" },
  { id: "DN20260420001", student: "Priya Sharma",          program: "Dentistry",                 university: "Wuhan University",              country: "India",       partner: "South Asia Study Abroad",   status: "Admitted",           date: "2026-04-20" },
  { id: "B20260415003",  student: "Kofi Boateng",          program: "Bachelor's Degree",         university: "Zhejiang University",           country: "Ghana",       partner: "Africa Education Hub",      status: "Complete",           date: "2026-04-15" },
  { id: "B20260410002",  student: "Yasmin Hasan",          program: "Bachelor's Degree",         university: "Fudan University",              country: "Bangladesh",  partner: "Dhaka Education Consultants",status: "Under Review",       date: "2026-04-10" },
  { id: "P20260408001",  student: "Amodu Ibrahim",         program: "Foundation / Pre-University",university: "Tsinghua University",           country: "Nigeria",     partner: "Ahmed Counseling",          status: "Applied",            date: "2026-04-08" },
  { id: "SC20260405002", student: "Nadia Al-Farsi",        program: "Short Course / Exchange",   university: "Beijing Normal University",     country: "Oman",        partner: "Gulf Education Partners",   status: "Complete",           date: "2026-04-05" },
  { id: "D20260401001",  student: "Dr. Samuel Addo",       program: "PhD / Doctorate",           university: "Peking University",             country: "Ghana",       partner: "Africa Education Hub",      status: "Admitted",           date: "2026-04-01" },
  { id: "MB20260325003", student: "Hassan Al-Qasim",       program: "MBBS / Medicine",          university: "Huazhong University",           country: "Jordan",      partner: "Gulf Education Partners",   status: "Complete",           date: "2026-03-25" },
  { id: "M20260320001",  student: "Ruchi Gupta",           program: "Master's Degree",           university: "Shanghai Jiao Tong University", country: "India",       partner: "South Asia Study Abroad",   status: "Complete",           date: "2026-03-20" },
  { id: "L20260315002",  student: "Aisha Camara",          program: "Language Program",          university: "BLCU",                          country: "Senegal",     partner: "—",                         status: "Rejected",           date: "2026-03-15" },
  { id: "B20260310001",  student: "Oliver Mensah",         program: "Bachelor's Degree",         university: "Renmin University",             country: "Ghana",       partner: "Africa Education Hub",      status: "Rejected",           date: "2026-03-10" },
  { id: "DN20260305002", student: "Kavya Pillai",          program: "Dentistry",                 university: "China Medical University",      country: "India",       partner: "South Asia Study Abroad",   status: "Under Review",       date: "2026-03-05" },
];

const ALL_STATUSES: AppStatus[] = [
  "Under Review", "Admitted", "Processing Visa", "Documents Approved",
  "Documents Required", "Complete", "Rejected", "Applied",
];

const PROGRAMS = [
  "All Programs",
  "MBBS / Medicine",
  "Bachelor's Degree",
  "Master's Degree",
  "Dentistry",
  "PhD / Doctorate",
  "Language Program",
  "Foundation / Pre-University",
  "Short Course / Exchange",
];

export default function AdminApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [programFilter, setProgramFilter] = useState("All Programs");

  const filtered = useMemo(() => {
    return ALL_APPS.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.student.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.university.toLowerCase().includes(q) ||
        a.partner.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      const matchProgram = programFilter === "All Programs" || a.program === programFilter;
      return matchSearch && matchStatus && matchProgram;
    });
  }, [search, statusFilter, programFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: ALL_APPS.length };
    ALL_STATUSES.forEach((s) => {
      c[s] = ALL_APPS.filter((a) => a.status === s).length;
    });
    return c;
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>
            Applications
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {ALL_APPS.length} total applications across all programs
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors"
          style={{ borderColor: "#E2E8F0", color: "#475569", backgroundColor: "white" }}
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Status chips */}
      <div className="flex gap-2 flex-wrap">
        {[{ label: "All", key: "All" }, ...ALL_STATUSES.map((s) => ({ label: s, key: s }))].map(({ label, key }) => {
          const active = statusFilter === key;
          const cfg = STATUS_CONFIG[key as AppStatus];
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
              style={
                active
                  ? { borderColor: cfg?.color ?? "#0A1628", backgroundColor: cfg?.bg ?? "#EEF4FF", color: cfg?.color ?? "#0A1628" }
                  : { borderColor: "#E2E8F0", backgroundColor: "white", color: "#64748B" }
              }
            >
              {label}
              <span
                className="text-[10px] font-black px-1 py-0.5 rounded-full min-w-[18px] text-center"
                style={active ? { backgroundColor: cfg?.color ?? "#0A1628", color: "white" } : { backgroundColor: "#F1F5F9", color: "#64748B" }}
              >
                {counts[key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + program filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search student, app ID, country, university, partner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none"
            style={{ borderColor: "#E2E8F0" }}
          />
        </div>
        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none min-w-[200px]"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {PROGRAMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold" style={{ color: "#94A3B8" }}>No applications match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                  {["App ID", "Student", "Program", "University", "Country", "Partner", "Status", "Date", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const s = STATUS_CONFIG[app.status];
                  return (
                    <tr
                      key={app.id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: "#1B3A6B" }}>
                        {app.id}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#0A1628" }}>
                        {app.student}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                        {app.program}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                        {app.university}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                        {app.country}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                        {app.partner}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: s.bg, color: s.color }}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>
                        {app.date}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                            title="View"
                          >
                            <Eye size={13} style={{ color: "#64748B" }} />
                          </button>
                          <button
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                            title="Edit status"
                          >
                            <Edit2 size={13} style={{ color: "#64748B" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}
        >
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Showing {filtered.length} of {ALL_APPS.length} applications
          </p>
          <p className="text-xs font-semibold" style={{ color: "#64748B" }}>
            Static data — connect to DB for live records
          </p>
        </div>
      </div>
    </div>
  );
}
