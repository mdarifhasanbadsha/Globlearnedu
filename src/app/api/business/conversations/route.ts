import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations, bizMessages } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { eq, and, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** List conversations for the authenticated staff area. */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();
  const rows = await db
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
    .limit(100);

  return NextResponse.json({
    conversations: rows.map((r) => ({ ...r, lastMessageAt: r.lastMessageAt.toISOString() })),
  });
}

/**
 * Create a conversation. Staff-authenticated for now; the public website
 * widget will use a separate guest path with its own rate limiting.
 */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const visitorId =
    typeof payload?.visitorId === "string" && payload.visitorId.trim().length > 0
      ? payload.visitorId.trim().slice(0, 64)
      : null;

  if (!visitorId) {
    return NextResponse.json({ error: "visitorId is required" }, { status: 400 });
  }

  const businessId = getBusinessId();

  const [conv] = await db
    .insert(bizConversations)
    .values({
      businessId,
      visitorId,
      subject:
        typeof payload?.subject === "string" ? payload.subject.slice(0, 255) : null,
      status: "open",
      aiState: "active",
    })
    .returning({ id: bizConversations.id });

  if (typeof payload?.body === "string" && payload.body.trim().length > 0) {
    await db.insert(bizMessages).values({
      businessId,
      conversationId: conv.id,
      direction: "in",
      authorKind: "student",
      body: payload.body.trim().slice(0, 4000),
    });
  }

  return NextResponse.json({ id: conv.id }, { status: 201 });
}
