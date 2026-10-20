import { db } from "@/lib/db";
import { bizStyleGuides } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { sampleStaffReplies } from "@/lib/business/style";
import { eq, desc } from "drizzle-orm";
import StyleClient from "./_StyleClient";

export const dynamic = "force-dynamic";

export default async function StylePage() {
  const businessId = getBusinessId();

  const rows = await db
    .select()
    .from(bizStyleGuides)
    .where(eq(bizStyleGuides.businessId, businessId))
    .orderBy(desc(bizStyleGuides.updatedAt))
    .limit(10);

  const samples = await sampleStaffReplies(businessId, 8);

  return (
    <StyleClient
      guides={rows.map((r) => ({
        id: r.id,
        summary: r.summary,
        tone: (r.tone as string[]) ?? [],
        greetingPatterns: (r.greetingPatterns as string[]) ?? [],
        pricingPhrases: (r.pricingPhrases as string[]) ?? [],
        followupPhrases: (r.followupPhrases as string[]) ?? [],
        avoidPhrases: (r.avoidPhrases as string[]) ?? [],
        languageMix: r.languageMix,
        sampleCount: r.sampleCount,
        status: r.status,
        updatedAt: r.updatedAt.toISOString(),
      }))}
      samples={samples.map((s) => ({ body: s.body, channel: s.channel }))}
    />
  );
}
