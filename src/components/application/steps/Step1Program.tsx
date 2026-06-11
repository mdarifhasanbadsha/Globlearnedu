"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Search, X, Info, Plus, Trash2, AlertCircle } from "lucide-react";
import type { FormData, UniversityChoice } from "../types";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void };

const FUNDING_OPTIONS = [
  { id: "csc",        label: "CSC Government Scholarship",     desc: "Full tuition + ¥2,500–¥3,500/month stipend", recommended: true },
  { id: "university", label: "University Scholarship",          desc: "50–100% tuition waiver, less competitive" },
  { id: "provincial", label: "Provincial Scholarship",          desc: "Jiangsu, Hubei, Shandong & more" },
  { id: "self",       label: "Self-sponsored",                  desc: "¥14,000–¥35,000/year — affordable cost" },
];

const DEGREE_LEVELS = [
  "MBBS / Medicine", "Bachelor's", "Master's", "PhD",
  "Chinese Language", "Diploma", "Foundation / Pre-University", "Short Course / Exchange",
];

export default function Step1Program({ data, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<UniversityChoice[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch universities from real DB — debounced
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({ limit: "40" });
        if (search.trim()) params.set("search", search.trim());
        const res = await fetch(`/api/universities?${params}`);
        const data = await res.json();
        setResults(data.universities ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [search]);

  function toggleUniversity(uni: UniversityChoice) {
    const current = data.selectedUniversities;
    const exists = current.find((u) => u.id === uni.id);
    if (exists) {
      const nextMajors = { ...data.universityMajors };
      delete nextMajors[uni.id];
      onChange({ selectedUniversities: current.filter((u) => u.id !== uni.id), universityMajors: nextMajors });
    } else if (current.length < 5) {
      onChange({ selectedUniversities: [...current, uni] });
    }
  }

  function setMajor(uniId: string, major: string) {
    onChange({ universityMajors: { ...data.universityMajors, [uniId]: major } });
  }

  function addInterestMajor() {
    onChange({ interestMajors: [...(data.interestMajors ?? []), ""] });
  }

  function setInterestMajor(idx: number, val: string) {
    const arr = [...(data.interestMajors ?? [])];
    arr[idx] = val;
    onChange({ interestMajors: arr });
  }

  function removeInterestMajor(idx: number) {
    onChange({ interestMajors: (data.interestMajors ?? []).filter((_, i) => i !== idx) });
  }

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>
        Choose your program and universities
      </h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        Select up to 5 universities as preferences. All should be the same degree level.
      </p>

      {/* ── Funding type ─────────────────────────── */}
      <div className="mb-8">
        <p className="text-sm font-bold mb-4 pb-2" style={{ color: "#1B3A6B", borderBottom: "1px solid #F1F5F9" }}>
          Funding type — select one <span style={{ color: "#C8102E" }}>*</span>
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
                    <p className="text-sm font-bold leading-snug" style={{ color: sel ? "#C8102E" : "#1B3A6B" }}>{opt.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{opt.desc}</p>
                  </div>
                  {opt.recommended && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ backgroundColor: "#C8102E" }}>
                      Popular
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

      {/* ── Degree level ─────────────────────────── */}
      <div className="mb-8">
        <p className="text-sm font-bold mb-4 pb-2" style={{ color: "#1B3A6B", borderBottom: "1px solid #F1F5F9" }}>
          Degree level — select one <span style={{ color: "#C8102E" }}>*</span>
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

      {/* ── University selection ──────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
            Select universities (preference order, max 5) <span style={{ color: "#C8102E" }}>*</span>
          </p>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: data.selectedUniversities.length >= 5 ? "#FEF2F2" : "#EEF4FF", color: data.selectedUniversities.length >= 5 ? "#C8102E" : "#1B3A6B" }}>
            {data.selectedUniversities.length} / 5
          </span>
        </div>

        {/* Selected chips */}
        {data.selectedUniversities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.selectedUniversities.map((uni, i) => (
              <span key={uni.id} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: "#1B3A6B" }}>
                <span className="text-[10px] opacity-70">#{i + 1}</span>
                {uni.nameEn}
                {uni.isPartner && <span className="text-[9px] font-bold px-1 rounded" style={{ backgroundColor: "#FFD700", color: "#92610A" }}>Partner</span>}
                <button type="button" onClick={() => toggleUniversity(uni)} className="hover:opacity-70 ml-0.5">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search by university name, city, or province…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1B3A6B]"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "#E2E8F0", borderTopColor: "#1B3A6B" }} />
          )}
        </div>

        {/* University cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
          {results.map((uni) => {
            const sel = !!data.selectedUniversities.find((u) => u.id === uni.id);
            const maxed = data.selectedUniversities.length >= 5 && !sel;
            return (
              <button
                key={uni.id}
                type="button"
                onClick={() => toggleUniversity(uni)}
                disabled={maxed}
                className="text-left p-3.5 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ borderColor: sel ? "#C8102E" : "#E2E8F0", backgroundColor: sel ? "#FEF2F2" : "white" }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: sel ? "#C8102E" : "#CBD5E1", backgroundColor: sel ? "#C8102E" : "white" }}>
                    {sel && <Check size={10} color="white" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight truncate" style={{ color: "#1B3A6B" }}>{uni.nameEn}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{uni.city}{uni.province ? `, ${uni.province}` : ""}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {uni.tier985 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEF2F2", color: "#C8102E" }}>985</span>}
                      {uni.tier211 && !uni.tier985 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>211</span>}
                      {uni.isPartner && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FFFBEB", color: "#92610A" }}>Partner</span>}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {!searching && results.length === 0 && (
            <div className="col-span-2 py-8 text-center text-sm" style={{ color: "#94A3B8" }}>
              {search.trim() ? `No universities found for "${search}"` : "Type to search all 1,500+ universities"}
            </div>
          )}
        </div>
        {data.selectedUniversities.length >= 5 && (
          <p className="mt-2 text-xs font-semibold" style={{ color: "#C8102E" }}>
            Maximum 5 universities selected. Remove one to add another.
          </p>
        )}
      </div>

      {/* ── Expected major per university ────────────── */}
      {data.selectedUniversities.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-bold mb-1 pb-2" style={{ color: "#1B3A6B", borderBottom: "1px solid #F1F5F9" }}>
            Expected major / field of study
          </p>
          <p className="text-xs mb-4" style={{ color: "#64748B" }}>
            Enter your intended major at each university. If unsure, write your preferred subject area.
          </p>
          <div className="space-y-3">
            {data.selectedUniversities.map((uni, i) => (
              <div key={uni.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-1.5 sm:w-52 flex-shrink-0">
                  <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: "#1B3A6B" }}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold truncate" style={{ color: "#1B3A6B" }}>{uni.nameEn}</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Clinical Medicine, Computer Science, Business Administration…"
                  value={data.universityMajors[uni.id] ?? ""}
                  onChange={(e) => setMajor(uni.id, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#1B3A6B]"
                />
              </div>
            ))}
          </div>

          {/* Additional interested majors */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold" style={{ color: "#64748B" }}>
                Other interested fields of study (optional)
              </p>
              {(data.interestMajors ?? []).length < 3 && (
                <button
                  type="button"
                  onClick={addInterestMajor}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                  style={{ borderColor: "#E2E8F0", color: "#1B3A6B" }}
                >
                  <Plus size={11} />
                  Add field
                </button>
              )}
            </div>
            {(data.interestMajors ?? []).map((m, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Biomedical Engineering"
                  value={m}
                  onChange={(e) => setInterestMajor(idx, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#1B3A6B]"
                />
                <button type="button" onClick={() => removeInterestMajor(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Globlearn disclaimer ──────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-xl border mt-2" style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }}>
        <AlertCircle size={15} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
          <strong>Programme availability notice:</strong> If your selected programme is not available at your chosen
          universities, Globlearn Education reserves the right to place you in a similar programme at a comparable
          institution based on availability, your academic profile, and scholarship requirements. Our advisors will
          contact you before making any changes.
        </p>
      </div>
    </div>
  );
}
