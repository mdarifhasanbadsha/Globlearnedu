import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ChevronRight, Tag, User } from "lucide-react";
import ApplyCTA from "~/components/shared/ApplyCTA";
import WhatsAppButton from "~/components/shared/WhatsAppButton";
import { blogPosts as staticBlogPosts, getPostBySlug, getRelatedPosts, formatDate } from "~/lib/data/blog";
import type { ContentBlock } from "~/lib/data/blog";
import { db } from "@/lib/db";
import { blogPosts as blogPostsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

const categoryColors: Record<string, string> = {
  Scholarships: "#FFD700",
  MBBS: "#C8102E",
  Universities: "#1B3A6B",
  "Study Tips": "#29ABE2",
  "Visa & Immigration": "#25D366",
  "Student Life": "#92610A",
  Admissions: "#1B3A6B",
  Visa: "#25D366",
  Programs: "#C8102E",
  News: "#29ABE2",
};

function catColor(c: string) { return categoryColors[c] ?? "#1B3A6B"; }

function fmtDate(d: Date | string | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// Static content block renderer (for static posts)
function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={idx} className="text-gray-600 leading-relaxed text-base mb-5">{block.text}</p>;
    case "h2":
      return <h2 key={idx} className="text-xl md:text-2xl font-black text-[#1B3A6B] mt-10 mb-4">{block.text}</h2>;
    case "h3":
      return <h3 key={idx} className="text-lg font-bold text-[#1B3A6B] mt-7 mb-3">{block.text}</h3>;
    case "ul":
      return (
        <ul key={idx} className="space-y-2 mb-6">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C8102E] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout": {
      const styles = {
        info:    { bg: "#EEF4FF", border: "#1B3A6B", text: "#1B3A6B", label: "Note" },
        tip:     { bg: "#F0FDF4", border: "#166534", text: "#166534", label: "Tip" },
        warning: { bg: "#FFF8EC", border: "#92610A", text: "#92610A", label: "Important" },
      };
      const s = styles[block.variant ?? "info"];
      return (
        <div key={idx} className="rounded-xl p-5 mb-6 border-l-4" style={{ backgroundColor: s.bg, borderColor: s.border }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: s.text }}>{s.label}</p>
          <p className="text-sm leading-relaxed" style={{ color: s.text }}>{block.text}</p>
        </div>
      );
    }
    case "table":
      return (
        <div key={idx} className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#1B3A6B" }}>
                {block.headers.map(h => <th key={h} className="text-left px-4 py-3 text-white font-semibold text-xs">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className={`border-t border-gray-100 ${ri % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-3 text-xs leading-relaxed ${ci === 0 ? "font-semibold text-[#1B3A6B]" : "text-gray-600"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Check DB first
  const [dbPost] = await db
    .select({ title: blogPostsTable.title, excerpt: blogPostsTable.excerpt, metaTitle: blogPostsTable.metaTitle, metaDescription: blogPostsTable.metaDescription })
    .from(blogPostsTable)
    .where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.status, "published")))
    .limit(1);

  if (dbPost) {
    return {
      title: `${dbPost.metaTitle ?? dbPost.title} | Blog`,
      description: dbPost.metaDescription ?? dbPost.excerpt ?? undefined,
    };
  }

  const staticPost = getPostBySlug(slug);
  if (!staticPost) return { title: "Article Not Found" };
  return { title: `${staticPost.title} | Blog`, description: staticPost.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // --- Try DB first ---
  const [dbPost] = await db
    .select()
    .from(blogPostsTable)
    .where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.status, "published")))
    .limit(1);

  if (dbPost) {
    const accentColor = catColor(dbPost.category ?? "");
    const relatedStatic = getRelatedPosts(slug, dbPost.category ?? "");

    return (
      <>
        {/* Hero */}
        <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <ChevronRight size={14} />
              <span className="font-semibold px-2.5 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: accentColor }}>
                {dbPost.category ?? "Article"}
              </span>
            </nav>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {dbPost.category && (
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                  {dbPost.category}
                </span>
              )}
              {dbPost.readingTimeMinutes && (
                <span className="flex items-center gap-1.5 text-white/60 text-xs">
                  <Clock size={13} />{dbPost.readingTimeMinutes} min read
                </span>
              )}
              <span className="text-white/60 text-xs">{fmtDate(dbPost.publishedAt)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{dbPost.title}</h1>
            {dbPost.excerpt && <p className="text-white/70 text-lg leading-relaxed mb-8">{dbPost.excerpt}</p>}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{dbPost.authorName ?? "GloblearnEdu Team"}</p>
                <p className="text-white/50 text-xs">Globlearn Education Advisor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Tags */}
            {Array.isArray(dbPost.tags) && (dbPost.tags as string[]).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-gray-100">
                {(dbPost.tags as string[]).map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    <Tag size={11} />{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content — rendered as HTML */}
            {dbPost.content ? (
              <div
                className="prose prose-sm max-w-none"
                style={{ color: "#374151" }}
                dangerouslySetInnerHTML={{ __html: dbPost.content }}
              />
            ) : (
              <p className="text-gray-400 italic">Content not yet available.</p>
            )}

            {/* Bottom CTA */}
            <div className="mt-12 rounded-2xl p-8 text-center" style={{ backgroundColor: "#1B3A6B" }}>
              <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-3">Ready to Apply?</p>
              <h3 className="text-2xl font-black text-white mb-3">Talk to a Globlearn Education Advisor</h3>
              <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
                Our advisors help with university selection, scholarship applications, and visa guidance — no upfront fees until you are admitted.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/universities" className="inline-flex items-center justify-center px-7 py-3 text-sm font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors">
                  Browse Universities
                </Link>
                <WhatsAppButton label="WhatsApp our advisors" message={`Hi! I just read your article about "${dbPost.title}" and I have some questions. Can you help?`} />
              </div>
            </div>
          </div>
        </article>

        {/* Related posts (static fallback) */}
        {relatedStatic.length > 0 && (
          <section className="py-14 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">More Articles</p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedStatic.map(rel => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-md transition-all overflow-hidden">
                    <div className="h-1.5 w-full" style={{ backgroundColor: catColor(rel.category) }} />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-400">{formatDate(rel.date)}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />{rel.readTime}</span>
                      </div>
                      <h3 className="font-bold text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors text-sm leading-snug mb-2">{rel.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{rel.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <ApplyCTA title="Start your China study journey today." subtitle="Globlearn Education guides you from application to arrival — scholarships, visa, and beyond." />
      </>
    );
  }

  // --- Static fallback ---
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, post.category);
  const accentColor = catColor(post.category);

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={14} />
            <span className="font-semibold px-2.5 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: accentColor }}>
              {post.category}
            </span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: accentColor }}>{post.category}</span>
            <span className="flex items-center gap-1.5 text-white/60 text-xs"><Clock size={13} />{post.readTime}</span>
            <span className="text-white/60 text-xs">{formatDate(post.date)}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{post.title}</h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8">{post.excerpt}</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{post.author}</p>
              <p className="text-white/50 text-xs">{post.authorRole}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-gray-100">
            {post.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                <Tag size={11} />{tag}
              </span>
            ))}
          </div>
          <div>{post.content.map((block, i) => renderBlock(block, i))}</div>
          <div className="mt-12 rounded-2xl p-8 text-center" style={{ backgroundColor: "#1B3A6B" }}>
            <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-3">Ready to Apply?</p>
            <h3 className="text-2xl font-black text-white mb-3">Talk to a Globlearn Education Advisor</h3>
            <p className="text-white/70 text-sm mb-6 max-w-lg mx-auto">
              Our advisors help with university selection, scholarship applications, and visa guidance — no upfront fees until you are admitted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/universities" className="inline-flex items-center justify-center px-7 py-3 text-sm font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors">
                Browse Universities
              </Link>
              <WhatsAppButton label="WhatsApp our advisors" message={`Hi! I just read your article about "${post.title}" and I have some questions. Can you help?`} />
            </div>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">More Articles</p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(rel => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-md transition-all overflow-hidden">
                  <div className="h-1.5 w-full" style={{ backgroundColor: catColor(rel.category) }} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-400">{formatDate(rel.date)}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />{rel.readTime}</span>
                    </div>
                    <h3 className="font-bold text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors text-sm leading-snug mb-2">{rel.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{rel.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ApplyCTA title="Start your China study journey today." subtitle="Globlearn Education guides you from application to arrival — scholarships, visa, and beyond." />
    </>
  );
}
