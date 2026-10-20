// ─────────────────────────────────────────────────────────────
// Conversation style learning from imported history.
//
// We do NOT fine-tune (DeepSeek is a closed model). Instead we distil
// approved real conversations into a compact style guide the counseling
// brain reads before replying, so replies match the team's actual voice.
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizMessages, bizConversations } from "@/lib/db/schema.business";
import { bizStyleGuides } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { and, eq, desc, sql } from "drizzle-orm";

export interface StyleGuide {
  summary: string;
  tone: string[];
  greetingPatterns: string[];
  pricingPhrases: string[];
  followupPhrases: string[];
  avoidPhrases: string[];
  languageMix: string;
}

/** Pull recent staff-authored replies across all channels as style samples. */
export async function sampleStaffReplies(businessId: string, limit = 120) {
  const rows = await db
    .select({
      body: bizMessages.body,
      channel: bizConversations.channel,
      createdAt: bizMessages.createdAt,
    })
    .from(bizMessages)
    .innerJoin(bizConversations, eq(bizMessages.conversationId, bizConversations.id))
    .where(
      and(
        eq(bizMessages.businessId, businessId),
        eq(bizMessages.direction, "out"),
        eq(bizMessages.authorKind, "staff"),
        sql`length(trim(${bizMessages.body})) between 12 and 400`
      )
    )
    .orderBy(desc(bizMessages.createdAt))
    .limit(limit);

  return rows;
}

/** The most recent active style guide, or null when none is published. */
export async function loadActiveStyleGuide(businessId: string): Promise<StyleGuide | null> {
  const [row] = await db
    .select()
    .from(bizStyleGuides)
    .where(and(eq(bizStyleGuides.businessId, businessId), eq(bizStyleGuides.status, "approved")))
    .orderBy(desc(bizStyleGuides.updatedAt))
    .limit(1);

  if (!row) return null;

  return {
    summary: row.summary ?? "",
    tone: (row.tone as string[]) ?? [],
    greetingPatterns: (row.greetingPatterns as string[]) ?? [],
    pricingPhrases: (row.pricingPhrases as string[]) ?? [],
    followupPhrases: (row.followupPhrases as string[]) ?? [],
    avoidPhrases: (row.avoidPhrases as string[]) ?? [],
    languageMix: row.languageMix ?? "",
  };
}

/** Render a style guide compactly for the system prompt. */
export function formatStyleGuide(g: StyleGuide): string {
  const lines: string[] = ["HOUSE STYLE (learned from our real conversations — follow closely):"];
  if (g.summary) lines.push(`Overall: ${g.summary}`);
  if (g.languageMix) lines.push(`Language: ${g.languageMix}`);
  if (g.tone.length) lines.push(`Tone: ${g.tone.join("; ")}`);
  if (g.greetingPatterns.length) lines.push(`Openings we use: ${g.greetingPatterns.join(" | ")}`);
  if (g.pricingPhrases.length) lines.push(`How we talk about fees: ${g.pricingPhrases.join(" | ")}`);
  if (g.followupPhrases.length) lines.push(`How we ask for documents/next steps: ${g.followupPhrases.join(" | ")}`);
  if (g.avoidPhrases.length) lines.push(`Avoid these: ${g.avoidPhrases.join(" | ")}`);
  lines.push(
    "Write like a human counselor, not a brochure: short sentences, no bullet-list walls, " +
      "no corporate filler. Match the student's language and script."
  );
  return lines.join("\n");
}
