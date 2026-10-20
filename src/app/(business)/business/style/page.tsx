import { db } from "@/lib/db";
import { bizStyleGuides } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { sampleStaffReplies } from "@/lib/business/style";
import { eq, desc } from "drizzle-orm";
import StyleClient from "./_StyleClient";

export const dynamic = "force-dynamic";

export default async function StylePage() {
  const businessId = getBusinessId();

  // Prefer the live guide; fall back to the newest draft.
  const rows = await db
    .select()
    .from(bizStyleGuides)
    .where(eq(bizStyleGuides.businessId, businessId))
    .orderBy(desc(bizStyleGuides.updatedAt))
    .limit(10);

  const active =
    rows.find((r) => r.status === "approved") ?? rows.find((r) => r.status === "draft") ?? null;

  const samples = await sampleStaffReplies(businessId, 8);

  return (
    <StyleClient
      guide={
        active
          ? {
              id: active.id,
              summary: active.summary,
              tone: (active.tone as string[]) ?? [],
              greetingPatterns: (active.greetingPatterns as string[]) ?? [],
              pricingPhrases: (active.pricingPhrases as string[]) ?? [],
              followupPhrases: (active.followupPhrases as string[]) ?? [],
              avoidPhrases: (active.avoidPhrases as string[]) ?? [],
              languageMix: active.languageMix,
              customRules: active.customRules,
              sampleCount: active.sampleCount,
              status: active.status,
              version: active.version,
              editedByOwner: active.editedByOwner,
              updatedAt: active.updatedAt.toISOString(),
            }
          : null
      }
      samples={samples.map((s) => ({ body: s.body, channel: s.channel }))}
    />
  );
}
