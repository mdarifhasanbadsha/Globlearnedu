// ─────────────────────────────────────────────────────────────────────
// The follow-up runner.
//
// Called by a scheduled job (or by any admin request) and sends whichever
// follow-up messages are now due. Idempotent: a stage is advanced only when
// the message actually goes out, so a failure retries rather than skipping.
// ─────────────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizConversations, bizMessages } from "@/lib/db/schema.business";
import { sendMessengerText, windowOpen } from "@/lib/business/messenger-send";
import {
  followupMessage,
  secondDueAt,
  type FollowupStage,
} from "@/lib/business/followup-engine";
import { and, eq, lte, isNotNull, sql } from "drizzle-orm";

export interface RunResult {
  scanned: number;
  sent: number;
  skipped: number;
  finished: number;
}

/**
 * Send every follow-up that is due.
 *
 * Only Messenger threads are handled, because the sequence needs a channel we
 * can push to without the student writing first.
 */
export async function runDueFollowups(businessId: string, now = new Date()): Promise<RunResult> {
  const result: RunResult = { scanned: 0, sent: 0, skipped: 0, finished: 0 };

  let due: any[] = [];
  try {
    const r: any = await db.execute(sql`
      select id, visitor_id, channel, ai_state, contact_name, followup_stage, last_inbound_at
      from biz_conversations
      where business_id = ${businessId}
        and channel = 'messenger'
        and followup_due_at is not null
        and followup_due_at <= ${now.toISOString()}
        and followup_stage in ('awaiting_call','awaiting_number','final_wait')
      order by followup_due_at asc
      limit 25
    `);
    due = r?.rows ?? r ?? [];
  } catch {
    return result;
  }

  for (const conv of due) {
    result.scanned++;
    const stage = conv.followup_stage as FollowupStage;

    // Never message outside Meta's 24-hour window; a template would be needed
    // and we do not have one for this sequence.
    if (!windowOpen(conv.last_inbound_at ? new Date(conv.last_inbound_at) : null, now)) {
      result.skipped++;
      continue;
    }

    // A human may have taken over while this was queued.
    if (conv.ai_state === "active") {
      result.skipped++;
      continue;
    }

    const msg = followupMessage(stage, conv.contact_name);
    if (!msg) {
      result.skipped++;
      continue;
    }

    const sent = await sendMessengerText({
      businessId,
      conversationId: conv.id,
      recipientId: conv.visitor_id,
      body: msg.body,
    });

    if (!sent.ok) {
      result.skipped++;
      continue;
    }

    await db.insert(bizMessages).values({
      businessId,
      conversationId: conv.id,
      direction: "out",
      authorKind: "ai",
      body: msg.body,
      meta: { source: "followup", stage },
    });

    try {
      if (msg.handOff) {
        // Final message: the AI is finished with this thread.
        await db.execute(
      sql`update biz_conversations set followup_stage = ${'handed_off'}, followup_due_at = null, followup_stage_at = now(), ai_state = ${'paused'}, updated_at = now() where id = ${conv.id}`
    );
        result.finished++;
      } else {
        // awaiting_call -> awaiting_number after the student answers; the
        // runner only advances to the next scheduled nudge for final_wait.
        await db.execute(
      sql`update biz_conversations set followup_stage = ${stage === 'awaiting_number' ? 'final_wait' : stage}, followup_due_at = ${stage === 'awaiting_number' ? secondDueAt(now) : null}, followup_stage_at = now(), updated_at = now() where id = ${conv.id}`
    );
      }
    } catch {
      /* the message went out; the stage catches up next run */
    }

    result.sent++;
  }

  return result;
}
