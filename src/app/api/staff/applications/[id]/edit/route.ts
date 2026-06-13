import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, applicationEditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// Scalar fields staff can edit
const SCALAR_FIELDS = [
  "passportGivenName", "passportSurname", "passportNumber", "passportExpiry",
  "dateOfBirth", "gender", "nationality", "religion",
  "phone", "email", "addressCity", "addressCountry", "addressDetailed", "addressPostcode",
  "programLevel", "scholarshipType", "isUrgent", "isCurrentlyInChina",
] as const;

// JSONB fields staff can replace wholesale
const JSONB_FIELDS = [
  "selectedUniversities", "parentInfo", "sponsorInfo",
  "academicHistory", "workExperience",
  "englishProficiency", "chineseProficiency", "chinaStatus",
] as const;

type ScalarField = typeof SCALAR_FIELDS[number];

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const [current] = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  if (!current) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const staffName = [(session.user as any).firstName, (session.user as any).lastName].filter(Boolean).join(" ") || "Staff";

  const updates: Record<string, unknown> = {};
  const logs: Array<{
    applicationId: string;
    editedByStaffId: string;
    editedByStaffName: string;
    fieldChanged: string;
    oldValue: string | null;
    newValue: string | null;
  }> = [];

  // Handle scalar fields
  for (const field of SCALAR_FIELDS) {
    if (!(field in body)) continue;
    const newVal = body[field];
    const oldVal = (current as unknown as Record<string, unknown>)[field];
    const newStr = newVal === null || newVal === undefined ? "" : String(newVal);
    const oldStr = oldVal === null || oldVal === undefined ? "" : String(oldVal);
    if (newStr === oldStr) continue;
    updates[field] = newVal;
    logs.push({
      applicationId: id,
      editedByStaffId: session.user.id,
      editedByStaffName: staffName,
      fieldChanged: field,
      oldValue: oldStr || null,
      newValue: newStr || null,
    });
  }

  // Handle JSONB fields
  for (const field of JSONB_FIELDS) {
    if (!(field in body)) continue;
    const newVal = body[field];
    const oldVal = (current as unknown as Record<string, unknown>)[field];
    const newStr = JSON.stringify(newVal ?? null);
    const oldStr = JSON.stringify(oldVal ?? null);
    if (newStr === oldStr) continue;
    updates[field] = newVal;
    logs.push({
      applicationId: id,
      editedByStaffId: session.user.id,
      editedByStaffName: staffName,
      fieldChanged: field,
      oldValue: oldStr.length > 500 ? oldStr.substring(0, 497) + "…" : (oldStr || null),
      newValue: newStr.length > 500 ? newStr.substring(0, 497) + "…" : (newStr || null),
    });
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true, changed: 0, message: "No fields changed" });
  }

  await db.update(applications)
    .set({ ...updates, updatedAt: new Date() } as Parameters<typeof db.update>[0]["$inferInsert"])
    .where(eq(applications.id, id));

  if (logs.length > 0) {
    db.insert(applicationEditLogs).values(logs).catch(() => {});
  }

  return NextResponse.json({ ok: true, changed: logs.length, fields: logs.map(l => l.fieldChanged) });
}
