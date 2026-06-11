import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users, staff, applications } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import StaffListClient from "./_StaffListClient";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    redirect("/sign-in");
  }

  const rows = await db
    .select({
      staffId: staff.id,
      userId: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      staffRole: staff.staffRole,
      isActive: staff.isActive,
      userIsActive: users.isActive,
      createdAt: staff.createdAt,
    })
    .from(staff)
    .innerJoin(users, eq(staff.userId, users.id))
    .orderBy(desc(staff.createdAt));

  const assignedCounts = await db
    .select({
      assignedStaffId: applications.assignedStaffId,
      count: sql<number>`count(*)::int`,
    })
    .from(applications)
    .groupBy(applications.assignedStaffId);

  const countMap: Record<string, number> = {};
  for (const r of assignedCounts) {
    if (r.assignedStaffId) countMap[r.assignedStaffId] = r.count;
  }

  const staffMembers = rows.map(r => ({
    staffId: r.staffId,
    userId: r.userId,
    email: r.email ?? "",
    firstName: r.firstName ?? "",
    lastName: r.lastName ?? "",
    staffRole: r.staffRole,
    isActive: r.isActive ?? true,
    userIsActive: r.userIsActive ?? true,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    applicationCount: countMap[r.userId] ?? 0,
  }));

  const isAdmin = (session.user as any).role === "admin";

  return <StaffListClient staffMembers={staffMembers} isAdmin={isAdmin} />;
}
