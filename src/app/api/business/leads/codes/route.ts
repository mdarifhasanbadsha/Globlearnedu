import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Every conversation, with the code needed to message it.
 *
 * The owner wants to sort threads by hand. This lists all of them with the
 * PSID, the name, whether a number is on file, when they last wrote, and whether
 * the 24-hour window is still open — because a thread outside the window cannot
 * be messaged at all, and knowing that up front saves wasted work.
 */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  const rowsOf = async (q: ReturnType<typeof sql>): Promise<any[]> => {
    try {
      const r: any = await db.execute(q);
      return r?.rows ?? r ?? [];
    } catch {
      return [];
    }
  };

  const rows = await rowsOf(sql`
    select
      c.visitor_id,
      c.channel,
      c.contact_name,
      c.last_inbound_at,
      c.ai_state,
      l.full_name,
      l.phone,
      l.degree_level,
      l.stage,
      (select count(*)::int from biz_messages m
         where m.conversation_id = c.id and m.direction = 'in') as inbound_count
    from biz_conversations c
    left join biz_leads l on l.conversation_id = c.id
    where c.business_id = ${businessId}
    order by c.last_inbound_at desc nulls last, c.last_message_at desc nulls last
  `);

  const now = Date.now();

  const list = rows.map((r) => {
    const last = r.last_inbound_at ? new Date(r.last_inbound_at) : null;
    const hours = last ? (now - last.getTime()) / 3_600_000 : null;
    return {
      code: r.visitor_id,
      channel: r.channel,
      name: r.full_name || r.contact_name || null,
      phone: r.phone || null,
      level: r.degree_level || null,
      messages: r.inbound_count ?? 0,
      lastInbound: last ? last.toISOString().slice(0, 16).replace("T", " ") : null,
      hoursAgo: hours != null ? Number(hours.toFixed(1)) : null,
      canMessage: hours != null && hours < 24,
    };
  });

  // A plain-text block, so it can be copied straight into a message to the owner.
  const lines = [
    "CODE                | CAN MSG | HRS  | ML  | NAME                 | PHONE",
    "-".repeat(96),
    ...list.map((m) =>
      [
        String(m.code ?? "").padEnd(19),
        (m.canMessage ? "YES" : "no").padEnd(7),
        (m.hoursAgo == null ? "-" : String(m.hoursAgo)).padEnd(4),
        String(m.messages).padEnd(3),
        (m.name ?? "-").slice(0, 20).padEnd(20),
        m.phone ?? "-",
      ].join(" | ")
    ),
  ];

  return NextResponse.json({
    total: list.length,
    canMessageNow: list.filter((m) => m.canMessage).length,
    withPhone: list.filter((m) => m.phone).length,
    table: lines.join("\n"),
    conversations: list,
  });
}
