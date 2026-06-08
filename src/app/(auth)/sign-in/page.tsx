"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A6B" }}>Welcome back</h2>
      <p className="text-sm mb-6" style={{ color: "#64748B" }}>
        Sign in to your Globlearn Education account
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

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" style={{ accentColor: "#C8102E" }} />
            <span className="text-sm" style={{ color: "#4B5563" }}>Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm font-medium" style={{ color: "#C8102E" }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: loading ? "#E57373" : "#C8102E" }}
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" />Signing in...</>
          ) : (
            "Sign in to my account"
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 space-y-3 text-center" style={{ borderTop: "1px solid #F1F5F9" }}>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold" style={{ color: "#C8102E" }}>
            Create account
          </Link>
        </p>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          Are you a partner?{" "}
          <Link href="/sign-up?type=partner" className="font-medium" style={{ color: "#1B3A6B" }}>
            Register as partner agency
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
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
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Student &amp; Partner Portal</p>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex items-center justify-center" style={{ height: "320px" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "#C8102E" }} />
        </div>
      }>
        <SignInForm />
      </Suspense>

      <p className="text-xs mt-6 text-center max-w-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
        Your data is secured and encrypted. Globlearn Education never shares your personal information.
      </p>
    </div>
  );
}
