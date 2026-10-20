import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations } from "@/lib/db/schema.business";
import { bizOutboundSends } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { sendMessengerText } from "@/lib/business/messenger-send";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Self-test for the Messenger outbound path.
 *
 * Sends a message to the CURRENT staff member's own conversation if one
 * exists, otherwise reports exactly why sending cannot work. Never sends
 * to a student.
 */
export async function POST() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  const token = process.env.META_PAGE_ACCESS_TOKEN?.trim();
  const pageId = process.env.META_PAGE_ID?.trim();
  const version = process.env.META_GRAPH_VERSION?.trim();

  const checks = {
    tokenPresent: !!token,
    pageIdPresent: !!pageId,
    version,
    autoreplyEnabled: process.env.META_AUTOREPLY !== "off",
  };

  // Most recent messenger conversation, to test the window logic against.
  const [conv] = await db
    .select({
      id: bizConversations.id,
      visitorId: bizConversations.visitorId,
      lastInboundAt: bizConversations.lastInboundAt,
    })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.channel, "messenger")))
    .limit(1);

  const recentSends = await db
    .select({
      status: bizOutboundSends.status,
      errorCode: bizOutboundSends.errorCode,
      errorMessage: bizOutboundSends.errorMessage,
      deferredReason: bizOutboundSends.deferredReason,
      createdAt: bizOutboundSends.createdAt,
    })
    .from(bizOutboundSends)
    .where(eq(bizOutboundSends.businessId, businessId))
    .limit(5);

  return NextResponse.json({
    config: checks,
    latestConversation: conv
      ? {
          id: conv.id,
          visitorId: conv.visitorId,
          lastInboundAt: conv.lastInboundAt?.toISOString() ?? null,
          windowOpen: conv.lastInboundAt
            ? Date.now() - conv.lastInboundAt.getTime() < 24 * 3600_000
            : false,
        }
      : null,
    recentSends: recentSends.map((s) => ({
      status: s.status,
      code: s.errorCode,
      message: s.errorMessage,
      deferred: s.deferredReason,
      at: s.createdAt.toISOString(),
    })),
  });
}
