import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Show exactly what is in the knowledge base, by university and level.
 *
 * The screen shows two different numbers ("72 live" is programme entries,
 * "72 live · 0 draft" below the list is the same count) which repeatedly read as
 * a contradiction. This returns the truth in one place so it can be trusted.
 */
export async function GET() {
  try {
    const r: any = await db.execute(sql`
      select
        university_name,
        city,
        level,
        count(*)::int as n,
        max(updated_at) as last_updated
      from biz_knowledge_entries
      where status = 'approved'
      group by university_name, city, level
      order by university_name, level
    `);
    const rows = r?.rows ?? r ?? [];

    const byLevel: Record<string, number> = {};
    const byUni = new Map<string, { city: string | null; levels: string[] }>();
    for (const row of rows) {
      const n = Number(row.n ?? 0);
      byLevel[row.level ?? "none"] = (byLevel[row.level ?? "none"] ?? 0) + n;
      const key = String(row.university_name ?? "");
      const entry: { city: string | null; levels: string[] } =
        byUni.get(key) ?? { city: row.city ?? null, levels: [] };
      entry.levels.push(`${row.level}(${n})`);
      if (!entry.city && row.city) entry.city = row.city;
      byUni.set(key, entry);
    }

    const last = await db.execute(sql`
      select max(updated_at) as newest from biz_knowledge_entries where status = 'approved'
    `);
    const newest = ((last as any)?.rows ?? (last as any) ?? [])[0]?.newest ?? null;

    return NextResponse.json({
      programmeEntries: Object.values(byLevel).reduce((a, b) => a + b, 0),
      distinctUniversities: byUni.size,
      byLevel,
      newestUpdate: newest,
      universities: [...byUni.entries()]
        .map(([name, v]) => ({ name, city: v.city, levels: v.levels }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e).slice(0, 200) }, { status: 500 });
  }
}
