"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, XCircle, Clock, AlertCircle,
  MessageCircle, Save, User, GraduationCap, FileText,
  CreditCard, Globe, Phone,
} from "lucide-react";

type DocStatus = "approved" | "rejected" | "pending" | "missing";
type AppStatus = "Under Review" | "Documents Required" | "Documents Approved" | "Admitted" | "Processing Visa" | "Rejected" | "Complete";

interface Document {
  id: string;
  name: string;
  status: DocStatus;
  note: string;
}

const APP_DATA: Record<string, {
  student: string; nationality: string; dob: string; gender: string; passport: string;
  program: string; university: string; degree: string; funding: string;
  email: string; whatsapp: string; city: string;
  partner: string; assignedTo: string; submittedDate: string; status: AppStatus;
  stage: string; documents: Document[];
}> = {
  "MB20260515004": {
    student: "Ahmed Khan", nationality: "Pakistan", dob: "2002-03-15", gender: "Male", passport: "AB1234567",
    program: "MBBS / Medicine", university: "Wuhan University", degree: "MBBS / Medicine", funding: "CSC Scholarship",
    email: "ahmed.khan@email.com", whatsapp: "+923001234567", city: "Lahore",
    partner: "South Asia Study Abroad", assignedTo: "Fatima Malik", submittedDate: "2026-05-15", status: "Under Review",
    stage: "Document Review",
    documents: [
      { id: "1", name: "Passport (valid 6+ months)", status: "approved", note: "" },
      { id: "2", name: "Secondary School Certificate", status: "approved", note: "" },
      { id: "3", name: "High School Diploma / A-Levels", status: "approved", note: "" },
      { id: "4", name: "Transcripts (certified)", status: "pending", note: "" },
      { id: "5", name: "Personal Statement", status: "approved", note: "" },
      { id: "6", name: "Medical Certificate (health exam)", status: "rejected", note: "Form must be completed by a licensed physician — resubmit." },
      { id: "7", name: "Police Clearance Certificate", status: "pending", note: "" },
      { id: "8", name: "Passport-size Photo (white background)", status: "approved", note: "" },
    ],
  },
  "B20260425001": {
    student: "Jean-Pierre Nkurunziza", nationality: "Burundi", dob: "2001-07-22", gender: "Male", passport: "BP7654321",
    program: "Bachelor's Degree", university: "Huazhong University", degree: "Bachelor's Degree", funding: "University Scholarship",
    email: "jp.nkurunziza@email.com", whatsapp: "+25761234567", city: "Bujumbura",
    partner: "East Africa Study Group", assignedTo: "Fatima Malik", submittedDate: "2026-04-25", status: "Documents Required",
    stage: "Docs Incomplete",
    documents: [
      { id: "1", name: "Passport (valid 6+ months)", status: "approved", note: "" },
      { id: "2", name: "Secondary School Certificate", status: "approved", note: "" },
      { id: "3", name: "High School Diploma", status: "missing", note: "Not yet submitted." },
      { id: "4", name: "Transcripts (certified)", status: "pending", note: "" },
      { id: "5", name: "Personal Statement", status: "rejected", note: "Too short — minimum 500 words required." },
      { id: "6", name: "Two Recommendation Letters", status: "missing", note: "Not yet submitted." },
      { id: "7", name: "Medical Certificate", status: "missing", note: "Not yet submitted." },
      { id: "8", name: "Police Clearance Certificate", status: "missing", note: "Not yet submitted." },
      { id: "9", name: "Passport-size Photo (white background)", status: "approved", note: "" },
    ],
  },
};

const FALLBACK_APP = {
  student: "Student", nationality: "—", dob: "—", gender: "—", passport: "—",
  program: "—", university: "—", degree: "—", funding: "—",
  email: "—", whatsapp: "—", city: "—",
  partner: "—", assignedTo: "—", submittedDate: "—", status: "Under Review" as AppStatus,
  stage: "Initial Review",
  documents: [
    { id: "1", name: "Passport (valid 6+ months)", status: "pending" as DocStatus, note: "" },
    { id: "2", name: "Academic Transcripts", status: "pending" as DocStatus, note: "" },
    { id: "3", name: "Personal Statement", status: "pending" as DocStatus, note: "" },
    { id: "4", name: "Medical Certificate", status: "pending" as DocStatus, note: "" },
    { id: "5", name: "Police Clearance Certificate", status: "pending" as DocStatus, note: "" },
    { id: "6", name: "Passport-size Photo", status: "pending" as DocStatus, note: "" },
  ],
};

const DOC_CONFIG: Record<DocStatus, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  approved: { label: "Approved",  bg: "#DCFCE7", color: "#166534", icon: <CheckCircle2 size={14} /> },
  rejected: { label: "Rejected",  bg: "#FEE2E2", color: "#991B1B", icon: <XCircle size={14} /> },
  pending:  { label: "Pending",   bg: "#FEF9C3", color: "#854D0E", icon: <Clock size={14} /> },
  missing:  { label: "Missing",   bg: "#F1F5F9", color: "#475569", icon: <AlertCircle size={14} /> },
};

const APP_STATUSES: AppStatus[] = [
  "Under Review", "Documents Required", "Documents Approved",
  "Admitted", "Processing Visa", "Rejected", "Complete",
];

const WA = "https://wa.me/8615655031556";

export default function ApplicationDetailPage() {
  const params = useParams();
  const appId = typeof params.id === "string" ? params.id : "";
  const raw = APP_DATA[appId] ?? FALLBACK_APP;

  const [docs, setDocs] = useState<Document[]>(raw.documents);
  const [appStatus, setAppStatus] = useState<AppStatus>(raw.status);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<"docs" | "notes">("docs");

  function setDocStatus(id: string, status: DocStatus) {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }

  function setDocNote(id: string, note: string) {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, note } : d)));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const approvedCount = docs.filter((d) => d.status === "approved").length;
  const rejectedCount = docs.filter((d) => d.status === "rejected").length;
  const pendingCount = docs.filter((d) => d.status === "pending").length;
  const missingCount = docs.filter((d) => d.status === "missing").length;

  const STATUS_BADGE: Record<AppStatus, { bg: string; color: string }> = {
    "Under Review":       { bg: "#FEF9C3", color: "#854D0E" },
    "Documents Required": { bg: "#FFEDD5", color: "#9A3412" },
    "Documents Approved": { bg: "#D1FAE5", color: "#065F46" },
    "Admitted":           { bg: "#DCFCE7", color: "#166534" },
    "Processing Visa":    { bg: "#DBEAFE", color: "#1E40AF" },
    "Rejected":           { bg: "#FEE2E2", color: "#991B1B" },
    "Complete":           { bg: "#F0FDF4", color: "#14532D" },
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/staff"
          className="w-8 h-8 rounded-lg flex items-center justify-center border hover:bg-gray-50 transition-colors"
          style={{ borderColor: "#E2E8F0" }}
        >
          <ArrowLeft size={15} style={{ color: "#64748B" }} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>
              {raw.student}
            </h1>
            <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
              {appId}
            </span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: STATUS_BADGE[appStatus].bg, color: STATUS_BADGE[appStatus].color }}
            >
              {appStatus}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            {raw.program} · {raw.university} · Submitted {raw.submittedDate}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#059669" }}
        >
          <Save size={14} />
          Save Changes
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#DCFCE7", border: "1px solid #86EFAC" }}>
          <CheckCircle2 size={16} style={{ color: "#166534" }} />
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>Changes saved successfully.</p>
        </div>
      )}

      <div className="gap-6" style={{ display: "grid", gridTemplateColumns: "1fr 300px" }}>
        {/* Left: main content */}
        <div className="space-y-5">
          {/* Status update */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>Application Status</p>
            <div className="flex flex-wrap gap-2">
              {APP_STATUSES.map((s) => {
                const active = appStatus === s;
                const badge = STATUS_BADGE[s];
                return (
                  <button
                    key={s}
                    onClick={() => setAppStatus(s)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all"
                    style={
                      active
                        ? { borderColor: badge.color, backgroundColor: badge.bg, color: badge.color }
                        : { borderColor: "#E2E8F0", backgroundColor: "white", color: "#64748B" }
                    }
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
            {(["docs", "notes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  activeSection === tab
                    ? { backgroundColor: "white", color: "#0A1628", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                    : { color: "#64748B" }
                }
              >
                {tab === "docs" ? `Documents (${docs.length})` : "Internal Notes"}
              </button>
            ))}
          </div>

          {/* Documents */}
          {activeSection === "docs" && (
            <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
              {/* Doc summary */}
              <div className="flex gap-4 px-5 py-3" style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                {[
                  { label: "Approved", count: approvedCount, color: "#166534", bg: "#DCFCE7" },
                  { label: "Rejected", count: rejectedCount, color: "#991B1B", bg: "#FEE2E2" },
                  { label: "Pending",  count: pendingCount,  color: "#854D0E", bg: "#FEF9C3" },
                  { label: "Missing",  count: missingCount,  color: "#475569", bg: "#F1F5F9" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="text-sm font-black" style={{ color: s.color }}>{s.count}</span>
                    <span className="text-xs" style={{ color: "#94A3B8" }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Doc rows */}
              <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
                {docs.map((doc) => {
                  const cfg = DOC_CONFIG[doc.status];
                  return (
                    <div key={doc.id} className="px-5 py-4">
                      <div className="flex items-start gap-4">
                        {/* Doc name + status badge */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{doc.name}</p>
                            <span
                              className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: cfg.bg, color: cfg.color }}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </span>
                          </div>

                          {/* Status buttons */}
                          <div className="flex gap-1.5 flex-wrap">
                            {(["approved", "rejected", "pending", "missing"] as DocStatus[]).map((s) => (
                              <button
                                key={s}
                                onClick={() => setDocStatus(doc.id, s)}
                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all capitalize"
                                style={
                                  doc.status === s
                                    ? { borderColor: DOC_CONFIG[s].color, backgroundColor: DOC_CONFIG[s].bg, color: DOC_CONFIG[s].color }
                                    : { borderColor: "#E2E8F0", backgroundColor: "white", color: "#94A3B8" }
                                }
                              >
                                {s}
                              </button>
                            ))}
                          </div>

                          {/* Note field (show if rejected or missing) */}
                          {(doc.status === "rejected" || doc.status === "missing") && (
                            <input
                              type="text"
                              placeholder="Add note for student (e.g. what to resubmit)…"
                              value={doc.note}
                              onChange={(e) => setDocNote(doc.id, e.target.value)}
                              className="mt-2 w-full border rounded-lg px-3 py-2 text-xs bg-white focus:outline-none"
                              style={{ borderColor: "#FECACA", backgroundColor: "#FEF2F2", color: "#991B1B" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {activeSection === "notes" && (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>
                Internal Staff Notes
              </p>
              <textarea
                className="w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#059669] transition-colors resize-none"
                style={{ borderColor: "#E2E8F0" }}
                rows={8}
                placeholder="Add internal notes about this application — visible to staff only, not the student…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "#F0FDF4", border: "1px solid #86EFAC" }}>
                <p className="text-xs font-semibold" style={{ color: "#166534" }}>
                  Stage: {raw.stage} · Assigned to: {raw.assignedTo} · Partner: {raw.partner}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar: student info + actions */}
        <div className="space-y-4">
          {/* Student details */}
          {[
            {
              title: "Student", icon: User,
              rows: [
                { label: "Full Name", value: raw.student },
                { label: "Nationality", value: raw.nationality },
                { label: "Date of Birth", value: raw.dob },
                { label: "Gender", value: raw.gender },
                { label: "Passport No.", value: raw.passport },
              ],
            },
            {
              title: "Program", icon: GraduationCap,
              rows: [
                { label: "Program", value: raw.program },
                { label: "University", value: raw.university },
                { label: "Funding", value: raw.funding },
              ],
            },
            {
              title: "Contact", icon: Phone,
              rows: [
                { label: "Email", value: raw.email },
                { label: "WhatsApp", value: raw.whatsapp },
                { label: "City", value: raw.city },
              ],
            },
          ].map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={14} style={{ color: "#059669" }} />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>
                    {section.title}
                  </p>
                </div>
                <div className="space-y-2">
                  {section.rows.map((row) => (
                    <div key={row.label}>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{row.label}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: "#0A1628" }}>{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border p-5 space-y-2" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>Quick Actions</p>
            <a
              href={`${WA}?text=${encodeURIComponent(`Hi ${raw.student.split(" ")[0]}, this is Globlearn Education regarding your application ${appId}. `)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={15} />
              WhatsApp Student
            </a>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#059669" }}
            >
              <Save size={15} />
              Save All Changes
            </button>
            <Link
              href="/staff"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}
            >
              <ArrowLeft size={14} />
              Back to Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
