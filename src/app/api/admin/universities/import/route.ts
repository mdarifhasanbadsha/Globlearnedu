export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { universities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const universitySchema = z.object({
  slug: z.string().min(1).max(255),
  nameEn: z.string().min(1).max(255),
  nameCn: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  tier985: z.boolean().optional().default(false),
  tier211: z.boolean().optional().default(false),
  qsRanking: z.number().int().optional(),
  founded: z.number().int().optional(),
  totalStudents: z.number().int().optional(),
  internationalStudents: z.number().int().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  description: z.string().optional(),
  isPartner: z.boolean().optional().default(false),
  cscAgencyNumber: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const importSchema = z.object({
  universities: z.array(universitySchema).min(1).max(500),
  mode: z.enum(["insert_only", "upsert"]).default("upsert"),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = importSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { universities: rows, mode } = parsed.data;

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    try {
      if (mode === "upsert") {
        const existing = await db.query.universities.findFirst({
          where: eq(universities.slug, row.slug),
        });
        if (existing) {
          await db.update(universities).set({ ...row, updatedAt: new Date() }).where(eq(universities.slug, row.slug));
          updated++;
        } else {
          await db.insert(universities).values(row);
          inserted++;
        }
      } else {
        const existing = await db.query.universities.findFirst({
          where: eq(universities.slug, row.slug),
        });
        if (existing) {
          skipped++;
        } else {
          await db.insert(universities).values(row);
          inserted++;
        }
      }
    } catch (err) {
      errors.push(`${row.slug}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return NextResponse.json({ inserted, updated, skipped, errors, total: rows.length });
}
