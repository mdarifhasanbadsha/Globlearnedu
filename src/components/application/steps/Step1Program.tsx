"use client";

import { useState, useMemo } from "react";
import { Check, Search, X } from "lucide-react";
import type { FormData } from "../types";
import { universitiesData } from "~/lib/data/universities";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void };

const FUNDING_OPTIONS = [
  { id: "csc", label: "CSC Government Scholarship", desc: "Full tuition + ¥2,500–¥3,500/month stipend", recommended: true },
  { id: "university", label: "University Scholarship", desc: "50–100% tuition waiver, less competitive", recommended: false },
  { id: "provincial", label: "Provincial Scholarship", desc: "Jiangsu, Hubei, Shandong & more", recommended: false },
  { id: "self", label: "Self-sponsored", desc: "¥14,000–¥35,000/year — affordable cost", recommended: false },
];

const DEGREE_LEVELS = [
  "MBBS / Medicine", "Bachelor's", "Master's", "PhD",
  "Chinese Language", "Diploma", "Foundation / Pre-University", "Short Course / Exchange",
];

export default function Step1Program({ data, onChange }: Props) {
  const [search, setSearch] = useState("");

  const allUniversities = useMemo(() => Object.values(universitiesData), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allUniversities;
    return allUniversities.filter(
      (u) => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)
    );
  }, [search, allUniversities]);

  function toggleUniversity(slug: string) {
    const current = data.selectedUniversities;
    if (current.includes(slug)) {
      const nextPrograms = { ...data.universityPrograms };
      delete nextPrograms[slug];
      onChange({ selectedUniversities: current.filter((s) => s !== slug), universityPrograms: nextPrograms });
    } else if (current.length < 5) {
      onChange({ selectedUniversities: [...current, slug] });
    }
  }

  function setProgram(slug: string, program: string) {
    onChange({ universityPrograms: { ...data.universityPrograms, [slug]: program } });
  }

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>
        Choose your program and universities
      </h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        Select up to 5 universities. All must be the same degree level (exception: language programs can be combined with one degree program).
      </p>

      {/* ── Funding type ────────────────────────────── */}
      <div className="mb-8">
        <p className="text-sm font-bold mb-4 pb-2" style={{ color: "#1B3A6B", borderBottom: "1px solid #F1F5F9" }}>
          Funding type — select one
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FUNDING_OPTIONS.map((opt) => {
            const sel = data.fundingType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ fundingType: opt.id })}
                className="text-left p-4 rounded-xl border-2 transition-all"
                style={{ borderColor: sel ? "#C8102E" : "#E2E8F0", backgroundColor: sel ? "#FEF2F2" : "white" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold leading-snug" style={{ color: sel ? "#C8102E" : "#1B3A6B" }}>
                      {opt.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{opt.desc}</p>
                  </div>
                  {opt.recommended && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ backgroundColor: "#C8102E" }}>
                      Recommended
                    </span>
                  )}
                </div>
                {sel && (
                  <div className="flex items-center gap-1 mt-2">
                    <Check size={12} style={{ color: "#C8102E" }} />
                    <span className="text-[11px] font-semibold" style={{ color: "#C8102E" }}>Selected</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Degree level ────────────────────────────── */}
      <div className="mb-8">
        <p className="text-sm font-bold mb-4 pb-2" style={{ color: "#1B3A6B", borderBottom: "1px solid #F1F5F9" }}>
          Degree level — select one
        </p>
        <div className="flex flex-wrap gap-2">
          {DEGREE_LEVELS.map((level) => {
            const sel = data.degreeLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ degreeLevel: level })}
                className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
                style={{ borderColor: sel ? "#C8102E" : "#E2E8F0", backgroundColor: sel ? "#C8102E" : "white", color: sel ? "white" : "#475569" }}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── University selection ─────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
            Select universities (max 5)
          </p>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: data.selectedUniversities.length >= 5 ? "#FEF2F2" : "#EEF4FF",
              color: data.selectedUniversities.length >= 5 ? "#C8102E" : "#1B3A6B",
            }}
          >
            {data.selectedUniversities.length} / 5
          </span>
        </div>

        {/* Chips for selected */}
        {data.selectedUniversities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.selectedUniversities.map((slug) => {
              const uni = universitiesData[slug];
              return (
                <span
                  key={slug}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: "#1B3A6B" }}
                >
                  {uni?.name}
                  <button type="button" onClick={() => toggleUniversity(slug)} className="hover:opacity-70">
                    <X size={11} />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search university name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1B3A6B]"
          />
        </div>

        {/* University cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {filtered.map((uni) => {
            const sel = data.selectedUniversities.includes(uni.slug);
            const maxed = data.selectedUniversities.length >= 5 && !sel;
            const hasCsc = uni.scholarships.some((s) => s.toLowerCase().includes("csc"));
            return (
              <button
                key={uni.slug}
                type="button"
                onClick={() => toggleUniversity(uni.slug)}
                disabled={maxed}
                className="text-left p-4 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ borderColor: sel ? "#C8102E" : "#E2E8F0", backgroundColor: sel ? "#FEF2F2" : "white" }}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                    style={{ borderColor: sel ? "#C8102E" : "#CBD5E1", backgroundColor: sel ? "#C8102E" : "white" }}
                  >
                    {sel && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight truncate" style={{ color: "#1B3A6B" }}>
                      {uni.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                      {uni.city} · {uni.tuitionRMB}/yr
                    </p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
                        {uni.tier}
                      </span>
                      {hasCsc && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F0FDF4", color: "#166534" }}>
                          CSC
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {data.selectedUniversities.length >= 5 && (
          <p className="mt-3 text-xs font-semibold" style={{ color: "#C8102E" }}>
            Maximum 5 universities selected. Remove one to add another.
          </p>
        )}
      </div>

      {/* ── Per-university program ───────────────────── */}
      {data.selectedUniversities.length > 0 && (
        <div>
          <p className="text-sm font-bold mb-4 pb-2" style={{ color: "#1B3A6B", borderBottom: "1px solid #F1F5F9" }}>
            Select program for each university
          </p>
          <div className="space-y-3">
            {data.selectedUniversities.map((slug) => {
              const uni = universitiesData[slug];
              if (!uni) return null;
              return (
                <div key={slug} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm font-semibold sm:w-52 flex-shrink-0 truncate" style={{ color: "#1B3A6B" }}>
                    {uni.name}
                  </span>
                  <select
                    value={data.universityPrograms[slug] ?? ""}
                    onChange={(e) => setProgram(slug, e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1B3A6B]"
                  >
                    <option value="">— Select program —</option>
                    {uni.programs.map((p) => (
                      <option key={p.slug} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
