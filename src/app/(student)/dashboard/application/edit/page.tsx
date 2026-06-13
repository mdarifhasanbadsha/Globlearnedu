export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ApplicationForm from "~/components/application/ApplicationForm";
import type { FormData } from "~/components/application/types";
import { getPaymentConfig } from "@/lib/payments/manual";

const SCHOLARSHIP_REVERSE: Record<string, string> = {
  csc: "csc", university: "university", provincial: "provincial", self_sponsored: "self",
};

const PROGRAM_REVERSE: Record<string, string> = {
  mbbs: "MBBS / Medicine",
  bachelor: "Bachelor's",
  master: "Master's",
  phd: "PhD",
  language: "Chinese Language",
  diploma: "Diploma",
  foundation: "Foundation / Pre-University",
  short_course: "Short Course / Exchange",
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function parseDate(iso: string | null | undefined): { year: string; month: string; day: string } {
  if (!iso) return { year: "", month: "", day: "" };
  const parts = iso.split("-");
  if (parts.length < 3) return { year: "", month: "", day: "" };
  const [yr, mo, dy] = parts;
  return {
    year: yr,
    month: MONTHS[parseInt(mo) - 1] ?? "",
    day: String(parseInt(dy)),
  };
}

function genderToForm(g: string | null | undefined): string {
  if (g === "male") return "Male";
  if (g === "female") return "Female";
  return "Prefer not to say";
}

export default async function EditApplicationPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const [app, paymentConfig] = await Promise.all([
    db.query.applications.findFirst({
      where: eq(applications.studentId, session.user.id),
      orderBy: [desc(applications.createdAt)],
    }),
    getPaymentConfig(),
  ]);

  if (!app) redirect("/dashboard/apply");
  if (app.applicationMode !== "editable") redirect("/dashboard/application");

  // ── Map DB data → FormData ────────────────────────────────────────

  // Step 1
  const fundingType = SCHOLARSHIP_REVERSE[app.scholarshipType ?? ""] ?? "";
  const degreeLevel = PROGRAM_REVERSE[app.programLevel ?? ""] ?? "";

  const rawUnivs = (app.selectedUniversities as Array<{
    universityId?: string; universityName?: string; programName?: string; expectedMajor?: string;
  }>) ?? [];

  const selectedUniversities = rawUnivs.map(u => ({
    id: u.universityId ?? "",
    slug: u.universityId ?? "",
    nameEn: u.universityName ?? "",
    city: "",
    province: "",
    tier985: false,
    tier211: false,
    isPartner: false,
  }));

  const universityMajors: Record<string, string> = {};
  for (const u of rawUnivs) {
    if (u.universityId) universityMajors[u.universityId] = u.programName ?? "";
  }

  // Step 2
  const dob = parseDate(app.dateOfBirth);
  const expiry = parseDate(app.passportExpiry);

  // Step 3
  const addressCity = app.addressCity ?? "";
  const addressPostcode = app.addressPostcode ?? "";

  // Step 4
  const parentInfo = (app.parentInfo as Record<string, string>) ?? {};
  const sponsorInfo = (app.sponsorInfo as Record<string, string | boolean>) ?? {};
  const isSameAsParent = sponsorInfo.isSameAsParent === true;

  // Step 5
  type DbAcademic = { institution?: string; qualification?: string; fieldOfStudy?: string; country?: string; startYear?: number | string; endYear?: number | string; grade?: string };
  const rawAcademics = (app.academicHistory as DbAcademic[]) ?? [];
  const academicHistory = rawAcademics.map(h => ({
    institution: h.institution ?? "",
    degree: h.qualification ?? "",
    field: h.fieldOfStudy ?? "",
    country: h.country ?? "",
    startYear: String(h.startYear ?? ""),
    endYear: String(h.endYear ?? ""),
    grade: h.grade ?? "",
  }));

  type DbWork = { employer?: string; jobTitle?: string; country?: string; startDate?: string; endDate?: string; description?: string };
  const rawWork = (app.workExperience as DbWork[]) ?? [];
  const workHistory = rawWork.map(w => ({
    employer: w.employer ?? "",
    title: w.jobTitle ?? "",
    country: w.country ?? "",
    startDate: w.startDate ?? "",
    endDate: w.endDate ?? "",
    description: w.description ?? "",
  }));

  // Step 6
  const eng = (app.englishProficiency as Record<string, string>) ?? {};
  const chn = (app.chineseProficiency as Record<string, string | boolean>) ?? {};

  // Step 7
  const china = (app.chinaStatus as Record<string, string>) ?? {};

  const initialData: Partial<FormData> = {
    // Step 1
    fundingType,
    degreeLevel,
    selectedUniversities,
    universityMajors,
    // Step 2
    surname: app.passportSurname ?? "",
    givenNames: app.passportGivenName ?? "",
    dobYear: dob.year,
    dobMonth: dob.month,
    dobDay: dob.day,
    gender: genderToForm(app.gender),
    nationality: app.nationality ?? "",
    passportNumber: app.passportNumber ?? "",
    passportExpiryYear: expiry.year,
    passportExpiryMonth: expiry.month,
    passportExpiryDay: expiry.day,
    religion: app.religion ?? "",
    // Step 3
    whatsapp: app.phone ?? "",
    email: app.email ?? "",
    address: app.addressDetailed ?? "",
    addressCity,
    addressPostcode,
    residenceCountry: app.addressCountry ?? "",
    // Step 4
    fatherName: String(parentInfo.fatherName ?? ""),
    fatherOccupation: String(parentInfo.fatherOccupation ?? ""),
    fatherPhone: String(parentInfo.fatherPhone ?? ""),
    motherName: String(parentInfo.motherName ?? ""),
    motherOccupation: String(parentInfo.motherOccupation ?? ""),
    motherPhone: String(parentInfo.motherPhone ?? ""),
    differentSponsor: !isSameAsParent,
    sponsorName: String(sponsorInfo.sponsorName ?? ""),
    sponsorRelationship: String(sponsorInfo.sponsorRelationship ?? ""),
    sponsorOccupation: String(sponsorInfo.sponsorOccupation ?? ""),
    sponsorPhone: String(sponsorInfo.sponsorPhone ?? ""),
    sponsorIncome: String(sponsorInfo.annualIncomeRange ?? ""),
    // Step 5
    academicHistory: academicHistory.length > 0 ? academicHistory : [{ institution: "", degree: "", field: "", country: "", startYear: "", endYear: "", grade: "" }],
    hasWorkExperience: workHistory.length > 0,
    workHistory,
    // Step 6
    englishTestType: eng.testType ?? "",
    englishScore: eng.score ?? "",
    englishTestDate: eng.testDate ?? "",
    hasChineseProficiency: chn.hasHSK === true,
    hskLevel: String(chn.hskLevel ?? ""),
    hskScore: String(chn.hskScore ?? ""),
    hskkLevel: String(chn.hskkLevel ?? ""),
    // Step 7
    inChina: app.isCurrentlyInChina ?? false,
    chinaVisaType: china.visaType ?? "",
    chinaVisaEntry: china.visaEntryDate ?? "",
    chinaVisaExpiry: china.visaExpiryDate ?? "",
    chinaCurrentUniversity: china.currentUniversity ?? "",
    chinaCurrentAddress: china.currentAddress ?? "",
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#C8102E" }}>
          Modification Requested
        </p>
        <h1 className="text-2xl font-black" style={{ color: "#1B3A6B" }}>
          Update Your Application
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Your advisor has requested changes. Update any sections below and submit when ready.
          All your existing information has been pre-filled.
        </p>
      </div>
      <ApplicationForm initialData={initialData} applicationId={app.id} paymentConfig={paymentConfig} />
    </div>
  );
}
