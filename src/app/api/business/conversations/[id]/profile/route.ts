import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { syncConversationProfile } from "@/lib/business/profile";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Refresh a conversation's name and photo from Meta. */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = typeof payload?.conversationId === "string" ? payload.conversationId : "";
  if (!id) return NextResponse.json({ error: "conversationId required" }, { status: 400 });

  const businessId = getBusinessId();

  const [conv] = await db
    .select({ id: bizConversations.id })
    .from(bizConversations)
    .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, id)))
    .limit(1);

  if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const result = await syncConversationProfile(businessId, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Profile sync failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, name: result.name });
}
