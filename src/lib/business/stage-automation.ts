// ─────────────────────────────────────────────────────────────
// Stage automation.
//
// The imported pipeline set a stage once and never moved again, so the
// board would quietly stop matching reality. These rules keep it honest:
// they only ever move a lead FORWARD, and never override a decision a
// human made on purpose (closed, booked, considering).
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizLeads } from "@/lib/db/schema.business2";
import { and, eq } from "drizzle-orm";
import { logActivity } from "@/lib/business/activity";

/** Stages a human chose deliberately; automation must not move these. */
const HUMAN_OWNED = new Set(["counseling_booked", "counseling_completed", "considering", "closed"]);

export interface AdvanceResult {
  moved: boolean;
  from?: string;
  to?: string;
  reason?: string;
}

/**
 * A student replied. That is the strongest signal a lead is alive, so a
 * new or cold lead becomes an active conversation.
 */
export async function onStudentReplied(args: {
  businessId: string;
  conversationId: string;
}): Promise<AdvanceResult> {
  const [lead] = await db
    .select({ id: bizLeads.id, stage: bizLeads.stage, ignored: bizLeads.ignored })
    .from(bizLeads)
    .where(
      and(
        eq(bizLeads.businessId, args.businessId),
        eq(bizLeads.conversationId, args.conversationId)
      )
    )
    .limit(1);

  if (!lead) return { moved: false, reason: "no lead linked to this conversation" };

  if (HUMAN_OWNED.has(lead.stage)) {
    // They replied, but a human already made a decision. Just un-ignore.
    if (lead.ignored) {
      await db
        .update(bizLeads)
        .set({ ignored: false, ignoreReason: null, updatedAt: new Date() })
        .where(eq(bizLeads.id, lead.id));
      await logActivity({
        businessId: args.businessId,
        leadId: lead.id,
        kind: "inbound",
        summary: "Student replied — lead restored from ignored",
        actorKind: "student",
      });
    }
    return { moved: false, reason: `stage ${lead.stage} is human-owned` };
  }

  const next = lead.stage === "new" ? "profile_pending" : lead.stage;

  await db
    .update(bizLeads)
    .set({ stage: next, ignored: false, ignoreReason: null, updatedAt: new Date() })
    .where(eq(bizLeads.id, lead.id));

  if (next !== lead.stage) {
    await logActivity({
      businessId: args.businessId,
      leadId: lead.id,
      kind: "stage_changed",
      summary: `Student replied — stage ${lead.stage} → ${next}`,
      detail: { from: lead.stage, to: next, trigger: "inbound_message" },
      actorKind: "student",
    });
  } else {
    await logActivity({
      businessId: args.businessId,
      leadId: lead.id,
      kind: "inbound",
      summary: "Student replied",
      actorKind: "student",
    });
  }

  return { moved: next !== lead.stage, from: lead.stage, to: next };
}

/**
 * An outbound reply was sent. A brand-new lead that we have answered
 * should not keep sitting in "new".
 */
export async function onStaffReplied(args: {
  businessId: string;
  conversationId: string;
}): Promise<AdvanceResult> {
  const [lead] = await db
    .select({ id: bizLeads.id, stage: bizLeads.stage })
    .from(bizLeads)
    .where(
      and(
        eq(bizLeads.businessId, args.businessId),
        eq(bizLeads.conversationId, args.conversationId)
      )
    )
    .limit(1);

  if (!lead || lead.stage !== "new") return { moved: false };

  await db
    .update(bizLeads)
    .set({ stage: "profile_pending", updatedAt: new Date() })
    .where(eq(bizLeads.id, lead.id));

  await logActivity({
    businessId: args.businessId,
    leadId: lead.id,
    kind: "outbound",
    summary: "We replied — stage new → profile_pending",
    detail: { from: "new", to: "profile_pending", trigger: "outbound_message" },
    actorKind: "system",
  });

  return { moved: true, from: "new", to: "profile_pending" };
}
