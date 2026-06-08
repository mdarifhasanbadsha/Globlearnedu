"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, AlertCircle, CheckCircle2, FileText, Eye } from "lucide-react";

type Priority = "Urgent" | "Normal" | "Low";
type AppStatus =
  | "Under Review"
  | "Documents Required"
  | "Documents Approved"
  | "Admitted"
  | "Processing Visa"
  | "Rejected";

interface QueueItem {
  id: string;
  student: string;
  nationality: string;
  program: string;
  university: string;
  stage: string;
  status: AppStatus;
  assignedTo: string;
  submittedDate: string;
  lastUpdated: string;
  daysWaiting: number;
  priority: Priority;
  docsComplete: number;
  docsTotal: number;
}

const QUEUE: QueueItem[] = [
  { id: "MB20260515004", student: "Ahmed Khan",             nationality: "Pakistan",    program: "MBBS / Medicine",          university: "Wuhan University",              stage: "Document Review",      status: "Under Review",       assignedTo: "Fatima Malik",   submittedDate: "2026-05-15", lastUpdated: "2026-06-05", daysWaiting: 24, priority: "Urgent",  docsComplete: 5, docsTotal: 8 },
  { id: "B20260410002",  student: "Yasmin Hasan",           nationality: "Bangladesh", program: "Bachelor's Degree",         university: "Fudan University",              stage: "Document Review",      status: "Under Review",       assignedTo: "Fatima Malik",   submittedDate: "2026-04-10", lastUpdated: "2026-06-04", daysWaiting: 59, priority: "Urgent",  docsComplete: 6, docsTotal: 9 },
  { id: "DN20260305002", student: "Kavya Pillai",           nationality: "India",      program: "Dentistry",                 university: "China Medical University",      stage: "Pending Offer Letter", status: "Under Review",       assignedTo: "Li Wei",         submittedDate: "2026-03-05", lastUpdated: "2026-06-03", daysWaiting: 95, priority: "Urgent",  docsComplete: 8, docsTotal: 8 },
  { id: "L20260510001",  student: "Maria Santos",           nationality: "Philippines",program: "Language Program",          university: "BLCU",                          stage: "Awaiting Offer",       status: "Under Review",       assignedTo: "James Okonkwo",  submittedDate: "2026-05-10", lastUpdated: "2026-06-06", daysWaiting: 29, priority: "Normal",  docsComplete: 5, docsTotal: 6 },
  { id: "B20260425001",  student: "Jean-Pierre Nkurunziza", nationality: "Burundi",    program: "Bachelor's Degree",         university: "Huazhong University",           stage: "Docs Incomplete",      status: "Documents Required", assignedTo: "Fatima Malik",   submittedDate: "2026-04-25", lastUpdated: "2026-06-01", daysWaiting: 44, priority: "Urgent",  docsComplete: 4, docsTotal: 9 },
  { id: "P20260408001",  student: "Amodu Ibrahim",          nationality: "Nigeria",    program: "Foundation / Pre-University",university: "Tsinghua University",           stage: "Initial Review",       status: "Under Review",       assignedTo: "James Okonkwo",  submittedDate: "2026-04-08", lastUpdated: "2026-06-07", daysWaiting: 61, priority: "Normal",  docsComplete: 7, docsTotal: 8 },
  { id: "B20260528003",  student: "Kwame Asante",           nationality: "Ghana",      program: "Bachelor's Degree",         university: "Zhejiang University",           stage: "Offer Received",       status: "Documents Approved", assignedTo: "Li Wei",         submittedDate: "2026-05-28", lastUpdated: "2026-06-07", daysWaiting: 11, priority: "Normal",  docsComplete: 9, docsTotal: 9 },
  { id: "MB20260602001", student: "Rahima Hossain",         nationality: "Bangladesh", program: "MBBS / Medicine",          university: "Wuhan University",              stage: "Visa Application",     status: "Processing Visa",    assignedTo: "Priya Nair",    submittedDate: "2026-06-02", lastUpdated: "2026-06-07", daysWaiting: 6,  priority: "Normal",  docsComplete: 9, docsTotal: 9 },
  { id: "MB20260501002", student: "Fatimah Al-Rashidi",    nationality: "Saudi Arabia",program: "MBBS / Medicine",          university: "China Medical University",      stage: "Visa Application",     status: "Processing Visa",    assignedTo: "Priya Nair",    submittedDate: "2026-05-01", lastUpdated: "2026-06-06", daysWaiting: 38, priority: "Low",     docsComplete: 9, docsTotal: 9 },
  { id: "M20260520002",  student: "Sunita Patel",           nationality: "India",      program: "Master's Degree",           university: "Fudan University",              stage: "Admitted",             status: "Admitted",           assignedTo: "Li Wei",         submittedDate: "2026-05-20", lastUpdated: "2026-06-05", daysWaiting: 19, priority: "Low",     docsComplete: 9, docsTotal: 9 },
  { id: "M20260505001",  student: "Emmanuel Osei",          nationality: "Ghana",      program: "Master's Degree",           university: "Tongji University",             stage: "Admitted",             status: "Admitted",           assignedTo: "James Okonkwo",  submittedDate: "2026-05-05", lastUpdated: "2026-06-04", daysWaiting: 34, priority: "Low",     docsComplete: 9, docsTotal: 9 },
  { id: "DN20260420001", student: "Priya Sharma",           nationality: "India",      program: "Dentistry",                 university: "Wuhan University",              stage: "Admitted",             status: "Admitted",           assignedTo: "Fatima Malik",   submittedDate: "2026-04-20", lastUpdated: "2026-06-03", daysWaiting: 49, priority: "Low",     docsComplete: 9, docsTotal: 9 },
];

const STATUS_CONFIG: Record<AppStatus, { bg: string; color: string; label: string }> = {
  "Under Review":       { bg: "#FEF9C3", color: "#854D0E", label: "Under Review" },
  "Documents Required": { bg: "#FFEDD5", color: "#9A3412", label: "Docs Required" },
  "Documents Approved": { bg: "#D1FAE5", color: "#065F46", label: "Docs Approved" },
  "Admitted":           { bg: "#DCFCE7", color: "#166534", label: "Admitted" },
  "Processing Visa":    { bg: "#DBEAFE", color: "#1E40AF", label: "Processing Visa" },
  "Rejected":           { bg: "#FEE2E2", color: "#991B1B", label: "Rejected" },
};

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string }> = {
  Urgent: { color: "#991B1B", bg: "#FEE2E2" },
  Normal: { color: "#1E40AF", bg: "#DBEAFE" },
  Low:    { color: "#475569", bg: "#F1F5F9" },
};

const STAFF_MEMBERS = ["All Staff", "Li Wei", "Fatima Malik", "James Okonkwo", "Priya Nair"];
const STATUS_FILTERS: ("All" | AppStatus)[] = ["All", "Under Review", "Documents Required", "Documents Approved", "Processing Visa", "Admitted"];

export default function StaffQueuePage() {
  const [search, setSearch] = useState("");
  const [staffFilter, setStaffFilter] = useState("All Staff");
  const [statusFilter, setStatusFilter] = useState<"All" | AppStatus>("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return QUEUE.filter((item) => {
      const matchSearch =
        !q ||
        item.student.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.nationality.toLowerCase().includes(q) ||
        item.program.toLowerCase().includes(q);
      const matchStaff = staffFilter === "All Staff" || item.assignedTo === staffFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchStaff && matchStatus;
    });
  }, [search, staffFilter, statusFilter]);

  const urgent = QUEUE.filter((q) => q.priority === "Urgent").length;
  const underReview = QUEUE.filter((q) => q.status === "Under Review").length;
  const docsRequired = QUEUE.filter((q) => q.status === "Documents Required").length;
  const visaProcessing = QUEUE.filter((q) => q.status === "Processing Visa").length;

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Application Queue</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {QUEUE.length} applications assigned · {urgent} urgent
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Urgent",           value: urgent,        bg: "#FEE2E2", color: "#991B1B", icon: AlertCircle },
          { label: "Under Review",     value: underReview,   bg: "#FEF9C3", color: "#854D0E", icon: FileText },
          { label: "Docs Required",    value: docsRequired,  bg: "#FFEDD5", color: "#9A3412", icon: Clock },
          { label: "Processing Visa",  value: visaProcessing,bg: "#DBEAFE", color: "#1E40AF", icon: CheckCircle2 },
        ].map((card) => {
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
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search student name, app ID, nationality, program…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none"
            style={{ borderColor: "#E2E8F0" }}
          />
        </div>
        <select
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {STAFF_MEMBERS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "All" | AppStatus)}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {STATUS_FILTERS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Queue table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                {["Priority", "App ID", "Student", "Program", "Stage", "Status", "Assigned To", "Waiting", "Docs", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const st = STATUS_CONFIG[item.status];
                const pr = PRIORITY_CONFIG[item.priority];
                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-gray-50"
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                  >
                    <td className="px-4 py-3.5">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: pr.bg, color: pr.color }}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-bold" style={{ color: "#1B3A6B" }}>
                      {item.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-sm" style={{ color: "#0A1628" }}>{item.student}</p>
                      <p className="text-[11px]" style={{ color: "#94A3B8" }}>{item.nationality}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: "#64748B" }}>{item.program}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: "#475569" }}>{item.stage}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: "#64748B" }}>{item.assignedTo}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs font-bold"
                        style={{ color: item.daysWaiting > 30 ? "#991B1B" : item.daysWaiting > 14 ? "#9A3412" : "#475569" }}
                      >
                        {item.daysWaiting}d
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: "#F1F5F9" }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${Math.round((item.docsComplete / item.docsTotal) * 100)}%`,
                              backgroundColor: item.docsComplete === item.docsTotal ? "#059669" : "#F59E0B",
                            }}
                          />
                        </div>
                        <span className="text-[11px]" style={{ color: "#94A3B8" }}>
                          {item.docsComplete}/{item.docsTotal}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/staff/applications/${item.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
                        style={{ backgroundColor: "#059669" }}
                      >
                        <Eye size={12} />
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
          <p className="text-xs" style={{ color: "#94A3B8" }}>Showing {filtered.length} of {QUEUE.length} applications</p>
        </div>
      </div>
    </div>
  );
}
