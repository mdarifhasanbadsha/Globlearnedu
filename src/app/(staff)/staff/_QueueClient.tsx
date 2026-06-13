"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, AlertCircle, FileText, CheckCircle2, Eye, Edit2, RefreshCw, MessageSquare, FileDown, Archive } from "lucide-react";

type QueueItem = {
  id: string;
  applicationNumber: string;
  status: string;
  programLevel: string;
  nationality: string;
  isUrgent: boolean;
  assignedStaffId: string | null;
  assignedStaffName: string;
  studentName: string;
  email: string;
  passportNumber: string;
  passportName: string | null;
  university: string;
  expectedMajors: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  submitted:              { bg: "#F1F5F9", color: "#475569",  label: "Submitted" },
  under_review:           { bg: "#FEF9C3", color: "#854D0E",  label: "Under Review" },
  documents_approved:     { bg: "#D1FAE5", color: "#065F46",  label: "Docs Approved" },
  applied_per_university: { bg: "#DBEAFE", color: "#1E40AF",  label: "Applied" },
  processing:             { bg: "#E0E7FF", color: "#3730A3",  label: "Processing" },
  interview:              { bg: "#FCE7F3", color: "#9D174D",  label: "Interview" },
  pre_admission:          { bg: "#FEF3C7", color: "#92400E",  label: "Pre-Admission" },
  student_confirms:       { bg: "#D1FAE5", color: "#065F46",  label: "Confirmed" },
  final_admission:        { bg: "#DCFCE7", color: "#166534",  label: "Final Admission" },
  complete:               { bg: "#F0FDF4", color: "#14532D",  label: "Complete" },
  withdrawn:              { bg: "#F8FAFC", color: "#94A3B8",  label: "Withdrawn" },
  cancelled:              { bg: "#FEE2E2", color: "#991B1B",  label: "Cancelled" },
};

const PROGRAM_LABELS: Record<string, string> = {
  mbbs: "MBBS / Medicine", bachelor: "Bachelor's", master: "Master's",
  phd: "PhD", language: "Language", diploma: "Diploma",
  foundation: "Foundation", short_course: "Short Course",
};

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

export default function StaffQueueClient({
  queue, isAdmin, currentUserId, staffList,
}: {
  queue: QueueItem[];
  isAdmin: boolean;
  currentUserId: string;
  staffList: { userId: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return queue.filter(item => {
      const matchSearch = !q
        || item.studentName.toLowerCase().includes(q)
        || item.applicationNumber.toLowerCase().includes(q)
        || item.nationality.toLowerCase().includes(q)
        || item.programLevel.toLowerCase().includes(q)
        || item.university.toLowerCase().includes(q)
        || item.email.toLowerCase().includes(q)
        || item.passportNumber.toLowerCase().includes(q)
        || (item.passportName ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchStaff = staffFilter === "all"
        || (staffFilter === "mine" && item.assignedStaffId === currentUserId)
        || item.assignedStaffId === staffFilter;
      return matchSearch && matchStatus && matchStaff;
    });
  }, [queue, search, statusFilter, staffFilter, currentUserId]);

  const urgent    = queue.filter(q => q.isUrgent).length;
  const review    = queue.filter(q => q.status === "under_review").length;
  const docsIssue = queue.filter(q => ["submitted"].includes(q.status)).length;
  const active    = queue.filter(q => !["complete", "withdrawn", "cancelled"].includes(q.status)).length;

  const statuses = [...new Set(queue.map(q => q.status))].sort();

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Application Queue</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          {queue.length} applications · {urgent} urgent
          {isAdmin ? " · all staff" : " · assigned to you"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Urgent",       value: urgent,    bg: "#FEE2E2", color: "#991B1B", icon: AlertCircle },
          { label: "Under Review", value: review,    bg: "#FEF9C3", color: "#854D0E", icon: FileText },
          { label: "Submitted",    value: docsIssue, bg: "#FFEDD5", color: "#9A3412", icon: Clock },
          { label: "Active",       value: active,    bg: "#DBEAFE", color: "#1E40AF", icon: CheckCircle2 },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border p-5 flex items-center gap-4" style={{ borderColor: "#E2E8F0" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.bg }}>
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "#0A1628" }}>{card.value}</p>
                <p className="text-xs font-semibold" style={{ color: "#64748B" }}>{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search name, passport no., email, app ID, university…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none"
            style={{ borderColor: "#E2E8F0" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          <option value="all">All statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
          ))}
        </select>
        {isAdmin && (
          <select
            value={staffFilter}
            onChange={e => setStaffFilter(e.target.value)}
            className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
            style={{ borderColor: "#E2E8F0", color: "#475569" }}
          >
            <option value="all">All staff</option>
            <option value="mine">Mine only</option>
            {staffList.map(s => (
              <option key={s.userId} value={s.userId}>{s.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-semibold" style={{ color: "#94A3B8" }}>
            {queue.length === 0
              ? "No applications assigned to you yet."
              : "No applications match your filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                  {["App ID", "Student", "Program", "University", "Expected Major", "Status", "Assigned To", "Updated", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const st = STATUS_CONFIG[item.status] ?? { bg: "#F1F5F9", color: "#475569", label: item.status };
                  const days = daysAgo(item.updatedAt);
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                    >
                      <td className="px-4 py-3.5 font-mono text-xs font-bold" style={{ color: "#1B3A6B" }}>
                        <div className="flex items-center gap-1.5">
                          {item.isUrgent && <span style={{ color: "#C8102E" }} title="Urgent">●</span>}
                          {item.applicationNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-sm" style={{ color: "#0A1628" }}>
                          {item.passportName || item.studentName}
                        </p>
                        {item.passportName && item.passportName !== item.studentName && (
                          <p className="text-[11px]" style={{ color: "#64748B" }}>{item.studentName}</p>
                        )}
                        <p className="text-[11px]" style={{ color: "#94A3B8" }}>{item.nationality}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs capitalize" style={{ color: "#64748B" }}>
                        {PROGRAM_LABELS[item.programLevel] ?? item.programLevel}
                      </td>
                      <td className="px-4 py-3.5 text-xs" style={{ color: "#64748B" }}>{item.university}</td>
                      <td className="px-4 py-3.5 text-xs" style={{ color: "#64748B" }}>
                        {item.expectedMajors || <span style={{ color: "#CBD5E1" }}>—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs" style={{ color: "#64748B" }}>
                        {item.assignedStaffName}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-xs font-bold"
                          style={{ color: days > 30 ? "#991B1B" : days > 14 ? "#9A3412" : "#475569" }}
                        >
                          {days}d ago
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/staff/applications/${item.id}`}
                            title="View & Review"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white"
                            style={{ backgroundColor: "#059669" }}
                          >
                            <Eye size={11} />View
                          </Link>
                          <Link
                            href={`/staff/applications/${item.id}/edit`}
                            title="Edit Application"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border"
                            style={{ borderColor: "#E2E8F0", color: "#1B3A6B" }}
                          >
                            <Edit2 size={11} />Edit
                          </Link>
                          <a
                            href={`/api/staff/applications/${item.id}/pdf`}
                            title="Download PDF"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border"
                            style={{ borderColor: "#E2E8F0", color: "#64748B" }}
                          >
                            <FileDown size={11} />PDF
                          </a>
                          <a
                            href={`/api/staff/applications/${item.id}/zip`}
                            title="Download ZIP"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border"
                            style={{ borderColor: "#E2E8F0", color: "#64748B" }}
                          >
                            <Archive size={11} />ZIP
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3" style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
            <p className="text-xs" style={{ color: "#94A3B8" }}>
              Showing {filtered.length} of {queue.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
