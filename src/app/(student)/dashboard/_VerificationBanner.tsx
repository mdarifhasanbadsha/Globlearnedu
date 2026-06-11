"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function VerificationBanner() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleResend() {
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/send-verification", { method: "POST" });
      const data = await res.json();
      setStatus(data.success || data.error === "already_verified" ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}>
        <CheckCircle2 size={18} style={{ color: "#16A34A", flexShrink: 0 }} />
        <p className="text-sm" style={{ color: "#166534" }}>
          Verification email sent! Check your inbox and click the link.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }}>
      <AlertCircle size={18} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "#92400E" }}>Email not verified</p>
        <p className="text-xs mt-0.5" style={{ color: "#B45309" }}>
          Verify your email to receive application updates and important notices.
        </p>
        {status === "error" && (
          <p className="text-xs mt-1 font-medium" style={{ color: "#C8102E" }}>
            Failed to send. Please try again.
          </p>
        )}
      </div>
      <button
        onClick={handleResend}
        disabled={status === "sending"}
        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-opacity"
        style={{ backgroundColor: "#D97706", color: "#fff", opacity: status === "sending" ? 0.7 : 1 }}
      >
        {status === "sending" ? (
          <><Loader2 size={11} className="animate-spin" />Sending…</>
        ) : (
          "Verify email"
        )}
      </button>
    </div>
  );
}
