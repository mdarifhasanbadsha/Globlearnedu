import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/admin/email-templates/[id]
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [t] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id)).limit(1);
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ template: t });
}

// PATCH /api/admin/email-templates/[id]
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, subject, bodyHtml, isActive, isAutoTrigger, sendToStudent, sendToPartner, category } = body;

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (name !== undefined)          updates.name = name;
  if (subject !== undefined)       updates.subject = subject;
  if (bodyHtml !== undefined)      updates.bodyHtml = bodyHtml;
  if (isActive !== undefined)      updates.isActive = Boolean(isActive);
  if (isAutoTrigger !== undefined) updates.isAutoTrigger = Boolean(isAutoTrigger);
  if (sendToStudent !== undefined) updates.sendToStudent = Boolean(sendToStudent);
  if (sendToPartner !== undefined) updates.sendToPartner = Boolean(sendToPartner);
  if (category !== undefined)      updates.category = category;

  const [updated] = await db
    .update(emailTemplates)
    .set(updates)
    .where(eq(emailTemplates.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ template: updated });
}

// DELETE /api/admin/email-templates/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
  return NextResponse.json({ success: true });
}
