"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!token) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <XCircle size={48} className="mx-auto mb-4" style={{ color: "#C8102E" }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Invalid reset link</h2>
        <p className="text-sm mb-6" style={{ color: "#64748B" }}>
          This password reset link is missing or invalid. Please request a new one.
        </p>
        <Link href="/forgot-password" className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#C8102E" }}>
          Request new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Failed to reset password. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#16A34A" }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Password updated!</h2>
        <p className="text-sm mb-6" style={{ color: "#64748B" }}>
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <Link href="/sign-in" className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#C8102E" }}>
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A6B" }}>Set a new password</h2>
      <p className="text-sm mb-6" style={{ color: "#64748B" }}>
        Choose a strong password with at least 8 characters, one uppercase letter, and one number.
      </p>

      {(status === "error" || errorMsg) && (
        <div className="rounded-lg px-4 py-3 text-sm mb-4" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>New password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className="w-full border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none transition-colors"
              style={{ borderColor: "#D1D5DB" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#C8102E"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9CA3AF" }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Confirm password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
            style={{ borderColor: "#D1D5DB" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#C8102E"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; }}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: status === "loading" ? "#E57373" : "#C8102E" }}
        >
          {status === "loading" ? (
            <><Loader2 size={18} className="animate-spin" />Updating…</>
          ) : (
            "Update password"
          )}
        </button>
      </form>

      <div className="mt-6 text-center" style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem" }}>
        <Link href="/sign-in" className="text-sm font-medium" style={{ color: "#C8102E" }}>
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex items-center justify-center" style={{ height: "280px" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "#C8102E" }} />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
