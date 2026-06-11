import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { SEED_TEMPLATES } from "@/lib/email/templateSeeds";

export const dynamic = "force-dynamic";

// GET /api/admin/email-templates — list all
export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(emailTemplates)
    .orderBy(desc(emailTemplates.updatedAt));

  return NextResponse.json({ templates: rows });
}

// POST /api/admin/email-templates — seed defaults (idempotent)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action as string | undefined;

  if (action === "seed") {
    // Insert defaults — skip any that already exist (by triggerEvent)
    const existing = await db.select({ triggerEvent: emailTemplates.triggerEvent }).from(emailTemplates);
    const existingEvents = new Set(existing.map(r => r.triggerEvent));

    const toInsert = SEED_TEMPLATES.filter(t => !existingEvents.has(t.triggerEvent));
    if (toInsert.length > 0) {
      await db.insert(emailTemplates).values(toInsert);
    }

    return NextResponse.json({ seeded: toInsert.length, skipped: SEED_TEMPLATES.length - toInsert.length });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
