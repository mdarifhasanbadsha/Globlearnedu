"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, ChevronRight, Search, GraduationCap, Users, CheckCircle2 } from "lucide-react";
import ApplyCTA from "~/components/shared/ApplyCTA";

export type UniPublicRow = {
  id: string;
  slug: string;
  nameEn: string;
  nameCn: string | null;
  city: string | null;
  province: string | null;
  tier985: boolean | null;
  tier211: boolean | null;
  qsRanking: number | null;
  isPartner: boolean | null;
  description: string | null;
  programCount: number;
};

const TIERS = ["All", "985", "211", "Partner"] as const;
const REGIONS = ["All", "North", "East", "South", "Central", "West", "Northeast"] as const;

const PROVINCE_REGION: Record<string, string> = {
  Beijing: "North", Tianjin: "North", Hebei: "North", Shanxi: "North", "Inner Mongolia": "North",
  Shanghai: "East", Jiangsu: "East", Zhejiang: "East", Anhui: "East", Fujian: "East", Jiangxi: "East", Shandong: "East",
  Guangdong: "South", Guangxi: "South", Hainan: "South",
  Henan: "Central", Hubei: "Central", Hunan: "Central",
  Chongqing: "West", Sichuan: "West", Guizhou: "West", Yunnan: "West", Tibet: "West",
  Shaanxi: "West", Gansu: "West", Qinghai: "West", Ningxia: "West", Xinjiang: "West",
  Liaoning: "Northeast", Jilin: "Northeast", Heilongjiang: "Northeast",
};

function getTier(u: UniPublicRow) {
  if (u.tier985) return "985";
  if (u.tier211) return "211";
  return "Regular";
}

const TIER_COLOR: Record<string, string> = {
  "985": "#C8102E",
  "211": "#1B3A6B",
  "Regular": "#6B7280",
};
const TIER_BG: Record<string, string> = {
  "985": "#FEF2F2",
  "211": "#EFF6FF",
  "Regular": "#F3F4F6",
};

interface Props {
  universities: UniPublicRow[];
  totalCount: number;
}

export default function UniversitiesClient({ universities, totalCount }: Props) {
  const [query, setQuery] = useState("");
  const [activeTier, setActiveTier] = useState<string>("All");
  const [activeRegion, setActiveRegion] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return universities.filter((u) => {
      const matchesSearch =
        !q ||
        u.nameEn.toLowerCase().includes(q) ||
        (u.nameCn ?? "").toLowerCase().includes(q) ||
        (u.city ?? "").toLowerCase().includes(q) ||
        (u.province ?? "").toLowerCase().includes(q);

      const matchesTier =
        activeTier === "All" ||
        (activeTier === "985" && u.tier985) ||
        (activeTier === "211" && u.tier211) ||
        (activeTier === "Partner" && u.isPartner);

      const region = PROVINCE_REGION[u.province ?? ""];
      const matchesRegion = activeRegion === "All" || region === activeRegion;

      return matchesSearch && matchesTier && matchesRegion;
    });
  }, [query, activeTier, activeRegion, universities]);

  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">
            Globlearn Education
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {totalCount.toLocaleString()}+ Partner Universities
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Browse China&apos;s top universities — from 985 research giants to specialist medical and language schools.
            All intakes for 2026–2027 are now open.
          </p>

          <div className="max-w-xl mx-auto relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, or province..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-800 text-sm font-medium bg-white border-0 focus:outline-none focus:ring-2 focus:ring-[#29ABE2] shadow-lg"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { value: `${totalCount.toLocaleString()}+`, label: "Universities" },
              { value: "985 & 211", label: "Elite Tiers" },
              { value: "4 Types", label: "Scholarships" },
              { value: "8", label: "Programs Offered" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-[#FFD700]">{s.value}</div>
                <div className="text-white/60 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[68px] z-30 bg-white border-b border-gray-100 shadow-sm py-4 px-4">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {TIERS.map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeTier === tier
                    ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                }`}
              >
                {tier === "All" ? "All Types" : `${tier} Universities`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  activeRegion === region
                    ? "bg-[#29ABE2] text-white border-[#29ABE2]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#29ABE2] hover:text-[#29ABE2]"
                }`}
              >
                {region === "All" ? "All Regions" : `${region} China`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4 bg-gray-50 min-h-[50vh]">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-gray-500 mb-6">
            Showing{" "}
            <span className="font-bold text-[#1B3A6B]">{filtered.length.toLocaleString()}</span>{" "}
            {filtered.length === 1 ? "university" : "universities"}
            {activeTier !== "All" ? ` · ${activeTier}` : ""}
            {activeRegion !== "All" ? ` · ${activeRegion} China` : ""}
            {query ? ` · "${query}"` : ""}
          </p>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-semibold">No universities match your filters.</p>
              <button
                onClick={() => { setQuery(""); setActiveTier("All"); setActiveRegion("All"); }}
                className="mt-4 text-sm text-[#C8102E] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((uni) => {
              const tier = getTier(uni);
              const accentColor = TIER_COLOR[tier];
              const accentBg = TIER_BG[tier];
              const rankingLabel = uni.qsRanking ? `QS Top ${uni.qsRanking}` : null;

              return (
                <Link
                  key={uni.slug}
                  href={`/universities/${uni.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-3">
                        <h2 className="text-lg font-bold text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors leading-snug">
                          {uni.nameEn}
                        </h2>
                        {uni.nameCn && (
                          <p className="text-xs text-gray-400 mt-0.5">{uni.nameCn}</p>
                        )}
                      </div>
                      <span
                        className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: accentBg, color: accentColor }}
                      >
                        {tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin size={12} />
                        {[uni.city, uni.province].filter(Boolean).join(", ")}
                      </span>
                      {rankingLabel && (
                        <span className="text-xs font-semibold text-[#29ABE2]">{rankingLabel}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {uni.tier985 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700">985</span>
                      )}
                      {uni.tier211 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">211</span>
                      )}
                      {uni.isPartner && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">Partner</span>
                      )}
                      {uni.programCount > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {uni.programCount} programs
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">Tuition / year</p>
                        <p className="text-sm font-bold text-[#1B3A6B]">Contact for fees</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {(uni.tier985 || uni.tier211) && (
                          <span className="flex items-center gap-1 text-xs text-green-700 font-semibold">
                            <CheckCircle2 size={12} />
                            Scholarship
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-sm font-bold text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors">
                          View &amp; Apply <ChevronRight size={15} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why China callout */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
            Why Study in China
          </p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">The Globlearn Education Advantage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <GraduationCap size={28} className="text-[#1B3A6B]" />,
                title: "Expert University Matching",
                body: "We match your profile, budget, and program preference to the right university — not just any available slot.",
              },
              {
                icon: <CheckCircle2 size={28} className="text-[#C8102E]" />,
                title: "4 Scholarship Types",
                body: "CSC, University, Provincial, and Self-sponsored options — we apply to all relevant scholarships on your behalf.",
              },
              {
                icon: <Users size={28} className="text-[#25D366]" />,
                title: "End-to-End Support",
                body: "Application, admission, visa guidance, flight booking, and arrival support. One team, one process.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#1B3A6B] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ApplyCTA
        title="Find your university — we handle the rest."
        subtitle="Globlearn Education matches you to the right university, applies for scholarships, and guides your visa. Transparent fees, no surprises."
      />
    </>
  );
}
