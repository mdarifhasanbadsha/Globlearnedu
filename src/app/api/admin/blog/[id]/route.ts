import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/admin/blog/[id]
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ post });
}

// PATCH /api/admin/blog/[id]
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const {
    title, slug, excerpt, content, featuredImageUrl,
    category, tags, status, readingTimeMinutes,
    metaTitle, metaDescription, focusKeyword,
  } = body;

  const [existing] = await db.select({ status: blogPosts.status, publishedAt: blogPosts.publishedAt })
    .from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const finalTags = Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : undefined);

  const wasPublished = existing.status === "published";
  const nowPublished = status === "published";
  const publishedAt = nowPublished ? (wasPublished ? existing.publishedAt : new Date()) : null;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (title !== undefined) updates.title = title.trim();
  if (slug !== undefined) updates.slug = slug.trim();
  if (excerpt !== undefined) updates.excerpt = excerpt?.trim() || null;
  if (content !== undefined) updates.content = content || null;
  if (featuredImageUrl !== undefined) updates.featuredImageUrl = featuredImageUrl?.trim() || null;
  if (category !== undefined) updates.category = category?.trim() || null;
  if (finalTags !== undefined) updates.tags = finalTags;
  if (status !== undefined) updates.status = status;
  if (publishedAt !== undefined) updates.publishedAt = publishedAt;
  if (readingTimeMinutes !== undefined) updates.readingTimeMinutes = readingTimeMinutes ? Number(readingTimeMinutes) : null;
  if (metaTitle !== undefined) updates.metaTitle = metaTitle?.trim() || null;
  if (metaDescription !== undefined) updates.metaDescription = metaDescription?.trim() || null;
  if (focusKeyword !== undefined) updates.focusKeyword = focusKeyword?.trim() || null;

  try {
    const [post] = await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id)).returning();
    return NextResponse.json({ post });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique")) {
      return NextResponse.json({ error: `Slug already exists` }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return NextResponse.json({ success: true });
}
