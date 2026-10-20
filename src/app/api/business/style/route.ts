import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizStyleGuides } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, ne, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** Approve or retire a style guide. Only one may be approved at a time. */
export async function PATCH(req: Request) {
  const guard = await requireBusinessUser();
  if ("error" in guard) return guard.error;

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = typeof payload?.id === "string" ? payload.id : "";
  const action = payload?.action;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const businessId = getBusinessId();

  const [row] = await db
    .select({ id: bizStyleGuides.id })
    .from(bizStyleGuides)
    .where(and(eq(bizStyleGuides.businessId, businessId), eq(bizStyleGuides.id, id)))
    .limit(1);

  if (!row) return NextResponse.json({ error: "Style guide not found" }, { status: 404 });

  if (action === "approve") {
    // Retire any previously approved guide so exactly one governs replies.
    await db
      .update(bizStyleGuides)
      .set({ status: "retired", updatedAt: new Date() })
      .where(
        and(
          eq(bizStyleGuides.businessId, businessId),
          eq(bizStyleGuides.status, "approved"),
          ne(bizStyleGuides.id, id)
        )
      );

    await db
      .update(bizStyleGuides)
      .set({ status: "approved", approvedBy: guard.userId, approvedAt: new Date(), updatedAt: new Date() })
      .where(eq(bizStyleGuides.id, id));

    return NextResponse.json({ ok: true, status: "approved" });
  }

  if (action === "reject") {
    await db
      .update(bizStyleGuides)
      .set({ status: "rejected", approvedBy: null, approvedAt: null, updatedAt: new Date() })
      .where(eq(bizStyleGuides.id, id));
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  if (action === "edit") {
    const f = payload?.fields ?? {};
    const patch: Record<string, unknown> = { updatedAt: new Date() };

    const str = (v: unknown, max: number) =>
      typeof v === "string" ? v.slice(0, max) : undefined;

    const summary = str(f.summary, 2000);
    if (summary !== undefined) patch.summary = summary;

    const languageMix = str(f.languageMix, 2000);
    if (languageMix !== undefined) patch.languageMix = languageMix;

    // Owner instruction: the highest-priority steer. Keep newlines.
    const customRules = str(f.customRules, 4000);
    if (customRules !== undefined) patch.customRules = customRules;

    // List fields arrive as arrays from the editor.
    const listFields: [string, number][] = [
      ["tone", 20],
      ["greetingPatterns", 12],
      ["pricingPhrases", 12],
      ["followupPhrases", 12],
      ["avoidPhrases", 12],
    ];
    for (const [key, max] of listFields) {
      if (Array.isArray(f[key])) {
        patch[key] = f[key]
          .filter((v: unknown) => typeof v === "string" && v.trim().length > 0)
          .map((v: string) => v.trim().slice(0, 400))
          .slice(0, max);
      }
    }

    if (Object.keys(patch).length === 1) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    // Mark as owner-edited and bump the version so regeneration cannot
    // silently replace hand-written guidance.
    patch.editedByOwner = true;
    patch.version = sql`${bizStyleGuides.version} + 1`;

    // Editing a guide in use keeps it live; otherwise it needs approval.
    const [existing] = await db
      .select({ status: bizStyleGuides.status })
      .from(bizStyleGuides)
      .where(eq(bizStyleGuides.id, id))
      .limit(1);

    if (existing?.status !== "approved") {
      patch.status = "draft";
      patch.approvedBy = null;
      patch.approvedAt = null;
    }

    await db.update(bizStyleGuides).set(patch).where(eq(bizStyleGuides.id, id));

    return NextResponse.json({
      ok: true,
      status: existing?.status === "approved" ? "approved" : "draft",
      live: existing?.status === "approved",
    });
  }

  if (action === "create") {
    // Start a blank guide the owner writes themselves.
    const [row] = await db
      .insert(bizStyleGuides)
      .values({
        businessId,
        summary: "",
        tone: [],
        greetingPatterns: [],
        pricingPhrases: [],
        followupPhrases: [],
        avoidPhrases: [],
        languageMix: "",
        customRules: "",
        sampleCount: 0,
        status: "approved",
        approvedBy: guard.userId,
        approvedAt: new Date(),
        editedByOwner: true,
      })
      .returning({ id: bizStyleGuides.id });

    await db
      .update(bizStyleGuides)
      .set({ status: "retired", updatedAt: new Date() })
      .where(
        and(
          eq(bizStyleGuides.businessId, businessId),
          eq(bizStyleGuides.status, "approved"),
          ne(bizStyleGuides.id, row.id)
        )
      );

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  }

  return NextResponse.json(
    { error: "action must be approve, reject, edit or create" },
    { status: 400 }
  );
}
