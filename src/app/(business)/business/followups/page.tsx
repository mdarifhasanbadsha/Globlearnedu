import { db } from "@/lib/db";
import { bizFollowups, bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId, BUSINESS_TIMEZONE } from "@/lib/business/config";
import { eq, and, asc, lte } from "drizzle-orm";
import FollowupsClient from "./_FollowupsClient";

export const dynamic = "force-dynamic";

export default async function FollowupsPage() {
  const businessId = getBusinessId();

  const rows = await db
    .select({
      id: bizFollowups.id,
      body: bizFollowups.body,
      dueAt: bizFollowups.dueAt,
      status: bizFollowups.status,
      channel: bizFollowups.channel,
      leadName: bizLeads.fullName,
      leadStage: bizLeads.stage,
    })
    .from(bizFollowups)
    .leftJoin(bizLeads, eq(bizFollowups.leadId, bizLeads.id))
    .where(and(eq(bizFollowups.businessId, businessId), eq(bizFollowups.status, "pending")))
    .orderBy(asc(bizFollowups.dueAt))
    .limit(100);

  const now = new Date();

  return (
    <FollowupsClient
      timezone={BUSINESS_TIMEZONE}
      items={rows.map((r) => ({
        id: r.id,
        body: r.body,
        dueAt: r.dueAt.toISOString(),
        channel: r.channel,
        leadName: r.leadName,
        leadStage: r.leadStage,
        overdue: r.dueAt.getTime() < now.getTime(),
      }))}
    />
  );
}
