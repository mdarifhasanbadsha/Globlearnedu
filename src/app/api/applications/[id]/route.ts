export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendStatusUpdateNotification, STATUS_DESCRIPTIONS } from "@/lib/email/notifications";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const app = await db.query.applications.findFirst({ where: eq(applications.id, id) });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { role, id: userId } = session.user;
  const allowed =
    role === "admin" ||
    role === "staff" ||
    (role === "student" && app.studentId === userId);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ application: app });
}

const patchSchema = z.object({
  status: z.enum([
    "submitted", "under_review", "documents_approved", "applied_per_university",
    "processing", "interview", "pre_admission", "student_confirms",
    "university_deposit", "final_admission", "student_accepts",
    "service_charge_payment", "jw202_issued", "complete", "withdrawn", "cancelled",
  ]).optional(),
  isUrgent: z.boolean().optional(),
  assignedStaffId: z.string().uuid().optional().nullable(),
  internalNotes: z.any().optional(),
  depositPaid: z.boolean().optional(),
  serviceChargePaid: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = session.user;
  if (role !== "admin" && role !== "staff") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const app = await db.query.applications.findFirst({ where: eq(applications.id, id) });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const d = parsed.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = { updatedAt: new Date() };
  if (d.status !== undefined) updates.status = d.status;
  if (d.isUrgent !== undefined) updates.isUrgent = d.isUrgent;
  if ("assignedStaffId" in d) updates.assignedStaffId = d.assignedStaffId;
  if (d.internalNotes !== undefined) updates.internalNotes = d.internalNotes;
  if (d.depositPaid !== undefined) {
    updates.depositPaid = d.depositPaid;
    if (d.depositPaid) updates.depositPaidAt = new Date();
  }
  if (d.serviceChargePaid !== undefined) {
    updates.serviceChargePaid = d.serviceChargePaid;
    if (d.serviceChargePaid) updates.serviceChargePaidAt = new Date();
  }
  if (d.status === "complete") updates.completedAt = new Date();

  const [updated] = await db
    .update(applications)
    .set(updates)
    .where(eq(applications.id, id))
    .returning();

  if (d.status && d.status !== app.status) {
    const student = await db.query.users.findFirst({ where: eq(users.id, app.studentId) });
    const statusInfo = STATUS_DESCRIPTIONS[d.status];
    if (student?.email && statusInfo) {
      sendStatusUpdateNotification({
        studentEmail: student.email,
        studentName: `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || student.email,
        applicationId: app.applicationNumber,
        newStatus: d.status.replace(/_/g, " "),
        statusDescription: statusInfo.description,
        nextStep: statusInfo.nextStep,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ application: updated });
}
