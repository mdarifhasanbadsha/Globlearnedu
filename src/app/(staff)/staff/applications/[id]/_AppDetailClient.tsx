"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Copy, Check, ChevronDown, ChevronRight,
  MessageCircle, Save, Loader2, AlertTriangle, ExternalLink,
  RefreshCw, X, Edit2, FileDown, Archive, Pencil, User, BookOpen,
  Phone, GraduationCap, Briefcase, Globe, Heart, Users, Building2,
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
  applicationMode: string;
  programLevel: string;
  scholarshipType: string | null;
  isUrgent: boolean;
  studentName: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  religion: string;
  passportNumber: string;
  passportExpiry: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  addressDetailed: string;
  addressPostcode: string;
  university: string;
  universities: Array<{ universityName?: string; programName?: string; expectedMajor?: string }>;
  parentInfo: Record<string, unknown>;
  sponsorInfo: Record<string, unknown>;
  academicHistory: Array<Record<string, unknown>>;
  workExperience: Array<Record<string, unknown>>;
  englishProficiency: Record<string, unknown>;
  chineseProficiency: Record<string, unknown>;
  isCurrentlyInChina: boolean;
  chinaStatus: Record<string, unknown>;
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

function Section({
  title, icon: Icon, defaultOpen = true, children,
}: {
  title: string; icon?: React.ElementType; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={13} style={{ color: "#94A3B8" }} />}
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>{title}</span>
        </div>
        {open
          ? <ChevronDown size={14} style={{ color: "#CBD5E1" }} />
          : <ChevronRight size={14} style={{ color: "#CBD5E1" }} />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    if (!value || value === "—") return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [value]);
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{label}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <p className="text-xs font-semibold break-all" style={{ color: "#0A1628" }}>{value || "—"}</p>
        {value && value !== "—" && (
          <button onClick={copy} className="flex-shrink-0 p-0.5 rounded hover:bg-gray-100 transition-colors">
            {copied ? <Check size={11} style={{ color: "#059669" }} /> : <Copy size={11} style={{ color: "#CBD5E1" }} />}
          </button>
        )}
      </div>
    </div>
  );
}

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

function str(v: unknown): string {
  if (v == null || v === "") return "—";
  return String(v);
}

export default function AppDetailClient({ app, targets: initialTargets }: { app: App; targets: Target[] }) {
  const [status, setStatus] = useState(app.status);
  const [statusRemark, setStatusRemark] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(app.staffNotes);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [appNumCopied, setAppNumCopied] = useState(false);

  const [targets, setTargets] = useState<Target[]>(initialTargets);
  const [statusModal, setStatusModal] = useState<{ open: boolean; target: Target | null }>({ open: false, target: null });
  const [newTargetStatus, setNewTargetStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [visibleToStudent, setVisibleToStudent] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);

  const [modModal, setModModal] = useState(false);
  const [modMessage, setModMessage] = useState("");
  const [modSaving, setModSaving] = useState(false);

  const [uploadedAdmissionUrl, setUploadedAdmissionUrl] = useState<string | null>(null);
  const [uploadedJw202Url, setUploadedJw202Url] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
      if (payload.status) setStatusRemark("");
      showToast(payload.status ? "Status updated — email sent to student" : "Note saved");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setSaving(false);
    }
  }

  function handleStartReview() {
    setStatus("under_review");
    callApi({ status: "under_review", remark: statusRemark.trim() || undefined });
  }

  function handleSaveStatus() {
    callApi({
      status: status !== app.status ? status : undefined,
      remark: statusRemark.trim() || undefined,
      note: note.trim() || undefined,
    });
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
    setUploadedAdmissionUrl(null);
    setUploadedJw202Url(null);
  }

  async function handleFileUpload(file: File, docType: "admission_notice" | "jw202") {
    setUploading(true);
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app.id,
          documentType: docType,
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });
      const presignData = await presignRes.json();
      if (!presignRes.ok) throw new Error(presignData.error ?? "Upload failed");
      await fetch(presignData.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (docType === "admission_notice") setUploadedAdmissionUrl(presignData.publicUrl);
      else setUploadedJw202Url(presignData.publicUrl);
      showToast("File uploaded");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Upload failed", false);
    } finally {
      setUploading(false);
    }
  }

  async function handleAskModification() {
    if (!modMessage.trim()) return;
    setModSaving(true);
    try {
      const res = await fetch(`/api/staff/applications/${app.id}/ask-modification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: modMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setModModal(false);
      setModMessage("");
      showToast("Modification request sent — email + notification fired");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setModSaving(false);
    }
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
          admissionNoticeUrl: uploadedAdmissionUrl || undefined,
          jw202Url: uploadedJw202Url || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setTargets(prev => prev.map(t =>
        t.id === statusModal.target!.id
          ? { ...t, targetStatus: newTargetStatus, updatedAt: new Date().toISOString() }
          : t
      ));
      setStatusModal({ open: false, target: null });
      showToast("Target status updated — email sent to student");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setSavingStatus(false);
    }
  }

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi ${app.studentName.split(" ")[0]}, this is Globlearn Education regarding your application ${app.applicationNumber}. `
  )}`;

  const hasSelectedUnivs = Array.isArray(app.universities) && app.universities.length > 0;

  const targetNames = new Set(targets.map(t => t.universityName));
  const pendingUnivs = Array.isArray(app.universities)
    ? app.universities.filter(u => u.universityName && !targetNames.has(u.universityName))
    : [];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: toast.ok ? "#166534" : "#C8102E" }}>
          {toast.msg}
        </div>
      )}

      {/* ── Change Target Status Modal ── */}
      {statusModal.open && statusModal.target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
              <div>
                <h2 className="text-base font-black" style={{ color: "#0A1628" }}>Change University Status</h2>
                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{statusModal.target.universityName}</p>
              </div>
              <button onClick={() => setStatusModal({ open: false, target: null })} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <X size={15} style={{ color: "#94A3B8" }} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>New Status</label>
                <select value={newTargetStatus} onChange={e => setNewTargetStatus(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#0A1628" }}>
                  {Object.entries(TARGET_STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Message to Student (visible in timeline)</label>
                <textarea rows={2} value={remark} onChange={e => setRemark(e.target.value)}
                  placeholder="e.g. Your application has been submitted to Fudan University. Expect a response within 4–6 weeks."
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" style={{ borderColor: "#E2E8F0" }} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Internal Note (staff only — not emailed)</label>
                <textarea rows={2} value={internalNote} onChange={e => setInternalNote(e.target.value)}
                  placeholder="Internal context — not shown to student or partner"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" style={{ borderColor: "#E2E8F0" }} />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={visibleToStudent} onChange={e => setVisibleToStudent(e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm font-medium" style={{ color: "#374151" }}>Send email + notification to student</span>
              </label>

              {/* File upload — Admission Notice (pre_admission / interview / admission_notice) */}
              {["pre_admission", "interview", "admission_notice"].includes(newTargetStatus) && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>
                    Admission Letter / Document (optional — attached in email)
                  </label>
                  {uploadedAdmissionUrl ? (
                    <div className="flex items-center gap-2">
                      <Check size={12} style={{ color: "#059669" }} />
                      <a href={uploadedAdmissionUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#059669" }}>
                        File uploaded — view
                      </a>
                      <button onClick={() => setUploadedAdmissionUrl(null)} className="p-0.5 rounded hover:bg-gray-100">
                        <X size={11} style={{ color: "#94A3B8" }} />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      disabled={uploading}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "admission_notice"); }}
                      className="w-full text-xs border rounded-xl px-3 py-2 cursor-pointer"
                      style={{ borderColor: "#E2E8F0" }}
                    />
                  )}
                  {uploading && !uploadedAdmissionUrl && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#6B7280" }}>
                      <Loader2 size={11} className="animate-spin" /> Uploading…
                    </p>
                  )}
                </div>
              )}

              {/* File upload — JW202 (final_admission) */}
              {newTargetStatus === "final_admission" && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>
                    JW202 Document (optional — attached in email)
                  </label>
                  {uploadedJw202Url ? (
                    <div className="flex items-center gap-2">
                      <Check size={12} style={{ color: "#059669" }} />
                      <a href={uploadedJw202Url} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#059669" }}>
                        JW202 uploaded — view
                      </a>
                      <button onClick={() => setUploadedJw202Url(null)} className="p-0.5 rounded hover:bg-gray-100">
                        <X size={11} style={{ color: "#94A3B8" }} />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      disabled={uploading}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "jw202"); }}
                      className="w-full text-xs border rounded-xl px-3 py-2 cursor-pointer"
                      style={{ borderColor: "#E2E8F0" }}
                    />
                  )}
                  {uploading && !uploadedJw202Url && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#6B7280" }}>
                      <Loader2 size={11} className="animate-spin" /> Uploading…
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: "#E2E8F0" }}>
              <button onClick={() => setStatusModal({ open: false, target: null })}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
                Cancel
              </button>
              <button onClick={handleChangeTargetStatus}
                disabled={savingStatus || newTargetStatus === statusModal.target.targetStatus}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ backgroundColor: "#1B3A6B" }}>
                {savingStatus ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                Update & Email Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ask Modification Modal ── */}
      {modModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
              <div>
                <h2 className="text-base font-black" style={{ color: "#0A1628" }}>Ask Student to Modify</h2>
                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Student can edit and resubmit — email + portal notification will be sent</p>
              </div>
              <button onClick={() => setModModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <X size={15} style={{ color: "#94A3B8" }} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl px-4 py-3 text-xs" style={{ backgroundColor: "#FEF9C3", color: "#854D0E" }}>
                <strong>What happens:</strong> Application unlocked for student editing. They receive an <strong>email + portal notification</strong> with your message. Once resubmitted, application returns to review queue.
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Message to Student *</label>
                <textarea rows={4} value={modMessage} onChange={e => setModMessage(e.target.value)}
                  placeholder="Describe exactly what needs to be updated, corrected, or re-uploaded…"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" style={{ borderColor: "#E2E8F0" }} />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: "#E2E8F0" }}>
              <button onClick={() => setModModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
                Cancel
              </button>
              <button onClick={handleAskModification} disabled={modSaving || !modMessage.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ backgroundColor: "#C8102E" }}>
                {modSaving ? <Loader2 size={13} className="animate-spin" /> : <Pencil size={13} />}
                Send — Email Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex items-start gap-3">
        <Link href="/staff" className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center border hover:bg-gray-50 transition-colors flex-shrink-0"
          style={{ borderColor: "#E2E8F0" }}>
          <ArrowLeft size={14} style={{ color: "#64748B" }} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-black truncate" style={{ color: "#0A1628" }}>{app.studentName}</h1>
            <button onClick={copyAppNum} className="flex items-center gap-1.5 font-mono text-xs font-bold px-2 py-1 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
              {app.applicationNumber}
              {appNumCopied ? <Check size={10} /> : <Copy size={10} />}
            </button>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>
              {st.label}
            </span>
            {app.applicationMode === "editable" && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                Modification Requested
              </span>
            )}
            {app.applicationMode === "resubmitted" && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                Resubmitted
              </span>
            )}
            {app.isUrgent && (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                <AlertTriangle size={10} /> Urgent
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            {PROGRAM_LABELS[app.programLevel] ?? app.programLevel}
            {" · "}{app.university}
            {" · submitted "}{fmt(app.createdAt)}
            {app.partnerName !== "Direct" && ` · via ${app.partnerName}`}
          </p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 288px", alignItems: "start" }}>
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4">

          {/* 1. Application Status */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>Application Status</p>
            {isSubmitted ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 rounded-xl p-3 text-sm" style={{ backgroundColor: "#FEF9C3", color: "#854D0E" }}>
                    <strong>New application.</strong> Click "Start Review" to take ownership and begin processing.
                  </div>
                  <button onClick={handleStartReview} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white whitespace-nowrap disabled:opacity-60"
                    style={{ backgroundColor: "#059669" }}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    Start Review
                  </button>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#94A3B8" }}>Remark to Student (optional)</label>
                  <textarea rows={2} value={statusRemark} onChange={e => setStatusRemark(e.target.value)}
                    placeholder="Message included in email to student…"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" style={{ borderColor: "#E2E8F0" }} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    style={{ borderColor: "#E2E8F0", color: "#0A1628" }}>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <button onClick={handleSaveStatus} disabled={saving || (status === app.status && !statusRemark.trim() && !note.trim())}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                    style={{ backgroundColor: "#059669" }}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save & Email
                  </button>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#94A3B8" }}>
                    Remark to Student — included in status email
                  </label>
                  <textarea rows={2} value={statusRemark} onChange={e => setStatusRemark(e.target.value)}
                    placeholder="e.g. We have reviewed your documents. You will be contacted within 3 working days…"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" style={{ borderColor: "#E2E8F0" }} />
                </div>
              </div>
            )}
          </div>

          {/* 2. University Targets */}
          <Section title={`University Targets (${targets.length + pendingUnivs.length})`} icon={Building2}>
            {targets.length > 0 ? (
              <>
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
                              {t.expectedMajor && <p className="text-[11px] mt-0.5 font-medium" style={{ color: "#29ABE2" }}>Major: {t.expectedMajor}</p>}
                              {t.intake && <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>Intake: {t.intake}</p>}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: tst.bg, color: tst.color }}>
                              {tst.label}
                            </span>
                            <button onClick={() => openStatusModal(t)}
                              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border"
                              style={{ borderColor: "#E2E8F0", color: "#1B3A6B" }}>
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
                {pendingUnivs.length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: "1px dashed #FDE68A" }}>
                    <p className="text-[11px] font-bold mb-2" style={{ color: "#D97706" }}>
                      Student recently added — not yet in workflow:
                    </p>
                    <div className="space-y-2">
                      {pendingUnivs.map((u, i) => (
                        <div key={i} className="rounded-xl p-3" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                          <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{u.universityName ?? "—"}</p>
                          {u.programName && <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>{u.programName}</p>}
                          {u.expectedMajor && <p className="text-[11px] mt-0.5 font-medium" style={{ color: "#29ABE2" }}>Major: {u.expectedMajor}</p>}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block" style={{ backgroundColor: "#FDE68A", color: "#92400E" }}>
                            New — add to workflow manually
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : hasSelectedUnivs ? (
              <div className="space-y-2">
                <p className="text-[11px] mb-2 font-semibold" style={{ color: "#D97706" }}>
                  Student's chosen universities (no per-target workflow started yet):
                </p>
                {app.universities.map((u, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{u.universityName ?? "—"}</p>
                    {u.programName && <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>{u.programName}</p>}
                    {u.expectedMajor && <p className="text-[11px] mt-0.5" style={{ color: "#29ABE2" }}>Major: {u.expectedMajor}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#94A3B8" }}>No universities selected yet.</p>
            )}
          </Section>

          {/* 3. Academic History */}
          <Section title="Academic History" icon={GraduationCap} defaultOpen={app.academicHistory.length > 0}>
            {app.academicHistory.length > 0 ? (
              <div className="space-y-3">
                {app.academicHistory.map((h, i) => (
                  <div key={i} className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>
                      {str(h.institution)}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        ["Qualification", str(h.qualification)],
                        ["Field of Study", str(h.fieldOfStudy)],
                        ["Start Year", str(h.startYear)],
                        ["End Year", str(h.endYear)],
                        ["Grade / GPA", str(h.grade)],
                        ["Country", str(h.country)],
                      ].filter(([, v]) => v && v !== "—").map(([l, v]) => (
                        <div key={l}>
                          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{l}</p>
                          <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v}</p>
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
          <Section title="Work Experience" icon={Briefcase} defaultOpen={app.workExperience.length > 0}>
            {app.workExperience.length > 0 ? (
              <div className="space-y-3">
                {app.workExperience.map((w, i) => (
                  <div key={i} className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{str(w.employer)}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        ["Job Title", str(w.jobTitle)],
                        ["Country", str(w.country)],
                        ["Start Date", str(w.startDate)],
                        ["End Date", str(w.endDate) || "Present"],
                        ["Description", str(w.description)],
                      ].filter(([, v]) => v && v !== "—").map(([l, v]) => (
                        <div key={l} className={l === "Description" ? "col-span-2" : ""}>
                          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{l}</p>
                          <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v}</p>
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
          <Section title="Language Proficiency" icon={Globe} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#1B3A6B" }}>English</p>
                {app.englishProficiency && Object.keys(app.englishProficiency).length > 0 ? (
                  <div className="space-y-1.5">
                    {[
                      ["Test Type", str(app.englishProficiency.testType)],
                      ["Score", str(app.englishProficiency.score)],
                      ["Test Date", str(app.englishProficiency.testDate)],
                      ["Institution (MOI)", str(app.englishProficiency.institution)],
                    ].filter(([, v]) => v && v !== "—").map(([k, v]) => (
                      <div key={k as string}>
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{k as string}</p>
                        <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v as string}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs" style={{ color: "#94A3B8" }}>Not provided</p>}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#1B3A6B" }}>Chinese (HSK)</p>
                {app.chineseProficiency && Object.keys(app.chineseProficiency).length > 0 ? (
                  <div className="space-y-1.5">
                    {[
                      ["Has HSK", app.chineseProficiency.hasHSK ? "Yes" : "No"],
                      ["HSK Level", str(app.chineseProficiency.hskLevel)],
                      ["HSK Score", str(app.chineseProficiency.hskScore)],
                      ["Has HSKK", app.chineseProficiency.hasHSKK ? "Yes" : "No"],
                      ["HSKK Level", str(app.chineseProficiency.hskkLevel)],
                    ].filter(([, v]) => v && v !== "—").map(([k, v]) => (
                      <div key={k as string}>
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{k as string}</p>
                        <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v as string}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs" style={{ color: "#94A3B8" }}>Not provided</p>}
              </div>
            </div>
          </Section>

          {/* 6. Parent & Sponsor */}
          <Section title="Parent & Sponsor Information" icon={Users} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>Father</p>
                {[
                  ["Name", str(app.parentInfo.fatherName)],
                  ["Occupation", str(app.parentInfo.fatherOccupation)],
                  ["Phone", str(app.parentInfo.fatherPhone)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{l}</p>
                    <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>Mother</p>
                {[
                  ["Name", str(app.parentInfo.motherName)],
                  ["Occupation", str(app.parentInfo.motherOccupation)],
                  ["Phone", str(app.parentInfo.motherPhone)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{l}</p>
                    <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
            {Object.keys(app.sponsorInfo).length > 0 && (
              <div className="mt-4 pt-4 space-y-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>Sponsor / Financial Guarantor</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Same as Parent", app.sponsorInfo.isSameAsParent ? "Yes" : "No"],
                    ["Name", str(app.sponsorInfo.sponsorName)],
                    ["Relationship", str(app.sponsorInfo.sponsorRelationship)],
                    ["Occupation", str(app.sponsorInfo.sponsorOccupation)],
                    ["Phone", str(app.sponsorInfo.sponsorPhone)],
                    ["Annual Income", str(app.sponsorInfo.annualIncomeRange)],
                  ].filter(([, v]) => v && v !== "—").map(([l, v]) => (
                    <div key={l as string}>
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{l as string}</p>
                      <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* 7. China Status */}
          {app.isCurrentlyInChina && (
            <Section title="Currently in China" icon={Globe} defaultOpen={true}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Visa Type", str(app.chinaStatus.visaType)],
                  ["Entry Date", str(app.chinaStatus.visaEntryDate)],
                  ["Visa Expiry", str(app.chinaStatus.visaExpiryDate)],
                  ["Current University", str(app.chinaStatus.currentUniversity)],
                  ["Current Address", str(app.chinaStatus.currentAddress)],
                ].filter(([, v]) => v && v !== "—").map(([l, v]) => (
                  <div key={l as string}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#CBD5E1" }}>{l as string}</p>
                    <p className="text-[11px] font-medium" style={{ color: "#475569" }}>{v as string}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 8. Documents */}
          <Section title="Documents" icon={FileDown} defaultOpen={Object.keys(app.documents).length > 0}>
            {Object.keys(app.documents).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(app.documents).map(([key, url]) =>
                  url ? (
                    <div key={key} className="flex items-center justify-between rounded-xl px-3 py-2.5"
                      style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#059669" }} />
                        <span className="text-xs font-semibold" style={{ color: "#065F46" }}>
                          {DOC_LABELS[key] ?? key.replace(/_/g, " ")}
                        </span>
                      </div>
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold" style={{ color: "#059669" }}>
                        View <ExternalLink size={10} />
                      </a>
                    </div>
                  ) : null
                )}
                {Object.keys(DOC_LABELS).filter(k => !app.documents[k]).map(key => (
                  <div key={key} className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
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

          {/* 9. Staff Notes */}
          <Section title={`Staff Notes (${notes.length})`} defaultOpen={true}>
            {notes.length > 0 && (
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {notes.map((n, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold" style={{ color: "#1B3A6B" }}>{n.staffName}</span>
                      <span className="text-[10px]" style={{ color: "#94A3B8" }}>{fmt(n.at)}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{n.content}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
              placeholder="Add internal note — visible to staff only, not emailed…"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" style={{ borderColor: "#E2E8F0" }} />
            <button onClick={() => callApi({ note: note.trim() || undefined })} disabled={saving || !note.trim()}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#059669" }}>
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save Note
            </button>
          </Section>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-4">

          {/* Personal */}
          <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <User size={12} style={{ color: "#94A3B8" }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Personal</p>
            </div>
            <CopyField label="Full Name (Passport)" value={app.studentName} />
            <Field label="Nationality" value={app.nationality} />
            <Field label="Date of Birth" value={app.dateOfBirth} />
            <Field label="Gender" value={app.gender} />
            <Field label="Religion" value={app.religion} />
            <CopyField label="Passport Number" value={app.passportNumber} />
            <Field label="Passport Expiry" value={app.passportExpiry} />
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <Phone size={12} style={{ color: "#94A3B8" }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Contact</p>
            </div>
            <CopyField label="Email" value={app.email} />
            <CopyField label="Phone" value={app.phone} />
            <Field label="City" value={app.city} />
            <Field label="Country" value={app.country} />
            <Field label="Postcode" value={app.addressPostcode} />
            {app.addressDetailed && app.addressDetailed !== "—" && (
              <Field label="Address" value={app.addressDetailed} />
            )}
          </div>

          {/* Application */}
          <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2">
              <BookOpen size={12} style={{ color: "#94A3B8" }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>Application</p>
            </div>
            <Field label="Scholarship Type" value={app.scholarshipType?.replace(/_/g, " ") ?? "—"} />
            <Field label="Program Level" value={PROGRAM_LABELS[app.programLevel] ?? app.programLevel} />
            <Field label="Application Mode" value={app.applicationMode} />
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
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={paid ? { backgroundColor: "#D1FAE5", color: "#065F46" } : { backgroundColor: "#FEF3C7", color: "#92400E" }}>
                  {paid ? "PAID" : "PENDING"}
                </span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border p-5 space-y-2" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>Quick Actions</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#25D366" }}>
              <MessageCircle size={14} />WhatsApp Student
            </a>
            <Link href={`/staff/applications/${app.id}/edit`}
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold border"
              style={{ borderColor: "#1B3A6B", color: "#1B3A6B" }}>
              <Edit2 size={14} />Edit Application
            </Link>
            <button onClick={() => setModModal(true)}
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold border"
              style={{ borderColor: "#C8102E", color: "#C8102E" }}>
              <Pencil size={14} />Ask Modification
            </button>
            <a href={`/api/staff/applications/${app.id}/pdf`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold border"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
              <FileDown size={14} />Download PDF
            </a>
            <a href={`/api/staff/applications/${app.id}/zip`}
              className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold border"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
              <Archive size={14} />Download Documents ZIP
            </a>
            <Link href="/staff"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
              <ArrowLeft size={13} />Back to Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
