"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, XCircle, Clock, AlertCircle,
  MessageCircle, Save, User, GraduationCap, Phone, Loader2,
} from "lucide-react";

type StaffNote = { type: string; content: string; staffName: string; at: string };

type App = {
  id: string;
  applicationNumber: string;
  status: string;
  programLevel: string;
  scholarshipType: string;
  isUrgent: boolean;
  studentName: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  passportNumber: string;
  passportExpiry: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  university: string;
  universities: Array<{ universityName?: string }>;
  staffNotes: StaffNote[];
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
  student_confirms:       { bg: "#D1FAE5", color: "#065F46",  label: "Student Confirms" },
  university_deposit:     { bg: "#FEE2E2", color: "#991B1B",  label: "Univ. Deposit" },
  final_admission:        { bg: "#DCFCE7", color: "#166534",  label: "Final Admission" },
  student_accepts:        { bg: "#D1FAE5", color: "#065F46",  label: "Student Accepts" },
  service_charge_payment: { bg: "#FFEDD5", color: "#9A3412",  label: "Service Charge" },
  jw202_issued:           { bg: "#DBEAFE", color: "#1E40AF",  label: "JW202 Issued" },
  complete:               { bg: "#F0FDF4", color: "#14532D",  label: "Complete" },
  withdrawn:              { bg: "#F8FAFC", color: "#94A3B8",  label: "Withdrawn" },
  cancelled:              { bg: "#FEE2E2", color: "#991B1B",  label: "Cancelled" },
};

const PROGRAM_LABELS: Record<string, string> = {
  mbbs: "MBBS / Medicine", bachelor: "Bachelor's Degree", master: "Master's Degree",
  phd: "PhD", language: "Chinese Language", diploma: "Diploma",
  foundation: "Foundation", short_course: "Short Course",
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);
const WA = "https://wa.me/8615655031556";

export default function AppDetailClient({ app }: { app: App }) {
  const [status, setStatus] = useState(app.status);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(app.staffNotes);
  const [activeTab, setActiveTab] = useState<"info" | "notes">("info");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/applications/${app.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status !== app.status ? status : undefined,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");

      // Append note to local state
      if (note.trim()) {
        setNotes(prev => [...prev, {
          type: "staff_note",
          content: note.trim(),
          staffName: "You",
          at: new Date().toISOString(),
        }]);
        setNote("");
      }
      showToast("Changes saved");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setSaving(false);
    }
  }

  const st = STATUS_CONFIG[status] ?? STATUS_CONFIG["submitted"];

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: toast.ok ? "#166534" : "#C8102E" }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/staff"
          className="w-8 h-8 rounded-lg flex items-center justify-center border hover:bg-gray-50 transition-colors flex-shrink-0"
          style={{ borderColor: "#E2E8F0" }}
        >
          <ArrowLeft size={15} style={{ color: "#64748B" }} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>{app.studentName}</h1>
            <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
              {app.applicationNumber}
            </span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: st.bg, color: st.color }}
            >
              {st.label}
            </span>
            {app.isUrgent && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                Urgent
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            {PROGRAM_LABELS[app.programLevel] ?? app.programLevel} · {app.university} · Submitted {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: "#059669" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save
        </button>
      </div>

      <div className="gap-6" style={{ display: "grid", gridTemplateColumns: "1fr 300px" }}>
        {/* Left */}
        <div className="space-y-5">
          {/* Status update */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>
              Application Status
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map(s => {
                const cfg = STATUS_CONFIG[s];
                const active = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all"
                    style={
                      active
                        ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color }
                        : { borderColor: "#E2E8F0", backgroundColor: "white", color: "#64748B" }
                    }
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
            {(["info", "notes"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  activeTab === tab
                    ? { backgroundColor: "white", color: "#0A1628", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                    : { color: "#64748B" }
                }
              >
                {tab === "info" ? "Application Info" : `Notes (${notes.length})`}
              </button>
            ))}
          </div>

          {/* Info tab */}
          {activeTab === "info" && (
            <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Universities Applied To</p>
              {Array.isArray(app.universities) && app.universities.length > 0 ? (
                <div className="space-y-2">
                  {app.universities.map((u, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[11px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
                        #{i + 1}
                      </span>
                      <span className="text-sm" style={{ color: "#0A1628" }}>{u.universityName ?? "—"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#94A3B8" }}>No universities selected yet</p>
              )}

              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#94A3B8" }}>Scholarship</p>
                <span className="text-sm font-semibold capitalize" style={{ color: "#0A1628" }}>
                  {app.scholarshipType?.replace(/_/g, " ") ?? "—"}
                </span>
              </div>
            </div>
          )}

          {/* Notes tab */}
          {activeTab === "notes" && (
            <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Internal Staff Notes</p>

              {notes.length > 0 && (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {notes.map((n, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold" style={{ color: "#1B3A6B" }}>{n.staffName}</span>
                        <span className="text-[10px]" style={{ color: "#94A3B8" }}>
                          {new Date(n.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#475569" }}>{n.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <textarea
                  rows={4}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add internal note — visible to staff only, not the student…"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                  style={{ borderColor: "#E2E8F0" }}
                />
                <button
                  onClick={handleSave}
                  disabled={saving || !note.trim()}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ backgroundColor: "#059669" }}
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {[
            {
              title: "Student", icon: User,
              rows: [
                { label: "Full Name",    value: app.studentName },
                { label: "Nationality",  value: app.nationality },
                { label: "Date of Birth",value: app.dateOfBirth },
                { label: "Gender",       value: app.gender },
                { label: "Passport No.", value: app.passportNumber },
                { label: "Expiry",       value: app.passportExpiry },
              ],
            },
            {
              title: "Program", icon: GraduationCap,
              rows: [
                { label: "Program",      value: PROGRAM_LABELS[app.programLevel] ?? app.programLevel },
                { label: "University",   value: app.university },
                { label: "Scholarship",  value: app.scholarshipType?.replace(/_/g, " ") ?? "—" },
              ],
            },
            {
              title: "Contact", icon: Phone,
              rows: [
                { label: "Email",        value: app.email },
                { label: "Phone",        value: app.phone },
                { label: "City",         value: app.city },
                { label: "Country",      value: app.country },
              ],
            },
          ].map(section => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={14} style={{ color: "#059669" }} />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>{section.title}</p>
                </div>
                <div className="space-y-2">
                  {section.rows.map(row => (
                    <div key={row.label}>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{row.label}</p>
                      <p className="text-xs font-semibold mt-0.5 break-words" style={{ color: "#0A1628" }}>{row.value}</p>
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
              href={`${WA}?text=${encodeURIComponent(`Hi ${app.studentName.split(" ")[0]}, this is Globlearn Education regarding your application ${app.applicationNumber}. `)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={15} />WhatsApp Student
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: "#059669" }}
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save All Changes
            </button>
            <Link
              href="/staff"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}
            >
              <ArrowLeft size={14} />Back to Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
