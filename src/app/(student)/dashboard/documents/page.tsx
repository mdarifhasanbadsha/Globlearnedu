"use client";

import { useState } from "react";
import { Upload, CheckCircle2, Clock, XCircle, FileText, Plus } from "lucide-react";

type DocStatus = "approved" | "under_review" | "uploaded" | "rejected" | "missing";

type Doc = {
  id: string;
  name: string;
  required: boolean;
  status: DocStatus;
  fileName?: string;
  rejectionReason?: string;
};

const INITIAL_DOCS: Doc[] = [
  { id: "passport", name: "Passport data page", required: true, status: "approved", fileName: "passport_rahman.pdf" },
  { id: "photo", name: "Passport-size photo", required: true, status: "approved", fileName: "photo_ahmed.jpg" },
  { id: "certificate", name: "Highest academic certificate", required: true, status: "approved", fileName: "hsc_certificate.pdf" },
  { id: "transcript", name: "Academic transcript", required: true, status: "approved", fileName: "hsc_transcript.pdf" },
  { id: "police", name: "Police clearance certificate", required: true, status: "approved", fileName: "police_clearance.pdf" },
  { id: "medical", name: "Physical examination report", required: true, status: "approved", fileName: "medical_form.pdf" },
  { id: "bank", name: "Bank statement", required: true, status: "under_review", fileName: "bank_statement_may26.pdf" },
  { id: "english_cert", name: "English proficiency certificate (IELTS)", required: false, status: "approved", fileName: "ielts_result.pdf" },
  { id: "hsk_cert", name: "Chinese proficiency certificate (HSK)", required: false, status: "missing" },
  { id: "rec1", name: "Recommendation letter 1", required: false, status: "missing" },
  { id: "rec2", name: "Recommendation letter 2", required: false, status: "missing" },
  { id: "intro_video", name: "Self-introduction video link", required: false, status: "missing" },
  { id: "equivalency", name: "Equivalency / ECA report", required: false, status: "missing" },
  { id: "visa_copy", name: "Current visa / residence permit copy", required: false, status: "missing" },
  { id: "enrollment", name: "Current enrollment letter", required: false, status: "missing" },
];

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  approved: { label: "Approved", color: "#16A34A", bg: "#F0FDF4", icon: CheckCircle2 },
  under_review: { label: "Under review", color: "#D97706", bg: "#FFFBEB", icon: Clock },
  uploaded: { label: "Uploaded", color: "#29ABE2", bg: "#E0F2FE", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "#C8102E", bg: "#FEF2F2", icon: XCircle },
  missing: { label: "Not uploaded", color: "#94A3B8", bg: "#F8FAFC", icon: FileText },
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>(INITIAL_DOCS);

  function handleReplace(id: string, file: File | null) {
    if (!file) return;
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: "uploaded" as DocStatus, fileName: file.name, rejectionReason: undefined } : d
      )
    );
  }

  const approved = docs.filter((d) => d.status === "approved").length;
  const underReview = docs.filter((d) => d.status === "under_review").length;
  const rejected = docs.filter((d) => d.status === "rejected").length;
  const uploaded = docs.filter((d) => d.status === "uploaded").length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>
          Documents
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Upload and manage your application documents.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Approved", value: approved, color: "#16A34A", bg: "#F0FDF4" },
          { label: "Under review", value: underReview, color: "#D97706", bg: "#FFFBEB" },
          { label: "Uploaded", value: uploaded, color: "#29ABE2", bg: "#E0F2FE" },
          { label: "Rejected", value: rejected, color: "#C8102E", bg: "#FEF2F2" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 border"
            style={{ backgroundColor: stat.bg, borderColor: stat.color + "30" }}
          >
            <p className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: stat.color }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {docs.map((doc) => {
          const cfg = STATUS_CONFIG[doc.status];
          const StatusIcon = cfg.icon;
          const canUpload = doc.status === "missing" || doc.status === "rejected" || doc.status === "uploaded";
          const canReplace = doc.status === "approved" || doc.status === "under_review";

          return (
            <div
              key={doc.id}
              className="flex items-start gap-4 p-4 rounded-xl border transition-colors"
              style={{ borderColor: doc.status === "missing" ? "#E2E8F0" : cfg.color + "40", backgroundColor: cfg.bg }}
            >
              <div className="flex-shrink-0 mt-0.5">
                <StatusIcon size={20} style={{ color: cfg.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-bold leading-snug" style={{ color: "#1B3A6B" }}>
                    {doc.name}
                  </p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: doc.required ? "#FEF2F2" : "#F1F5F9",
                      color: doc.required ? "#C8102E" : "#64748B",
                    }}
                  >
                    {doc.required ? "Required" : "Optional"}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cfg.color + "20", color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
                {doc.fileName && (
                  <p className="text-xs font-medium" style={{ color: "#64748B" }}>
                    {doc.fileName}
                  </p>
                )}
                {doc.rejectionReason && (
                  <p className="text-xs mt-1" style={{ color: "#C8102E" }}>
                    Reason: {doc.rejectionReason}
                  </p>
                )}
              </div>

              <label className="flex-shrink-0 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) => handleReplace(doc.id, e.target.files?.[0] ?? null)}
                />
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer"
                  style={{
                    borderColor: "#E2E8F0",
                    backgroundColor: "white",
                    color: "#475569",
                  }}
                >
                  <Upload size={12} />
                  {canReplace ? "Replace" : "Upload"}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {/* Upload additional */}
      <div className="mt-6 border-2 border-dashed rounded-2xl p-6 text-center" style={{ borderColor: "#E2E8F0" }}>
        <Plus size={20} className="mx-auto mb-2" style={{ color: "#94A3B8" }} />
        <p className="text-sm font-semibold mb-1" style={{ color: "#1B3A6B" }}>
          Upload additional document
        </p>
        <p className="text-xs mb-4" style={{ color: "#94A3B8" }}>
          Supporting letters, translations, or any other documents requested by your advisor.
        </p>
        <label className="cursor-pointer">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="sr-only" />
          <span
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#1B3A6B" }}
          >
            <Upload size={14} />
            Choose file
          </span>
        </label>
      </div>

      {/* Info */}
      <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FFD70040" }}>
        <p className="text-xs font-semibold" style={{ color: "#92610A" }}>
          💡 Files must be PDF, JPG, or PNG. Maximum 5 MB per file. Documents marked &ldquo;Under review&rdquo; are being checked by your Globlearn Education advisor — you&apos;ll be notified once reviewed.
        </p>
      </div>
    </div>
  );
}
