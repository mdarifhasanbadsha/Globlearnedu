export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getPresignedUploadUrl, getDocumentKey, getPaymentSlipKey } from "@/lib/storage/r2";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_SIZE_MB = 5;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId, documentType, filename, contentType, fileSize } =
    await request.json();

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "File type not allowed. Use PDF, JPG, or PNG." },
      { status: 400 }
    );
  }

  if (fileSize > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `File too large. Maximum ${MAX_SIZE_MB}MB.` },
      { status: 400 }
    );
  }

  if (!applicationId || !documentType || !filename) {
    return NextResponse.json(
      { error: "applicationId, documentType, and filename are required" },
      { status: 400 }
    );
  }

  const key =
    documentType === "payment_slip"
      ? getPaymentSlipKey(applicationId, filename)
      : getDocumentKey(applicationId, documentType, filename);

  const presignedUrl = await getPresignedUploadUrl(key, contentType);
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({ presignedUrl, publicUrl, key });
}
