import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users, activityLog } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendStatusUpdateNotification, STATUS_DESCRIPTIONS, writePortalNotification } from "@/lib/email/notifications";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_STATUSES = [
  "submitted", "under_review", "documents_approved", "applied_per_university",
  "processing", "interview", "pre_admission", "student_confirms",
  "university_deposit", "final_admission", "student_accepts",
  "service_charge_payment", "jw202_issued", "complete", "withdrawn", "cancelled",
] as const;

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  documents_approved: "Documents Approved",
  applied_per_university: "Applied to Universities",
  processing: "Processing at University",
  interview: "Interview",
  pre_admission: "Pre-Admission",
  student_confirms: "Student Confirms",
  university_deposit: "University Deposit",
  final_admission: "Final Admission",
  student_accepts: "Student Accepts",
  service_charge_payment: "Service Charge Payment",
  jw202_issued: "JW202 Issued",
  complete: "Complete",
  withdrawn: "Withdrawn",
  cancelled: "Cancelled",
};

// POST /api/staff/applications/[id]/review
// Body: { status?, note?, isUrgent?, assignedStaffId? }
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, note, isUrgent, assignedStaffId } = body;

  const [app] = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Enforce status transition rules
  if (status && status !== app.status) {
    if (app.status === "submitted" && status !== "under_review") {
      return NextResponse.json(
        { error: "Applications in 'Submitted' state must first be moved to 'Under Review' via the Start Review button." },
        { status: 400 }
      );
    }
  }

  const staffName = `${(session.user as any).firstName ?? ""} ${(session.user as any).lastName ?? ""}`.trim() || "Staff";

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (status) updates.status = status;
  if (isUrgent !== undefined) updates.isUrgent = Boolean(isUrgent);
  if (assignedStaffId !== undefined) updates.assignedStaffId = assignedStaffId || null;

  if (note?.trim()) {
    const noteEntry = {
      type: "staff_note",
      staffId: session.user.id,
      staffName,
      content: note.trim(),
      at: new Date().toISOString(),
    };
    updates.internalNotes = sql`coalesce(${applications.internalNotes}, '[]'::jsonb) || ${JSON.stringify([noteEntry])}::jsonb`;
  }

  const [updated] = await db
    .update(applications)
    .set(updates)
    .where(eq(applications.id, id))
    .returning();

  // Fire side effects on status change
  if (status && status !== app.status) {
    // 1. Activity log
    await db.insert(activityLog).values({
      userId: session.user.id,
      applicationId: id,
      action: "status_changed",
      details: {
        from: app.status,
        to: status,
        staffId: session.user.id,
        staffName,
      },
    }).catch(() => {});

    // 2. In-portal notification for student
    const newLabel = STATUS_LABELS[status] ?? status.replace(/_/g, " ");
    await writePortalNotification({
      userId: app.studentId,
      applicationId: id,
      title: `Application Update — ${app.applicationNumber}`,
      message: `Your application status has been updated to: ${newLabel}.`,
    });

    // 3. Email notification
    const statusInfo = STATUS_DESCRIPTIONS[status];
    const student = await db.query.users.findFirst({ where: eq(users.id, app.studentId) });
    if (student?.email && statusInfo) {
      sendStatusUpdateNotification({
        studentEmail: student.email,
        studentName: `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || student.email,
        applicationId: app.applicationNumber,
        newStatus: newLabel,
        statusDescription: statusInfo.description,
        nextStep: statusInfo.nextStep,
      }).catch(() => {});
    }
  }

  // Activity log for note added
  if (note?.trim()) {
    await db.insert(activityLog).values({
      userId: session.user.id,
      applicationId: id,
      action: "note_added",
      details: { staffId: session.user.id, staffName },
    }).catch(() => {});
  }

  return NextResponse.json({ application: updated });
}
