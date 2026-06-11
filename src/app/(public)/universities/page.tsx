import { db } from "@/lib/db";
import { universities, programs } from "@/lib/db/schema";
import { desc, sql, eq, and, or, ilike } from "drizzle-orm";
import UniversitiesClient, { type UniPublicRow } from "./_UniversitiesClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

const REGION_PROVINCES: Record<string, string[]> = {
  north:     ["Beijing", "Tianjin", "Hebei", "Shanxi", "Inner Mongolia"],
  east:      ["Shanghai", "Jiangsu", "Zhejiang", "Anhui", "Fujian", "Jiangxi", "Shandong"],
  south:     ["Guangdong", "Guangxi", "Hainan"],
  central:   ["Henan", "Hubei", "Hunan"],
  west:      ["Chongqing", "Sichuan", "Guizhou", "Yunnan", "Tibet", "Shaanxi", "Gansu", "Qinghai", "Ningxia", "Xinjiang"],
  northeast: ["Liaoning", "Jilin", "Heilongjiang"],
};

interface PageProps {
  searchParams: Promise<{ search?: string; tier?: string; region?: string; page?: string }>;
}

export default async function UniversitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = (params.search ?? "").trim();
  const tier   = (params.tier   ?? "").toLowerCase();
  const region = (params.region ?? "").toLowerCase();
  const page   = Math.max(1, parseInt(params.page ?? "1") || 1);
  const offset = (page - 1) * PAGE_SIZE;

  // Build where conditions
  const conditions: ReturnType<typeof eq>[] = [eq(universities.isActive, true) as any];

  if (search) {
    conditions.push(
      or(
        ilike(universities.nameEn, `%${search}%`),
        ilike(universities.nameCn, `%${search}%`),
        ilike(universities.city,   `%${search}%`),
        ilike(universities.province, `%${search}%`),
      ) as any
    );
  }

  if (tier === "985")     conditions.push(eq(universities.tier985,   true) as any);
  if (tier === "211")     conditions.push(eq(universities.tier211,   true) as any);
  if (tier === "partner") conditions.push(eq(universities.isPartner, true) as any);

  if (region && REGION_PROVINCES[region]) {
    conditions.push(
      or(...REGION_PROVINCES[region].map((p) => ilike(universities.province, `%${p}%`))) as any
    );
  }

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];

  const [[{ total }], universityList] = await Promise.all([
    db
      .select({ total: sql<number>`cast(count(*) as int)` })
      .from(universities)
      .where(where),

    db
      .select({
        id:             universities.id,
        slug:           universities.slug,
        nameEn:         universities.nameEn,
        nameCn:         universities.nameCn,
        city:           universities.city,
        province:       universities.province,
        tier985:        universities.tier985,
        tier211:        universities.tier211,
        qsRanking:      universities.qsRanking,
        isPartner:      universities.isPartner,
        dataConfidence: universities.dataConfidence,
        programCount:   sql<number>`cast(count(${programs.id}) as int)`,
      })
      .from(universities)
      .leftJoin(programs, eq(programs.universityId, universities.id))
      .where(where)
      .groupBy(universities.id)
      .orderBy(desc(universities.isPartner), desc(universities.tier985), universities.nameEn)
      .limit(PAGE_SIZE)
      .offset(offset),
  ]);

  // Total unfiltered count for hero stat
  const [{ allTotal }] = await db
    .select({ allTotal: sql<number>`cast(count(*) as int)` })
    .from(universities)
    .where(eq(universities.isActive, true));

  return (
    <UniversitiesClient
      universities={universityList as UniPublicRow[]}
      totalCount={total}
      allTotal={allTotal}
      currentPage={page}
      totalPages={Math.ceil(total / PAGE_SIZE)}
      searchQuery={search}
      activeTier={tier}
      activeRegion={region}
    />
  );
}
