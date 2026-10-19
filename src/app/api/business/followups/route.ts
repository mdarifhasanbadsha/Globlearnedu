import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizFollowups, bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = typeof payload?.id === "string" ? payload.id : "";
  const action = payload?.action;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const businessId = getBusinessId();
  const scope = and(eq(bizFollowups.businessId, businessId), eq(bizFollowups.id, id));

  if (action === "done" || action === "skip" || action === "cancel") {
    const status = action === "done" ? "sent" : action === "skip" ? "skipped" : "cancelled";
    await db
      .update(bizFollowups)
      .set({ status, updatedAt: new Date() })
      .where(scope);
    return NextResponse.json({ ok: true, status });
  }

  return NextResponse.json({ error: "action must be done, skip or cancel" }, { status: 400 });
}

/**
 * Create a followup task. In-app only for now — nothing is sent externally,
 * so there is no risk of messaging a real student from a test.
 */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const body = typeof payload?.body === "string" ? payload.body.trim() : "";
  if (body.length === 0 || body.length > 2000) {
    return NextResponse.json({ error: "body must be 1-2000 characters" }, { status: 400 });
  }

  // dueAt: accept an ISO string or a number of hours from now.
  let dueAt: Date;
  if (typeof payload?.dueInHours === "number" && payload.dueInHours > 0) {
    dueAt = new Date(Date.now() + payload.dueInHours * 3600_000);
  } else if (typeof payload?.dueAt === "string") {
    const d = new Date(payload.dueAt);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "Invalid dueAt" }, { status: 400 });
    }
    dueAt = d;
  } else {
    dueAt = new Date(Date.now() + 24 * 3600_000);
  }

  const businessId = getBusinessId();
  const leadId = typeof payload?.leadId === "string" ? payload.leadId : null;
  const conversationId = typeof payload?.conversationId === "string" ? payload.conversationId : null;

  // Never queue a followup for a lead that opted out or replied.
  if (leadId) {
    const [lead] = await db
      .select({ stage: bizLeads.stage, consent: bizLeads.consentContact })
      .from(bizLeads)
      .where(and(eq(bizLeads.businessId, businessId), eq(bizLeads.id, leadId)))
      .limit(1);

    if (lead && lead.stage === "closed") {
      return NextResponse.json(
        { error: "This lead is closed; no followup will be scheduled." },
        { status: 409 }
      );
    }
  }

  const [row] = await db
    .insert(bizFollowups)
    .values({
      businessId,
      leadId,
      conversationId,
      channel: "in_app",
      body,
      dueAt,
      createdBy: guard.userId,
    })
    .returning({ id: bizFollowups.id });

  return NextResponse.json({ ok: true, id: row.id, dueAt: dueAt.toISOString() }, { status: 201 });
}
