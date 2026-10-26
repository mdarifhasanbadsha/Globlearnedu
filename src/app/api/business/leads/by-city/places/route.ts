import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Which places do students actually name?
 *
 * The Chittagong finder returned zero out of 724 conversations, so before
 * trusting the patterns this counts the place-words that DO appear. It answers
 * "are they naming cities at all, and which ones?" instead of guessing.
 */
const PLACES = [
  "dhaka", "chittagong", "chattogram", "ctg", "sylhet", "khulna", "rajshahi",
  "barishal", "rangpur", "comilla", "cumilla", "mymensingh", "gazipur",
  "narayanganj", "bogura", "bogra", "jessore", "jashore", "dinajpur",
  "coxs bazar", "coxbazar", "cox's bazar", "faridpur", "tangail", "noakhali",
  "feni", "brahmanbaria", "chandpur", "lakshmipur", "bhola", "patuakhali",
  "kushtia", "pabna", "natore", "sirajganj", "jamalpur", "sherpur",
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

  const total = await rowsOf(sql`
    select
      count(*)::int as all_msgs,
      count(*) filter (where direction = 'in')::int as inbound,
      count(*) filter (where direction = 'out')::int as outbound
    from biz_messages where business_id = ${businessId}
  `);

  const counts: Record<string, number> = {};
  for (const p of PLACES) {
    const r = await rowsOf(sql`
      select count(*)::int as n
      from biz_messages
      where business_id = ${businessId}
        and direction = 'in'
        and body ilike ${"%" + p + "%"}
    `);
    const n = Number(r?.[0]?.n ?? 0);
    if (n > 0) counts[p] = n;
  }

  // A sample of real student messages, so the shape of their language is visible.
  const sample = await rowsOf(sql`
    select body from biz_messages
    where business_id = ${businessId} and direction = 'in'
    order by random() limit 15
  `);

  return NextResponse.json({
    messageCounts: total?.[0] ?? {},
    placeMentions: counts,
    sampleMessages: sample.map((s) => String(s.body ?? "").slice(0, 160)),
  });
}
