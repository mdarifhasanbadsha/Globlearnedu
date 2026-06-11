"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarRange, CheckCircle2, XCircle, Globe, Plus, Loader2,
  RefreshCw, ChevronDown, Edit2, Trash2,
} from "lucide-react";

type Page = {
  id: string;
  slug: string;
  year: number;
  pageType: string;
  programType: string | null;
  isPublished: boolean | null;
  publishedAt: string | null;
  disclaimerActive: boolean | null;
  feesVerified: boolean | null;
  datesVerified: boolean | null;
  programsVerified: boolean | null;
  universityId: string | null;
  universityName: string | null;
  createdAt: string;
  updatedAt: string;
};

const PAGE_TYPE_LABELS: Record<string, string> = {
  university_admission: "University Admission",
  general_yearly: "General Yearly",
  intl_student_admission: "Intl. Student Admission",
  program_yearly: "Program Yearly",
};

function verifyScore(p: Page): number {
  return [p.feesVerified, p.datesVerified, p.programsVerified].filter(Boolean).length;
}

export default function ListClient({ pages: initialPages }: { pages: Page[] }) {
  const [pages, setPages] = useState(initialPages);
  const [yearFilter, setYearFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pubFilter, setPubFilter] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [genYear, setGenYear] = useState(new Date().getFullYear().toString());
  const [genFilter, setGenFilter] = useState<"all" | "985" | "211">("985");
  const [showGen, setShowGen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const years = useMemo(() => {
    const s = new Set(pages.map(p => String(p.year)));
    return Array.from(s).sort().reverse();
  }, [pages]);

  const filtered = useMemo(() => pages.filter(p => {
    if (yearFilter !== "all" && String(p.year) !== yearFilter) return false;
    if (typeFilter !== "all" && p.pageType !== typeFilter) return false;
    if (pubFilter === "published" && !p.isPublished) return false;
    if (pubFilter === "draft" && p.isPublished) return false;
    return true;
  }), [pages, yearFilter, typeFilter, pubFilter]);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/admission-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", year: Number(genYear), filter: genFilter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      showToast(data.message ?? `Created ${data.created} pages`);
      window.location.reload();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this admission page?")) return;
    await fetch(`/api/admin/admission-pages/${id}`, { method: "DELETE" });
    setPages(prev => prev.filter(p => p.id !== id));
    showToast("Page deleted");
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: toast.ok ? "#166534" : "#C8102E" }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Admission Scheduler</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {pages.length} pages total · {pages.filter(p => p.isPublished).length} published
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/admission-scheduler/new"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#1B3A6B" }}
          >
            <Plus size={14} />New Page
          </Link>
          <button
            onClick={() => setShowGen(v => !v)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold"
            style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}
          >
            <RefreshCw size={14} />Bulk Generate
            <ChevronDown size={12} className={showGen ? "rotate-180" : ""} />
          </button>
        </div>
      </div>

      {/* Bulk generate panel */}
      {showGen && (
        <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
            Bulk Generate University Admission Pages
          </p>
          <p className="text-xs" style={{ color: "#64748B" }}>
            Auto-creates one admission page per university. Skips existing pages (idempotent).
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "#64748B" }}>Year</label>
              <input
                type="number"
                value={genYear}
                onChange={e => setGenYear(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-24 focus:outline-none"
                style={{ borderColor: "#E2E8F0" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "#64748B" }}>Filter</label>
              <select
                value={genFilter}
                onChange={e => setGenFilter(e.target.value as "all" | "985" | "211")}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: "#E2E8F0" }}
              >
                <option value="985">985 universities only</option>
                <option value="211">211 universities only</option>
                <option value="all">All 1,500 universities</option>
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: "#C8102E" }}
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {generating ? "Generating…" : "Generate Now"}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm focus:outline-none"
          style={{ borderColor: "#E2E8F0" }}
        >
          <option value="all">All years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm focus:outline-none"
          style={{ borderColor: "#E2E8F0" }}
        >
          <option value="all">All types</option>
          {Object.entries(PAGE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          value={pubFilter}
          onChange={e => setPubFilter(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm focus:outline-none"
          style={{ borderColor: "#E2E8F0" }}
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <span className="text-sm ml-1" style={{ color: "#94A3B8" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: "#E2E8F0" }}>
          <CalendarRange size={40} className="mx-auto mb-3" style={{ color: "#CBD5E1" }} />
          <p className="font-bold" style={{ color: "#1B3A6B" }}>No pages found</p>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            Use Bulk Generate to create pages for all universities.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                  {["Page / University", "Year", "Type", "Verified", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const score = verifyScore(p);
                  return (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "#0A1628" }}>
                            {p.universityName ?? p.slug}
                          </p>
                          <p className="text-[11px] truncate max-w-[240px]" style={{ color: "#94A3B8" }}>
                            /{p.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-sm" style={{ color: "#1B3A6B" }}>{p.year}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                          style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
                          {PAGE_TYPE_LABELS[p.pageType] ?? p.pageType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {[
                            { done: p.feesVerified, label: "Fees" },
                            { done: p.datesVerified, label: "Dates" },
                            { done: p.programsVerified, label: "Programs" },
                          ].map(({ done, label }) => (
                            <span
                              key={label}
                              className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                              style={{
                                backgroundColor: done ? "#DCFCE7" : "#F1F5F9",
                                color: done ? "#166534" : "#94A3B8",
                              }}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{score}/3 verified</p>
                      </td>
                      <td className="px-4 py-3">
                        {p.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: "#166534" }}>
                            <Globe size={11} />Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: "#94A3B8" }}>
                            <XCircle size={11} />Draft
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/admission-scheduler/${p.id}`}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100"
                            title="Edit"
                          >
                            <Edit2 size={13} style={{ color: "#64748B" }} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={13} style={{ color: "#C8102E" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-xs" style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA", color: "#94A3B8" }}>
            Showing {filtered.length} of {pages.length} pages
          </div>
        </div>
      )}
    </div>
  );
}
