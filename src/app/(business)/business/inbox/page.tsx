import { db } from "@/lib/db";
import { bizConversations } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { isDeepSeekConfigured } from "@/lib/business/deepseek";
import { eq, desc } from "drizzle-orm";
import InboxClient from "./_InboxClient";

export const dynamic = "force-dynamic";

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
      status: bizConversations.status,
      aiState: bizConversations.aiState,
      lastMessageAt: bizConversations.lastMessageAt,
    })
    .from(bizConversations)
    .where(eq(bizConversations.businessId, businessId))
    .orderBy(desc(bizConversations.lastMessageAt))
    .limit(50);

  return (
    <InboxClient
      initialConversations={conversations.map((row) => ({
        ...row,
        lastMessageAt: row.lastMessageAt.toISOString(),
      }))}
      initialSelected={c ?? null}
      aiReady={isDeepSeekConfigured()}
    />
  );
}
