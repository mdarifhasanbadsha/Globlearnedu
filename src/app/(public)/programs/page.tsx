"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  GraduationCap,
  BookOpen,
  Microscope,
  Languages,
  Award,
  Briefcase,
  Brain,
  ChevronRight,
  Clock,
  DollarSign,
} from "lucide-react";
import ApplyCTA from "~/components/shared/ApplyCTA";
import { programsList, programCategories } from "~/lib/data/programs";

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope size={28} />,
  GraduationCap: <GraduationCap size={28} />,
  BookOpen: <BookOpen size={28} />,
  Microscope: <Microscope size={28} />,
  Languages: <Languages size={28} />,
  Award: <Award size={28} />,
  Briefcase: <Briefcase size={28} />,
  Brain: <Brain size={28} />,
  Clock: <Clock size={28} />,
};

export default function ProgramsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? programsList
      : programsList.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">
            Globlearn Education
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Find Your Perfect Program
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            From MBBS to PhD, Foundation to Short Course — 8 program pathways at 280+ universities across China.
            All intakes for 2026–2027 are now open.
          </p>
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: "8", label: "Program Types" },
              { value: "280+", label: "Universities" },
              { value: "4 Types", label: "Scholarships" },
              { value: "80+", label: "Countries Served" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-[#FFD700]">{s.value}</div>
                <div className="text-white/60 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="sticky top-[68px] z-30 bg-white border-b border-gray-100 shadow-sm py-4 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {programCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat
                    ? "bg-[#C8102E] text-white border-[#C8102E]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Program cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">No programs found in this category.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {filtered.map((program) => (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Card top accent */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: program.color }}
                />
                <div className="p-6">
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: program.color }}
                    >
                      {iconMap[program.icon] ?? <Award size={28} />}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                      {program.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#1B3A6B] mb-2 group-hover:text-[#C8102E] transition-colors">
                    {program.name}
                  </h2>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{program.tagline}</p>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={13} />
                      {program.duration}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <DollarSign size={13} />
                      {program.tuitionRange}
                    </span>
                  </div>

                  {/* CTA row */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-[#C8102E] font-semibold">
                      Intake: {program.intakeMonths}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors">
                      View Program <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarship callout */}
      <section className="py-12 px-4 bg-[#FFD700]/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#92610A] mb-3">
            Scholarships Available
          </p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-3">
            All 4 Scholarship Types — One Application
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            CSC, University, Provincial, and Self-sponsored options available for every program.
            Globlearn Education matches you to the right funding based on your profile.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["CSC Scholarship", "University Scholarship", "Provincial Scholarship", "Self-Sponsored"].map(
              (s) => (
                <span
                  key={s}
                  className="px-4 py-2 rounded-full bg-[#1B3A6B] text-white text-sm font-semibold"
                >
                  {s}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <ApplyCTA
        title="Ready to start your program?"
        subtitle="Globlearn Education guides you from program selection to admission — scholarships, visa guidance, and arrival support."
      />
    </>
  );
}
