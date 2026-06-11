import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { universities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  if (!["admin", "staff"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const allowed = [
      "nameEn", "nameCn", "city", "province", "country",
      "tier985", "tier211", "qsRanking", "founded",
      "totalStudents", "internationalStudents",
      "website", "description", "isPartner", "isActive",
      "dataConfidence", "cscAgencyNumber",
      "metaTitle", "metaDescription",
    ];

    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // Try update by ID first, then by slug
    let result = await db
      .update(universities)
      .set(update)
      .where(eq(universities.id, id))
      .returning({ id: universities.id });

    if (result.length === 0) {
      result = await db
        .update(universities)
        .set(update)
        .where(eq(universities.slug, id))
        .returning({ id: universities.id });
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
