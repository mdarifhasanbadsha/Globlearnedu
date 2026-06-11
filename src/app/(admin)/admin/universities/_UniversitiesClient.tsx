"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, ExternalLink, ChevronLeft, ChevronRight, Star } from "lucide-react";

const TIERS = ["All Tiers", "985", "211", "Partner"];
const REGIONS = ["All Regions", "North", "East", "South", "Central", "West", "Northeast"];

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  "985": { bg: "#FEF9C3", color: "#854D0E" },
  "211": { bg: "#DBEAFE", color: "#1E40AF" },
};

const CONFIDENCE: Record<string, { label: string; bg: string; color: string }> = {
  verified:   { label: "Verified",   bg: "#DCFCE7", color: "#166534" },
  high:       { label: "High",       bg: "#DBEAFE", color: "#1E40AF" },
  medium:     { label: "Medium",     bg: "#FEF9C3", color: "#854D0E" },
  low:        { label: "Low",        bg: "#FEE2E2", color: "#991B1B" },
  skeleton:   { label: "Skeleton",   bg: "#F1F5F9", color: "#64748B" },
  unverified: { label: "N/A",         bg: "#F1F5F9", color: "#94A3B8" },
};

export type UniRow = {
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
  isActive: boolean | null;
  dataConfidence: string | null;
  website: string | null;
  programCount: number;
};

interface Props {
  universities: UniRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  q: string;
  tier: string;
  region: string;
}

export default function UniversitiesClient({
  universities,
  totalCount,
  page,
  pageSize,
  q,
  tier,
  region,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function navigate(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (!v || v === "All Tiers" || v === "All Regions") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    if (!("page" in updates)) params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const showFrom = totalCount === 0 ? 0 : page * pageSize + 1;
  const showTo = Math.min((page + 1) * pageSize, totalCount);

  return (
    <div className="max-w-[1300px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>
            Universities
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {totalCount.toLocaleString()} universities in the database
          </p>
        </div>
        <Link
          href="/admin/universities/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white w-fit"
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
            defaultValue={q}
            onChange={(e) => {
              const val = e.target.value;
              clearTimeout((window as any).__uniSearchTimer);
              (window as any).__uniSearchTimer = setTimeout(() => navigate({ q: val }), 400);
            }}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none"
            style={{ borderColor: "#E2E8F0" }}
          />
        </div>
        <select
          value={tier}
          onChange={(e) => navigate({ tier: e.target.value })}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {TIERS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select
          value={region}
          onChange={(e) => navigate({ region: e.target.value })}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "#E2E8F0", opacity: isPending ? 0.6 : 1, transition: "opacity 0.15s" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                {["University", "City / Province", "Tier", "Data Quality", "Programs", "Actions"].map((h) => (
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
              {universities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "#94A3B8" }}>
                    No universities match your filters.
                  </td>
                </tr>
              ) : universities.map((u, i) => {
                const conf = CONFIDENCE[u.dataConfidence ?? "unverified"] ?? CONFIDENCE.unverified;
                return (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-gray-50"
                    style={{ borderBottom: i < universities.length - 1 ? "1px solid #F8FAFC" : "none" }}
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-sm flex items-center gap-1.5" style={{ color: "#0A1628" }}>
                        {u.nameEn}
                        {u.isPartner && (
                          <Star size={11} fill="#FFD700" stroke="#FFD700" />
                        )}
                      </p>
                      {u.nameCn && (
                        <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>
                          {u.nameCn}
                        </p>
                      )}
                    </td>

                    {/* City / Province */}
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                      {[u.city, u.province].filter(Boolean).join(", ") || "—"}
                    </td>

                    {/* Tier badges */}
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1 flex-wrap">
                        {u.tier985 && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={TIER_COLORS["985"]}>985</span>
                        )}
                        {u.tier211 && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={TIER_COLORS["211"]}>211</span>
                        )}
                        {!u.tier985 && !u.tier211 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "#F1F5F9", color: "#94A3B8" }}>Regular</span>
                        )}
                        {u.qsRanking && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "#F5F3FF", color: "#5B21B6" }}>QS {u.qsRanking}</span>
                        )}
                      </div>
                    </td>

                    {/* Data confidence */}
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: conf.bg, color: conf.color }}
                      >
                        {conf.label}
                      </span>
                    </td>

                    {/* Program count */}
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                      {u.programCount > 0 ? `${u.programCount} programs` : "—"}
                    </td>

                    {/* Actions */}
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

        {/* Footer */}
        <div
          className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap"
          style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}
        >
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            {totalCount === 0
              ? "No results"
              : `Showing ${showFrom.toLocaleString()}–${showTo.toLocaleString()} of ${totalCount.toLocaleString()} universities`}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => navigate({ page: String(page - 1) })}
                className="w-8 h-8 rounded-lg flex items-center justify-center border disabled:opacity-40 hover:bg-gray-100 transition-colors"
                style={{ borderColor: "#E2E8F0" }}
              >
                <ChevronLeft size={14} style={{ color: "#475569" }} />
              </button>
              <span className="text-xs font-medium px-1" style={{ color: "#475569" }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => navigate({ page: String(page + 1) })}
                className="w-8 h-8 rounded-lg flex items-center justify-center border disabled:opacity-40 hover:bg-gray-100 transition-colors"
                style={{ borderColor: "#E2E8F0" }}
              >
                <ChevronRight size={14} style={{ color: "#475569" }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
