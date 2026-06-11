import { db } from "@/lib/db";
import { universities, programs } from "@/lib/db/schema";
import { desc, sql, eq } from "drizzle-orm";
import UniversitiesClient, { type UniPublicRow } from "./_UniversitiesClient";

export const dynamic = "force-dynamic";

export default async function UniversitiesPage() {
  const [universityList, totalRows] = await Promise.all([
    db
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
        description: universities.description,
        programCount: sql<number>`cast(count(${programs.id}) as int)`,
      })
      .from(universities)
      .leftJoin(programs, eq(programs.universityId, universities.id))
      .where(eq(universities.isActive, true))
      .groupBy(universities.id)
      .orderBy(desc(universities.isPartner), desc(universities.tier985), universities.nameEn)
      .limit(200),

    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(universities)
      .where(eq(universities.isActive, true)),
  ]);

  return (
    <UniversitiesClient
      universities={universityList as UniPublicRow[]}
      totalCount={totalRows[0]?.count ?? 0}
    />
  );
}
