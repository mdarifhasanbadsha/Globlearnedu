import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore Bachelor, Master, PhD, MBBS and language programs at top Chinese universities with Globlearn Education.",
};

export default function ProgramsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#1B3A6B" }}>Programs</h1>
      <p className="text-slate-600 mb-8">
        Discover Bachelor, Master, PhD, MBBS, and language programs at China's top universities.
        Full program listings coming soon.
      </p>
      <Link
        href="/universities"
        className="inline-block px-6 py-3 text-sm font-semibold text-white rounded-lg bg-[#C8102E] hover:bg-[#A50D25] transition-colors"
      >
        Explore Universities
      </Link>
    </div>
  );
}
