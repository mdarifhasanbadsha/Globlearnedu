import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import BlogListClient from "./_BlogListClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    redirect("/sign-in");
  }

  const posts = await db
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
    .orderBy(desc(blogPosts.updatedAt));

  return <BlogListClient posts={posts} />;
}
