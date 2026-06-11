"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Edit2, ExternalLink, Plus, Globe, FileText, Clock, AlertCircle } from "lucide-react";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: unknown;
  authorName: string | null;
  status: "draft" | "in_review" | "published" | "scheduled";
  publishedAt: Date | string | null;
  readingTimeMinutes: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type Props = { posts: Post[] };

const STATUS_META: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  published: { label: "Published", bg: "#DCFCE7", color: "#166534", icon: <Globe size={10} /> },
  draft:     { label: "Draft",     bg: "#F1F5F9", color: "#64748B", icon: <FileText size={10} /> },
  in_review: { label: "In Review", bg: "#FEF9C3", color: "#854D0E", icon: <Clock size={10} /> },
  scheduled: { label: "Scheduled", bg: "#DBEAFE", color: "#1E40AF", icon: <Clock size={10} /> },
};

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  "Scholarships": { bg: "#FEF9C3", color: "#854D0E" },
  "Visa":         { bg: "#DBEAFE", color: "#1E40AF" },
  "Admissions":   { bg: "#DCFCE7", color: "#166534" },
  "Student Life": { bg: "#F5F3FF", color: "#5B21B6" },
  "Programs":     { bg: "#FFEDD5", color: "#9A3412" },
  "Universities": { bg: "#D1FAE5", color: "#065F46" },
  "MBBS":         { bg: "#FEE2E2", color: "#991B1B" },
  "News":         { bg: "#EEF4FF", color: "#1B3A6B" },
};

function fmt(iso: Date | string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogListClient({ posts }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const categories = ["All Categories", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean))) as string[]];
  const statuses = ["All", "published", "draft", "in_review"];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter(p => {
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchCat = categoryFilter === "All Categories" || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [search, statusFilter, categoryFilter, posts]);

  const counts = {
    all: posts.length,
    published: posts.filter(p => p.status === "published").length,
    draft: posts.filter(p => p.status === "draft").length,
    in_review: posts.filter(p => p.status === "in_review").length,
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Blog Posts</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {counts.all} total · {counts.published} published · {counts.draft} drafts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white self-start"
          style={{ backgroundColor: "#C8102E" }}
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => {
          const count = s === "All" ? counts.all : counts[s as keyof typeof counts] ?? 0;
          const meta = s === "All" ? null : STATUS_META[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all capitalize"
              style={{
                borderColor: statusFilter === s ? "#1B3A6B" : "#E2E8F0",
                backgroundColor: statusFilter === s ? "#1B3A6B" : "white",
                color: statusFilter === s ? "white" : "#64748B",
              }}
            >
              {meta && <span className="inline-flex items-center gap-1">{meta.icon}</span>}
              {s === "All" ? "All" : STATUS_META[s]?.label ?? s} ({count})
            </button>
          );
        })}
      </div>

      {/* Search + category filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search title or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none"
            style={{ borderColor: "#E2E8F0" }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle size={32} className="mx-auto mb-3" style={{ color: "#CBD5E1" }} />
            <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>No posts found</p>
            <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
              {posts.length === 0
                ? "Create your first post using the New Post button above."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                    {["Title", "Category", "Status", "Reading time", "Date", "Actions"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post, i) => {
                    const cat = CAT_COLORS[post.category ?? ""] ?? { bg: "#F1F5F9", color: "#475569" };
                    const sm = STATUS_META[post.status] ?? STATUS_META.draft;
                    const dateStr = post.publishedAt ? fmt(post.publishedAt) : fmt(post.updatedAt);
                    return (
                      <tr
                        key={post.id}
                        className="transition-colors hover:bg-gray-50"
                        style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                      >
                        <td className="px-5 py-3.5 max-w-[300px]">
                          <p className="font-semibold text-sm leading-snug" style={{ color: "#0A1628" }}>{post.title}</p>
                          <p className="text-[11px] mt-0.5 truncate" style={{ color: "#94A3B8" }}>
                            /blog/{post.slug}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          {post.category ? (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: cat.bg, color: cat.color }}>
                              {post.category}
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: "#CBD5E1" }}>—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: sm.bg, color: sm.color }}>
                            {sm.icon}
                            {sm.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                          {post.readingTimeMinutes ? `${post.readingTimeMinutes} min` : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>
                          {dateStr}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/admin/blog/${post.id}`}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                              title="Edit"
                            >
                              <Edit2 size={13} style={{ color: "#64748B" }} />
                            </Link>
                            {post.status === "published" && (
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                                title="View live"
                              >
                                <ExternalLink size={13} style={{ color: "#64748B" }} />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3" style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                Showing {filtered.length} of {posts.length} posts
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
