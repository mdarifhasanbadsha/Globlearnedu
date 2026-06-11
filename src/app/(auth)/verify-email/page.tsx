"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token found in the URL.");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.alreadyVerified) {
          setStatus("already");
        } else if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(data.error ?? "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("An unexpected error occurred. Please try again.");
      });
  }, [token]);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
      {status === "loading" && (
        <>
          <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: "#29ABE2" }} />
          <h2 className="text-lg font-bold" style={{ color: "#1B3A6B" }}>Verifying your email…</h2>
          <p className="text-sm mt-2" style={{ color: "#64748B" }}>Please wait a moment.</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#16A34A" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Email verified!</h2>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>
            Your email address has been successfully verified. You can now receive all updates about your application.
          </p>
          <Link
            href="/dashboard"
            className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#C8102E" }}
          >
            Go to my dashboard
          </Link>
        </>
      )}

      {status === "already" && (
        <>
          <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#29ABE2" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Already verified</h2>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>
            Your email address is already verified. You&apos;re all set!
          </p>
          <Link
            href="/dashboard"
            className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#C8102E" }}
          >
            Go to my dashboard
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle size={48} className="mx-auto mb-4" style={{ color: "#C8102E" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Verification failed</h2>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>{errorMsg}</p>
          <Link
            href="/dashboard"
            className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white mb-3"
            style={{ backgroundColor: "#C8102E" }}
          >
            Return to dashboard
          </Link>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            Need a new link?{" "}
            <Link href="/dashboard" className="underline font-medium" style={{ color: "#1B3A6B" }}>
              Request from your dashboard
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: "#0A1628" }}>
      <div className="mb-8 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
          style={{ backgroundColor: "#1B3A6B", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <span className="text-white font-black text-2xl">GL</span>
        </div>
        <h1 className="text-white font-bold text-2xl">Globlearn Education</h1>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex items-center justify-center" style={{ height: "220px" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "#C8102E" }} />
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
