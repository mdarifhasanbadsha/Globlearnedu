// ─────────────────────────────────────────────────────────────
// Lead activity log.
//
// Every meaningful change to a lead goes through here, so the timeline
// is the single source of truth for "what happened to this student".
// Append-only by design: nothing is edited or deleted, because a
// rewritten history is worse than no history.
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizLeadActivity } from "@/lib/db/schema.business2";

export type ActivityKind =
  | "created"
  | "stage_changed"
  | "assigned"
  | "note_added"
  | "score_changed"
  | "inbound"
  | "outbound"
  | "followup_scheduled"
  | "followup_done"
  | "alerted";

export async function logActivity(args: {
  businessId: string;
  leadId: string;
  kind: ActivityKind;
  summary: string;
  detail?: Record<string, unknown> | null;
  actorId?: string | null;
  actorKind?: "staff" | "system" | "student";
}): Promise<void> {
  try {
    await db.insert(bizLeadActivity).values({
      businessId: args.businessId,
      leadId: args.leadId,
      kind: args.kind,
      summary: args.summary.slice(0, 300),
      detail: args.detail ?? null,
      actorId: args.actorId ?? null,
      actorKind: args.actorKind ?? "system",
    });
  } catch {
    // Logging must never break the operation it is describing.
  }
}
