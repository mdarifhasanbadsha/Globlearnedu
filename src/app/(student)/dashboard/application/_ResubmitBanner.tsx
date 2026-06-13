"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Pencil } from "lucide-react";

export default function ResubmitBanner({ applicationId }: { applicationId: string }) {
  void applicationId; // kept for API compatibility
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
            then click <strong>Edit Application</strong> to make your changes and resubmit.
          </p>
          <Link
            href="/dashboard/application/edit"
            className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white"
            style={{ backgroundColor: "#C8102E" }}
          >
            <Pencil size={14} />
            Edit &amp; Resubmit Application
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
