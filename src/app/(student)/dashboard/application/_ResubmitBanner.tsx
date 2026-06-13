"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResubmitBanner({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleResubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/applications/${applicationId}/resubmit`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setDone(true);
      setTimeout(() => router.refresh(), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl p-5 mb-6 flex items-center gap-3"
        style={{ backgroundColor: "#D1FAE5", border: "2px solid #6EE7B7" }}>
        <Check size={20} style={{ color: "#059669" }} />
        <p className="text-sm font-bold" style={{ color: "#065F46" }}>
          Application resubmitted! Your advisor will review the changes shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: "#FEF9C3", border: "2px solid #FCD34D" }}>
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FDE68A" }}>
          <AlertTriangle size={18} style={{ color: "#92400E" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black mb-1" style={{ color: "#92400E" }}>
            Your application needs to be updated
          </p>
          <p className="text-xs mb-4" style={{ color: "#A16207" }}>
            Your advisor has requested changes. Check your email for details of what to update,
            then upload new documents or make corrections below. When ready, click Resubmit.
          </p>
          {error && (
            <p className="text-xs font-semibold mb-3" style={{ color: "#C8102E" }}>{error}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/documents"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border"
              style={{ borderColor: "#92400E", color: "#92400E" }}
            >
              Update Documents <ArrowRight size={11} />
            </Link>
            <button
              onClick={handleResubmit}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-white disabled:opacity-60"
              style={{ backgroundColor: "#C8102E" }}
            >
              {submitting ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
              Confirm &amp; Resubmit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
