import Link from "next/link";

const POSTS = [
  {
    slug: "csc-scholarship-2025-complete-guide",
    category: "Scholarships",
    categoryColor: "#C8102E",
    title: "CSC Scholarship 2025: Complete Application Guide for International Students",
    excerpt:
      "Everything you need to know about China Scholarship Council (CSC) applications — eligibility, required documents, deadlines and expert tips to maximise your chances.",
    readingTime: 8,
    date: "Jan 15, 2025",
    author: "GloblearnEdu Team",
  },
  {
    slug: "top-universities-china-international-students",
    category: "Universities",
    categoryColor: "#1B3A6B",
    title: "Top 10 Universities in China for International Students 2025",
    excerpt:
      "A comprehensive ranking of the best Chinese universities for international students, covering academics, campus life, scholarship availability and English-taught programs.",
    readingTime: 6,
    date: "Jan 22, 2025",
    author: "GloblearnEdu Team",
  },
  {
    slug: "chinese-student-visa-x1-x2-guide",
    category: "Visa Guide",
    categoryColor: "#29ABE2",
    title: "Chinese Student Visa (X1 & X2): A Step-by-Step Application Guide",
    excerpt:
      "A practical guide to applying for your Chinese student visa — required documents, embassy procedures, common mistakes to avoid and what Globlearn Education's 99% guidance record means for you.",
    readingTime: 7,
    date: "Feb 3, 2025",
    author: "GloblearnEdu Team",
  },
];

export function BlogPreview() {
  return (
    <section className="py-16" style={{ backgroundColor: "#F8FAFF" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#C8102E" }}
            >
              From Our Blog
            </p>
            <h2
              className="text-2xl sm:text-3xl font-black"
              style={{ color: "#1B3A6B" }}
            >
              Guides &amp; Resources
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: "#1B3A6B" }}
          >
            View All Posts
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col overflow-hidden group"
            >
              {/* Placeholder image area */}
              <div
                className="h-40 flex items-center justify-center text-white/20 text-6xl font-black"
                style={{ backgroundColor: post.categoryColor }}
              >
                {post.category.charAt(0)}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: post.categoryColor }}
                  >
                    {post.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{post.readingTime} min read</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-[#1B3A6B] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: "#1B3A6B" }}
          >
            View All Posts
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
