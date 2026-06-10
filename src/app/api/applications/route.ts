export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users, partners } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { generateApplicationNumber } from "@/lib/utils";
import { sendApplicationReceivedNotification } from "@/lib/email/notifications";

const createSchema = z.object({
  scholarshipType: z.enum(["csc", "university", "provincial", "self_sponsored"]),
  programLevel: z.enum(["bachelor", "master", "phd", "language", "diploma", "foundation", "short_course", "mbbs"]),
  selectedUniversities: z.array(z.object({
    universityId: z.string().uuid(),
    universityName: z.string(),
    programName: z.string(),
  })).min(1).max(5),
});

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

  const { scholarshipType, programLevel, selectedUniversities } = parsed.data;
  const applicationNumber = generateApplicationNumber(programLevel);

  const partner = session.user.role === "partner"
    ? await db.query.partners.findFirst({ where: eq(partners.userId, session.user.id) })
    : null;

  const [newApp] = await db.insert(applications).values({
    applicationNumber,
    studentId: session.user.id,
    partnerId: partner?.id ?? null,
    scholarshipType,
    programLevel,
    selectedUniversities,
    status: "submitted",
  }).returning();

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

  return NextResponse.json({ application: newApp }, { status: 201 });
}
