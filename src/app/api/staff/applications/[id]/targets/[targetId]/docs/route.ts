export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applicationUniversities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string; targetId: string }> };

const DOC_FIELD_MAP: Record<string, "preAdmissionUrl" | "admissionNoticeUrl" | "jw202Url"> = {
  pre_admission:    "preAdmissionUrl",
  admission_notice: "admissionNoticeUrl",
  jw202:            "jw202Url",
};

// POST — save a doc URL to a target row (after client-side R2 upload)
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetId } = await params;
  const { docType, url } = await req.json();

  const field = DOC_FIELD_MAP[docType];
  if (!field) return NextResponse.json({ error: "Invalid docType" }, { status: 400 });
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  await db.update(applicationUniversities)
    .set({ [field]: url, updatedAt: new Date() })
    .where(eq(applicationUniversities.id, targetId));

  return NextResponse.json({ ok: true, [field]: url });
}

// DELETE — clear a doc URL from a target row
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes((session.user as any).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetId } = await params;
  const { docType } = await req.json();

  const field = DOC_FIELD_MAP[docType];
  if (!field) return NextResponse.json({ error: "Invalid docType" }, { status: 400 });

  await db.update(applicationUniversities)
    .set({ [field]: null, updatedAt: new Date() })
    .where(eq(applicationUniversities.id, targetId));

  return NextResponse.json({ ok: true });
}
