import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const AI_STATES = new Set(["active", "human_owned", "paused", "handoff_requested"]);
const STATUSES = new Set(["open", "snoozed", "resolved"]);

/** Change AI ownership or conversation status. */
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

  const [conv] = await db
    .select({ id: bizConversations.id })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, id)))
    .limit(1);

  if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof payload?.aiState === "string") {
    if (!AI_STATES.has(payload.aiState)) {
      return NextResponse.json({ error: "Invalid aiState" }, { status: 400 });
    }
    patch.aiState = payload.aiState;

    // Taking over assigns the conversation to the acting staff member.
    if (payload.aiState === "human_owned") {
      patch.assignedStaffId = guard.userId;
      patch.handoffAt = new Date();
    }
    // Returning control clears the assignment so any staff can pick it up.
    if (payload.aiState === "active") {
      patch.assignedStaffId = null;
      patch.handoffAt = null;
    }
  }

  if (typeof payload?.status === "string") {
    if (!STATUSES.has(payload.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    patch.status = payload.status;
  }

  if (Object.keys(patch).length === 1) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await db.update(bizConversations).set(patch).where(eq(bizConversations.id, id));

  return NextResponse.json({ ok: true });
}
