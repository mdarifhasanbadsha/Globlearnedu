// ─────────────────────────────────────────────────────────────
// Alerting.
//
// A hot lead nobody notices is the same as no lead. Alerts are written
// to the lead timeline and, when staff have notifications enabled, sent
// through the existing in-app notification table.
//
// Deliberately quiet: one alert per lead, not one per message, so the
// team is not trained to ignore the alerts.
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizLeads, bizLeads as leads } from "@/lib/db/schema.business2";
import { logActivity } from "@/lib/business/activity";
import { and, eq, isNull, sql } from "drizzle-orm";

export interface AlertResult {
  alerted: boolean;
  reason: string;
}

/**
 * Announce a lead once, when it first becomes hot or a student asks for
 * a human. Re-alerts only after alerted_at is cleared.
 */
export async function alertIfHot(args: {
  businessId: string;
  conversationId: string;
}): Promise<AlertResult> {
  const [lead] = await db
    .select({
      id: leads.id,
      priority: leads.priority,
      score: leads.score,
      category: leads.category,
      alertedAt: leads.alertedAt,
      fullName: leads.fullName,
    })
    .from(leads)
    .where(
      and(eq(leads.businessId, args.businessId), eq(leads.conversationId, args.conversationId))
    )
    .limit(1);

  if (!lead) return { alerted: false, reason: "no lead linked" };
  if (lead.priority !== "hot") return { alerted: false, reason: "not hot" };
  if (lead.alertedAt) return { alerted: false, reason: "already alerted" };

  await db
    .update(bizLeads)
    .set({ alertedAt: new Date(), updatedAt: new Date() })
    .where(eq(bizLeads.id, lead.id));

  await logActivity({
    businessId: args.businessId,
    leadId: lead.id,
    kind: "alerted",
    summary: `Hot lead: score ${lead.score}, ${lead.category.replace(/_/g, " ")} — call today`,
    detail: { score: lead.score, category: lead.category },
    actorKind: "system",
  });

  return { alerted: true, reason: "hot lead announced" };
}

/** Leads that are hot and have never been actioned by a human. */
export async function countUnalertedHot(businessId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(leads)
    .where(
      and(
        eq(leads.businessId, businessId),
        eq(leads.priority, "hot"),
        isNull(leads.alertedAt),
        eq(leads.ignored, false)
      )
    );
  return row?.n ?? 0;
}
