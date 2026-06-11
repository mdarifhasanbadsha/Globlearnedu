import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { admissionYearPages, universities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/admin/admission-pages/[id]
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const rows = await db
    .select({
      id: admissionYearPages.id,
      slug: admissionYearPages.slug,
      year: admissionYearPages.year,
      pageType: admissionYearPages.pageType,
      programType: admissionYearPages.programType,
      isPublished: admissionYearPages.isPublished,
      publishedAt: admissionYearPages.publishedAt,
      disclaimerActive: admissionYearPages.disclaimerActive,
      feesVerified: admissionYearPages.feesVerified,
      feesVerifiedAt: admissionYearPages.feesVerifiedAt,
      datesVerified: admissionYearPages.datesVerified,
      datesVerifiedAt: admissionYearPages.datesVerifiedAt,
      programsVerified: admissionYearPages.programsVerified,
      programsVerifiedAt: admissionYearPages.programsVerifiedAt,
      verifiedBy: admissionYearPages.verifiedBy,
      pageData: admissionYearPages.pageData,
      universityId: admissionYearPages.universityId,
      universityName: universities.nameEn,
      universityCn: universities.nameCn,
      universityCity: universities.city,
      createdAt: admissionYearPages.createdAt,
      updatedAt: admissionYearPages.updatedAt,
    })
    .from(admissionYearPages)
    .leftJoin(universities, eq(admissionYearPages.universityId, universities.id))
    .where(eq(admissionYearPages.id, id))
    .limit(1);

  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ page: rows[0] });
}

// PATCH /api/admin/admission-pages/[id]
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const {
    pageData, isPublished, disclaimerActive,
    feesVerified, datesVerified, programsVerified,
    programType, slug,
  } = body;

  const now = new Date();
  const updates: Record<string, unknown> = { updatedAt: now };

  if (pageData !== undefined)       updates.pageData = pageData;
  if (disclaimerActive !== undefined) updates.disclaimerActive = Boolean(disclaimerActive);
  if (programType !== undefined)    updates.programType = programType;
  if (slug !== undefined)           updates.slug = slug;

  if (isPublished !== undefined) {
    updates.isPublished = Boolean(isPublished);
    if (Boolean(isPublished)) updates.publishedAt = now;
    else updates.publishedAt = null;
  }

  if (feesVerified !== undefined) {
    updates.feesVerified = Boolean(feesVerified);
    updates.feesVerifiedAt = feesVerified ? now : null;
    updates.verifiedBy = session.user.id;
  }
  if (datesVerified !== undefined) {
    updates.datesVerified = Boolean(datesVerified);
    updates.datesVerifiedAt = datesVerified ? now : null;
    updates.verifiedBy = session.user.id;
  }
  if (programsVerified !== undefined) {
    updates.programsVerified = Boolean(programsVerified);
    updates.programsVerifiedAt = programsVerified ? now : null;
    updates.verifiedBy = session.user.id;
  }

  const [updated] = await db
    .update(admissionYearPages)
    .set(updates)
    .where(eq(admissionYearPages.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ page: updated });
}

// DELETE /api/admin/admission-pages/[id]
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await params;
  await db.delete(admissionYearPages).where(eq(admissionYearPages.id, id));
  return NextResponse.json({ success: true });
}
