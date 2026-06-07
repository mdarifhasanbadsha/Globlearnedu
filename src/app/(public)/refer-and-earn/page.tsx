import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refer & Earn",
  description: "Refer students to Globlearn Education and earn commission for every successful enrollment.",
};

export default function ReferAndEarnPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#1B3A6B" }}>Refer & Earn</h1>
      <p className="text-slate-600 mb-8 text-lg">
        Know a student who wants to study in China? Refer them to Globlearn Education
        and earn a commission for every successful enrollment.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { step: "1", title: "Share Your Link", desc: "Get a unique referral link after signing up." },
          { step: "2", title: "Student Enrolls", desc: "Your referred student completes their application." },
          { step: "3", title: "You Earn", desc: "Receive your commission upon successful enrollment." },
        ].map((item) => (
          <div key={item.step} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3"
              style={{ backgroundColor: "#C8102E" }}
            >
              {item.step}
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/sign-up"
          className="px-6 py-3 text-sm font-semibold text-white rounded-xl bg-[#C8102E] hover:bg-[#A50D25] transition-colors text-center"
        >
          Join & Get Referral Link
        </Link>
        <Link
          href="/partner"
          className="px-6 py-3 text-sm font-semibold text-slate-700 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors text-center"
        >
          Become a Partner Instead
        </Link>
      </div>
    </div>
  );
}
