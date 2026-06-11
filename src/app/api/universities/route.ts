export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { universities } from "@/lib/db/schema";
import { desc, ilike, or, eq, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") ?? "").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "30"), 100);

  const conditions = [eq(universities.isActive, true) as any];

  if (search) {
    conditions.push(
      or(
        ilike(universities.nameEn, `%${search}%`),
        ilike(universities.city, `%${search}%`),
        ilike(universities.province, `%${search}%`),
      ) as any
    );
  }

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];

  const rows = await db
    .select({
      id: universities.id,
      slug: universities.slug,
      nameEn: universities.nameEn,
      nameCn: universities.nameCn,
      city: universities.city,
      province: universities.province,
      tier985: universities.tier985,
      tier211: universities.tier211,
      qsRanking: universities.qsRanking,
      isPartner: universities.isPartner,
    })
    .from(universities)
    .where(where)
    .orderBy(
      desc(universities.isPartner),
      desc(universities.tier985),
      desc(universities.tier211),
      universities.nameEn
    )
    .limit(limit);

  return NextResponse.json({ universities: rows });
}
