"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Globe, EyeOff, CheckCircle2, Circle,
  CalendarRange, Loader2, Trash2, ChevronUp, ChevronDown,
} from "lucide-react";

type PageData = Record<string, unknown>;

type PageProps = {
  id: string;
  slug: string;
  year: number;
  pageType: string;
  programType: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  disclaimerActive: boolean;
  feesVerified: boolean;
  feesVerifiedAt: string | null;
  datesVerified: boolean;
  datesVerifiedAt: string | null;
  programsVerified: boolean;
  programsVerifiedAt: string | null;
  pageData: PageData;
  universityId: string | null;
  universityName: string | null;
  createdAt: string;
  updatedAt: string;
};

type Props = { page?: PageProps };

const PAGE_TYPE_OPTIONS = [
  { value: "university_admission", label: "University Admission" },
  { value: "general_yearly", label: "General Yearly" },
  { value: "intl_student_admission", label: "Intl. Student Admission" },
  { value: "program_yearly", label: "Program Yearly" },
];

function Section({
  title, children, defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold hover:bg-gray-50 transition-colors"
        style={{ color: "#1B3A6B" }}
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: "1px solid #F1F5F9" }}>
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}

function VerifyRow({
  label, verified, verifiedAt, onToggle, saving,
}: {
  label: string;
  verified: boolean;
  verifiedAt: string | null;
  onToggle: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F8FAFC" }}>
      <div className="flex items-center gap-3">
        {verified
          ? <CheckCircle2 size={18} style={{ color: "#166534" }} />
          : <Circle size={18} style={{ color: "#CBD5E1" }} />
        }
        <div>
          <p className="text-sm font-semibold" style={{ color: verified ? "#166534" : "#64748B" }}>{label}</p>
          {verified && verifiedAt && (
            <p className="text-[11px]" style={{ color: "#94A3B8" }}>
              Verified {new Date(verifiedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={saving}
        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
        style={{
          backgroundColor: verified ? "#DCFCE7" : "#F1F5F9",
          color: verified ? "#166534" : "#64748B",
        }}
      >
        {saving ? <Loader2 size={11} className="animate-spin" /> : verified ? "Mark Unverified" : "Mark Verified"}
      </button>
    </div>
  );
}

export default function AdmissionPageEditor({ page }: Props) {
  const router = useRouter();
  const isNew = !page;

  const [slug, setSlug] = useState(page?.slug ?? "");
  const [year, setYear] = useState(String(page?.year ?? new Date().getFullYear() + 1));
  const [pageType, setPageType] = useState(page?.pageType ?? "university_admission");
  const [programType, setProgramType] = useState(page?.programType ?? "");
  const [disclaimerActive, setDisclaimerActive] = useState(page?.disclaimerActive ?? true);
  const [isPublished, setIsPublished] = useState(page?.isPublished ?? false);
  const [feesVerified, setFeesVerified] = useState(page?.feesVerified ?? false);
  const [feesVerifiedAt, setFeesVerifiedAt] = useState(page?.feesVerifiedAt ?? null);
  const [datesVerified, setDatesVerified] = useState(page?.datesVerified ?? false);
  const [datesVerifiedAt, setDatesVerifiedAt] = useState(page?.datesVerifiedAt ?? null);
  const [programsVerified, setProgramsVerified] = useState(page?.programsVerified ?? false);
  const [programsVerifiedAt, setProgramsVerifiedAt] = useState(page?.programsVerifiedAt ?? null);

  // Page data fields
  const [feesContent, setFeesContent] = useState(
    (page?.pageData?.fees as string) ?? ""
  );
  const [datesContent, setDatesContent] = useState(
    (page?.pageData?.dates as string) ?? ""
  );
  const [programsContent, setProgramsContent] = useState(
    (page?.pageData?.programs as string) ?? ""
  );
  const [notes, setNotes] = useState(
    (page?.pageData?.notes as string) ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [verifySaving, setVerifySaving] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    try {
      const pageData: PageData = { fees: feesContent, dates: datesContent, programs: programsContent, notes };
      if (isNew) {
        const res = await fetch("/api/admin/admission-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            year: Number(year),
            pageType,
            slug: slug || undefined,
            programType: programType || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to create");
        showToast("Page created");
        router.push(`/admin/admission-scheduler/${data.page.id}`);
      } else {
        const res = await fetch(`/api/admin/admission-pages/${page!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            programType: programType || null,
            disclaimerActive,
            isPublished: publish !== undefined ? publish : isPublished,
            pageData,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to save");
        if (publish !== undefined) setIsPublished(publish);
        showToast(publish ? "Page published" : "Saved");
      }
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setSaving(false);
    }
  }

  async function handleVerify(field: "feesVerified" | "datesVerified" | "programsVerified", value: boolean) {
    if (!page) return;
    setVerifySaving(field);
    try {
      const res = await fetch(`/api/admin/admission-pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      const now = value ? new Date().toISOString() : null;
      if (field === "feesVerified") { setFeesVerified(value); setFeesVerifiedAt(now); }
      if (field === "datesVerified") { setDatesVerified(value); setDatesVerifiedAt(now); }
      if (field === "programsVerified") { setProgramsVerified(value); setProgramsVerifiedAt(now); }
      showToast(value ? "Marked verified" : "Marked unverified");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setVerifySaving("");
    }
  }

  async function handleDelete() {
    if (!page) return;
    try {
      await fetch(`/api/admin/admission-pages/${page.id}`, { method: "DELETE" });
      router.push("/admin/admission-scheduler");
    } catch {
      showToast("Delete failed", false);
    }
  }

  const verifyScore = [feesVerified, datesVerified, programsVerified].filter(Boolean).length;

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/admission-scheduler"
            className="mt-1 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-gray-100 transition-colors"
            style={{ border: "1px solid #E2E8F0" }}
          >
            <ArrowLeft size={15} style={{ color: "#64748B" }} />
          </Link>
          <div>
            <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>
              {isNew ? "New Admission Page" : (page.universityName ?? page.slug)}
            </h1>
            {!isNew && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs" style={{ color: "#94A3B8" }}>/{page.slug}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isPublished ? "#DCFCE7" : "#F1F5F9",
                    color: isPublished ? "#166534" : "#94A3B8",
                  }}
                >
                  {isPublished ? "Published" : "Draft"}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}
                >
                  {verifyScore}/3 verified
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
            style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>
          {!isNew && (
            isPublished ? (
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: "#64748B" }}
              >
                <EyeOff size={14} />Unpublish
              </button>
            ) : (
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: "#C8102E" }}
              >
                <Globe size={14} />Publish
              </button>
            )
          )}
        </div>
      </div>

      {/* Page Settings */}
      <Section title="Page Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Year *</label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(e.target.value)}
              disabled={!isNew}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#E2E8F0" }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Page Type *</label>
            <select
              value={pageType}
              onChange={e => setPageType(e.target.value)}
              disabled={!isNew}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#E2E8F0" }}
            >
              {PAGE_TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#E2E8F0" }}
              placeholder="auto-generated from university name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Program Type</label>
            <input
              type="text"
              value={programType}
              onChange={e => setProgramType(e.target.value)}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#E2E8F0" }}
              placeholder="e.g. mbbs, bachelor"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setDisclaimerActive(v => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors ${disclaimerActive ? "bg-[#29ABE2]" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${disclaimerActive ? "left-5" : "left-0.5"}`}
            />
          </button>
          <span className="text-sm" style={{ color: "#64748B" }}>Show disclaimer banner on this page</span>
        </div>
      </Section>

      {/* Content Sections */}
      <Section title="Fees Information">
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>
          Fees content (HTML supported)
        </label>
        <textarea
          value={feesContent}
          onChange={e => setFeesContent(e.target.value)}
          rows={8}
          className="w-full border rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 resize-y"
          style={{ borderColor: "#E2E8F0" }}
          placeholder="Enter fees information for this university and year..."
        />
      </Section>

      <Section title="Admission Dates">
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>
          Dates content (HTML supported)
        </label>
        <textarea
          value={datesContent}
          onChange={e => setDatesContent(e.target.value)}
          rows={8}
          className="w-full border rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 resize-y"
          style={{ borderColor: "#E2E8F0" }}
          placeholder="Enter key admission dates, deadlines, intake periods..."
        />
      </Section>

      <Section title="Programs Available">
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>
          Programs content (HTML supported)
        </label>
        <textarea
          value={programsContent}
          onChange={e => setProgramsContent(e.target.value)}
          rows={8}
          className="w-full border rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 resize-y"
          style={{ borderColor: "#E2E8F0" }}
          placeholder="List programs available for this intake year..."
        />
      </Section>

      <Section title="Internal Notes" defaultOpen={false}>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-y"
          style={{ borderColor: "#E2E8F0" }}
          placeholder="Internal notes, reminders, verification status notes..."
        />
      </Section>

      {/* Verification */}
      {!isNew && (
        <Section title="Content Verification">
          <p className="text-xs mb-4" style={{ color: "#94A3B8" }}>
            Mark each section as verified once the content has been checked and is accurate for {page.year}.
          </p>
          <VerifyRow
            label="Fees Verified"
            verified={feesVerified}
            verifiedAt={feesVerifiedAt}
            onToggle={() => handleVerify("feesVerified", !feesVerified)}
            saving={verifySaving === "feesVerified"}
          />
          <VerifyRow
            label="Dates Verified"
            verified={datesVerified}
            verifiedAt={datesVerifiedAt}
            onToggle={() => handleVerify("datesVerified", !datesVerified)}
            saving={verifySaving === "datesVerified"}
          />
          <VerifyRow
            label="Programs Verified"
            verified={programsVerified}
            verifiedAt={programsVerifiedAt}
            onToggle={() => handleVerify("programsVerified", !programsVerified)}
            saving={verifySaving === "programsVerified"}
          />
          {verifyScore === 3 && (
            <div
              className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ backgroundColor: "#DCFCE7", color: "#166534" }}
            >
              <CheckCircle2 size={15} />
              All sections verified — page is ready to publish
            </div>
          )}
        </Section>
      )}

      {/* Danger zone */}
      {!isNew && (
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#FEE2E2" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#C8102E" }}>Danger Zone</p>
          <p className="text-xs mb-3" style={{ color: "#94A3B8" }}>Deleting a page is permanent and cannot be undone.</p>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: "#C8102E" }}
              >
                Yes, delete permanently
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor: "#FEE2E2", color: "#C8102E" }}
            >
              <Trash2 size={14} />Delete Page
            </button>
          )}
        </div>
      )}

      {/* Bottom save */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Link
          href="/admin/admission-scheduler"
          className="px-5 py-2.5 rounded-xl text-sm font-bold"
          style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
        >
          Cancel
        </Link>
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: "#C8102E" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save
        </button>
      </div>
    </div>
  );
}
