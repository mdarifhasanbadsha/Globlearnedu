import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BlogPostEditor from "@/components/admin/BlogPostEditor";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  if (!post) notFound();

  return (
    <BlogPostEditor
      post={{
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? null,
        content: post.content ?? null,
        featuredImageUrl: post.featuredImageUrl ?? null,
        category: post.category ?? null,
        tags: post.tags,
        status: post.status as "draft" | "in_review" | "published" | "scheduled",
        readingTimeMinutes: post.readingTimeMinutes ?? null,
        metaTitle: post.metaTitle ?? null,
        metaDescription: post.metaDescription ?? null,
        focusKeyword: post.focusKeyword ?? null,
      }}
    />
  );
}
