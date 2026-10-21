// ─────────────────────────────────────────────────────────────────────
// Answering the follow-up conversation.
//
// Separate from the main reply path because this is not counselling: it is a
// conversation about whether we kept a promise, and every line is fixed.
// ─────────────────────────────────────────────────────────────────────

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { bizConversations, bizMessages } from "@/lib/db/schema.business";
import { sendMessengerText } from "@/lib/business/messenger-send";
import {
  findPhoneNumber,
  followupMessage,
  saysCalled,
  saysNotCalled,
  HANDOFF_REPLY,
  secondDueAt,
  type FollowupStage,
} from "@/lib/business/followup-engine";

export interface FollowupReplyOutcome {
  attempted: true;
  reason: string;
  sent: boolean;
  batched: number;
}

export async function readFollowupStage(
  conversationId: string
): Promise<{ stage: FollowupStage | null; name: string | null }> {
  try {
    const r: any = await db.execute(
      sql`select followup_stage, contact_name from biz_conversations where id = ${conversationId} limit 1`
    );
    const row = (r?.rows ?? r ?? [])[0];
    return { stage: (row?.followup_stage ?? null) as FollowupStage | null, name: row?.contact_name ?? null };
  } catch {
    return { stage: null, name: null };
  }
}

/**
 * Handle one message from a student whose thread is in the follow-up sequence.
 * Returns null when the message is not part of it, so normal counselling runs.
 */
export async function handleFollowupAnswer(args: {
  businessId: string;
  conversationId: string;
  visitorId: string;
  message: string;
}): Promise<FollowupReplyOutcome | null> {
  const { businessId, conversationId, visitorId, message } = args;

  const { stage, name } = await readFollowupStage(conversationId);
  if (!stage || stage === "none" || stage === "handed_off") return null;

  const send = async (body: string) => {
    if (!body) return false;
    const [saved] = await db
      .insert(bizMessages)
      .values({
        businessId,
        conversationId,
        direction: "out",
        authorKind: "ai",
        body,
        meta: { source: "followup_reply", stage },
      })
      .returning({ id: bizMessages.id });
    const sent = await sendMessengerText({
      businessId,
      conversationId,
      recipientId: visitorId,
      body,
      messageId: saved?.id,
    });
    return sent.ok;
  };

  const advance = async (next: FollowupStage, dueAt: Date | null) => {
    await db.execute(
      sql`update biz_conversations set followup_stage = ${next}, followup_due_at = ${dueAt}, followup_stage_at = now(), ai_state = ${next === 'handed_off' ? 'paused' : 'handoff_requested'}, updated_at = now() where id = ${conversationId}`
    );
  };

  // They told us the team did call. The promise was kept — stop entirely.
  if (saysCalled(message)) {
    const ok = await send(HANDOFF_REPLY);
    await advance("handed_off", null);
    return { attempted: true, reason: "call confirmed, AI finished", sent: ok, batched: 1 };
  }

  // Nobody called. Apologise, say the team has been told, and check the number.
  if (stage === "awaiting_call" || saysNotCalled(message)) {
    const msg = followupMessage("awaiting_number", name);
    const ok = await send(msg?.body ?? "");
    await advance("awaiting_number", secondDueAt());
    return { attempted: true, reason: "not called: apologised, confirming number", sent: ok, batched: 1 };
  }

  // They confirmed the number (or gave a new one).
  if (findPhoneNumber(message) || stage === "awaiting_number") {
    const msg = followupMessage("final_wait", name);
    const ok = await send(msg?.body ?? "");
    await advance("handed_off", null);
    return { attempted: true, reason: "number confirmed: final apology, handed off", sent: ok, batched: 1 };
  }

  return null;
}
