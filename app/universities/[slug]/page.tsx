
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: any) {
  return {
    title: `Study at ${params.slug.replace("-", " ")}`,
    description: `Apply to ${params.slug}`
  };
}

export default async function Page({ params }: any) {
  const u = await prisma.university.findUnique({
    where: { slug: params.slug }
  });

  return (
    <div>
      <h1>Study at {u?.name}</h1>
      <p>{u?.description}</p>

      <h2>Admission Requirements</h2>
      <p>Submit transcripts and documents.</p>

      <form action="/api/applications" method="POST">
        <input name="userEmail" defaultValue="demo@test.com" />
        <input name="universityId" defaultValue={u?.id} hidden />
        <button>Apply</button>
      </form>
    </div>
  );
}
