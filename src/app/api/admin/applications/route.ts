export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users, partners } from "@/lib/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { sendStatusUpdateNotification, STATUS_DESCRIPTIONS } from "@/lib/email/notifications";

function requireAdmin(role?: string) {
  return role === "admin" || role === "staff";
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !requireAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const limit = Math.min(Number(searchParams.get("limit") ?? "200"), 500);

  const rows = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      scholarshipType: applications.scholarshipType,
      programLevel: applications.programLevel,
      selectedUniversities: applications.selectedUniversities,
      passportSurname: applications.passportSurname,
      passportGivenName: applications.passportGivenName,
      nationality: applications.nationality,
      isUrgent: applications.isUrgent,
      depositPaid: applications.depositPaid,
      serviceChargePaid: applications.serviceChargePaid,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      studentId: applications.studentId,
      partnerId: applications.partnerId,
      assignedStaffId: applications.assignedStaffId,
      studentEmail: users.email,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentCountry: users.country,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .orderBy(desc(applications.createdAt))
    .limit(limit);

  let filtered = rows;

  if (status && status !== "all") {
    filtered = filtered.filter((r) => r.status === status);
  }

  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter((r) =>
      r.applicationNumber.toLowerCase().includes(lower) ||
      (r.studentEmail ?? "").toLowerCase().includes(lower) ||
      (r.studentFirstName ?? "").toLowerCase().includes(lower) ||
      (r.studentLastName ?? "").toLowerCase().includes(lower) ||
      (r.nationality ?? "").toLowerCase().includes(lower) ||
      (r.programLevel ?? "").toLowerCase().includes(lower)
    );
  }

  return NextResponse.json({ applications: filtered, total: rows.length });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "submitted", "under_review", "documents_approved", "applied_per_university",
    "processing", "interview", "pre_admission", "student_confirms",
    "university_deposit", "final_admission", "student_accepts",
    "service_charge_payment", "jw202_issued", "complete", "withdrawn", "cancelled",
  ]).optional(),
  assignedStaffId: z.string().uuid().nullable().optional(),
  isUrgent: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !requireAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { id, status, assignedStaffId, isUrgent } = parsed.data;

  const app = await db.query.applications.findFirst({ where: eq(applications.id, id) });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const setData: Record<string, unknown> = { updatedAt: new Date() };
  if (status) {
    setData.status = status;
    if (status === "complete") setData.completedAt = new Date();
  }
  if (assignedStaffId !== undefined) setData.assignedStaffId = assignedStaffId;
  if (isUrgent !== undefined) setData.isUrgent = isUrgent;

  const [updated] = await db
    .update(applications)
    .set(setData)
    .where(eq(applications.id, id))
    .returning();

  if (status && status !== app.status) {
    const student = await db.query.users.findFirst({ where: eq(users.id, app.studentId) });
    const statusInfo = STATUS_DESCRIPTIONS[status];
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
