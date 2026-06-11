import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { universities } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import EditUniversityClient from "./_EditClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUniversityPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as any).role;
  if (!["admin", "staff"].includes(role)) redirect("/dashboard");

  const { id } = await params;

  // slug in the URL (from admin list links), fall back to UUID lookup
  const [university] = await db
    .select()
    .from(universities)
    .where(eq(universities.slug, id))
    .limit(1);

  const resolved = university ?? await (async () => {
    const [byId] = await db
      .select()
      .from(universities)
      .where(eq(universities.id, id))
      .limit(1);
    return byId;
  })();

  if (!resolved) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div
          className="flex items-start gap-3 p-5 rounded-xl"
          style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#991B1B" }}>
            University &quot;{id}&quot; not found in the database.
          </p>
        </div>
        <a href="/admin/universities" className="text-sm text-[#C8102E] underline mt-4 block">
          ← Back to universities
        </a>
      </div>
    );
  }

  return <EditUniversityClient university={resolved} />;
}
