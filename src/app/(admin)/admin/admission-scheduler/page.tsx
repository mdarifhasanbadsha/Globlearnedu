import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { admissionYearPages, universities } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import ListClient from "./_ListClient";

export const dynamic = "force-dynamic";

export default async function AdmissionSchedulerPage() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    redirect("/sign-in");
  }

  const rows = await db
    .select({
      id: admissionYearPages.id,
      slug: admissionYearPages.slug,
      year: admissionYearPages.year,
      pageType: admissionYearPages.pageType,
      programType: admissionYearPages.programType,
      isPublished: admissionYearPages.isPublished,
      publishedAt: admissionYearPages.publishedAt,
      disclaimerActive: admissionYearPages.disclaimerActive,
      feesVerified: admissionYearPages.feesVerified,
      datesVerified: admissionYearPages.datesVerified,
      programsVerified: admissionYearPages.programsVerified,
      universityId: admissionYearPages.universityId,
      universityName: universities.nameEn,
      createdAt: admissionYearPages.createdAt,
      updatedAt: admissionYearPages.updatedAt,
    })
    .from(admissionYearPages)
    .leftJoin(universities, eq(admissionYearPages.universityId, universities.id))
    .orderBy(desc(admissionYearPages.updatedAt));

  const pages = rows.map(r => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
    publishedAt: r.publishedAt instanceof Date ? r.publishedAt.toISOString() : r.publishedAt,
  }));

  return <ListClient pages={pages} />;
}
