import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users, staff, applications } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET /api/admin/staff — list all staff with application counts
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const result = rows.map(r => ({
    ...r,
    applicationCount: countMap[r.userId] ?? 0,
  }));

  return NextResponse.json({ staff: result });
}

// POST /api/admin/staff — create staff account (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { email, firstName, lastName, password, staffRole } = await req.json();

  if (!email || !firstName || !lastName || !password) {
    return NextResponse.json({ error: "email, firstName, lastName and password are required" }, { status: 400 });
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, (email as string).toLowerCase()))
    .limit(1);

  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password as string, 12);

  const [newUser] = await db.insert(users).values({
    email: (email as string).toLowerCase(),
    firstName: firstName as string,
    lastName: lastName as string,
    name: `${firstName} ${lastName}`,
    passwordHash,
    role: "staff",
    emailVerified: new Date(),
    isActive: true,
  }).returning();

  const [newStaff] = await db.insert(staff).values({
    userId: newUser.id,
    staffRole: (staffRole ?? "support_agent") as "admin" | "application_manager" | "content_manager" | "support_agent" | "finance",
    isActive: true,
  }).returning();

  return NextResponse.json({
    staff: {
      staffId: newStaff.id,
      userId: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      staffRole: newStaff.staffRole,
      isActive: newStaff.isActive,
      userIsActive: newUser.isActive,
      createdAt: newStaff.createdAt,
      applicationCount: 0,
    },
  }, { status: 201 });
}
