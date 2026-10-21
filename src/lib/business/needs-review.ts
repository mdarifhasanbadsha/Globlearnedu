// ─────────────────────────────────────────────────────────────────────
// "Needs review" marking.
//
// The owner's request: after the AI answers, keep the thread flagged so a human
// staff member can see a student wrote in and nobody has read it yet.
//
// Deliberately NOT a schema column in Drizzle. Declaring a column that is not
// yet in the database breaks every conversation insert and takes chat down
// completely — that has already happened twice in this codebase. Raw SQL with a
// guarded read keeps chat working whether or not migration 0016 has run.
// ─────────────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

/** Flag a conversation so staff can see it needs a human look. */
export async function markNeedsReview(conversationId: string): Promise<void> {
  try {
    await db.execute(
      sql`update biz_conversations
          set needs_review = true, last_ai_reply_at = now(), updated_at = now()
          where id = ${conversationId}`
    );
  } catch {
    /* column not applied yet — chat must keep working */
  }
}

/** Clear the flag when someone has actually opened the thread. */
export async function clearNeedsReview(conversationId: string): Promise<void> {
  try {
    await db.execute(
      sql`update biz_conversations set needs_review = false where id = ${conversationId}`
    );
  } catch {
    /* nothing to clear */
  }
}

/** How many threads are waiting for a human. Zero when the column is missing. */
export async function countNeedsReview(businessId: string): Promise<number> {
  try {
    const rows: any[] = await db
      .execute(
        sql`select count(*)::int as n from biz_conversations
            where business_id = ${businessId} and needs_review = true`
      )
      .then((r: any) => r?.rows ?? r ?? []);
    return Number(rows?.[0]?.n ?? 0);
  } catch {
    return 0;
  }
}
