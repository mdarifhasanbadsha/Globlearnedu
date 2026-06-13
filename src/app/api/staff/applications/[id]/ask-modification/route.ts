import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, modificationRequests, notifications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email/resend";
import { askModificationEmail } from "@/lib/email/templates";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { message } = body;

  if (!message?.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const [app] = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      studentId: applications.studentId,
      applicationMode: applications.applicationMode,
    })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  // 1. Unlock the application for student editing
  await db.update(applications)
    .set({ applicationMode: "editable", updatedAt: new Date() })
    .where(eq(applications.id, id));

  // 2. Record the modification request
  await db.insert(modificationRequests).values({
    applicationId: id,
    requestedByStaffId: session.user.id,
    message: message.trim(),
    status: "pending",
  });

  // 3. Portal notification to student
  if (app.studentId) {
    db.insert(notifications).values({
      userId: app.studentId,
      applicationId: id,
      title: "Your application needs to be updated",
      message: `Please log in to update your application ${app.applicationNumber}. Message: ${message.trim().substring(0, 100)}`,
      channel: "in_portal",
      isRead: false,
    }).catch(() => {});
  }

  // 4. Email to student (fire-and-forget)
  if (app.studentId) {
    const [student] = await db
      .select({ email: users.email, firstName: users.firstName })
      .from(users)
      .where(eq(users.id, app.studentId))
      .limit(1);

    if (student?.email) {
      const emailData = askModificationEmail({
        studentName: student.firstName ?? "Student",
        applicationId: app.applicationNumber,
        message: message.trim(),
      });
      sendEmail({
        to: student.email,
        subject: emailData.subject,
        html: emailData.html,
        templateName: "ask_modification",
        applicationId: id,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
