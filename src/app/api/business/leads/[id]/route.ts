import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Lead stages. Applications/other statuses stay independent of these. */
const LEAD_STAGES = [
  "new",
  "profile_pending",
  "qualified",
  "counseling_booked",
  "counseling_completed",
  "considering",
  "closed",
];

const STAGE_SET = new Set<string>(LEAD_STAGES);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const businessId = getBusinessId();

  const [lead] = await db
    .select({ id: bizLeads.id })
    .from(bizLeads)
    .where(and(eq(bizLeads.businessId, businessId), eq(bizLeads.id, id)))
    .limit(1);

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof payload?.stage === "string") {
    if (!STAGE_SET.has(payload.stage)) {
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    }
    patch.stage = payload.stage;
    if (typeof payload?.stageReason === "string") {
      patch.stageReason = payload.stageReason.slice(0, 1000);
    }
  }

  const strFields: [string, number][] = [
    ["fullName", 200],
    ["phone", 40],
    ["email", 255],
    ["nationality", 100],
    ["degreeLevel", 50],
    ["subjectInterest", 200],
    ["intakeTarget", 50],
    ["languageTest", 100],
    ["budgetCurrency", 8],
  ];
  for (const [key, max] of strFields) {
    if (typeof payload?.[key] === "string") {
      patch[key] = payload[key].trim().slice(0, max) || null;
    }
  }

  if (payload?.gpaValue === null || payload?.gpaScale === null) {
    patch.gpaValue = null;
    patch.gpaScale = null;
  } else if (
    typeof payload?.gpaValue === "number" &&
    typeof payload?.gpaScale === "number" &&
    payload.gpaScale > 0 &&
    payload.gpaValue >= 0 &&
    payload.gpaValue <= payload.gpaScale
  ) {
    patch.gpaValue = String(payload.gpaValue);
    patch.gpaScale = String(payload.gpaScale);
  }

  if (typeof payload?.budgetAmount === "number" && payload.budgetAmount > 0) {
    patch.budgetAmount = Math.round(payload.budgetAmount);
  }

  if (typeof payload?.consentContact === "boolean") {
    patch.consentContact = payload.consentContact;
  }

  if (Object.keys(patch).length === 1) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await db.update(bizLeads).set(patch).where(eq(bizLeads.id, id));
  return NextResponse.json({ ok: true });
}
