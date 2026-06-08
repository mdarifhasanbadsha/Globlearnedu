"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

const COUNTRIES = [
  "Bangladesh", "Nigeria", "Pakistan", "India", "Ghana", "Kenya",
  "Egypt", "Ethiopia", "Cameroon", "Zimbabwe", "Saudi Arabia", "Iran",
  "Indonesia", "Malaysia", "Morocco", "Philippines", "Tanzania",
  "Uganda", "Zambia", "Afghanistan", "Other",
];

function getPasswordStrength(p: string): { score: number; label: string; color: string } {
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#EF4444" };
  if (score <= 3) return { score, label: "Medium", color: "#F59E0B" };
  return { score, label: "Strong", color: "#22C55E" };
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") === "partner" ? "partner" : "student";

  const [accountType, setAccountType] = useState<"student" | "partner">(defaultType as "student" | "partner");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (!agreed) { setError("Please agree to the Terms of Service and Privacy Policy"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, country, role: accountType }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }

      const result = await signIn("credentials", { email: email.toLowerCase(), password, redirect: false });
      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#22C55E" }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Account created!</h2>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Your Globlearn Education account is ready.</p>
        <Link href="/sign-in" className="block w-full text-white font-bold py-3 rounded-lg text-center" style={{ backgroundColor: "#C8102E" }}>
          Sign in now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-xl font-bold mb-1" style={{ color: "#1B3A6B" }}>Create your account</h2>
      <p className="text-sm mb-5" style={{ color: "#64748B" }}>Join 5,000+ students guided by Globlearn Education</p>

      {/* Account type toggle */}
      <div className="flex rounded-lg p-1 mb-5" style={{ backgroundColor: "#F3F4F6" }}>
        {(["student", "partner"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setAccountType(type)}
            className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
            style={accountType === type
              ? { backgroundColor: "white", color: "#1B3A6B", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
              : { color: "#6B7280" }}
          >
            {type === "student" ? "Student" : "Partner Agency"}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg px-4 py-3 text-sm mb-4" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { label: "First name", value: firstName, set: setFirstName, placeholder: "Ahmed", auto: "given-name" },
            { label: "Last name", value: lastName, set: setLastName, placeholder: "Khan", auto: "family-name" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>{f.label}</label>
              <input
                type="text" value={f.value} onChange={(e) => f.set(e.target.value)}
                required placeholder={f.placeholder} autoComplete={f.auto}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: "#D1D5DB" }}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Email address</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            required autoComplete="email" placeholder="you@example.com"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none"
            style={{ borderColor: "#D1D5DB" }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Country</label>
          <select
            value={country} onChange={(e) => setCountry(e.target.value)} required
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white"
            style={{ borderColor: "#D1D5DB", color: country ? "#111827" : "#9CA3AF" }}
          >
            <option value="">Select your country</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              required autoComplete="new-password" placeholder="Min 8 chars, 1 uppercase, 1 number"
              className="w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none"
              style={{ borderColor: "#D1D5DB" }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div className="mt-1.5">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all"
                    style={{ backgroundColor: i <= strength.score ? strength.color : "#E5E7EB" }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: strength.color }}>{strength.label} password</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Confirm password</label>
          <input
            type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            required autoComplete="new-password" placeholder="Repeat your password"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none"
            style={{ borderColor: confirmPassword && confirmPassword !== password ? "#FCA5A5" : "#D1D5DB" }}
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="text-xs mt-1" style={{ color: "#EF4444" }}>Passwords do not match</p>
          )}
        </div>

        <label className="flex items-start gap-2 cursor-pointer pt-1">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ accentColor: "#C8102E" }} />
          <span className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
            I agree to Globlearn Education&apos;s{" "}
            <Link href="/terms" style={{ color: "#C8102E", textDecoration: "underline" }}>Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" style={{ color: "#C8102E", textDecoration: "underline" }}>Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit" disabled={loading || !agreed}
          className="w-full text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
          style={{ backgroundColor: loading || !agreed ? "#E57373" : "#C8102E" }}
        >
          {loading ? <><Loader2 size={18} className="animate-spin" />Creating account...</> : "Create my account"}
        </button>
      </form>

      <div className="mt-4 pt-4 text-center" style={{ borderTop: "1px solid #F1F5F9" }}>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold" style={{ color: "#C8102E" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: "#0A1628" }}>
      <div className="mb-6 text-center">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl"
          style={{ backgroundColor: "#1B3A6B", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-white font-black text-xl">GL</span>
        </div>
        <h1 className="text-white font-bold text-xl">Globlearn Education</h1>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Student &amp; Partner Portal</p>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-2xl p-8 flex items-center justify-center" style={{ height: "400px" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "#C8102E" }} />
        </div>
      }>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
