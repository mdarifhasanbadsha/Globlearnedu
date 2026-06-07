"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ChevronRight, Tag } from "lucide-react";
import ApplyCTA from "~/components/shared/ApplyCTA";
import { blogPosts, blogCategories, formatDate } from "~/lib/data/blog";

const categoryColors: Record<string, string> = {
  Scholarships: "#FFD700",
  MBBS: "#C8102E",
  Universities: "#1B3A6B",
  "Study Tips": "#29ABE2",
  "Visa & Immigration": "#25D366",
  "Student Life": "#92610A",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0];
  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">
            Globlearn Education Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Study in China — Expert Guides
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Scholarships, MBBS, visa guidance, university comparisons, and student life — everything you need to know, written by our advisors.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-6">
            Featured Article
          </p>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-white rounded-2xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Accent bar */}
            <div
              className="h-2 w-full"
              style={{ backgroundColor: categoryColors[featured.category] ?? "#1B3A6B" }}
            />
            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: categoryColors[featured.category] ?? "#1B3A6B" }}
                >
                  {featured.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={12} />
                  {featured.readTime}
                </span>
                <span className="text-xs text-gray-400">{formatDate(featured.date)}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors mb-4 leading-tight">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-3xl">
                {featured.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors">
                Read full article <ChevronRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Category filter + grid */}
      <section className="py-4 px-4 bg-white border-b border-gray-100 sticky top-[68px] z-30 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 py-2">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat
                    ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-gray-500 mb-6">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div
                  className="h-1.5 w-full flex-shrink-0"
                  style={{ backgroundColor: categoryColors[post.category] ?? "#1B3A6B" }}
                />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: categoryColors[post.category] ?? "#1B3A6B" }}
                    >
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors mb-3 leading-snug flex-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors">
                      Read <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tags cloud */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-4">
            Topics We Cover
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "CSC Scholarship", "MBBS in China", "Bachelor's Degree", "Master's Degree",
              "PhD Scholarship", "Student Visa", "University Rankings", "Cost of Living",
              "Chinese Language", "Wuhan University", "Tsinghua", "Dalian Medical",
              "Study in China 2026", "China vs Philippines", "International Students",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
              >
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ApplyCTA
        title="Ready to study in China?"
        subtitle="Our advisors help with applications, scholarships, and visa guidance — one team, end-to-end."
      />
    </>
  );
}
