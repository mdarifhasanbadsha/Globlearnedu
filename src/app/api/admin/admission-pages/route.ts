import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { admissionYearPages, universities } from "@/lib/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/admission-pages?year=2026&type=university_admission&published=true
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year   = searchParams.get("year");
  const type   = searchParams.get("type");
  const pub    = searchParams.get("published");

  const conditions = [];
  if (year)  conditions.push(eq(admissionYearPages.year, Number(year)));
  if (type)  conditions.push(eq(admissionYearPages.pageType, type as "general_yearly" | "university_admission" | "intl_student_admission" | "program_yearly"));
  if (pub !== null) conditions.push(eq(admissionYearPages.isPublished, pub === "true"));

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
      datesVerified: admissionYearPages.datesVerified,
      programsVerified: admissionYearPages.programsVerified,
      universityId: admissionYearPages.universityId,
      universityName: universities.nameEn,
      createdAt: admissionYearPages.createdAt,
      updatedAt: admissionYearPages.updatedAt,
    })
    .from(admissionYearPages)
    .leftJoin(universities, eq(admissionYearPages.universityId, universities.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(admissionYearPages.updatedAt));

  return NextResponse.json({ pages: rows });
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 300);
}

// POST /api/admin/admission-pages
// body: { action: "create" | "generate" }
// create: { year, pageType, universityId?, programType?, slug? }
// generate: { year, pageType, filter?: "985" | "211" | "all" }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  // --- Single create ---
  if (!action || action === "create") {
    const { year, pageType, universityId, programType, slug: rawSlug } = body;
    if (!year || !pageType) return NextResponse.json({ error: "year and pageType required" }, { status: 400 });

    let slug = rawSlug?.trim();
    if (!slug) {
      if (universityId) {
        const [uni] = await db.select({ nameEn: universities.nameEn }).from(universities).where(eq(universities.id, universityId)).limit(1);
        slug = slugify(`${uni?.nameEn ?? "university"}-admission-${year}`);
      } else if (programType) {
        slug = slugify(`${programType}-${pageType}-${year}`);
      } else {
        slug = slugify(`${pageType}-${year}`);
      }
    }

    const [page] = await db.insert(admissionYearPages).values({
      slug,
      year: Number(year),
      pageType: pageType as "general_yearly" | "university_admission" | "intl_student_admission" | "program_yearly",
      universityId: universityId || null,
      programType: programType || null,
      pageData: {},
    }).returning();

    return NextResponse.json({ page }, { status: 201 });
  }

  // --- Bulk generate ---
  if (action === "generate") {
    const { year, pageType = "university_admission", filter = "all" } = body;
    if (!year) return NextResponse.json({ error: "year required" }, { status: 400 });

    // Fetch universities matching filter
    const uniRows = await db
      .select({ id: universities.id, nameEn: universities.nameEn })
      .from(universities)
      .where(
        filter === "985" ? eq(universities.tier985, true)
        : filter === "211" ? eq(universities.tier211, true)
        : undefined
      )
      .orderBy(universities.nameEn);

    if (uniRows.length === 0) return NextResponse.json({ error: "No universities found" }, { status: 400 });

    // Find existing slugs for this year to avoid duplicates
    const existing = await db
      .select({ slug: admissionYearPages.slug })
      .from(admissionYearPages)
      .where(eq(admissionYearPages.year, Number(year)));
    const existingSlugs = new Set(existing.map(r => r.slug));

    const toInsert = uniRows
      .map(u => ({
        slug: slugify(`${u.nameEn}-${pageType}-${year}`),
        year: Number(year),
        pageType: pageType as "general_yearly" | "university_admission" | "intl_student_admission" | "program_yearly",
        universityId: u.id,
        pageData: {},
      }))
      .filter(r => !existingSlugs.has(r.slug));

    if (toInsert.length === 0) {
      return NextResponse.json({ created: 0, skipped: uniRows.length, message: "All pages already exist" });
    }

    // Insert in batches of 100
    let created = 0;
    for (let i = 0; i < toInsert.length; i += 100) {
      const batch = toInsert.slice(i, i + 100);
      await db.insert(admissionYearPages).values(batch);
      created += batch.length;
    }

    return NextResponse.json({
      created,
      skipped: uniRows.length - created,
      message: `Generated ${created} pages for ${year}`,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
