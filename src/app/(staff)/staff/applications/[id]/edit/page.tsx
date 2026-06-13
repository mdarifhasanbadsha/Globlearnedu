import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import StaffEditClient from "./_EditClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function StaffEditPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const [row] = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      programLevel: applications.programLevel,
      isUrgent: applications.isUrgent,
      scholarshipType: applications.scholarshipType,
      nationality: applications.nationality,
      passportSurname: applications.passportSurname,
      passportGivenName: applications.passportGivenName,
      dateOfBirth: applications.dateOfBirth,
      gender: applications.gender,
      religion: applications.religion,
      passportNumber: applications.passportNumber,
      passportExpiry: applications.passportExpiry,
      phone: applications.phone,
      email: applications.email,
      addressCity: applications.addressCity,
      addressCountry: applications.addressCountry,
      addressDetailed: applications.addressDetailed,
      addressPostcode: applications.addressPostcode,
      selectedUniversities: applications.selectedUniversities,
      parentInfo: applications.parentInfo,
      sponsorInfo: applications.sponsorInfo,
      academicHistory: applications.academicHistory,
      workExperience: applications.workExperience,
      englishProficiency: applications.englishProficiency,
      chineseProficiency: applications.chineseProficiency,
      isCurrentlyInChina: applications.isCurrentlyInChina,
      chinaStatus: applications.chinaStatus,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentEmail: users.email,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) notFound();

  const studentName = (
    [row.passportGivenName, row.passportSurname].filter(Boolean).join(" ")
    || [row.studentFirstName, row.studentLastName].filter(Boolean).join(" ")
    || row.studentEmail || "—"
  );

  return (
    <StaffEditClient
      applicationId={id}
      applicationNumber={row.applicationNumber}
      studentName={studentName}
      initialData={{
        passportGivenName: row.passportGivenName ?? "",
        passportSurname: row.passportSurname ?? "",
        passportNumber: row.passportNumber ?? "",
        passportExpiry: row.passportExpiry ?? "",
        dateOfBirth: row.dateOfBirth ?? "",
        gender: row.gender ?? "",
        nationality: row.nationality ?? "",
        religion: row.religion ?? "",
        phone: row.phone ?? "",
        email: row.email ?? row.studentEmail ?? "",
        addressCity: row.addressCity ?? "",
        addressCountry: row.addressCountry ?? "",
        addressDetailed: row.addressDetailed ?? "",
        addressPostcode: row.addressPostcode ?? "",
        programLevel: row.programLevel ?? "",
        scholarshipType: row.scholarshipType ?? "",
        isUrgent: row.isUrgent ?? false,
        isCurrentlyInChina: row.isCurrentlyInChina ?? false,
        selectedUniversities: (row.selectedUniversities as Array<{
          universityId?: string; universityName?: string; programName?: string; expectedMajor?: string;
        }>) ?? [],
        parentInfo: (row.parentInfo as Record<string, string>) ?? {},
        sponsorInfo: (row.sponsorInfo as Record<string, string | boolean>) ?? {},
        academicHistory: (row.academicHistory as Array<Record<string, string>>) ?? [],
        workExperience: (row.workExperience as Array<Record<string, string>>) ?? [],
        englishProficiency: (row.englishProficiency as Record<string, string>) ?? {},
        chineseProficiency: (row.chineseProficiency as Record<string, string | boolean>) ?? {},
        chinaStatus: (row.chinaStatus as Record<string, string>) ?? {},
      }}
    />
  );
}
