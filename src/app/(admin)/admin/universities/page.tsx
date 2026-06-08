"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, ExternalLink } from "lucide-react";
import { universitiesData } from "~/lib/data/universities";

const TIERS = ["All Tiers", "985", "211", "Medical", "Language", "Business", "Regular"];
const REGIONS = ["All Regions", "North", "East", "South", "Central", "West", "Northeast"];

export default function AdminUniversitiesPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [regionFilter, setRegionFilter] = useState("All Regions");

  const universities = useMemo(() => Object.values(universitiesData), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return universities.filter((u) => {
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.province.toLowerCase().includes(q);
      const matchTier = tierFilter === "All Tiers" || u.tier === tierFilter;
      const matchRegion = regionFilter === "All Regions" || u.region === regionFilter;
      return matchSearch && matchTier && matchRegion;
    });
  }, [universities, search, tierFilter, regionFilter]);

  const tierColors: Record<string, { bg: string; color: string }> = {
    "985":      { bg: "#FEF9C3", color: "#854D0E" },
    "211":      { bg: "#DBEAFE", color: "#1E40AF" },
    "Medical":  { bg: "#FEE2E2", color: "#991B1B" },
    "Language": { bg: "#D1FAE5", color: "#065F46" },
    "Business": { bg: "#F5F3FF", color: "#5B21B6" },
    "Regular":  { bg: "#F1F5F9", color: "#475569" },
  };

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>
            Universities
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {universities.length} universities in the database
          </p>
        </div>
        <Link
          href="/admin/universities/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#C8102E" }}
        >
          <Plus size={15} />
          Add University
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search by name, city, or province…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none"
            style={{ borderColor: "#E2E8F0" }}
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {TIERS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                {["University", "City / Province", "Tier", "Region", "Programs", "Tuition / yr", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "#94A3B8" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const tier = tierColors[u.tier] ?? { bg: "#F1F5F9", color: "#475569" };
                return (
                  <tr
                    key={u.slug}
                    className="transition-colors hover:bg-gray-50"
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-sm" style={{ color: "#0A1628" }}>
                        {u.name}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>
                        {u.chineseName}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                      {u.city}, {u.province}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: tier.bg, color: tier.color }}
                      >
                        {u.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                      {u.region}
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                      {u.programs.length} programs
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold" style={{ color: "#0A1628" }}>
                      {u.tuitionRMB}/yr
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/universities/${u.slug}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 size={13} style={{ color: "#64748B" }} />
                        </Link>
                        <Link
                          href={`/universities/${u.slug}`}
                          target="_blank"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                          title="View live page"
                        >
                          <ExternalLink size={13} style={{ color: "#64748B" }} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}
        >
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Showing {filtered.length} of {universities.length} universities
          </p>
        </div>
      </div>
    </div>
  );
}
