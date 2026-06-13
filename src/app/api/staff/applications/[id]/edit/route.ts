import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, applicationEditLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// Fields staff are allowed to edit
const EDITABLE_FIELDS = [
  "passportGivenName", "passportSurname", "passportNumber", "passportExpiry",
  "dateOfBirth", "gender", "nationality",
  "phone", "email", "addressCity", "addressCountry",
  "programLevel", "scholarshipType", "isUrgent",
] as const;

type EditableField = typeof EDITABLE_FIELDS[number];

// Map camelCase field names to Drizzle column names
const FIELD_MAP: Record<EditableField, keyof typeof applications.$inferSelect> = {
  passportGivenName: "passportGivenName",
  passportSurname:   "passportSurname",
  passportNumber:    "passportNumber",
  passportExpiry:    "passportExpiry",
  dateOfBirth:       "dateOfBirth",
  gender:            "gender",
  nationality:       "nationality",
  phone:             "phone",
  email:             "email",
  addressCity:       "addressCity",
  addressCountry:    "addressCountry",
  programLevel:      "programLevel",
  scholarshipType:   "scholarshipType",
  isUrgent:          "isUrgent",
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Fetch current values for diffing
  const [current] = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
  if (!current) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const staffName = [session.user.firstName, (session.user as any).lastName].filter(Boolean).join(" ") || "Staff";

  const updates: Record<string, unknown> = {};
  const logs: Array<{
    applicationId: string;
    editedByStaffId: string;
    editedByStaffName: string;
    fieldChanged: string;
    oldValue: string | null;
    newValue: string | null;
  }> = [];

  for (const field of EDITABLE_FIELDS) {
    if (!(field in body)) continue;

    const newVal = body[field];
    const oldVal = current[FIELD_MAP[field]];

    const newStr = newVal === null || newVal === undefined ? "" : String(newVal);
    const oldStr = oldVal === null || oldVal === undefined ? "" : String(oldVal);

    if (newStr === oldStr) continue; // No change

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

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true, changed: 0, message: "No fields changed" });
  }

  // Apply update
  await db.update(applications)
    .set({ ...updates, updatedAt: new Date() } as Parameters<typeof db.update>[0]["$inferInsert"])
    .where(eq(applications.id, id));

  // Write audit logs (fire-and-forget — don't block response)
  if (logs.length > 0) {
    db.insert(applicationEditLogs).values(logs).catch(() => {});
  }

  return NextResponse.json({ ok: true, changed: logs.length, fields: logs.map(l => l.fieldChanged) });
}
