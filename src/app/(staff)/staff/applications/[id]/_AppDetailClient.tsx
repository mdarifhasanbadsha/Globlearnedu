"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Copy, Check, ChevronDown, ChevronRight,
  MessageCircle, Save, Loader2, AlertTriangle, ExternalLink,
  RefreshCw, X,
} from "lucide-react";

type StaffNote = { type: string; content: string; staffName: string; at: string };

type Target = {
  id: string;
  universityName: string;
  programName: string | null;
  expectedMajor: string | null;
  intake: string | null;
  targetStatus: string;
  admissionNoticeUrl: string | null;
  jw202Url: string | null;
  priority: number;
  updatedAt: string;
};

const TARGET_STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  pending:          { bg: "#F1F5F9", color: "#475569",  label: "Pending" },
  applied:          { bg: "#DBEAFE", color: "#1E40AF",  label: "Applied" },
  pre_admission:    { bg: "#FEF3C7", color: "#92400E",  label: "Pre-Admission" },
  interview:        { bg: "#FCE7F3", color: "#9D174D",  label: "Interview" },
  admission_notice: { bg: "#D1FAE5", color: "#065F46",  label: "Admission Notice" },
  final_admission:  { bg: "#DCFCE7", color: "#166534",  label: "Final Admission" },
  rejected:         { bg: "#FEE2E2", color: "#991B1B",  label: "Rejected" },
  deferred:         { bg: "#FFEDD5", color: "#9A3412",  label: "Deferred" },
  withdrawn:        { bg: "#F8FAFC", color: "#94A3B8",  label: "Withdrawn" },
};

type App = {
  id: string;
  applicationNumber: string;
  status: string;
  programLevel: string;
  scholarshipType: string | null;
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
  universities: Array<{ universityName?: string; programName?: string; expectedMajor?: string }>;
  academicHistory: Array<Record<string, string>>;
  workExperience: Array<Record<string, string>>;
  englishProficiency: Record<string, string>;
  chineseProficiency: Record<string, string>;
  parentInfo: Record<string, string>;
  sponsorInfo: Record<string, string>;
  documents: Record<string, string>;
  depositPaid: boolean;
  serviceChargePaid: boolean;
  partnerName: string;
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

const DOC_LABELS: Record<string, string> = {
  passport: "Passport Copy",
  photo: "Passport Photo",
  highschool_certificate: "High School Certificate",
  highschool_transcript: "High School Transcript",
  bachelor_certificate: "Bachelor's Certificate",
  bachelor_transcript: "Bachelor's Transcript",
  language_certificate: "Language Certificate",
  medical_certificate: "Medical Certificate",
  financial_statement: "Financial Statement",
  recommendation_letter: "Recommendation Letter",
  cv: "CV / Resume",
  research_proposal: "Research Proposal",
};

const WA_NUMBER = "8615655031556";

// ── Collapsible section card ─────────────────────────────
function Section({
  title, defaultOpen = true, children,
}: {
  title: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>{title}</span>
        {open
          ? <ChevronDown size={14} style={{ color: "#CBD5E1" }} />
          : <ChevronRight size={14} style={{ color: "#CBD5E1" }} />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

// ── Copy-to-clipboard field ───────────────────────────────
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    if (value === "—") return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [value]);

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{label}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <p className="text-xs font-semibold break-all" style={{ color: "#0A1628" }}>{value}</p>
        {value !== "—" && (
          <button onClick={copy} className="flex-shrink-0 p-0.5 rounded hover:bg-gray-100 transition-colors">
            {copied
              ? <Check size={11} style={{ color: "#059669" }} />
              : <Copy size={11} style={{ color: "#CBD5E1" }} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Plain field (no copy) ────────────────────────────────
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{label}</p>
      <p className="text-xs font-semibold mt-0.5 break-words" style={{ color: "#0A1628" }}>{value || "—"}</p>
    </div>
  );
}

function fmt(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
}

export default function AppDetailClient({ app, targets: initialTargets }: { app: App; targets: Target[] }) {
  const [status,    setStatus]    = useState(app.status);
  const [note,      setNote]      = useState("");
  const [notes,     setNotes]     = useState(app.staffNotes);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null);
  const [appNumCopied, setAppNumCopied] = useState(false);

  // Target status state
  const [targets, setTargets] = useState<Target[]>(initialTargets);

  // Change Status modal state
  const [statusModal, setStatusModal] = useState<{ open: boolean; target: Target | null }>({ open: false, target: null });
  const [newTargetStatus, setNewTargetStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [visibleToStudent, setVisibleToStudent] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);

  const st = STATUS_CONFIG[status] ?? STATUS_CONFIG["submitted"];
  const isSubmitted = status === "submitted";

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function callApi(payload: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/applications/${app.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      if (payload.note && typeof payload.note === "string") {
        setNotes(prev => [...prev, {
          type: "staff_note",
          content: payload.note as string,
          staffName: "You",
          at: new Date().toISOString(),
        }]);
        setNote("");
      }
      showToast(payload.status ? "Status updated" : "Note saved");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setSaving(false);
    }
  }

  function handleStartReview() {
    setStatus("under_review");
    callApi({ status: "under_review" });
  }

  function handleSaveStatus() {
    callApi({ status: status !== app.status ? status : undefined, note: note.trim() || undefined });
  }

  function copyAppNum() {
    navigator.clipboard.writeText(app.applicationNumber).then(() => {
      setAppNumCopied(true);
      setTimeout(() => setAppNumCopied(false), 2000);
    });
  }

  function openStatusModal(target: Target) {
    setStatusModal({ open: true, target });
    setNewTargetStatus(target.targetStatus);
    setRemark("");
    setInternalNote("");
    setVisibleToStudent(true);
  }

  async function handleChangeTargetStatus() {
    if (!statusModal.target || !newTargetStatus) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/staff/applications/${app.id}/change-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: statusModal.target.id,
          newStatus: newTargetStatus,
          remark: remark.trim() || undefined,
          internalNote: internalNote.trim() || undefined,
          visibleToStudent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      // Optimistic update
      setTargets(prev => prev.map(t =>
        t.id === statusModal.target!.id
          ? { ...t, targetStatus: newTargetStatus, updatedAt: new Date().toISOString() }
          : t
      ));
      setStatusModal({ open: false, target: null });
      showToast("Target status updated");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setSavingStatus(false);
    }
  }

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi ${app.studentName.split(" ")[0]}, this is Globlearn Education regarding your application ${app.applicationNumber}. `
  )}`;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: toast.ok ? "#166534" : "#C8102E" }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Change Status Modal (E2) ── */}
      {statusModal.open && statusModal.target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
              <div>
                <h2 className="text-base font-black" style={{ color: "#0A1628" }}>Change Target Status</h2>
                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{statusModal.target.universityName}</p>
              </div>
              <button onClick={() => setStatusModal({ open: false, target: null })} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <X size={15} style={{ color: "#94A3B8" }} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>New Status</label>
                <select
                  value={newTargetStatus}
                  onChange={e => setNewTargetStatus(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: "#E2E8F0", color: "#0A1628" }}
                >
                  {Object.entries(TARGET_STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Student-Visible Remark</label>
                <textarea
                  rows={2}
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  placeholder="Message shown to the student (optional)"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                  style={{ borderColor: "#E2E8F0" }}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Internal Note (staff only)</label>
                <textarea
                  rows={2}
                  value={internalNote}
                  onChange={e => setInternalNote(e.target.value)}
                  placeholder="Internal note — not shown to student"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                  style={{ borderColor: "#E2E8F0" }}
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={visibleToStudent}
                  onChange={e => setVisibleToStudent(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium" style={{ color: "#374151" }}>Show this update in student&apos;s timeline</span>
              </label>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: "#E2E8F0" }}>
              <button
                onClick={() => setStatusModal({ open: false, target: null })}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: "#E2E8F0", color: "#64748B" }}
              >Cancel</button>
              <button
                onClick={handleChangeTargetStatus}
                disabled={savingStatus || newTargetStatus === statusModal.target.targetStatus}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ backgroundColor: "#1B3A6B" }}
              >
                {savingStatus ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex items-start gap-3">
        <Link
          href="/staff"
          className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center border hover:bg-gray-50 transition-colors flex-shrink-0"
          style={{ borderColor: "#E2E8F0" }}
        >
          <ArrowLeft size={14} style={{ color: "#64748B" }} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-black truncate" style={{ color: "#0A1628" }}>{app.studentName}</h1>
            <button onClick={copyAppNum} className="flex items-center gap-1.5 font-mono text-xs font-bold px-2 py-1 rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
              {app.applicationNumber}
              {appNumCopied ? <Check size={10} /> : <Copy size={10} />}
            </button>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>
              {st.label}
            </span>
            {app.isUrgent && (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                <AlertTriangle size={10} /> Urgent
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            {PROGRAM_LABELS[app.programLevel] ?? app.programLevel}
            {" · "}
            {app.university}
            {" · submitted "}
            {fmt(app.createdAt)}
            {app.partnerName !== "Direct" && ` · via ${app.partnerName}`}
          </p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 288px", alignItems: "start" }}>
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4">

          {/* 1. Status control */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>Application Status</p>

            {isSubmitted ? (
              /* Rule: submitted → only "Start Review" is allowed */
              <div className="flex items-center gap-4">
                <div className="flex-1 rounded-xl p-3 text-sm" style={{ backgroundColor: "#FEF9C3", color: "#854D0E" }}>
                  <strong>New application.</strong> Click "Start Review" to take ownership and begin processing.
                </div>
                <button
                  onClick={handleStartReview}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white whitespace-nowrap disabled:opacity-60"
                  style={{ backgroundColor: "#059669" }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Start Review
                </button>
              </div>
            ) : (
              /* All other statuses: full dropdown */
              <div className="flex items-center gap-3">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: "#E2E8F0", color: "#0A1628" }}
                >
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleSaveStatus}
                  disabled={saving || (status === app.status && !note.trim())}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ backgroundColor: "#059669" }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save
                </button>
              </div>
            )}
          </div>

          {/* 2. University Targets (E1) */}
          <Section title={`University Targets (${targets.length})`}>
            {targets.length > 0 ? (
              <div className="space-y-3">
                {targets.map((t, i) => {
                  const tst = TARGET_STATUS_CONFIG[t.targetStatus] ?? TARGET_STATUS_CONFIG["pending"];
                  return (
                    <div key={t.id} className="rounded-xl p-3.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
                            #{i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{t.universityName}</p>
                            {t.programName && <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>{t.programName}</p>}
                            {t.expectedMajor && (
                              <p className="text-[11px] mt-0.5 font-medium" style={{ color: "#29ABE2" }}>Major: {t.expectedMajor}</p>
                            )}
                            {t.intake && (
                              <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>Intake: {t.intake}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: tst.bg, color: tst.color }}>
                            {tst.label}
                          </span>
                          <button
                            onClick={() => openStatusModal(t)}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border"
                            style={{ borderColor: "#E2E8F0", color: "#1B3A6B" }}
                          >
                            <RefreshCw size={10} />Change
                          </button>
                        </div>
                      </div>
                      {(t.admissionNoticeUrl || t.jw202Url) && (
                        <div className="flex gap-2 mt-2.5 pt-2.5" style={{ borderTop: "1px solid #F1F5F9" }}>
                          {t.admissionNoticeUrl && (
                            <a href={t.admissionNoticeUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] font-bold" style={{ color: "#059669" }}>
                              <ExternalLink size={10} />Admission Notice
                            </a>
                          )}
                          {t.jw202Url && (
                            <a href={t.jw202Url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] font-bold" style={{ color: "#1B3A6B" }}>
                              <ExternalLink size={10} />JW202
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#94A3B8" }}>No university targets yet. Targets are created when student completes the application form.</p>
            )}
          </Section>

          {/* 3. Academic History */}
          <Section title="Academic History" defaultOpen={app.academicHistory.length > 0}>
            {app.academicHistory.length > 0 ? (
              <div className="space-y-3">
                {app.academicHistory.map((h, i) => (
                  <div key={i} className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{h.schoolName ?? h.institution ?? "—"}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        ["Degree / Level", h.degree ?? h.level],
                        ["Subject / Major", h.subject ?? h.major],
                        ["Start", h.startYear ?? h.startDate],
                        ["End", h.endYear ?? h.endDate],
                        ["Grade / GPA", h.grade ?? h.gpa],
                        ["Country", h.country],
                      ].filter(([, v]) => v).map(([l, v]) => (
                        <div key={l as string}>
                          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{l as string}</p>
                          <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#94A3B8" }}>No academic history provided.</p>
            )}
          </Section>

          {/* 4. Work Experience */}
          <Section title="Work Experience" defaultOpen={app.workExperience.length > 0}>
            {app.workExperience.length > 0 ? (
              <div className="space-y-3">
                {app.workExperience.map((w, i) => (
                  <div key={i} className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{w.employer ?? w.company ?? "—"}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        ["Position", w.position ?? w.role],
                        ["Start", w.startDate],
                        ["End", w.endDate ?? "Present"],
                        ["Description", w.description],
                      ].filter(([, v]) => v).map(([l, v]) => (
                        <div key={l as string} className={(l === "Description") ? "col-span-2" : ""}>
                          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{l as string}</p>
                          <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#94A3B8" }}>No work experience provided.</p>
            )}
          </Section>

          {/* 5. Language Proficiency */}
          <Section title="Language Proficiency" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#1B3A6B" }}>English</p>
                {Object.keys(app.englishProficiency).length > 0 ? (
                  <div className="space-y-1.5">
                    {Object.entries(app.englishProficiency).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{k}</p>
                        <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "#94A3B8" }}>Not provided</p>
                )}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#1B3A6B" }}>Chinese</p>
                {Object.keys(app.chineseProficiency).length > 0 ? (
                  <div className="space-y-1.5">
                    {Object.entries(app.chineseProficiency).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{k}</p>
                        <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "#94A3B8" }}>Not provided</p>
                )}
              </div>
            </div>
          </Section>

          {/* 6. Documents */}
          <Section title="Documents" defaultOpen={Object.keys(app.documents).length > 0}>
            {Object.keys(app.documents).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(app.documents).map(([key, url]) => (
                  url ? (
                    <div key={key} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#059669" }} />
                        <span className="text-xs font-semibold" style={{ color: "#065F46" }}>
                          {DOC_LABELS[key] ?? key.replace(/_/g, " ")}
                        </span>
                      </div>
                      <a
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold"
                        style={{ color: "#059669" }}
                      >
                        View <ExternalLink size={10} />
                      </a>
                    </div>
                  ) : null
                ))}
                {/* Show missing docs */}
                {Object.keys(DOC_LABELS)
                  .filter(k => !app.documents[k])
                  .map(key => (
                    <div key={key} className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#DC2626" }} />
                      <span className="text-xs font-semibold" style={{ color: "#991B1B" }}>
                        {DOC_LABELS[key]} — missing
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#94A3B8" }}>No documents uploaded yet.</p>
            )}
          </Section>

          {/* 7. Staff Notes */}
          <Section title={`Staff Notes (${notes.length})`}>
            {notes.length > 0 && (
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {notes.map((n, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold" style={{ color: "#1B3A6B" }}>{n.staffName}</span>
                      <span className="text-[10px]" style={{ color: "#94A3B8" }}>
                        {fmt(n.at)}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{n.content}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add internal note — visible to staff only…"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
              style={{ borderColor: "#E2E8F0" }}
            />
            <button
              onClick={() => callApi({ note: note.trim() || undefined })}
              disabled={saving || !note.trim()}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#059669" }}
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save Note
            </button>
          </Section>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-4">

          {/* Personal */}
          <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Personal</p>
            <CopyField label="Full Name (Passport)" value={app.studentName} />
            <Field label="Nationality" value={app.nationality} />
            <Field label="Date of Birth" value={app.dateOfBirth} />
            <Field label="Gender" value={app.gender} />
            <CopyField label="Passport Number" value={app.passportNumber} />
            <Field label="Passport Expiry" value={app.passportExpiry} />
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Contact</p>
            <CopyField label="Email" value={app.email} />
            <CopyField label="Phone" value={app.phone} />
            <Field label="City" value={app.city} />
            <Field label="Country" value={app.country} />
          </div>

          {/* Scholarship + Partner */}
          <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Application</p>
            <Field label="Scholarship Type" value={app.scholarshipType?.replace(/_/g, " ") ?? "—"} />
            <Field label="Program Level" value={PROGRAM_LABELS[app.programLevel] ?? app.programLevel} />
            <Field label="Referred By" value={app.partnerName} />
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Payments</p>
            {[
              { label: "Deposit (500 RMB)", paid: app.depositPaid },
              { label: "Service Charge", paid: app.serviceChargePaid },
            ].map(({ label, paid }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: "#64748B" }}>{label}</span>
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={paid
                    ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                    : { backgroundColor: "#FEF3C7", color: "#92400E" }}
                >
                  {paid ? "PAID" : "PENDING"}
                </span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border p-5 space-y-2" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>Quick Actions</p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={14} />WhatsApp Student
            </a>
            <Link
              href="/staff"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}
            >
              <ArrowLeft size={13} />Back to Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
