"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, UserPlus, Filter } from "lucide-react";

type Student = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  program: string;
  degree: string;
  university: string;
  status: string;
  addedDate: string;
  appId: string;
};

const STUDENTS: Student[] = [
  { id: "s1", name: "Rahima Hossain", country: "Bangladesh", countryCode: "🇧🇩", program: "MBBS / Medicine", degree: "MBBS", university: "Wuhan University", status: "Under Review", addedDate: "2 June 2026", appId: "APP-2026-0142" },
  { id: "s2", name: "Kwame Asante", country: "Ghana", countryCode: "🇬🇭", program: "Mechanical Engineering", degree: "Bachelor's", university: "Peking University", status: "Admitted", addedDate: "28 May 2026", appId: "APP-2026-0138" },
  { id: "s3", name: "Amara Mensah", country: "Nigeria", countryCode: "🇳🇬", program: "Computer Science", degree: "Bachelor's", university: "Jilin University", status: "Processing", addedDate: "25 May 2026", appId: "APP-2026-0133" },
  { id: "s4", name: "Sunita Patel", country: "India", countryCode: "🇮🇳", program: "MBA", degree: "Master's", university: "Fudan University", status: "Documents Approved", addedDate: "20 May 2026", appId: "APP-2026-0127" },
  { id: "s5", name: "Ahmed Khan", country: "Pakistan", countryCode: "🇵🇰", program: "MBBS / Medicine", degree: "MBBS", university: "Sichuan University", status: "Applied", addedDate: "15 May 2026", appId: "APP-2026-0119" },
  { id: "s6", name: "Maria Santos", country: "Philippines", countryCode: "🇵🇭", program: "Chinese Language", degree: "Bachelor's", university: "Wuhan University", status: "Complete", addedDate: "10 May 2026", appId: "APP-2026-0112" },
  { id: "s7", name: "Emmanuel Osei", country: "Ghana", countryCode: "🇬🇭", program: "Public Health", degree: "Master's", university: "Peking Union Medical College", status: "Documents Required", addedDate: "5 May 2026", appId: "APP-2026-0108" },
  { id: "s8", name: "Fatimah Al-Rashidi", country: "Saudi Arabia", countryCode: "🇸🇦", program: "MBBS / Medicine", degree: "MBBS", university: "Wuhan University", status: "Applied", addedDate: "1 May 2026", appId: "APP-2026-0104" },
  { id: "s9", name: "Jean-Pierre Nkurunziza", country: "Rwanda", countryCode: "🇷🇼", program: "Civil Engineering", degree: "Bachelor's", university: "Tongji University", status: "Admitted", addedDate: "25 Apr 2026", appId: "APP-2026-0097" },
  { id: "s10", name: "Priya Sharma", country: "India", countryCode: "🇮🇳", program: "Dentistry", degree: "MBBS", university: "Capital Medical University", status: "Complete", addedDate: "20 Apr 2026", appId: "APP-2026-0091" },
  { id: "s11", name: "Kofi Boateng", country: "Ghana", countryCode: "🇬🇭", program: "Economics", degree: "Bachelor's", university: "Renmin University", status: "Admitted", addedDate: "15 Apr 2026", appId: "APP-2026-0086" },
  { id: "s12", name: "Yasmin Hasan", country: "Bangladesh", countryCode: "🇧🇩", program: "Pharmacy", degree: "Bachelor's", university: "Jilin University", status: "Complete", addedDate: "10 Apr 2026", appId: "APP-2026-0079" },
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Under Review": { color: "#D97706", bg: "#FFFBEB" },
  "Admitted": { color: "#16A34A", bg: "#F0FDF4" },
  "Processing": { color: "#29ABE2", bg: "#E0F2FE" },
  "Documents Approved": { color: "#1B3A6B", bg: "#EEF4FF" },
  "Applied": { color: "#94A3B8", bg: "#F8FAFC" },
  "Complete": { color: "#16A34A", bg: "#DCFCE7" },
  "Documents Required": { color: "#C8102E", bg: "#FEF2F2" },
};

const ALL_STATUSES = ["All", ...Object.keys(STATUS_STYLES)];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return STUDENTS.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.country.toLowerCase().includes(search.toLowerCase()) ||
        s.program.toLowerCase().includes(search.toLowerCase()) ||
        s.appId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>
            My Students
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            {STUDENTS.length} total students — {filtered.length} shown
          </p>
        </div>
        <Link
          href="/partner/add-student"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#C8102E" }}
        >
          <UserPlus size={15} />
          Add student
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-2xl p-4 mb-6 flex flex-wrap gap-3" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 min-w-[200px]" style={{ borderColor: "#E2E8F0" }}>
          <Search size={15} style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search by name, country, program or App ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
            style={{ color: "#1B3A6B" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: "#94A3B8" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border rounded-xl px-3 py-2 outline-none"
            style={{ borderColor: "#E2E8F0", color: "#475569" }}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold" style={{ color: "#94A3B8" }}>
              No students match your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {["Student", "Country", "Program", "University", "Status", "Added", "App ID"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: "#94A3B8" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const style = STATUS_STYLES[s.status] ?? { color: "#64748B", bg: "#F8FAFC" };
                  return (
                    <tr
                      key={s.id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: "1px solid #F8FAFC" }}
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold whitespace-nowrap" style={{ color: "#1B3A6B" }}>
                          {s.name}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: "#64748B" }}>
                        {s.countryCode} {s.country}
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>
                        {s.degree}
                      </td>
                      <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: "#64748B" }}>
                        {s.university}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: style.bg, color: style.color }}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>
                        {s.addedDate}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono whitespace-nowrap" style={{ color: "#94A3B8" }}>
                        {s.appId}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
