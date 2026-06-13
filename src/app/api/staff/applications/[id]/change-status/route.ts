import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import {
  applications, applicationUniversities, applicationStatusHistory,
  users, notifications,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email/resend";
import {
  appliedToUniversityEmail,
  preAdmissionEmail,
  admissionNoticeEmail,
  finalAdmissionEmail,
  applicationRejectedEmail,
  applicationDeferredEmail,
} from "@/lib/email/templates";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_TARGET_STATUSES = [
  "pending", "applied", "pre_admission", "interview",
  "admission_notice", "final_admission", "rejected", "deferred", "withdrawn",
] as const;

const TARGET_STATUS_LABELS: Record<string, string> = {
  pending:          "Pending",
  applied:          "Applied",
  pre_admission:    "Pre-Admission",
  interview:        "Interview Scheduled",
  admission_notice: "Admission Notice Received",
  final_admission:  "Final Admission",
  rejected:         "Not Accepted",
  deferred:         "Deferred",
  withdrawn:        "Withdrawn",
};

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { targetId, newStatus, remark, internalNote, visibleToStudent = true, admissionNoticeUrl, jw202Url } = body;

  if (!targetId || !newStatus) {
    return NextResponse.json({ error: "targetId and newStatus are required" }, { status: 400 });
  }
  if (!(VALID_TARGET_STATUSES as readonly string[]).includes(newStatus)) {
    return NextResponse.json({ error: "Invalid target status" }, { status: 400 });
  }

  // Verify application belongs to this id
  const [app] = await db.select({
    id: applications.id,
    applicationNumber: applications.applicationNumber,
    studentId: applications.studentId,
    notifyPartnerEmail: applications.notifyPartnerEmail,
  }).from(applications).where(eq(applications.id, id)).limit(1);

  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  // Fetch target row
  const [target] = await db.select({
    id: applicationUniversities.id,
    applicationId: applicationUniversities.applicationId,
    universityName: applicationUniversities.universityName,
    programName: applicationUniversities.programName,
    expectedMajor: applicationUniversities.expectedMajor,
    targetStatus: applicationUniversities.targetStatus,
    admissionNoticeUrl: applicationUniversities.admissionNoticeUrl,
    jw202Url: applicationUniversities.jw202Url,
  }).from(applicationUniversities)
    .where(eq(applicationUniversities.id, targetId))
    .limit(1);

  if (!target || target.applicationId !== id) {
    return NextResponse.json({ error: "Target not found" }, { status: 404 });
  }

  const previousStatus = target.targetStatus;
  const staffName = [session.user.firstName, (session.user as any).lastName].filter(Boolean).join(" ") || "Staff";

  // 1. Update the target row (including optional document URLs)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetUpdates: Record<string, any> = { targetStatus: newStatus, updatedAt: new Date() };
  if (admissionNoticeUrl) targetUpdates.admissionNoticeUrl = admissionNoticeUrl;
  if (jw202Url) targetUpdates.jw202Url = jw202Url;
  await db.update(applicationUniversities)
    .set(targetUpdates)
    .where(eq(applicationUniversities.id, targetId));

  // 2. Write audit history
  await db.insert(applicationStatusHistory).values({
    applicationId: id,
    targetId,
    previousStatus,
    newStatus,
    studentVisibleRemark: remark ?? null,
    internalNote: internalNote ?? null,
    visibleToStudent,
    changedByStaffId: session.user.id,
    changedByStaffName: staffName,
  });

  // 3. Portal notification to student
  if (visibleToStudent && app.studentId) {
    const label = TARGET_STATUS_LABELS[newStatus] ?? newStatus;
    db.insert(notifications).values({
      userId: app.studentId,
      applicationId: id,
      title: `University update — ${target.universityName ?? "University"}`,
      message: `Status changed to "${label}"${remark ? `: ${remark}` : ""}.`,
      channel: "in_portal",
      isRead: false,
    }).catch(() => {});
  }

  // 4. Email to student (fire-and-forget)
  if (visibleToStudent && app.studentId) {
    const [studentUser] = await db.select({ email: users.email, firstName: users.firstName })
      .from(users).where(eq(users.id, app.studentId)).limit(1);

    if (studentUser?.email) {
      const studentName = studentUser.firstName ?? "Student";
      const targetInfo = {
        universityName: target.universityName ?? "University",
        programName: target.programName ?? undefined,
        expectedMajor: target.expectedMajor ?? undefined,
      };

      let emailTemplate: { subject: string; html: string } | null = null;

      if (newStatus === "applied") {
        emailTemplate = appliedToUniversityEmail({
          studentName, applicationId: app.applicationNumber, target: targetInfo, remark,
        });
      } else if (newStatus === "pre_admission") {
        emailTemplate = preAdmissionEmail({
          studentName, applicationId: app.applicationNumber, target: targetInfo, remark,
        });
      } else if (newStatus === "interview") {
        emailTemplate = preAdmissionEmail({
          studentName, applicationId: app.applicationNumber, target: targetInfo, remark,
        });
      } else if (newStatus === "admission_notice") {
        emailTemplate = admissionNoticeEmail({
          studentName, applicationId: app.applicationNumber, target: targetInfo,
          admissionNoticeUrl: admissionNoticeUrl ?? target.admissionNoticeUrl ?? undefined, remark,
        });
      } else if (newStatus === "final_admission") {
        emailTemplate = finalAdmissionEmail({
          studentName, applicationId: app.applicationNumber, target: targetInfo,
          jw202Url: jw202Url ?? target.jw202Url ?? undefined, remark,
        });
      } else if (newStatus === "rejected") {
        emailTemplate = applicationRejectedEmail({
          studentName, applicationId: app.applicationNumber, target: targetInfo, remark,
        });
      } else if (newStatus === "deferred") {
        emailTemplate = applicationDeferredEmail({
          studentName, applicationId: app.applicationNumber, target: targetInfo, remark,
        });
      }

      if (emailTemplate) {
        sendEmail({
          to: studentUser.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          templateName: `target_status_${newStatus}`,
          applicationId: id,
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ ok: true, previousStatus, newStatus });
}
