import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, notifications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: RouteContext) {
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

  // Only the owning student can resubmit
  if (app.studentId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Only editable applications can be resubmitted
  if (app.applicationMode !== "editable") {
    return NextResponse.json({ error: "Application is not in editable mode" }, { status: 400 });
  }

  // Mark as resubmitted
  await db.update(applications)
    .set({
      applicationMode: "resubmitted",
      lastResubmittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(applications.id, id));

  // Notify assigned staff member
  if (app.assignedStaffId) {
    db.insert(notifications).values({
      userId: app.assignedStaffId,
      applicationId: id,
      title: `Application resubmitted — ${app.applicationNumber}`,
      message: `The student has updated and resubmitted application ${app.applicationNumber}. Please review the changes.`,
      channel: "in_portal",
      isRead: false,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, applicationMode: "resubmitted" });
}
