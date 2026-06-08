export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateSetting } from "@/lib/settings";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const allSettings = category
    ? await db.select().from(settings).where(eq(settings.category, category))
    : await db.select().from(settings);

  return NextResponse.json({ settings: allSettings });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const { key, value } = await request.json();
  if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });

  await updateSetting(key, value ?? "", session.user.id);
  return NextResponse.json({ success: true });
}
