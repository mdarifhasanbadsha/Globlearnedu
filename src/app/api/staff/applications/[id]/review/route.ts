import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendStatusUpdateNotification, STATUS_DESCRIPTIONS } from "@/lib/email/notifications";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const VALID_STATUSES = [
  "submitted", "under_review", "documents_approved", "applied_per_university",
  "processing", "interview", "pre_admission", "student_confirms",
  "university_deposit", "final_admission", "student_accepts",
  "service_charge_payment", "jw202_issued", "complete", "withdrawn", "cancelled",
] as const;

// POST /api/staff/applications/[id]/review
// Body: { status?, note?, isUrgent? }
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, note, isUrgent } = body;

  const [app] = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (status) updates.status = status;
  if (isUrgent !== undefined) updates.isUrgent = Boolean(isUrgent);

  if (note?.trim()) {
    const noteEntry = {
      type: "staff_note",
      staffId: session.user.id,
      staffName: `${(session.user as any).firstName ?? ""} ${(session.user as any).lastName ?? ""}`.trim() || "Staff",
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

  // Send status email if status changed
  if (status && status !== app.status) {
    const statusInfo = STATUS_DESCRIPTIONS[status];
    const student = await db.query.users.findFirst({ where: eq(users.id, app.studentId) });
    if (student?.email && statusInfo) {
      sendStatusUpdateNotification({
        studentEmail: student.email,
        studentName: `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || student.email,
        applicationId: app.applicationNumber,
        newStatus: status.replace(/_/g, " "),
        statusDescription: statusInfo.description,
        nextStep: statusInfo.nextStep,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ application: updated });
}
