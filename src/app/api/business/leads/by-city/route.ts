import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Find students whose own messages say they are from Chittagong.
 *
 * There is no address column, so the only honest source is what the student
 * wrote. This scans their messages for the city, its spellings, and the
 * neighbourhoods people actually name. It reports what matched so a human can
 * verify each one before anything is sent.
 */
const PATTERNS: { label: string; rx: RegExp }[] = [
  { label: "chittagong", rx: /\bchittagong\b|\bchattogram\b|\bchittagong bashi\b/i },
  { label: "ctg", rx: /\bctg\b/i },
  { label: "agrabad", rx: /\bagrabad\b|\bagrabad/i },
  { label: "halishahar", rx: /\bhalishahar\b|\bhalishar\b/i },
  { label: "pahartali", rx: /\bpahartali\b/i },
  { label: "kotwali", rx: /\bkotwali\b|\bkotowali\b/i },
  { label: "double mooring", rx: /\bdouble mooring\b/i },
  { label: "sitakunda", rx: /\bsitakunda\b/i },
  { label: "patiya", rx: /\bpatiya\b/i },
  { label: "cuet", rx: /\bcuet\b/i },
  { label: "chawk bazar", rx: /\bchawk ?bazar\b/i },
  { label: "nasirabad", rx: /\bnasirabad\b/i },
  { label: "khulshi", rx: /\bkhulshi\b/i },
  { label: "gEC", rx: /\bgec\b|\bgec circle\b/i },
  { label: "mirsharai", rx: /\bmirsharai\b/i },
  { label: "rangunia", rx: /\brangunia\b/i },
  { label: "anwara", rx: /\banwara\b/i },
  { label: "banshkhali", rx: /\bbanshkhali\b/i },
  { label: "chittagong bangla", rx: /\u099a\u099f\u09cd\u099f\u0997\u09cd\u09b0\u09be\u09ae/i },
];

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

  // Every conversation with its student messages.
  const convs = await rowsOf(sql`
    select c.id, c.visitor_id, c.channel, c.contact_name, c.last_inbound_at,
           l.full_name, l.phone, l.has_contact
    from biz_conversations c
    left join biz_leads l on l.conversation_id = c.id
    where c.business_id = ${businessId}
    order by c.last_message_at desc nulls last
  `);

  const matches: any[] = [];

  for (const c of convs) {
    const msgs = await rowsOf(sql`
      select body from biz_messages
      where conversation_id = ${c.id} and direction = 'in'
      order by created_at desc
      limit 200
    `);

    const hits: { label: string; quote: string }[] = [];
    for (const m of msgs) {
      const body = String(m.body ?? "");
      if (!body) continue;
      for (const p of PATTERNS) {
        if (p.rx.test(body)) {
          // Keep a short quote so a human can judge the match.
          const at = body.search(p.rx);
          const from = Math.max(0, at - 40);
          hits.push({ label: p.label, quote: body.slice(from, from + 120).trim() });
          break; // one hit per message is enough
        }
      }
    }

    if (hits.length > 0) {
      const lastIn = c.last_inbound_at ? new Date(c.last_inbound_at) : null;
      const hours = lastIn ? (Date.now() - lastIn.getTime()) / 3_600_000 : null;
      matches.push({
        conversationId: c.id,
        name: c.full_name || c.contact_name || null,
        phone: c.phone || null,
        channel: c.channel,
        visitorId: c.visitor_id,
        hits: hits.slice(0, 3),
        inside24h: hours != null && hours < 24,
        hoursAgo: hours != null ? Number(hours.toFixed(1)) : null,
      });
    }
  }

  return NextResponse.json({
    scannedConversations: convs.length,
    matched: matches.length,
    withPhone: matches.filter((m) => m.phone).length,
    inside24h: matches.filter((m) => m.inside24h).length,
    matches,
  });
}
