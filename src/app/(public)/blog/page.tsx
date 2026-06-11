import { db } from "@/lib/db";
import { blogPosts as blogPostsTable } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { blogPosts as staticPosts } from "~/lib/data/blog";
import BlogPageClient, { type PublicPost } from "./_BlogPageClient";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | string | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogPage() {
  // Fetch published posts from DB
  const dbPosts = await db
    .select({
      id: blogPostsTable.id,
      slug: blogPostsTable.slug,
      title: blogPostsTable.title,
      excerpt: blogPostsTable.excerpt,
      category: blogPostsTable.category,
      readingTimeMinutes: blogPostsTable.readingTimeMinutes,
      publishedAt: blogPostsTable.publishedAt,
      createdAt: blogPostsTable.createdAt,
    })
    .from(blogPostsTable)
    .where(eq(blogPostsTable.status, "published"))
    .orderBy(desc(blogPostsTable.publishedAt));

  const dbSlugs = new Set(dbPosts.map(p => p.slug));

  // Convert DB posts to PublicPost shape
  const dbPublicPosts: PublicPost[] = dbPosts.map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    category: p.category ?? "General",
    readTime: p.readingTimeMinutes ? `${p.readingTimeMinutes} min read` : "5 min read",
    date: fmtDate(p.publishedAt ?? p.createdAt),
    featured: false,
    source: "db" as const,
  }));

  // Static posts that aren't in DB (avoid duplicate slugs)
  const staticPublicPosts: PublicPost[] = staticPosts
    .filter(p => !dbSlugs.has(p.slug))
    .map(p => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readTime: p.readTime,
      date: p.date,
      featured: p.featured,
      source: "static" as const,
    }));

  // Mark first DB post as featured if no static featured post
  const hasStaticFeatured = staticPublicPosts.some(p => p.featured);
  if (!hasStaticFeatured && dbPublicPosts.length > 0) {
    dbPublicPosts[0].featured = true;
  }

  const allPosts = [...dbPublicPosts, ...staticPublicPosts];

  return <BlogPageClient posts={allPosts} />;
}
