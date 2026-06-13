export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { uploadFile } from "@/lib/storage/r2";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
const MAX_MB = 5;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const applicationId = (formData.get("applicationId") as string | null) ?? "";
  const docType = formData.get("docType") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!docType) return NextResponse.json({ error: "docType required" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed. Use PDF, JPG, or PNG." }, { status: 400 });
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return NextResponse.json({ error: `File too large. Maximum ${MAX_MB}MB.` }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "pdf";
  const key = applicationId
    ? `applications/${applicationId}/documents/${docType}.${ext}`
    : `documents/drafts/${session.user.id}/${docType}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadFile(key, buffer, file.type);

  return NextResponse.json({ url });
}
