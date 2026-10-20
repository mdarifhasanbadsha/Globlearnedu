import { db } from "@/lib/db";
import { bizConversations } from "@/lib/db/schema.business";
import { bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { isDeepSeekConfigured } from "@/lib/business/deepseek";
import { eq, desc } from "drizzle-orm";
import InboxClient from "./_InboxClient";

export const dynamic = "force-dynamic";

const SOURCE_LABEL: Record<string, string> = {
  ad: "Facebook ad",
  post: "Facebook post",
  comment: "Post comment",
  mme: "m.me link",
  shortlink: "Short link",
  direct: "Direct message",
};

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const businessId = getBusinessId();
  const { c } = await searchParams;

  const conversations = await db
    .select({
      id: bizConversations.id,
      visitorId: bizConversations.visitorId,
      channel: bizConversations.channel,
      status: bizConversations.status,
      aiState: bizConversations.aiState,
      lastMessageAt: bizConversations.lastMessageAt,
      contactName: bizConversations.contactName,
      contactPicture: bizConversations.contactPicture,
      contactLocale: bizConversations.contactLocale,
      sourceKind: bizConversations.sourceKind,
      sourceRef: bizConversations.sourceRef,
      sourceAdId: bizConversations.sourceAdId,
      sourceUrl: bizConversations.sourceUrl,
      leadName: bizLeads.fullName,
      leadPriority: bizLeads.priority,
      leadScore: bizLeads.score,
      leadStage: bizLeads.stage,
      leadId: bizLeads.id,
    })
    .from(bizConversations)
    .leftJoin(bizLeads, eq(bizLeads.conversationId, bizConversations.id))
    .where(eq(bizConversations.businessId, businessId))
    .orderBy(desc(bizConversations.lastMessageAt))
    .limit(60);

  return (
    <InboxClient
      initialConversations={conversations.map((row) => ({
        ...row,
        lastMessageAt: row.lastMessageAt.toISOString(),
        displayName:
          row.contactName ??
          row.leadName ??
          (row.channel === "messenger"
            ? `Messenger ${row.visitorId.slice(-6)}`
            : `Website visitor ${row.visitorId.slice(-4)}`),
        sourceLabel: row.sourceKind ? (SOURCE_LABEL[row.sourceKind] ?? row.sourceKind) : null,
      }))}
      initialSelected={c ?? null}
      aiReady={isDeepSeekConfigured()}
    />
  );
}
