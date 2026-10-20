import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bizStyleGuides } from "@/lib/db/schema.business2";
import { getBusinessId } from "@/lib/business/config";
import { requireBusinessUser } from "@/lib/business/guard";
import { and, eq, ne } from "drizzle-orm";

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

  return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
}
