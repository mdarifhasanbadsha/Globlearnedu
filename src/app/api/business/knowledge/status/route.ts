import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizKnowledgeEntries } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { eq, and, desc, sql, isNotNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Read-only check of what the AI can actually see. */
export async function GET() {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  const businessId = getBusinessId();

  const [total] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizKnowledgeEntries)
    .where(and(eq(bizKnowledgeEntries.businessId, businessId), eq(bizKnowledgeEntries.status, "approved")));

  const byLevel = await db
    .select({ level: bizKnowledgeEntries.level, n: sql<number>`count(*)::int` })
    .from(bizKnowledgeEntries)
    .where(and(eq(bizKnowledgeEntries.businessId, businessId), eq(bizKnowledgeEntries.status, "approved")))
    .groupBy(bizKnowledgeEntries.level);

  const [uniCount] = await db
    .select({ n: sql<number>`count(distinct ${bizKnowledgeEntries.universityName})::int` })
    .from(bizKnowledgeEntries)
    .where(and(eq(bizKnowledgeEntries.businessId, businessId), eq(bizKnowledgeEntries.status, "approved")));

  const recent = await db
    .select({
      university: bizKnowledgeEntries.universityName,
      program: bizKnowledgeEntries.programName,
      level: bizKnowledgeEntries.level,
      status: bizKnowledgeEntries.status,
      hasNotes: isNotNull(bizKnowledgeEntries.requirements),
    })
    .from(bizKnowledgeEntries)
    .where(eq(bizKnowledgeEntries.businessId, businessId))
    .orderBy(desc(bizKnowledgeEntries.updatedAt))
    .limit(15);

  // Does a real question retrieve anything?
  const probe = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bizKnowledgeEntries)
    .where(
      and(
        eq(bizKnowledgeEntries.businessId, businessId),
        eq(bizKnowledgeEntries.status, "approved"),
        sql`${bizKnowledgeEntries.level} = 'bachelor'`
      )
    );

  return NextResponse.json({
    approvedEntries: total?.n ?? 0,
    distinctUniversities: uniCount?.n ?? 0,
    bachelorEntries: probe[0]?.n ?? 0,
    byLevel: Object.fromEntries(byLevel.map((r) => [r.level ?? "none", r.n])),
    recent,
  });
}
