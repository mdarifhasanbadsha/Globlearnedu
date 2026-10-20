import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations, bizMessages } from "@/lib/db/schema.business";
import { bizLeads } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, desc, ilike, or, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Search within accessible conversations only:
 * visitor id, linked lead name/phone/email, and message body text.
 */
export async function GET(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ results: [], note: "Type at least 2 characters." });
  }
  if (q.length > 100) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  const businessId = getBusinessId();
  const like = `%${q}%`;

  // Conversations whose linked lead matches on name/phone/email.
  const leadMatches = await db
    .select({ conversationId: bizLeads.conversationId })
    .from(bizLeads)
    .where(
      and(
        eq(bizLeads.businessId, businessId),
        or(
          ilike(bizLeads.fullName, like),
          ilike(bizLeads.phone, like),
          ilike(bizLeads.email, like),
          ilike(bizLeads.subjectInterest, like)
        )
      )
    )
    .limit(50);

  const leadConvIds = leadMatches
    .map((r) => r.conversationId)
    .filter((v): v is string => typeof v === "string");

  // Conversations with a matching message body.
  const msgMatches = await db
    .select({ conversationId: bizMessages.conversationId })
    .from(bizMessages)
    .where(and(eq(bizMessages.businessId, businessId), ilike(bizMessages.body, like)))
    .limit(200);

  const msgConvIds = [...new Set(msgMatches.map((r) => r.conversationId))];

  const allIds = [...new Set([...leadConvIds, ...msgConvIds])];

  if (allIds.length === 0) {
    return NextResponse.json({ results: [] });
  }

  const rows = await db
    .select({
      id: bizConversations.id,
      visitorId: bizConversations.visitorId,
      status: bizConversations.status,
      aiState: bizConversations.aiState,
      lastMessageAt: bizConversations.lastMessageAt,
      leadName: bizLeads.fullName,
      leadPhone: bizLeads.phone,
      leadStage: bizLeads.stage,
    })
    .from(bizConversations)
    .leftJoin(bizLeads, eq(bizLeads.conversationId, bizConversations.id))
    .where(
      and(
        eq(bizConversations.businessId, businessId),
        inArray(bizConversations.id, allIds)
      )
    )
    .orderBy(desc(bizConversations.lastMessageAt))
    .limit(50);

  return NextResponse.json({
    results: rows.map((r) => ({
      ...r,
      lastMessageAt: r.lastMessageAt.toISOString(),
      matchedOn: msgConvIds.includes(r.id) ? "message" : "profile",
    })),
  });
}
