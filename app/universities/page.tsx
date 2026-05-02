
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const data = await prisma.university.findMany();

  return (
    <div>
      <h1>Universities</h1>
      {data.map((u) => (
        <div key={u.id}>
          <a href={`/universities/${u.slug}`}>{u.name}</a>
        </div>
      ))}
    </div>
  );
}
