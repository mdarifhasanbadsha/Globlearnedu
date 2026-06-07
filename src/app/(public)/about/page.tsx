import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Globlearn Education — our mission, team and commitment to helping students study in China.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#1B3A6B" }}>About Globlearn Education</h1>
      <p className="text-slate-600 text-lg leading-relaxed mb-6">
        Globlearn Education is a dedicated consultancy helping students from Africa, Middle East
        and South Asia access top Chinese universities. We guide students through CSC, University,
        Provincial and Self-sponsored scholarship applications with transparent fees and dedicated support.
      </p>
      <p className="text-slate-600 mb-6">
        Our team has guided 500+ students to study in China, with a 99% visa guidance success rate.
        We believe every student deserves access to quality education at an affordable cost.
      </p>
      <p className="text-sm text-slate-500 italic mb-8">
        * Visa decisions are made by the Chinese Embassy. Our 99% figure reflects our guidance
        success based on student outcomes.
      </p>
      <Link
        href="/universities"
        className="inline-block px-6 py-3 text-sm font-semibold text-white rounded-lg bg-[#C8102E] hover:bg-[#A50D25] transition-colors"
      >
        Start Your Application
      </Link>
    </div>
  );
}
