export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, applicationUniversities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  step1Schema, step2Schema, step3Schema,
  step4Schema, step5Schema, step6Schema, step7Schema,
} from "@/lib/validations/application";

type RouteContext = { params: Promise<{ id: string }> };

const STEP_SCHEMAS = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
  7: step7Schema,
} as const;

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const app = await db.query.applications.findFirst({
    where: eq(applications.id, id),
  });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const role = session.user.role;
  const isOwner = app.studentId === session.user.id;
  if (role !== "admin" && role !== "staff" && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const step = body.step as keyof typeof STEP_SCHEMAS | undefined;
  if (!step || !STEP_SCHEMAS[step]) {
    return NextResponse.json({ error: "Invalid step. Must be 1–7." }, { status: 400 });
  }

  const schema = STEP_SCHEMAS[step];
  const parsed = schema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const stepUpdates: Record<string, unknown> = { updatedAt: new Date() };

  if (step === 1) {
    const d = parsed.data as typeof step1Schema._type;
    stepUpdates.scholarshipType = d.scholarshipType;
    stepUpdates.programLevel = d.programLevel;
    stepUpdates.selectedUniversities = d.selectedUniversities;
  } else if (step === 2) {
    const d = parsed.data as typeof step2Schema._type;
    stepUpdates.passportSurname = d.passportSurname;
    stepUpdates.passportGivenName = d.passportGivenName;
    stepUpdates.dateOfBirth = d.dateOfBirth;
    stepUpdates.gender = d.gender;
    stepUpdates.nationality = d.nationality;
    stepUpdates.passportNumber = d.passportNumber;
    stepUpdates.passportExpiry = d.passportExpiry;
    stepUpdates.religion = d.religion;
  } else if (step === 3) {
    const d = parsed.data as typeof step3Schema._type;
    stepUpdates.phone = d.phone;
    stepUpdates.email = d.email;
    stepUpdates.addressDetailed = d.addressDetailed;
    stepUpdates.addressCity = d.addressCity;
    stepUpdates.addressPostcode = d.addressPostcode;
    stepUpdates.addressCountry = d.addressCountry;
  } else if (step === 4) {
    const d = parsed.data as typeof step4Schema._type;
    stepUpdates.parentInfo = d.parentInfo;
    stepUpdates.sponsorInfo = d.sponsorInfo;
  } else if (step === 5) {
    const d = parsed.data as typeof step5Schema._type;
    stepUpdates.academicHistory = d.academicHistory;
    stepUpdates.workExperience = d.workExperience;
  } else if (step === 6) {
    const d = parsed.data as typeof step6Schema._type;
    stepUpdates.englishProficiency = d.englishProficiency;
    stepUpdates.chineseProficiency = d.chineseProficiency;
  } else if (step === 7) {
    const d = parsed.data as typeof step7Schema._type;
    stepUpdates.isCurrentlyInChina = d.isCurrentlyInChina;
    stepUpdates.chinaStatus = d.chinaStatus;
  }

  const [updated] = await db
    .update(applications)
    .set(stepUpdates as any)
    .where(eq(applications.id, id))
    .returning();

  // Auto-sync: insert any newly added universities into applicationUniversities workflow table
  if (step === 1) {
    const newUnivs = (stepUpdates.selectedUniversities as Array<{
      universityId?: string; universityName?: string; programName?: string; expectedMajor?: string;
    }>) ?? [];

    if (newUnivs.length > 0) {
      const existingTargets = await db
        .select({ universityName: applicationUniversities.universityName, universityId: applicationUniversities.universityId })
        .from(applicationUniversities)
        .where(eq(applicationUniversities.applicationId, id));

      const existingNames = new Set(existingTargets.map((t) => t.universityName?.toLowerCase()));
      const existingIds = new Set(existingTargets.map((t) => t.universityId).filter(Boolean));

      const toInsert = newUnivs.filter((u) => {
        if (u.universityId && existingIds.has(u.universityId)) return false;
        if (u.universityName && existingNames.has(u.universityName.toLowerCase())) return false;
        return true;
      });

      if (toInsert.length > 0) {
        await db.insert(applicationUniversities).values(
          toInsert.map((u, i) => ({
            applicationId: id,
            universityId: u.universityId || null,
            universityName: u.universityName ?? "Unknown University",
            programName: u.programName ?? null,
            expectedMajor: u.expectedMajor ?? u.programName ?? null,
            targetStatus: "pending",
            priority: i + 1,
            order: i + 1,
          }))
        ).catch(() => {});
      }
    }
  }

  return NextResponse.json({ application: updated });
}
