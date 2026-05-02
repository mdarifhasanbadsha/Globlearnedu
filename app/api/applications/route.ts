
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const form = await req.formData();
  await prisma.application.create({
    data: {
      userEmail: String(form.get("userEmail")),
      universityId: String(form.get("universityId"))
    }
  });
  return new Response("OK");
}
