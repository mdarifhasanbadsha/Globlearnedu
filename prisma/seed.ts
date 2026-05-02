
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.university.createMany({
    data: [
      { name: "University of Toronto", slug: "university-of-toronto", country: "Canada", description: "Top Canadian university" },
      { name: "University of Oxford", slug: "university-of-oxford", country: "UK", description: "Historic UK university" }
    ]
  });
}
main().finally(() => prisma.$disconnect());
