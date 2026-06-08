"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Star, Edit2, ExternalLink, Plus } from "lucide-react";
import { blogPosts } from "~/lib/data/blog";

const CATEGORIES = ["All Categories", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

export default function AdminBlogPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogPosts.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = categoryFilter === "All Categories" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter]);

  const categoryColors: Record<string, { bg: string; color: string }> = {
    "Scholarships":   { bg: "#FEF9C3", color: "#854D0E" },
    "Visa":           { bg: "#DBEAFE", color: "#1E40AF" },
    "Admissions":     { bg: "#DCFCE7", color: "#166534" },
    "Student Life":   { bg: "#F5F3FF", color: "#5B21B6" },
    "Programs":       { bg: "#FFEDD5", color: "#9A3412" },
    "Universities":   { bg: "#D1FAE5", color: "#065F46" },
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Blog Posts</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {blogPosts.length} articles published
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#C8102E" }}
          onClick={() => alert("Connect to CMS to create new posts.")}
        >
          <Plus size={15} />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search title, author, category, tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none"
            style={{ borderColor: "#E2E8F0" }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#475569" }}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                {["Title", "Category", "Author", "Reading Time", "Published", "Featured", "Actions"].map((h) => (
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
              {filtered.map((post, i) => {
                const cat = categoryColors[post.category] ?? { bg: "#F1F5F9", color: "#475569" };
                return (
                  <tr
                    key={post.slug}
                    className="transition-colors hover:bg-gray-50"
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                  >
                    <td className="px-5 py-3.5 max-w-[300px]">
                      <p className="font-semibold text-sm leading-snug" style={{ color: "#0A1628" }}>
                        {post.title}
                      </p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: "#94A3B8" }}>
                        {post.tags.slice(0, 3).join(" · ")}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: cat.bg, color: cat.color }}
                      >
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                      {post.author}
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>
                      {post.readTime}
                    </td>
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>
                      {post.date}
                    </td>
                    <td className="px-5 py-3.5">
                      {post.featured ? (
                        <Star size={15} style={{ color: "#F59E0B" }} fill="#F59E0B" />
                      ) : (
                        <span className="text-xs" style={{ color: "#CBD5E1" }}>—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/${post.slug}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 size={13} style={{ color: "#64748B" }} />
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                          title="View live"
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
          className="px-5 py-3"
          style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}
        >
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Showing {filtered.length} of {blogPosts.length} posts
          </p>
        </div>
      </div>
    </div>
  );
}
