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
  searchParams: Promise<{ c?: string; page?: string }>;
}) {
  const businessId = getBusinessId();
  const { c, page } = await searchParams;

  // The list shows the most recently active threads. A hard limit of 60 hid
  // everyone else once the import passed 500; paging keeps the page light
  // while making every conversation reachable.
  const PAGE_SIZE = 60;
  const pageNum = Math.max(1, Number(page) || 1);

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
    .limit(PAGE_SIZE)
    .offset((pageNum - 1) * PAGE_SIZE);

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
      page={pageNum}
      pageSize={PAGE_SIZE}
    />
  );
}
