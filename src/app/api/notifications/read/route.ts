export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  if (body.markAll === true) {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(eq(notifications.userId, session.user.id), eq(notifications.isRead, false)),
      );
    return NextResponse.json({ updated: "all" });
  }

  const { ids } = body as { ids?: string[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ updated: 0 });
  }

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.userId, session.user.id),
        inArray(notifications.id, ids as string[]),
      ),
    );

  return NextResponse.json({ updated: ids.length });
}
