export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, applicationUniversities, users, partners } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { generateApplicationNumber } from "@/lib/utils";
import { sendApplicationReceivedNotification, writePortalNotification } from "@/lib/email/notifications";

const uniSchema = z.object({
  universityId: z.string(),
  universityName: z.string(),
  programName: z.string(),
  expectedMajor: z.string().optional(),
});

const createSchema = z.object({
  scholarshipType: z.enum(["csc", "university", "provincial", "self_sponsored"]),
  programLevel: z.enum(["bachelor", "master", "phd", "language", "diploma", "foundation", "short_course", "mbbs"]),
  selectedUniversities: z.array(uniSchema).min(1).max(5),
  // All remaining fields optional — populated when student completes all 9 steps
  surname: z.string().optional(),
  givenNames: z.string().optional(),
  dobYear: z.string().optional(),
  dobMonth: z.string().optional(),
  dobDay: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiryYear: z.string().optional(),
  passportExpiryMonth: z.string().optional(),
  passportExpiryDay: z.string().optional(),
  religion: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  addressCity: z.string().optional(),
  addressPostcode: z.string().optional(),
  residenceCountry: z.string().optional(),
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherPhone: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherPhone: z.string().optional(),
  differentSponsor: z.boolean().optional(),
  sponsorName: z.string().optional(),
  sponsorRelationship: z.string().optional(),
  sponsorOccupation: z.string().optional(),
  sponsorPhone: z.string().optional(),
  sponsorIncome: z.string().optional(),
  academicHistory: z.array(z.record(z.unknown())).optional(),
  workHistory: z.array(z.record(z.unknown())).optional(),
  englishTestType: z.string().optional(),
  englishScore: z.string().optional(),
  englishTestDate: z.string().optional(),
  hasChineseProficiency: z.boolean().optional(),
  hskLevel: z.string().optional(),
  hskScore: z.string().optional(),
  hskkLevel: z.string().optional(),
  hskkScore: z.string().optional(),
  inChina: z.boolean().optional(),
  chinaVisaType: z.string().optional(),
  chinaVisaEntry: z.string().optional(),
  chinaVisaExpiry: z.string().optional(),
  chinaCurrentUniversity: z.string().optional(),
  chinaCurrentAddress: z.string().optional(),
  documents: z.record(z.string()).optional(),
});

const MONTH_NAMES: Record<string, string> = {
  January:"01",February:"02",March:"03",April:"04",May:"05",June:"06",
  July:"07",August:"08",September:"09",October:"10",November:"11",December:"12",
};
const GENDER_MAP: Record<string, "male" | "female" | "prefer_not_to_say"> = {
  Male: "male", Female: "female", "Prefer not to say": "prefer_not_to_say",
  male: "male", female: "female", prefer_not_to_say: "prefer_not_to_say",
};

function buildDate(year?: string, month?: string, day?: string): string | null {
  if (!year || !month || !day) return null;
  const m = MONTH_NAMES[month] ?? String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const role = session.user.role;

  if (role === "student") {
    const rows = await db
      .select()
      .from(applications)
      .where(eq(applications.studentId, userId))
      .orderBy(desc(applications.createdAt));
    return NextResponse.json({ applications: rows });
  }

  if (role === "partner") {
    const partner = await db.query.partners.findFirst({
      where: eq(partners.userId, userId),
    });
    if (!partner) return NextResponse.json({ applications: [] });
    const rows = await db
      .select()
      .from(applications)
      .where(eq(applications.partnerId, partner.id))
      .orderBy(desc(applications.createdAt));
    return NextResponse.json({ applications: rows });
  }

  if (role === "staff" || role === "admin") {
    const rows = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt))
      .limit(200);
    return NextResponse.json({ applications: rows });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const d = parsed.data;
  const { scholarshipType, programLevel, selectedUniversities } = d;
  const applicationNumber = await generateApplicationNumber(programLevel);

  const partner = session.user.role === "partner"
    ? await db.query.partners.findFirst({ where: eq(partners.userId, session.user.id) })
    : null;

  // Build optional step 2-8 fields
  const dateOfBirth = buildDate(d.dobYear, d.dobMonth, d.dobDay);
  const passportExpiry = buildDate(d.passportExpiryYear, d.passportExpiryMonth, d.passportExpiryDay);
  const gender = d.gender ? (GENDER_MAP[d.gender] ?? "prefer_not_to_say") : null;

  const phone = d.whatsapp || null;
  const email = d.email || null;
  const addressDetailed = d.address || null;
  const addressCountry = d.residenceCountry || null;

  const parentInfo = (d.fatherName || d.motherName) ? {
    fatherName: d.fatherName ?? "",
    fatherOccupation: d.fatherOccupation ?? "",
    fatherPhone: d.fatherPhone ?? "",
    motherName: d.motherName ?? "",
    motherOccupation: d.motherOccupation ?? "",
    motherPhone: d.motherPhone ?? "",
  } : null;

  const sponsorInfo = (d.sponsorName || d.differentSponsor !== undefined) ? {
    isSameAsParent: !d.differentSponsor,
    sponsorName: d.sponsorName ?? "",
    sponsorRelationship: d.sponsorRelationship ?? "",
    sponsorOccupation: d.sponsorOccupation ?? "",
    sponsorPhone: d.sponsorPhone ?? "",
    annualIncomeRange: d.sponsorIncome ?? "",
  } : null;

  const academicHistory = (d.academicHistory ?? []).map((h: Record<string, unknown>) => ({
    institution: String(h.institution ?? ""),
    qualification: String(h.qualification ?? h.degree ?? ""),
    fieldOfStudy: String(h.fieldOfStudy ?? h.field ?? ""),
    country: String(h.country ?? ""),
    startYear: parseInt(String(h.startYear)) || 0,
    endYear: parseInt(String(h.endYear)) || 0,
    grade: String(h.grade ?? ""),
  }));

  const workExperience = (d.workHistory ?? []).map((w: Record<string, unknown>) => ({
    employer: String(w.employer ?? ""),
    jobTitle: String(w.jobTitle ?? w.title ?? ""),
    country: String(w.country ?? ""),
    startDate: String(w.startDate ?? ""),
    endDate: String(w.endDate ?? ""),
    description: String(w.description ?? ""),
  }));

  const englishProficiency = d.englishTestType
    ? { testType: d.englishTestType, score: d.englishScore ?? "", testDate: d.englishTestDate ?? "" }
    : null;

  const chineseProficiency = (d.hasChineseProficiency || d.hskLevel) ? {
    hasHSK: !!d.hasChineseProficiency,
    hskLevel: d.hskLevel ?? "",
    hskScore: d.hskScore ?? "",
    hasHSKK: !!(d.hskkLevel),
    hskkLevel: d.hskkLevel ?? "",
    hskkScore: d.hskkScore ?? "",
  } : null;

  const isCurrentlyInChina = d.inChina ?? false;
  const chinaStatus = isCurrentlyInChina ? {
    visaType: d.chinaVisaType ?? "",
    visaEntryDate: d.chinaVisaEntry ?? "",
    visaExpiryDate: d.chinaVisaExpiry ?? "",
    currentUniversity: d.chinaCurrentUniversity ?? "",
    currentAddress: d.chinaCurrentAddress ?? "",
  } : null;

  // Filter documents to only include ones with valid URLs
  const documents = d.documents
    ? Object.fromEntries(Object.entries(d.documents).filter(([, v]) => v?.startsWith("http")))
    : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newApp] = await db.insert(applications).values({
    applicationNumber,
    studentId: session.user.id,
    partnerId: partner?.id ?? null,
    scholarshipType,
    programLevel,
    selectedUniversities,
    status: "submitted",
    passportSurname: d.surname ?? null,
    passportGivenName: d.givenNames ?? null,
    dateOfBirth: dateOfBirth ?? null,
    gender: gender ?? null,
    nationality: d.nationality ?? null,
    passportNumber: d.passportNumber ?? null,
    passportExpiry: passportExpiry ?? null,
    religion: d.religion ?? null,
    phone: phone ?? null,
    email: email ?? null,
    addressDetailed: addressDetailed ?? null,
    addressCity: d.addressCity ?? null,
    addressPostcode: d.addressPostcode ?? null,
    addressCountry: addressCountry ?? null,
    parentInfo: parentInfo ?? undefined,
    sponsorInfo: sponsorInfo ?? undefined,
    academicHistory: academicHistory.length > 0 ? academicHistory : undefined,
    workExperience: workExperience.length > 0 ? workExperience : undefined,
    englishProficiency: englishProficiency ?? undefined,
    chineseProficiency: chineseProficiency ?? undefined,
    isCurrentlyInChina: isCurrentlyInChina ?? undefined,
    chinaStatus: chinaStatus ?? undefined,
    documents: (documents && Object.keys(documents).length > 0) ? documents : undefined,
  } as any).returning();

  // Auto-create applicationUniversities workflow rows for all selected universities
  if (selectedUniversities.length > 0) {
    await db.insert(applicationUniversities).values(
      selectedUniversities.map((u, i) => ({
        applicationId: newApp.id,
        universityId: u.universityId || null,
        universityName: u.universityName,
        programName: u.programName || null,
        expectedMajor: u.expectedMajor || u.programName || null,
        targetStatus: "pending" as const,
        priority: i + 1,
        order: i + 1,
      }))
    ).catch(() => {});
  }

  const student = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });

  if (student?.email) {
    await sendApplicationReceivedNotification({
      studentEmail: student.email,
      studentName: `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || student.email,
      applicationId: applicationNumber,
      universities: selectedUniversities.map((u) => u.universityName),
      program: programLevel,
    }).catch(() => {});
  }

  await writePortalNotification({
    userId: session.user.id,
    applicationId: newApp.id,
    title: "Application submitted",
    message: `Your application ${applicationNumber} has been received. Globlearn Education will review your documents within 24 hours.`,
  });

  return NextResponse.json({ application: newApp }, { status: 201 });
}
