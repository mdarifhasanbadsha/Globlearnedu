export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users, partners, applicationUniversities } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role !== "partner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const partner = await db.query.partners.findFirst({
    where: eq(partners.userId, session.user.id),
  });

  if (!partner) return NextResponse.json({ students: [] });

  const rows = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      programLevel: applications.programLevel,
      selectedUniversities: applications.selectedUniversities,
      passportSurname: applications.passportSurname,
      passportGivenName: applications.passportGivenName,
      nationality: applications.nationality,
      createdAt: applications.createdAt,
      studentEmail: users.email,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentCountry: users.country,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .where(eq(applications.partnerId, partner.id))
    .orderBy(desc(applications.createdAt));

  // Fetch per-university target rows for all applications
  const appIds = rows.map(r => r.id);
  const targets = appIds.length > 0
    ? await db
        .select({
          applicationId: applicationUniversities.applicationId,
          universityName: applicationUniversities.universityName,
          programName: applicationUniversities.programName,
          targetStatus: applicationUniversities.targetStatus,
          priority: applicationUniversities.priority,
        })
        .from(applicationUniversities)
        .where(inArray(applicationUniversities.applicationId, appIds))
        .orderBy(applicationUniversities.priority)
    : [];

  // Group targets by applicationId
  const targetsByApp: Record<string, typeof targets> = {};
  for (const t of targets) {
    if (!targetsByApp[t.applicationId]) targetsByApp[t.applicationId] = [];
    targetsByApp[t.applicationId].push(t);
  }

  const students = rows.map(r => ({
    ...r,
    targets: targetsByApp[r.id] ?? [],
  }));

  return NextResponse.json({ students, partnerId: partner.id });
}
