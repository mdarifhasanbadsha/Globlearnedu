export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import {
  applications, users,
  applicationUniversities, applicationStatusHistory,
  applicationEditLogs, emailLogs, modificationRequests,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

function requireAdmin(role?: string) {
  return role === "admin" || role === "staff";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || !requireAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const app = await db.query.applications.findFirst({
    where: eq(applications.id, id),
  });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [student, targets, history, editLogs, emails, modRequests] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, app.studentId) }),
    db.select().from(applicationUniversities)
      .where(eq(applicationUniversities.applicationId, id))
      .orderBy(applicationUniversities.priority),
    db.select().from(applicationStatusHistory)
      .where(eq(applicationStatusHistory.applicationId, id))
      .orderBy(desc(applicationStatusHistory.createdAt)),
    db.select().from(applicationEditLogs)
      .where(eq(applicationEditLogs.applicationId, id))
      .orderBy(desc(applicationEditLogs.createdAt)),
    db.select().from(emailLogs)
      .where(eq(emailLogs.applicationId, id))
      .orderBy(desc(emailLogs.createdAt)),
    db.select().from(modificationRequests)
      .where(eq(modificationRequests.applicationId, id))
      .orderBy(desc(modificationRequests.createdAt)),
  ]);

  return NextResponse.json({
    application: app,
    student,
    targets,
    history,
    editLogs,
    emails,
    modRequests,
  });
}
