import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users, partners, applicationUniversities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AppDetailClient from "./_AppDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function StaffApplicationDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const rows = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      programLevel: applications.programLevel,
      isUrgent: applications.isUrgent,
      assignedStaffId: applications.assignedStaffId,
      selectedUniversities: applications.selectedUniversities,
      scholarshipType: applications.scholarshipType,
      // Personal
      passportSurname: applications.passportSurname,
      passportGivenName: applications.passportGivenName,
      dateOfBirth: applications.dateOfBirth,
      gender: applications.gender,
      nationality: applications.nationality,
      passportNumber: applications.passportNumber,
      passportExpiry: applications.passportExpiry,
      // Contact
      phone: applications.phone,
      email: applications.email,
      addressCity: applications.addressCity,
      addressCountry: applications.addressCountry,
      // Personal extended
      religion: applications.religion,
      // Contact extended
      addressDetailed: applications.addressDetailed,
      addressPostcode: applications.addressPostcode,
      // Family + academic
      parentInfo: applications.parentInfo,
      sponsorInfo: applications.sponsorInfo,
      academicHistory: applications.academicHistory,
      workExperience: applications.workExperience,
      englishProficiency: applications.englishProficiency,
      chineseProficiency: applications.chineseProficiency,
      // China status
      isCurrentlyInChina: applications.isCurrentlyInChina,
      chinaStatus: applications.chinaStatus,
      // Application mode
      applicationMode: applications.applicationMode,
      // Internals
      internalNotes: applications.internalNotes,
      documents: applications.documents,
      depositPaid: applications.depositPaid,
      serviceChargePaid: applications.serviceChargePaid,
      partnerId: applications.partnerId,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      // Student
      studentId: applications.studentId,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentEmail: users.email,
      studentPhone: users.phone,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!rows[0]) notFound();

  const r = rows[0];

  // Fetch per-target rows from applicationUniversities
  const targetRows = await db
    .select({
      id: applicationUniversities.id,
      universityName: applicationUniversities.universityName,
      programName: applicationUniversities.programName,
      expectedMajor: applicationUniversities.expectedMajor,
      intake: applicationUniversities.intake,
      targetStatus: applicationUniversities.targetStatus,
      admissionNoticeUrl: applicationUniversities.admissionNoticeUrl,
      jw202Url: applicationUniversities.jw202Url,
      priority: applicationUniversities.priority,
      updatedAt: applicationUniversities.updatedAt,
    })
    .from(applicationUniversities)
    .where(eq(applicationUniversities.applicationId, id))
    .orderBy(applicationUniversities.priority);

  // Resolve partner name
  let partnerName = "Direct";
  if (r.partnerId) {
    const partnerRow = await db
      .select({ agencyName: partners.agencyName, agencyCountry: partners.agencyCountry })
      .from(partners)
      .where(eq(partners.id, r.partnerId))
      .limit(1);
    if (partnerRow[0]) {
      partnerName = [partnerRow[0].agencyName, partnerRow[0].agencyCountry].filter(Boolean).join(", ");
    }
  }

  // Parse internal notes
  const internalNotes = (r.internalNotes as Array<{ type: string; content: string; staffName: string; at: string }> | null) ?? [];
  const staffNotes = internalNotes.filter(n => n.type === "staff_note");

  const studentName = (
    [r.passportGivenName, r.passportSurname].filter(Boolean).join(" ")
    || [r.studentFirstName, r.studentLastName].filter(Boolean).join(" ")
    || r.studentEmail
    || "—"
  );

  const primaryUniversity = (() => {
    const univs = r.selectedUniversities as Array<{ universityName?: string }>;
    return Array.isArray(univs) && univs.length > 0 ? (univs[0].universityName ?? "—") : "—";
  })();

  const app = {
    id: r.id,
    applicationNumber: r.applicationNumber,
    status: r.status,
    programLevel: r.programLevel ?? "—",
    scholarshipType: r.scholarshipType,
    isUrgent: r.isUrgent ?? false,
    applicationMode: r.applicationMode ?? "submitted",
    studentName,
    nationality: r.nationality ?? "—",
    dateOfBirth: r.dateOfBirth ?? "—",
    gender: r.gender ?? "—",
    religion: r.religion ?? "—",
    passportNumber: r.passportNumber ?? "—",
    passportExpiry: r.passportExpiry ?? "—",
    email: r.email ?? r.studentEmail ?? "—",
    phone: r.phone ?? r.studentPhone ?? "—",
    city: r.addressCity ?? "—",
    country: r.addressCountry ?? r.nationality ?? "—",
    addressDetailed: r.addressDetailed ?? "—",
    addressPostcode: r.addressPostcode ?? "—",
    university: primaryUniversity,
    universities: r.selectedUniversities as Array<{ universityName?: string; programName?: string; expectedMajor?: string }>,
    // Extended fields
    parentInfo: (r.parentInfo ?? {}) as Record<string, unknown>,
    sponsorInfo: (r.sponsorInfo ?? {}) as Record<string, unknown>,
    academicHistory: (r.academicHistory ?? []) as Array<Record<string, unknown>>,
    workExperience: (r.workExperience ?? []) as Array<Record<string, unknown>>,
    englishProficiency: (r.englishProficiency ?? {}) as Record<string, unknown>,
    chineseProficiency: (r.chineseProficiency ?? {}) as Record<string, unknown>,
    isCurrentlyInChina: r.isCurrentlyInChina ?? false,
    chinaStatus: (r.chinaStatus ?? {}) as Record<string, unknown>,
    documents: (r.documents ?? {}) as Record<string, string>,
    depositPaid: r.depositPaid ?? false,
    serviceChargePaid: r.serviceChargePaid ?? false,
    partnerName,
    staffNotes,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
  };

  const targets = targetRows.map(t => ({
    id: t.id,
    universityName: t.universityName ?? "—",
    programName: t.programName ?? null,
    expectedMajor: t.expectedMajor ?? null,
    intake: t.intake ?? null,
    targetStatus: t.targetStatus ?? "pending",
    admissionNoticeUrl: t.admissionNoticeUrl ?? null,
    jw202Url: t.jw202Url ?? null,
    priority: t.priority ?? 1,
    updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : String(t.updatedAt),
  }));

  return <AppDetailClient app={app} targets={targets} />;
}
