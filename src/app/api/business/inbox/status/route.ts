import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations, bizMessages } from "@/lib/db/schema.business";
import { bizOutboundSends } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, desc, sql, gte } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Operational snapshot for the inbox: is live traffic arriving, and is
 * the outbound path working? Read-only.
 */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  const [webhookMsgs] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizMessages)
    .where(and(eq(bizMessages.businessId, businessId), sql`${bizMessages.meta}->>'source' = 'messenger'`));

  const [importMsgs] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizMessages)
    .where(and(eq(bizMessages.businessId, businessId), sql`${bizMessages.meta}->>'source' = 'messenger_import'`));

  const since = new Date(Date.now() - 60 * 60 * 1000);
  const [recentMsgs] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizMessages)
    .where(and(eq(bizMessages.businessId, businessId), gte(bizMessages.createdAt, since)));

  const latest = await db
    .select({
      direction: bizMessages.direction,
      authorKind: bizMessages.authorKind,
      body: sql<string>`left(${bizMessages.body}, 60)`,
      createdAt: bizMessages.createdAt,
      source: sql<string>`${bizMessages.meta}->>'source'`,
    })
    .from(bizMessages)
    .where(eq(bizMessages.businessId, businessId))
    .orderBy(desc(bizMessages.createdAt))
    .limit(5);

  const sends = await db
    .select({ status: bizOutboundSends.status, n: sql<number>`count(*)::int` })
    .from(bizOutboundSends)
    .where(eq(bizOutboundSends.businessId, businessId))
    .groupBy(bizOutboundSends.status);

  const [openWindow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), sql`${bizConversations.lastInboundAt} > now() - interval '24 hours'`));

  return NextResponse.json({
    liveWebhookMessages: webhookMsgs?.n ?? 0,
    importedMessages: importMsgs?.n ?? 0,
    messagesLastHour: recentMsgs?.n ?? 0,
    openWindows: openWindow?.n ?? 0,
    outbound: Object.fromEntries(sends.map((s) => [s.status, s.n])),
    latest: latest.map((m) => ({
      dir: m.direction,
      who: m.authorKind,
      body: m.body,
      source: m.source ?? null,
      at: m.createdAt.toISOString(),
    })),
  });
}
