"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  applicationId: string;
  paymentId?: string;
}

export default function PaymentSlipUpload({ applicationId, paymentId }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum 5MB.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("applicationId", applicationId);
      if (paymentId) formData.append("paymentId", paymentId);

      const res = await fetch("/api/upload/payment-slip", { method: "POST", body: formData });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Upload failed");
      }
      setUploaded(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (uploaded) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
        style={{ backgroundColor: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}
      >
        <CheckCircle2 size={16} />
        Payment slip uploaded — your advisor will review it shortly.
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
        style={{ backgroundColor: "#1B3A6B" }}
      >
        <Upload size={15} />
        {uploading ? "Uploading…" : "Upload payment slip"}
      </button>
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "#C8102E" }}>
          <AlertCircle size={13} />
          {error}
        </div>
      )}
      <p className="text-[11px] mt-1.5" style={{ color: "#94A3B8" }}>
        PDF, JPG, PNG accepted · max 5 MB
      </p>
    </div>
  );
}
