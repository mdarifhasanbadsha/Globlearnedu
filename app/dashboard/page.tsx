
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const apps = await prisma.application.findMany();

  return (
    <div>
      <h1>Applications</h1>
      {apps.map((a) => (
        <div key={a.id}>
          {a.userEmail} - {a.status}
        </div>
      ))}
    </div>
  );
}
