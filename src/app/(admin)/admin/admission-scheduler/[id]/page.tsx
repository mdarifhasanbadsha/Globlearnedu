import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { admissionYearPages, universities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AdmissionPageEditor from "@/components/admin/AdmissionPageEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditAdmissionPagePage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    redirect("/sign-in");
  }

  const { id } = await params;

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
      feesVerifiedAt: admissionYearPages.feesVerifiedAt,
      datesVerified: admissionYearPages.datesVerified,
      datesVerifiedAt: admissionYearPages.datesVerifiedAt,
      programsVerified: admissionYearPages.programsVerified,
      programsVerifiedAt: admissionYearPages.programsVerifiedAt,
      pageData: admissionYearPages.pageData,
      universityId: admissionYearPages.universityId,
      universityName: universities.nameEn,
      createdAt: admissionYearPages.createdAt,
      updatedAt: admissionYearPages.updatedAt,
    })
    .from(admissionYearPages)
    .leftJoin(universities, eq(admissionYearPages.universityId, universities.id))
    .where(eq(admissionYearPages.id, id))
    .limit(1);

  if (!rows[0]) notFound();

  const r = rows[0];
  const page = {
    id: r.id,
    slug: r.slug,
    year: r.year,
    pageType: r.pageType as string,
    programType: r.programType,
    isPublished: r.isPublished ?? false,
    publishedAt: r.publishedAt instanceof Date ? r.publishedAt.toISOString() : r.publishedAt,
    disclaimerActive: r.disclaimerActive ?? true,
    feesVerified: r.feesVerified ?? false,
    feesVerifiedAt: r.feesVerifiedAt instanceof Date ? r.feesVerifiedAt.toISOString() : r.feesVerifiedAt,
    datesVerified: r.datesVerified ?? false,
    datesVerifiedAt: r.datesVerifiedAt instanceof Date ? r.datesVerifiedAt.toISOString() : r.datesVerifiedAt,
    programsVerified: r.programsVerified ?? false,
    programsVerifiedAt: r.programsVerifiedAt instanceof Date ? r.programsVerifiedAt.toISOString() : r.programsVerifiedAt,
    pageData: (r.pageData ?? {}) as Record<string, unknown>,
    universityId: r.universityId,
    universityName: r.universityName,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
  };

  return <AdmissionPageEditor page={page} />;
}
