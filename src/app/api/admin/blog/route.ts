import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, ilike, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/blog — list all posts
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();

  const rows = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      tags: blogPosts.tags,
      authorName: blogPosts.authorName,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      readingTimeMinutes: blogPosts.readingTimeMinutes,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(
      search
        ? or(
            ilike(blogPosts.title, `%${search}%`),
            ilike(blogPosts.category, `%${search}%`),
          )
        : undefined
    )
    .orderBy(desc(blogPosts.updatedAt));

  return NextResponse.json({ posts: rows });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

// POST /api/admin/blog — create new post
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title, slug: rawSlug, excerpt, content, featuredImageUrl,
    category, tags, status, readingTimeMinutes,
    metaTitle, metaDescription, focusKeyword,
  } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = rawSlug?.trim() ? slugify(rawSlug.trim()) : slugify(title.trim());
  const finalTags = Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []);
  const publishedAt = status === "published" ? new Date() : null;

  try {
    const [post] = await db
      .insert(blogPosts)
      .values({
        slug,
        title: title.trim(),
        excerpt: excerpt?.trim() || null,
        content: content || null,
        featuredImageUrl: featuredImageUrl?.trim() || null,
        category: category?.trim() || null,
        tags: finalTags,
        authorName: "GloblearnEdu Team",
        status: status ?? "draft",
        publishedAt,
        readingTimeMinutes: readingTimeMinutes ? Number(readingTimeMinutes) : null,
        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
        focusKeyword: focusKeyword?.trim() || null,
      })
      .returning();

    return NextResponse.json({ post }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique")) {
      return NextResponse.json({ error: `Slug "${slug}" already exists. Edit the slug and try again.` }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
