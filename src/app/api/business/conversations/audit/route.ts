import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizConversations, bizMessages } from "@/lib/db/schema.business";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, asc, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Read a conversation as the AI saw it, with a verdict on each turn.
 *
 * Exists because the owner needs to audit what went wrong in a real chat —
 * the inbox shows the messages, but not the pattern, the repeats, or which
 * replies were junk.
 */
export async function GET(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const visitor = url.searchParams.get("visitor");

  // Find the conversation by id, or by the visitor id shown in the inbox.
  let conv: any = null;
  if (id) {
    const [row] = await db
      .select()
      .from(bizConversations)
      .where(and(eq(bizConversations.businessId, businessId), eq(bizConversations.id, id)))
      .limit(1);
    conv = row;
  } else if (visitor) {
    const [row] = await db
      .select()
      .from(bizConversations)
      .where(
        and(
          eq(bizConversations.businessId, businessId),
          sql`${bizConversations.visitorId} like ${"%" + visitor}`
        )
      )
      .orderBy(desc(bizConversations.lastMessageAt))
      .limit(1);
    conv = row;
  } else {
    const [row] = await db
      .select()
      .from(bizConversations)
      .where(eq(bizConversations.businessId, businessId))
      .orderBy(desc(bizConversations.lastMessageAt))
      .limit(1);
    conv = row;
  }

  if (!conv) return NextResponse.json({ error: "No conversation found" }, { status: 404 });

  const msgs = await db
    .select({
      id: bizMessages.id,
      direction: bizMessages.direction,
      authorKind: bizMessages.authorKind,
      body: bizMessages.body,
      meta: bizMessages.meta,
      createdAt: bizMessages.createdAt,
    })
    .from(bizMessages)
    .where(eq(bizMessages.conversationId, conv.id))
    .orderBy(asc(bizMessages.createdAt));

  // ── analysis ──
  const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

  let consecutiveStudent = 0;
  let maxConsecutiveStudent = 0;
  const outBodies: string[] = [];
  const findings: { type: string; at: string; detail: string }[] = [];

  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i];

    // Jammed messages: one student bubble containing the previous reply too.
    if (m.direction === "in" && m.body.length > 400) {
      findings.push({
        type: "jammed_message",
        at: m.createdAt.toISOString(),
        detail: `${m.body.length} chars — message contains more than the student typed`,
      });
    }

    // Identical replies sent twice in a row.
    if (m.direction === "out") {
      const prevOut = outBodies[outBodies.length - 1];
      if (prevOut && norm(prevOut) === norm(m.body)) {
        findings.push({
          type: "duplicate_reply",
          at: m.createdAt.toISOString(),
          detail: "identical to the previous outbound message",
        });
      }
      outBodies.push(m.body);
      consecutiveStudent = 0;
    } else {
      consecutiveStudent++;
      maxConsecutiveStudent = Math.max(maxConsecutiveStudent, consecutiveStudent);
    }
  }

  // Self-reveal in any outbound message.
  const REVEAL = /আমি নিজের মডেল|টেকনিক্যাল ডিটেইলস|আমি একটি AI|as an AI|I am an AI|আমার মডেল/i;
  for (const m of msgs.filter((x) => x.direction === "out")) {
    if (REVEAL.test(m.body)) {
      findings.push({
        type: "self_reveal",
        at: m.createdAt.toISOString(),
        detail: m.body.slice(0, 100),
      });
    }
  }

  // The line "message the page" suggests the assistant answered a question
  // meant for the team, or pushed the student elsewhere.
  for (const m of msgs.filter((x) => x.direction === "out")) {
    if (/পেজে মেসেজ|message our page|পেজে লিখুন/i.test(m.body)) {
      findings.push({
        type: "pushes_student_away",
        at: m.createdAt.toISOString(),
        detail: m.body.slice(0, 100),
      });
    }
  }

  return NextResponse.json({
    conversation: {
      id: conv.id,
      visitorId: conv.visitorId,
      channel: conv.channel,
      aiState: conv.aiState,
      contactName: conv.contactName,
      messageCount: msgs.length,
    },
    stats: {
      inbound: msgs.filter((m) => m.direction === "in").length,
      outbound: msgs.filter((m) => m.direction === "out").length,
      maxConsecutiveStudentWithNoReply: maxConsecutiveStudent,
      distinctReplies: new Set(outBodies.map(norm)).size,
      totalReplies: outBodies.length,
    },
    findings,
    messages: msgs.map((m) => ({
      dir: m.direction,
      who: m.authorKind,
      len: m.body.length,
      body: m.body.slice(0, 500),
      intent: (m.meta as any)?.intent ?? null,
      at: m.createdAt.toISOString(),
    })),
  });
}
