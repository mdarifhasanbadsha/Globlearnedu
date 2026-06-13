import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, modificationRequests, notifications } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const SCHOLARSHIP_MAP: Record<string, string> = {
  csc: "csc", university: "university", provincial: "provincial",
  self: "self_sponsored", self_sponsored: "self_sponsored",
};
const PROGRAM_MAP: Record<string, string> = {
  "MBBS / Medicine": "mbbs", "Bachelor's": "bachelor", "Master's": "master", "PhD": "phd",
  "Chinese Language": "language", "Diploma": "diploma",
  "Foundation / Pre-University": "foundation", "Short Course / Exchange": "short_course",
  mbbs: "mbbs", bachelor: "bachelor", master: "master", phd: "phd",
  language: "language", diploma: "diploma", foundation: "foundation", short_course: "short_course",
};
const GENDER_MAP: Record<string, string> = {
  Male: "male", Female: "female", "Prefer not to say": "prefer_not_to_say",
  male: "male", female: "female", prefer_not_to_say: "prefer_not_to_say",
};
const MONTH_NAMES: Record<string, string> = {
  January:"01",February:"02",March:"03",April:"04",May:"05",June:"06",
  July:"07",August:"08",September:"09",October:"10",November:"11",December:"12",
};

function buildDate(year: string, month: string, day: string): string {
  if (!year || !month || !day) return "";
  const m = MONTH_NAMES[month] ?? String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

// POST /api/applications/[id]/resubmit
// Student saves all edited form data after a staff modification request
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [app] = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      studentId: applications.studentId,
      applicationMode: applications.applicationMode,
      assignedStaffId: applications.assignedStaffId,
    })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (app.studentId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (app.applicationMode !== "editable") {
    return NextResponse.json({ error: "Application is not open for modification" }, { status: 400 });
  }

  const body = await req.json();

  // ── Step 1: Programme ─────────────────────────────────────
  const scholarshipType = (SCHOLARSHIP_MAP[body.fundingType ?? body.scholarshipType] ?? "self_sponsored") as
    "csc" | "university" | "provincial" | "self_sponsored";
  const programLevel = (PROGRAM_MAP[body.degreeLevel ?? body.programLevel] ?? "bachelor") as
    "bachelor" | "master" | "phd" | "language" | "diploma" | "foundation" | "short_course" | "mbbs";

  const selectedUniversities = Array.isArray(body.selectedUniversities)
    ? body.selectedUniversities.map((u: Record<string, string>) => ({
        universityId: u.universityId ?? u.id ?? "",
        universityName: u.universityName ?? u.nameEn ?? "",
        programName: u.programName ?? "",
        expectedMajor: u.expectedMajor ?? u.programName ?? "",
      }))
    : [];

  // ── Step 2: Personal ──────────────────────────────────────
  const dateOfBirth = body.dateOfBirth ?? buildDate(body.dobYear, body.dobMonth, body.dobDay);
  const passportExpiry = body.passportExpiry ?? buildDate(body.passportExpiryYear, body.passportExpiryMonth, body.passportExpiryDay);
  const gender = (GENDER_MAP[body.gender ?? ""] ?? "prefer_not_to_say") as "male" | "female" | "prefer_not_to_say";

  // ── Step 3: Contact ───────────────────────────────────────
  const phone = body.phone ?? body.whatsapp ?? "";
  const addressDetailed = body.addressDetailed ?? body.address ?? "";
  const addressCountry = body.addressCountry ?? body.residenceCountry ?? "";

  // ── Step 4: Family ────────────────────────────────────────
  const parentInfo = body.parentInfo ?? {
    fatherName: body.fatherName ?? "",
    fatherOccupation: body.fatherOccupation ?? "",
    fatherPhone: body.fatherPhone ?? "",
    motherName: body.motherName ?? "",
    motherOccupation: body.motherOccupation ?? "",
    motherPhone: body.motherPhone ?? "",
  };
  const sponsorInfo = body.sponsorInfo ?? {
    isSameAsParent: !body.differentSponsor,
    sponsorName: body.sponsorName ?? "",
    sponsorRelationship: body.sponsorRelationship ?? "",
    sponsorOccupation: body.sponsorOccupation ?? "",
    sponsorPhone: body.sponsorPhone ?? "",
    annualIncomeRange: body.sponsorIncome ?? "",
  };

  // ── Step 5: Academic ──────────────────────────────────────
  const academicHistory = Array.isArray(body.academicHistory)
    ? body.academicHistory.map((h: Record<string, string | number>) => ({
        institution: String(h.institution ?? ""),
        qualification: String(h.qualification ?? h.degree ?? ""),
        fieldOfStudy: String(h.fieldOfStudy ?? h.field ?? ""),
        country: String(h.country ?? ""),
        startYear: typeof h.startYear === "number" ? h.startYear : (parseInt(String(h.startYear)) || 0),
        endYear: typeof h.endYear === "number" ? h.endYear : (parseInt(String(h.endYear)) || 0),
        grade: String(h.grade ?? ""),
      }))
    : [];

  const rawWork: Array<Record<string, string>> = Array.isArray(body.workHistory)
    ? body.workHistory
    : Array.isArray(body.workExperience) ? body.workExperience : [];
  const workExperience = rawWork.map((w) => ({
    employer: w.employer ?? "",
    jobTitle: w.jobTitle ?? w.title ?? "",
    country: w.country ?? "",
    startDate: w.startDate ?? "",
    endDate: w.endDate ?? "",
    description: w.description ?? "",
  }));

  // ── Step 6: Language ──────────────────────────────────────
  const englishProficiency = body.englishProficiency ?? (body.englishTestType
    ? { testType: body.englishTestType, score: body.englishScore ?? "", testDate: body.englishTestDate ?? "" }
    : {});
  const chineseProficiency = body.chineseProficiency ?? {
    hasHSK: body.hasChineseProficiency === true,
    hskLevel: body.hskLevel ?? "",
    hskScore: body.hskScore ?? "",
    hasHSKK: !!(body.hskkLevel),
    hskkLevel: body.hskkLevel ?? "",
    hskkScore: body.hskkScore ?? "",
  };

  // ── Step 7: China Status ──────────────────────────────────
  const isCurrentlyInChina = body.isCurrentlyInChina ?? body.inChina ?? false;
  const chinaStatus = body.chinaStatus ?? (isCurrentlyInChina ? {
    visaType: body.chinaVisaType ?? "",
    visaEntryDate: body.chinaVisaEntry ?? "",
    visaExpiryDate: body.chinaVisaExpiry ?? "",
    currentUniversity: body.chinaCurrentUniversity ?? "",
    currentAddress: body.chinaCurrentAddress ?? "",
  } : {});

  // ── Save everything, mark as resubmitted ─────────────────
  await db.update(applications).set({
    scholarshipType,
    programLevel,
    selectedUniversities,
    passportSurname: body.passportSurname ?? body.surname ?? null,
    passportGivenName: body.passportGivenName ?? body.givenNames ?? null,
    dateOfBirth: dateOfBirth || null,
    gender,
    nationality: body.nationality ?? null,
    passportNumber: body.passportNumber ?? null,
    passportExpiry: passportExpiry || null,
    religion: body.religion ?? null,
    phone,
    email: body.email ?? null,
    addressDetailed,
    addressCity: body.addressCity ?? null,
    addressPostcode: body.addressPostcode ?? null,
    addressCountry,
    parentInfo,
    sponsorInfo,
    academicHistory,
    workExperience,
    englishProficiency,
    chineseProficiency,
    isCurrentlyInChina,
    chinaStatus,
    applicationMode: "resubmitted",
    status: "submitted",
    updatedAt: new Date(),
  } as Parameters<typeof db.update>[0]["$inferInsert"])
    .where(and(eq(applications.id, id), eq(applications.studentId, session.user.id)));

  // Mark pending modification requests as resolved
  await db.update(modificationRequests)
    .set({ status: "resolved", resolvedAt: new Date() })
    .where(and(
      eq(modificationRequests.applicationId, id),
      eq(modificationRequests.status, "pending"),
    ))
    .catch(() => {});

  // Notify assigned staff
  if (app.assignedStaffId) {
    db.insert(notifications).values({
      userId: app.assignedStaffId,
      applicationId: id,
      title: `Application resubmitted — ${app.applicationNumber}`,
      message: `Student has updated and resubmitted application ${app.applicationNumber}. Please review the changes.`,
      channel: "in_portal",
      isRead: false,
    }).catch(() => {});
  }

  // Notify student
  db.insert(notifications).values({
    userId: session.user.id,
    applicationId: id,
    title: "Application Resubmitted",
    message: `Your updated application ${app.applicationNumber} has been submitted for review.`,
    channel: "in_portal",
    isRead: false,
  }).catch(() => {});

  return NextResponse.json({ ok: true, applicationNumber: app.applicationNumber });
}
