import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, users, staff } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import StaffQueueClient from "./_QueueClient";

export const dynamic = "force-dynamic";

export default async function StaffQueuePage() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    redirect("/sign-in");
  }

  const userId = session.user.id as string;
  const role = (session.user as any).role as string;

  // Staff see only their assigned applications; admin sees all
  const rows = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      programLevel: applications.programLevel,
      nationality: applications.nationality,
      isUrgent: applications.isUrgent,
      assignedStaffId: applications.assignedStaffId,
      passportSurname: applications.passportSurname,
      passportGivenName: applications.passportGivenName,
      passportNumber: applications.passportNumber,
      selectedUniversities: applications.selectedUniversities,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentEmail: users.email,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .where(role === "staff" ? eq(applications.assignedStaffId, userId) : undefined)
    .orderBy(desc(applications.updatedAt))
    .limit(300);

  // Fetch staff list for admin "assigned to" display
  const staffList = await db
    .select({
      userId: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(staff)
    .innerJoin(users, eq(staff.userId, users.id))
    .where(eq(staff.isActive, true));

  const staffMap: Record<string, string> = {};
  for (const s of staffList) {
    staffMap[s.userId] = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
  }

  const queue = rows.map(r => ({
    id: r.id,
    applicationNumber: r.applicationNumber,
    status: r.status,
    programLevel: r.programLevel ?? "—",
    nationality: r.nationality ?? "—",
    isUrgent: r.isUrgent ?? false,
    assignedStaffId: r.assignedStaffId,
    assignedStaffName: r.assignedStaffId ? (staffMap[r.assignedStaffId] ?? "Unassigned") : "Unassigned",
    studentName: [r.studentFirstName, r.studentLastName].filter(Boolean).join(" ") || r.studentEmail || "—",
    email: r.studentEmail ?? "",
    passportNumber: r.passportNumber ?? "",
    passportName: [r.passportGivenName, r.passportSurname].filter(Boolean).join(" ") || null,
    university: (() => {
      const univs = r.selectedUniversities as Array<{ universityName?: string }>;
      return Array.isArray(univs) && univs.length > 0 ? (univs[0].universityName ?? "—") : "—";
    })(),
    expectedMajors: (() => {
      const univs = r.selectedUniversities as Array<{ expectedMajor?: string }>;
      if (!Array.isArray(univs)) return "";
      return univs.map(u => u.expectedMajor).filter(Boolean).join(", ");
    })(),
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
  }));

  return (
    <StaffQueueClient
      queue={queue}
      isAdmin={role === "admin"}
      currentUserId={userId}
      staffList={staffList.map(s => ({
        userId: s.userId,
        name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim(),
      }))}
    />
  );
}
