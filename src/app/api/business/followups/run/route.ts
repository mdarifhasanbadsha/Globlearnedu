import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { runDueFollowups } from "@/lib/business/followup-runner";

export const dynamic = "force-dynamic";

/**
 * Run any follow-up messages that are due.
 *
 * Reads first so the owner (or a scheduler) can see how many are waiting
 * without sending anything.
 */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  let pending: any[] = [];
  try {
    const r: any = await db.execute(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (await import("drizzle-orm")).sql`
        select followup_stage, count(*)::int as n
        from biz_conversations
        where business_id = ${businessId} and followup_due_at is not null
          and followup_due_at <= now()
        group by followup_stage
      `
    );
    pending = r?.rows ?? r ?? [];
  } catch {
    pending = [];
  }

  return NextResponse.json({
    dueNow: pending.reduce((n: number, r: any) => n + Number(r.n ?? 0), 0),
    byStage: Object.fromEntries(pending.map((r: any) => [r.followup_stage ?? "unknown", r.n])),
  });
}

/** Send them. Safe to call repeatedly. */
export async function POST() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();
  const result = await runDueFollowups(businessId);
  return NextResponse.json(result);
}
