import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Track Application",
  description: "Track your China university application status with Globlearn Education.",
};

export default function TrackPage() {
  return (
    <div className="max-w-xl mx-auto px-4 lg:px-6 py-16 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: "#EFF6FF" }}
      >
        <svg className="w-8 h-8 text-[#1B3A6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: "#1B3A6B" }}>Track Your Application</h1>
      <p className="text-slate-600 mb-8 text-sm">
        Sign in to your student portal to track your application status in real-time,
        view documents, and receive notifications.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/sign-in"
          className="px-6 py-3 text-sm font-semibold text-white rounded-xl bg-[#C8102E] hover:bg-[#A50D25] transition-colors"
        >
          Sign In to Track
        </Link>
        <Link
          href="/universities"
          className="px-6 py-3 text-sm font-semibold text-slate-700 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          Apply First
        </Link>
      </div>
    </div>
  );
}
