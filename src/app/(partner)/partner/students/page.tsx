"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, UserPlus, Filter, RefreshCw } from "lucide-react";

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  submitted:              { color: "#475569", bg: "#F1F5F9",  label: "Submitted" },
  under_review:           { color: "#D97706", bg: "#FFFBEB",  label: "Under Review" },
  documents_approved:     { color: "#1B3A6B", bg: "#EEF4FF",  label: "Docs Approved" },
  applied_per_university: { color: "#94A3B8", bg: "#F8FAFC",  label: "Applied" },
  processing:             { color: "#29ABE2", bg: "#E0F2FE",  label: "Processing" },
  interview:              { color: "#9D174D", bg: "#FCE7F3",  label: "Interview" },
  pre_admission:          { color: "#92400E", bg: "#FEF3C7",  label: "Pre-Admission" },
  student_confirms:       { color: "#065F46", bg: "#D1FAE5",  label: "Student Confirms" },
  university_deposit:     { color: "#991B1B", bg: "#FEE2E2",  label: "Univ. Deposit" },
  final_admission:        { color: "#166534", bg: "#DCFCE7",  label: "Final Admission" },
  student_accepts:        { color: "#065F46", bg: "#D1FAE5",  label: "Student Accepts" },
  service_charge_payment: { color: "#9A3412", bg: "#FFEDD5",  label: "Service Charge" },
  jw202_issued:           { color: "#1E40AF", bg: "#DBEAFE",  label: "JW202 Issued" },
  complete:               { color: "#14532D", bg: "#F0FDF4",  label: "Complete" },
  withdrawn:              { color: "#94A3B8", bg: "#F8FAFC",  label: "Withdrawn" },
  cancelled:              { color: "#991B1B", bg: "#FEE2E2",  label: "Cancelled" },
};

interface StudentRow {
  id: string;
  applicationNumber: string;
  status: string;
  programLevel: string | null;
  selectedUniversities: Array<{ universityName: string }> | unknown;
  passportSurname: string | null;
  passportGivenName: string | null;
  nationality: string | null;
  createdAt: string;
  studentEmail: string | null;
  studentFirstName: string | null;
  studentLastName: string | null;
  studentCountry: string | null;
}

function displayName(row: StudentRow) {
  if (row.passportGivenName && row.passportSurname) return `${row.passportGivenName} ${row.passportSurname}`;
  if (row.studentFirstName && row.studentLastName) return `${row.studentFirstName} ${row.studentLastName}`;
  return row.studentEmail ?? "—";
}

function primaryUniversity(row: StudentRow) {
  const univs = row.selectedUniversities as Array<{ universityName: string }>;
  return Array.isArray(univs) && univs.length > 0 ? univs[0].universityName : "—";
}

export default function StudentsPage() {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch("/api/partner/students");
      if (res.ok) {
        const data = await res.json();
        setRows(data.students ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStudents(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = search.toLowerCase();
      const name = displayName(r).toLowerCase();
      const matchSearch =
        !q ||
        name.includes(q) ||
        (r.nationality ?? "").toLowerCase().includes(q) ||
        (r.studentCountry ?? "").toLowerCase().includes(q) ||
        r.applicationNumber.toLowerCase().includes(q) ||
        (r.programLevel ?? "").toLowerCase().includes(q) ||
        primaryUniversity(r).toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const uniqueStatuses = Array.from(new Set(rows.map((r) => r.status)));

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>My Students</h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            {loading ? "Loading…" : `${rows.length} total — ${filtered.length} shown`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStudents}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border"
            style={{ borderColor: "#E2E8F0", color: "#64748B" }}
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/partner/add-student"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#C8102E" }}
          >
            <UserPlus size={15} />
            Add student
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-2xl p-4 mb-6 flex flex-wrap gap-3" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 min-w-[200px]" style={{ borderColor: "#E2E8F0" }}>
          <Search size={15} style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search name, country, program, app ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent"
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
            <option value="All">All statuses</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>{STATUS_STYLES[s]?.label ?? s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw size={20} className="animate-spin mx-auto mb-2" style={{ color: "#94A3B8" }} />
            <p className="text-sm" style={{ color: "#94A3B8" }}>Loading students…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold" style={{ color: "#94A3B8" }}>
              {rows.length === 0 ? "No students yet. Add your first student to get started." : "No students match your filters."}
            </p>
            {rows.length === 0 && (
              <Link href="/partner/add-student" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#C8102E" }}>
                <UserPlus size={14} />
                Add first student
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {["Student", "Country", "Program", "University", "Status", "Added", "App ID"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: "#94A3B8" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const style = STATUS_STYLES[row.status] ?? { color: "#64748B", bg: "#F8FAFC", label: row.status };
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-gray-50" style={{ borderBottom: "1px solid #F8FAFC" }}>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold whitespace-nowrap" style={{ color: "#1B3A6B" }}>{displayName(row)}</p>
                        {row.studentEmail && <p className="text-[11px]" style={{ color: "#94A3B8" }}>{row.studentEmail}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: "#64748B" }}>
                        {row.nationality ?? row.studentCountry ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-sm capitalize" style={{ color: "#64748B" }}>
                        {row.programLevel?.replace(/_/g, " ") ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: "#64748B" }}>
                        {primaryUniversity(row)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>
                          {style.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>
                        {new Date(row.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono whitespace-nowrap" style={{ color: "#94A3B8" }}>
                        {row.applicationNumber}
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
