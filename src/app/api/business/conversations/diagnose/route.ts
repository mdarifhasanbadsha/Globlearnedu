import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Why did a Messenger thread get no reply?
 *
 * Reads the state the auto-reply reads, and reports which gate would have
 * stopped it. Built because the owner could see a conversation with an inbound
 * message and no answer, and nothing in the UI said why.
 */
export async function GET(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();
  const url = new URL(req.url);
  const needle = url.searchParams.get("q");

  const rowsOf = async (q: ReturnType<typeof sql>): Promise<any[]> => {
    try {
      const r: any = await db.execute(q);
      return r?.rows ?? r ?? [];
    } catch {
      return [];
    }
  };

  // Most recent conversations, or the ones matching ?q=
  const convs = await rowsOf(sql`
    select id, visitor_id, channel, ai_state, status,
           last_inbound_at, last_message_at, updated_at,
           contact_name, source_kind
    from biz_conversations
    where business_id = ${businessId}
      ${needle ? sql`and (visitor_id ilike ${"%" + needle + "%"} or contact_name ilike ${"%" + needle + "%"})` : sql``}
    order by last_message_at desc nulls last
    limit 15
  `);

  const out = [];

  for (const c of convs) {
    const counts = await rowsOf(sql`
      select direction, count(*)::int as n, max(created_at) as newest
      from biz_messages where conversation_id = ${c.id}
      group by direction
    `);

    const inbound = counts.find((x) => x.direction === "in");
    const outbound = counts.find((x) => x.direction === "out");

    // Each gate the auto-reply applies, in the order it applies them.
    const gates: { name: string; ok: boolean; detail: string }[] = [];

    gates.push({
      name: "channel is messenger",
      ok: c.channel === "messenger",
      detail: String(c.channel),
    });

    gates.push({
      name: "ai_state is active",
      ok: c.ai_state === "active",
      detail: String(c.ai_state),
    });

    gates.push({
      name: "has inbound message",
      ok: Boolean(inbound && inbound.n > 0),
      detail: inbound ? `${inbound.n} inbound` : "none",
    });

    // The 24-hour window is measured from last_inbound_at.
    const lastIn = c.last_inbound_at ? new Date(c.last_inbound_at) : null;
    const hoursOpen = lastIn ? (Date.now() - lastIn.getTime()) / 3_600_000 : null;
    gates.push({
      name: "last_inbound_at recorded",
      ok: Boolean(lastIn),
      detail: lastIn ? lastIn.toISOString() : "NULL — window cannot open",
    });

    gates.push({
      name: "inside 24h window",
      ok: hoursOpen != null && hoursOpen < 24,
      detail: hoursOpen == null ? "unknown" : `${hoursOpen.toFixed(1)}h ago`,
    });

    gates.push({
      name: "AI answered the latest inbound",
      ok: Boolean(
        outbound && inbound && new Date(outbound.newest) >= new Date(inbound.newest)
      ),
      detail: outbound
        ? `last out ${outbound.newest}, last in ${inbound?.newest}`
        : "no outbound at all",
    });

    const blockedBy = gates.filter((g) => !g.ok).map((g) => g.name);

    out.push({
      conversationId: c.id,
      whose: c.contact_name ?? c.visitor_id,
      channel: c.channel,
      aiState: c.ai_state,
      source: c.source_kind,
      inbound: inbound?.n ?? 0,
      outbound: outbound?.n ?? 0,
      verdict: blockedBy.length === 0 ? "answered" : "NO REPLY",
      blockedBy,
      gates,
    });
  }

  return NextResponse.json({ count: out.length, conversations: out });
}

/**
 * Unfreeze threads the echo bug marked human_owned.
 *
 * A thread is only safe to release if no STAFF message exists in it — those are
 * genuine handovers and must stay with the human. Threads whose only "staff"
 * messages came from our own echo are reset to active.
 */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();
  const url = new URL(req.url);
  const only = url.searchParams.get("id");

  const rowsOf = async (q: ReturnType<typeof sql>): Promise<any[]> => {
    try {
      const r: any = await db.execute(q);
      return r?.rows ?? r ?? [];
    } catch {
      return [];
    }
  };

  // Threads marked human_owned with no real staff reply in them.
  const stuck = await rowsOf(sql`
    select c.id
    from biz_conversations c
    where c.business_id = ${businessId}
      and c.ai_state = 'human_owned'
      ${only ? sql`and c.id = ${only}` : sql``}
      and not exists (
        select 1 from biz_messages m
        where m.conversation_id = c.id
          and m.author_kind = 'staff'
          and m.direction = 'out'
      )
  `);

  let released = 0;
  for (const row of stuck) {
    try {
      await db.execute(
        sql`update biz_conversations set ai_state = ${"active"}, updated_at = now() where id = ${row.id}`
      );
      released++;
    } catch {
      /* keep going */
    }
  }

  return NextResponse.json({ examined: stuck.length, released });
}
