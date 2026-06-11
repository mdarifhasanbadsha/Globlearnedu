export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users, partners, payments, applicationUniversities, universities } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

const ADMITTED_STATUSES = ["final_admission", "student_accepts", "service_charge_payment", "jw202_issued", "complete"] as const;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [partner] = await db
    .select({ id: partners.id })
    .from(partners)
    .where(eq(partners.userId, session.user.id))
    .limit(1);

  if (!partner) return NextResponse.json({ rows: [], summary: null });

  // Applications with student info and paid service-charge payment (if any)
  const appRows = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      programLevel: applications.programLevel,
      nationality: applications.nationality,
      serviceChargePaid: applications.serviceChargePaid,
      serviceChargePaidAt: applications.serviceChargePaidAt,
      completedAt: applications.completedAt,
      createdAt: applications.createdAt,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentEmail: users.email,
      studentCountry: users.country,
      paymentAmount: payments.amount,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .leftJoin(
      payments,
      and(
        eq(payments.applicationId, applications.id),
        eq(payments.type, "service_charge"),
        eq(payments.status, "paid"),
      ),
    )
    .where(eq(applications.partnerId, partner.id))
    .orderBy(desc(applications.createdAt));

  // First university per application
  const uniRows = await db
    .select({
      applicationId: applicationUniversities.applicationId,
      universityName: universities.nameEn,
    })
    .from(applicationUniversities)
    .leftJoin(universities, eq(applicationUniversities.universityId, universities.id))
    .where(
      sql`${applicationUniversities.applicationId} IN (
        SELECT id FROM applications WHERE partner_id = ${partner.id}
      )`,
    )
    .orderBy(applicationUniversities.order);

  const uniMap: Record<string, string> = {};
  for (const r of uniRows) {
    if (!uniMap[r.applicationId]) uniMap[r.applicationId] = r.universityName ?? "—";
  }

  const COMMISSION_RATE = 0.2;
  const DEFAULT_SERVICE_CHARGE = 10000; // CNY

  const rows = appRows
    .filter(r => !["withdrawn", "cancelled"].includes(r.status))
    .map(r => {
      const studentName =
        [r.studentFirstName, r.studentLastName].filter(Boolean).join(" ") ||
        r.studentEmail ||
        "—";
      const serviceChargeAmount = r.paymentAmount ? parseFloat(r.paymentAmount as string) : null;
      const commissionAmount = serviceChargeAmount
        ? serviceChargeAmount * COMMISSION_RATE
        : DEFAULT_SERVICE_CHARGE * COMMISSION_RATE;
      const isEstimated = !serviceChargeAmount;
      const isPaid = r.serviceChargePaid ?? false;
      const isAdmitted = (ADMITTED_STATUSES as readonly string[]).includes(r.status);

      return {
        id: r.id,
        applicationNumber: r.applicationNumber,
        studentName,
        nationality: r.nationality ?? r.studentCountry ?? "—",
        university: uniMap[r.id] ?? "—",
        status: r.status,
        programLevel: r.programLevel,
        admittedAt: r.serviceChargePaidAt
          ? new Date(r.serviceChargePaidAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : r.completedAt
          ? new Date(r.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : "—",
        serviceChargeAmount: isPaid && serviceChargeAmount ? serviceChargeAmount : null,
        commissionAmount,
        isEstimated,
        commissionStatus: isPaid ? "paid" : isAdmitted ? "pending" : "not_due",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
      };
    });

  const paidRows = rows.filter(r => r.commissionStatus === "paid");
  const pendingRows = rows.filter(r => r.commissionStatus === "pending");

  const totalPaid = paidRows.reduce((s, r) => s + r.commissionAmount, 0);
  const totalPending = pendingRows.reduce((s, r) => s + r.commissionAmount, 0);

  return NextResponse.json({
    rows,
    summary: {
      totalPaid,
      totalPending,
      totalEarned: totalPaid + totalPending,
      paidCount: paidRows.length,
      pendingCount: pendingRows.length,
      commissionRate: COMMISSION_RATE,
    },
  });
}
