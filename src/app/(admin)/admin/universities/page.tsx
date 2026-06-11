import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { universities, programs } from "@/lib/db/schema";
import { and, ilike, or, eq, desc, sql, inArray } from "drizzle-orm";
import UniversitiesClient, { type UniRow } from "./_UniversitiesClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const REGION_PROVINCES: Record<string, string[]> = {
  North:     ["Beijing", "Tianjin", "Hebei", "Shanxi", "Inner Mongolia"],
  East:      ["Shanghai", "Jiangsu", "Zhejiang", "Anhui", "Fujian", "Jiangxi", "Shandong"],
  South:     ["Guangdong", "Guangxi", "Hainan"],
  Central:   ["Henan", "Hubei", "Hunan"],
  West:      ["Chongqing", "Sichuan", "Guizhou", "Yunnan", "Tibet", "Shaanxi", "Gansu", "Qinghai", "Ningxia", "Xinjiang"],
  Northeast: ["Liaoning", "Jilin", "Heilongjiang"],
};

interface PageProps {
  searchParams: Promise<{ q?: string; tier?: string; region?: string; page?: string }>;
}

export default async function AdminUniversitiesPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as any).role;
  if (!["admin", "content_manager", "staff"].includes(role)) redirect("/dashboard");

  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const tier = params.tier ?? "All Tiers";
  const region = params.region ?? "All Regions";
  const page = Math.max(0, parseInt(params.page ?? "0", 10) || 0);

  // Build where conditions
  const conditions = [];

  if (q) {
    conditions.push(
      or(
        ilike(universities.nameEn, `%${q}%`),
        ilike(universities.city, `%${q}%`),
        ilike(universities.province, `%${q}%`),
      )
    );
  }

  if (tier === "985") conditions.push(eq(universities.tier985, true));
  else if (tier === "211") conditions.push(eq(universities.tier211, true));
  else if (tier === "Partner") conditions.push(eq(universities.isPartner, true));

  if (region !== "All Regions" && REGION_PROVINCES[region]) {
    conditions.push(inArray(universities.province, REGION_PROVINCES[region]));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countRows] = await Promise.all([
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
        isActive: universities.isActive,
        dataConfidence: universities.dataConfidence,
        website: universities.website,
        programCount: sql<number>`cast(count(${programs.id}) as int)`,
      })
      .from(universities)
      .leftJoin(programs, eq(programs.universityId, universities.id))
      .where(where)
      .groupBy(universities.id)
      .orderBy(desc(universities.isPartner), desc(universities.tier985), universities.nameEn)
      .limit(PAGE_SIZE)
      .offset(page * PAGE_SIZE),

    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(universities)
      .where(where),
  ]);

  const totalCount: number = countRows[0]?.count ?? 0;

  return (
    <UniversitiesClient
      universities={rows as UniRow[]}
      totalCount={totalCount}
      page={page}
      pageSize={PAGE_SIZE}
      q={q}
      tier={tier}
      region={region}
    />
  );
}
