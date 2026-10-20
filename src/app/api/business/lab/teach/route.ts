import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizTestFindings, bizStyleGuides } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Promote a graded finding into the brand voice.
 *
 * This is the teaching loop: you test as a student, mark an answer wrong,
 * state what it should have said, then push that correction into the voice
 * so it applies to every future reply. It appends to the owner's custom
 * rules, which take precedence over the learned guidance.
 */
export async function POST(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const findingId = typeof payload?.findingId === "string" ? payload.findingId : "";
  if (!findingId) return NextResponse.json({ error: "findingId required" }, { status: 400 });

  const businessId = getBusinessId();

  const [finding] = await db
    .select()
    .from(bizTestFindings)
    .where(
      and(eq(bizTestFindings.businessId, businessId), eq(bizTestFindings.id, findingId))
    )
    .limit(1);

  if (!finding) return NextResponse.json({ error: "Finding not found" }, { status: 404 });

  const expected = (finding.expected ?? "").trim() || (payload?.expected as string)?.trim();
  if (!expected) {
    return NextResponse.json(
      { error: "Add what it should have said before teaching this." },
      { status: 400 }
    );
  }

  // The live guide, or the newest one we can amend.
  const rows = await db
    .select()
    .from(bizStyleGuides)
    .where(eq(bizStyleGuides.businessId, businessId))
    .orderBy(desc(bizStyleGuides.updatedAt))
    .limit(10);

  const guide = rows.find((r) => r.status === "approved") ?? rows[0] ?? null;

  if (!guide) {
    return NextResponse.json(
      { error: "No brand voice exists yet. Create one on the Brand voice page first." },
      { status: 409 }
    );
  }

  const rule = `When a student asks something like "${(finding.question ?? "").slice(0, 140)}", answer in this spirit: ${expected.slice(0, 400)}`;

  const existing = (guide.customRules ?? "").trim();
  const nextRules = existing.length > 0 ? `${existing}\n- ${rule}` : `- ${rule}`;

  await db
    .update(bizStyleGuides)
    .set({
      customRules: nextRules,
      editedByOwner: true,
      version: sql`${bizStyleGuides.version} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(bizStyleGuides.id, guide.id));

  await db
    .update(bizTestFindings)
    .set({ promotedTo: "brand_voice", promotedAt: new Date() })
    .where(eq(bizTestFindings.id, findingId));

  return NextResponse.json({
    ok: true,
    appliedTo: guide.status === "approved" ? "live voice" : "draft voice",
    note:
      guide.status === "approved"
        ? "Added to your brand voice. The next reply will follow it."
        : "Added, but the voice is still a draft — approve it to take effect.",
  });
}
