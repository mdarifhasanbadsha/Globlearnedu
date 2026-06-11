"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
      } else {
        setError("Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  }

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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {status === "sent" ? (
          <div className="text-center">
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#16A34A" }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Check your inbox</h2>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
              If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly. The link expires in 1 hour.
            </p>
            <Link
              href="/sign-in"
              className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#C8102E" }}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A6B" }}>Forgot your password?</h2>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
              Enter your email address and we&apos;ll send you a secure link to reset your password.
            </p>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm mb-4" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
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
                  <><Loader2 size={18} className="animate-spin" />Sending…</>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            <div className="mt-6 text-center" style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem" }}>
              <Link href="/sign-in" className="text-sm font-medium" style={{ color: "#C8102E" }}>
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
