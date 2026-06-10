"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Eye, Edit2, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";

const DB_STATUS_VALUES = [
  "submitted", "under_review", "documents_approved", "applied_per_university",
  "processing", "interview", "pre_admission", "student_confirms",
  "university_deposit", "final_admission", "student_accepts",
  "service_charge_payment", "jw202_issued", "complete", "withdrawn", "cancelled",
] as const;

type DbStatus = (typeof DB_STATUS_VALUES)[number];

const STATUS_CONFIG: Record<DbStatus, { label: string; bg: string; color: string }> = {
  submitted:              { label: "Submitted",          bg: "#F1F5F9", color: "#475569" },
  under_review:           { label: "Under Review",       bg: "#FEF9C3", color: "#854D0E" },
  documents_approved:     { label: "Docs Approved",      bg: "#D1FAE5", color: "#065F46" },
  applied_per_university: { label: "Applied",            bg: "#DBEAFE", color: "#1E40AF" },
  processing:             { label: "Processing",         bg: "#E0E7FF", color: "#3730A3" },
  interview:              { label: "Interview",          bg: "#FCE7F3", color: "#9D174D" },
  pre_admission:          { label: "Pre-Admission",      bg: "#FEF3C7", color: "#92400E" },
  student_confirms:       { label: "Student Confirms",   bg: "#D1FAE5", color: "#065F46" },
  university_deposit:     { label: "Univ. Deposit",      bg: "#FEE2E2", color: "#991B1B" },
  final_admission:        { label: "Final Admission",    bg: "#DCFCE7", color: "#166534" },
  student_accepts:        { label: "Student Accepts",    bg: "#D1FAE5", color: "#065F46" },
  service_charge_payment: { label: "Service Charge",     bg: "#FFEDD5", color: "#9A3412" },
  jw202_issued:           { label: "JW202 Issued",       bg: "#DBEAFE", color: "#1E40AF" },
  complete:               { label: "Complete",           bg: "#F0FDF4", color: "#14532D" },
  withdrawn:              { label: "Withdrawn",          bg: "#F8FAFC", color: "#94A3B8" },
  cancelled:              { label: "Cancelled",          bg: "#FEE2E2", color: "#991B1B" },
};

interface AppRow {
  id: string;
  applicationNumber: string;
  status: DbStatus;
  programLevel: string | null;
  selectedUniversities: Array<{ universityName: string }> | unknown;
  passportSurname: string | null;
  passportGivenName: string | null;
  nationality: string | null;
  isUrgent: boolean | null;
  depositPaid: boolean | null;
  createdAt: string;
  studentEmail: string | null;
  studentFirstName: string | null;
  studentLastName: string | null;
  studentCountry: string | null;
}

function studentName(row: AppRow) {
  if (row.passportGivenName && row.passportSurname) return `${row.passportGivenName} ${row.passportSurname}`;
  if (row.studentFirstName && row.studentLastName) return `${row.studentFirstName} ${row.studentLastName}`;
  return row.studentEmail ?? "—";
}

function primaryUniversity(row: AppRow) {
  const univs = row.selectedUniversities as Array<{ universityName: string }>;
  return Array.isArray(univs) && univs.length > 0 ? univs[0].universityName : "—";
}

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<DbStatus>("under_review");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/applications");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRows(data.applications);
      setTotal(data.total);
    } catch {
      setError("Could not load applications. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.applicationNumber.toLowerCase().includes(q) ||
        studentName(r).toLowerCase().includes(q) ||
        (r.nationality ?? "").toLowerCase().includes(q) ||
        (r.studentEmail ?? "").toLowerCase().includes(q) ||
        (r.programLevel ?? "").toLowerCase().includes(q) ||
        primaryUniversity(r).toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    DB_STATUS_VALUES.forEach((s) => { c[s] = rows.filter((r) => r.status === s).length; });
    return c;
  }, [rows]);

  async function saveStatus(id: string, status: DbStatus) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      setEditingId(null);
    } catch {
      alert("Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  const topStatuses: DbStatus[] = ["under_review", "documents_approved", "applied_per_university", "processing", "complete"];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Applications</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {loading ? "Loading…" : `${total} total applications`}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors"
          style={{ borderColor: "#E2E8F0", color: "#475569", backgroundColor: "white" }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl p-4 text-sm" style={{ backgroundColor: "#FEF2F2", color: "#C8102E" }}>
          <AlertTriangle size={15} />
          {error}
        </div>
      )}

      {/* Status chips — top statuses only to avoid overflow */}
      <div className="flex gap-2 flex-wrap">
        {[{ key: "all", label: "All" }, ...topStatuses.map((s) => ({ key: s, label: STATUS_CONFIG[s].label }))].map(({ key, label }) => {
          const active = statusFilter === key;
          const cfg = STATUS_CONFIG[key as DbStatus];
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

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
        <input
          type="text"
          placeholder="Search student name, app ID, nationality, university…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0" }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw size={20} className="animate-spin mx-auto mb-2" style={{ color: "#94A3B8" }} />
            <p className="text-sm" style={{ color: "#94A3B8" }}>Loading applications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold" style={{ color: "#94A3B8" }}>No applications match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                  {["App ID", "Student", "Program", "University", "Country", "Status", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => {
                  const cfg = STATUS_CONFIG[row.status] ?? { label: row.status, bg: "#F1F5F9", color: "#64748B" };
                  const isEditing = editingId === row.id;
                  return (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: "#1B3A6B" }}>
                        <div className="flex items-center gap-1.5">
                          {row.isUrgent && <span title="Urgent" style={{ color: "#C8102E" }}>●</span>}
                          {row.applicationNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#0A1628" }}>
                        {studentName(row)}
                        {row.studentEmail && (
                          <p className="text-[11px] font-normal" style={{ color: "#94A3B8" }}>{row.studentEmail}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs capitalize" style={{ color: "#64748B" }}>
                        {row.programLevel?.replace(/_/g, " ") ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                        {primaryUniversity(row)}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#64748B" }}>
                        {row.nationality ?? row.studentCountry ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value as DbStatus)}
                              className="border rounded-lg px-2 py-1 text-xs bg-white focus:outline-none"
                              style={{ borderColor: "#E2E8F0" }}
                            >
                              {DB_STATUS_VALUES.map((s) => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => saveStatus(row.id, editStatus)}
                              disabled={saving}
                              className="text-[11px] font-bold px-2 py-1 rounded-lg text-white disabled:opacity-50"
                              style={{ backgroundColor: "#1B3A6B" }}
                            >
                              {saving ? "…" : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-[11px] font-bold px-2 py-1 rounded-lg"
                              style={{ color: "#64748B" }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>
                        {new Date(row.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/staff/applications/${row.id}`}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                            title="View"
                          >
                            <Eye size={13} style={{ color: "#64748B" }} />
                          </Link>
                          <button
                            onClick={() => { setEditingId(row.id); setEditStatus(row.status); }}
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

        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Showing {filtered.length} of {total} applications
          </p>
        </div>
      </div>
    </div>
  );
}
