"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Send, Eye, Code, Loader2, CheckCircle2, AlertCircle,
  ToggleLeft, ToggleRight, Info
} from "lucide-react";
import { TEMPLATE_VARIABLES } from "@/lib/email/templateSeeds";

type Template = {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string | null;
  triggerEvent: string | null;
  category: string | null;
  isActive: boolean | null;
  isAutoTrigger: boolean | null;
  sendToStudent: boolean | null;
  sendToPartner: boolean | null;
};

const INPUT = "w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors";
const STYLE = { borderColor: "#E2E8F0" };

type Toast = { type: "success" | "error"; msg: string };

export default function EmailTemplateEditor({ template }: { template: Template }) {
  const router = useRouter();
  const [subject, setSubject] = useState(template.subject ?? "");
  const [bodyHtml, setBodyHtml] = useState(template.bodyHtml ?? "");
  const [isActive, setIsActive] = useState(template.isActive ?? true);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const variables = template.triggerEvent ? (TEMPLATE_VARIABLES[template.triggerEvent] ?? []) : [];

  function showToast(type: Toast["type"], msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // Build preview HTML: replace {{var}} with styled sample values
  function buildPreviewHtml() {
    const SAMPLES: Record<string, string> = {
      firstName: "Ahmed",
      studentName: "Ahmed Rahman",
      partnerName: "Global Agency",
      referrerName: "Sarah Ali",
      applicationId: "MD20260611001",
      applicationNumber: "MD20260611001",
      universityName: "Wuhan University",
      programName: "MBBS",
      program: "MBBS",
      universities: "Wuhan University",
      newStatus: "Documents Approved",
      statusDescription: "All documents have been verified.",
      nextStep: "Your application is being prepared for submission.",
      scholarshipType: "CSC Scholarship",
      intakeDate: "September 2026",
      staffName: "Globlearn Team",
      interviewDate: "15 June 2026",
      interviewTime: "10:00 AM",
      timezone: "GMT+8",
      platform: "Zoom",
      link: "https://zoom.us/j/123",
      duration: "30 minutes",
      language: "English",
      guidelines: "Be professional and polite.",
      amount: "500",
      currency: "RMB",
      paymentType: "Application Deposit",
      section: "Academic Documents",
      instructions: "Please upload your transcript.",
      agencyName: "Global Agency Ltd",
      referredStudentFirstName: "Ali",
      commissionAmount: "200 RMB",
      totalEarned: "800 RMB",
      trackingUrl: "https://globlearnedu.com/track?id=MD20260611001",
      verifyUrl: "https://globlearnedu.com/verify-email?token=abc123",
      resetUrl: "https://globlearnedu.com/reset-password?token=abc123",
      visaGuideUrl: "https://globlearnedu.com/dashboard/guide",
      guideUrl: "https://globlearnedu.com/dashboard/guide",
    };
    return bodyHtml.replace(/\{\{(\w+)\}\}/g, (_: string, name: string) => {
      return `<span style="background:#FEF3C7;color:#92400E;padding:0 3px;border-radius:3px;font-weight:600;">${SAMPLES[name] ?? name}</span>`;
    });
  }

  async function save() {
    if (!subject.trim()) { showToast("error", "Subject is required."); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/email-templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, bodyHtml, isActive }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error ?? "Save failed"); return; }
      showToast("success", "Template saved.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    if (!testEmail.trim()) { showToast("error", "Enter a recipient email."); return; }
    setSendingTest(true);
    try {
      const res = await fetch("/api/admin/email-templates/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail, subject, bodyHtml }),
      });
      const data = await res.json();
      setShowTestModal(false);
      if (res.ok) {
        showToast("success", `Test email sent to ${testEmail}`);
      } else {
        showToast("error", data.error ?? "Failed to send test");
      }
    } finally {
      setSendingTest(false);
    }
  }

  function insertVariable(varName: string) {
    const insertion = `{{${varName}}}`;
    const el = document.querySelector<HTMLTextAreaElement>("#template-body");
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newVal = bodyHtml.slice(0, start) + insertion + bodyHtml.slice(end);
      setBodyHtml(newVal);
      setTimeout(() => { el.selectionStart = el.selectionEnd = start + insertion.length; el.focus(); }, 0);
    } else {
      setBodyHtml(prev => prev + insertion);
    }
  }

  const catColors: Record<string, { bg: string; color: string }> = {
    Auth:        { bg: "#EEF4FF", color: "#1B3A6B" },
    Application: { bg: "#DCFCE7", color: "#166534" },
    Admission:   { bg: "#FEF9C3", color: "#854D0E" },
    Payment:     { bg: "#DBEAFE", color: "#1E40AF" },
    Partner:     { bg: "#F5F3FF", color: "#5B21B6" },
    Visa:        { bg: "#FFEDD5", color: "#9A3412" },
  };
  const cat = catColors[template.category ?? ""] ?? { bg: "#F1F5F9", color: "#64748B" };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/email-templates"
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-50"
            style={{ borderColor: "#E2E8F0" }}
          >
            <ArrowLeft size={15} style={{ color: "#64748B" }} />
          </Link>
          <div>
            <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>{template.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {template.triggerEvent && (
                <code className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
                  {template.triggerEvent}
                </code>
              )}
              {template.category && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.bg, color: cat.color }}>
                  {template.category}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active toggle */}
          <button
            type="button"
            onClick={() => setIsActive(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all"
            style={isActive
              ? { borderColor: "#86EFAC", backgroundColor: "#F0FDF4", color: "#166534" }
              : { borderColor: "#E2E8F0", backgroundColor: "white", color: "#94A3B8" }
            }
          >
            {isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
            {isActive ? "Active" : "Inactive"}
          </button>
          <button
            type="button"
            onClick={() => setShowTestModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-colors"
            style={{ borderColor: "#1B3A6B", backgroundColor: "white", color: "#1B3A6B" }}
          >
            <Send size={13} />
            Send test
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors"
            style={{ backgroundColor: "#C8102E" }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save changes
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-semibold"
          style={toast.type === "success"
            ? { backgroundColor: "#DCFCE7", borderColor: "#86EFAC", color: "#166534" }
            : { backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }
          }
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Subject */}
      <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>Subject line</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className={INPUT}
            style={STYLE}
            placeholder="Email subject…"
          />
          <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>
            Use {"{{"} variable {"}}"}  e.g. <code>{"{{applicationId}}"}</code> — values are substituted when sent.
          </p>
        </div>

        {/* Variables reference */}
        {variables.length > 0 && (
          <div>
            <p className="text-[11px] font-bold mb-2" style={{ color: "#475569" }}>
              <Info size={11} className="inline mr-1" />
              Available variables — click to insert at cursor:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {variables.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insertVariable(v)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded border cursor-pointer transition-colors hover:bg-[#EEF4FF]"
                  style={{ borderColor: "#E2E8F0", color: "#1B3A6B", backgroundColor: "#F8FAFC" }}
                >
                  {"{{"}{v}{"}}"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recipients info */}
        <div className="flex items-center gap-4 text-xs" style={{ color: "#64748B" }}>
          {template.sendToStudent && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Sent to student
            </span>
          )}
          {template.sendToPartner && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              Sent to partner
            </span>
          )}
          {template.isAutoTrigger && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Auto-triggered
            </span>
          )}
        </div>
      </div>

      {/* Body editor with tabs */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex border-b" style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFAFA" }}>
          <button
            type="button"
            onClick={() => setTab("edit")}
            className="flex items-center gap-2 px-5 py-3 text-xs font-bold transition-colors"
            style={{
              borderBottom: tab === "edit" ? "2px solid #C8102E" : "2px solid transparent",
              color: tab === "edit" ? "#C8102E" : "#94A3B8",
            }}
          >
            <Code size={13} />
            HTML Editor
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className="flex items-center gap-2 px-5 py-3 text-xs font-bold transition-colors"
            style={{
              borderBottom: tab === "preview" ? "2px solid #1B3A6B" : "2px solid transparent",
              color: tab === "preview" ? "#1B3A6B" : "#94A3B8",
            }}
          >
            <Eye size={13} />
            Preview
          </button>
        </div>

        {tab === "edit" && (
          <div className="p-4">
            <p className="text-[11px] mb-2" style={{ color: "#94A3B8" }}>
              Edit the full HTML email body. Use inline styles for best email client compatibility.
            </p>
            <textarea
              id="template-body"
              value={bodyHtml}
              onChange={e => setBodyHtml(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-xs font-mono leading-relaxed resize-y focus:outline-none focus:border-[#29ABE2]"
              style={{ ...STYLE, minHeight: "500px" }}
              spellCheck={false}
            />
            <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>
              {bodyHtml.length.toLocaleString()} characters
            </p>
          </div>
        )}

        {tab === "preview" && (
          <div>
            <div className="px-5 py-2 border-b text-[11px]" style={{ borderColor: "#F1F5F9", backgroundColor: "#FFFBEB", color: "#92400E" }}>
              <Info size={11} className="inline mr-1" />
              Variables highlighted in yellow — showing sample values for preview
            </div>
            <iframe
              ref={previewRef}
              srcDoc={buildPreviewHtml()}
              className="w-full border-0"
              style={{ height: "600px" }}
              title="Email preview"
              sandbox="allow-same-origin"
            />
          </div>
        )}
      </div>

      {/* Test email modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl">
            <h3 className="text-lg font-black mb-1" style={{ color: "#0A1628" }}>Send test email</h3>
            <p className="text-sm mb-5" style={{ color: "#64748B" }}>
              Sends the current template (with placeholder values shown) to the address below.
            </p>
            <div className="mb-5">
              <label className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>Recipient email</label>
              <input
                type="email"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                className={INPUT}
                style={STYLE}
                placeholder="you@example.com"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: "#E2E8F0", color: "#64748B" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendTest}
                disabled={sendingTest}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: "#1B3A6B" }}
              >
                {sendingTest ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
