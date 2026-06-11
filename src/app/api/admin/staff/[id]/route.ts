import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users, staff } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/admin/staff/[id] — update staffRole or isActive
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { staffRole, isActive } = body;

  const [staffRecord] = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  if (!staffRecord) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const staffUpdates: Record<string, unknown> = {};
  const userUpdates: Record<string, unknown> = {};

  if (staffRole !== undefined) staffUpdates.staffRole = staffRole;
  if (isActive !== undefined) {
    staffUpdates.isActive = Boolean(isActive);
    userUpdates.isActive = Boolean(isActive);
    userUpdates.updatedAt = new Date();
  }

  const [updated] = await db.update(staff).set(staffUpdates).where(eq(staff.id, id)).returning();

  if (Object.keys(userUpdates).length > 0) {
    await db.update(users).set(userUpdates).where(eq(users.id, staffRecord.userId));
  }

  return NextResponse.json({ staff: updated });
}

// DELETE /api/admin/staff/[id] — deactivate (soft delete)
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await params;

  const [staffRecord] = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  if (!staffRecord) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.update(staff).set({ isActive: false }).where(eq(staff.id, id));
  await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, staffRecord.userId));

  return NextResponse.json({ success: true });
}
