import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scholarships",
  description: "Explore CSC Government, University, Provincial and Self-sponsored scholarships for studying in China with Globlearn Education.",
};

const TYPES = [
  {
    title: "CSC Government Scholarship",
    description: "China Scholarship Council full scholarship covering tuition, accommodation & monthly stipend. Highly competitive, merit-based.",
    badge: "Full Coverage",
  },
  {
    title: "University Scholarship",
    description: "Partial to full tuition waivers offered directly by Chinese universities. Easier to obtain, rolling applications.",
    badge: "Partial to Full",
  },
  {
    title: "Provincial Government Scholarship",
    description: "Regional scholarships from provincial governments in China. Less competition, strong coverage for eligible students.",
    badge: "Regional Award",
  },
  {
    title: "Self-Sponsored",
    description: "Affordable tuition programs with transparent fees for students who prefer to self-fund their studies in China.",
    badge: "Affordable Cost",
  },
];

export default function ScholarshipsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Scholarships</h1>
      <p className="text-slate-600 mb-10 max-w-2xl">
        Globlearn Education supports all four scholarship pathways equally. We help you identify
        the best fit based on your profile and goals.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {TYPES.map((type) => (
          <div key={type.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <span
              className="inline-block text-xs font-semibold text-white px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              {type.badge}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mb-2">{type.title}</h2>
            <p className="text-sm text-slate-600">{type.description}</p>
          </div>
        ))}
      </div>
      <Link
        href="/universities"
        className="inline-block px-6 py-3 text-sm font-semibold text-white rounded-lg bg-[#C8102E] hover:bg-[#A50D25] transition-colors"
      >
        Apply Now — Affordable Cost
      </Link>
    </div>
  );
}
