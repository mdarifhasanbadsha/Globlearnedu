import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import BlogPostEditor from "@/components/admin/BlogPostEditor";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    redirect("/sign-in");
  }

  return <BlogPostEditor />;
}
