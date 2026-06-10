export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { uploadFile, getPaymentSlipKey } from "@/lib/storage/r2";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const paymentId = formData.get("paymentId") as string | null;
  const applicationId = formData.get("applicationId") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!applicationId) return NextResponse.json({ error: "applicationId required" }, { status: 400 });

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed. Use PDF, JPG, or PNG." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = getPaymentSlipKey(applicationId, file.name);
  const url = await uploadFile(key, buffer, file.type);

  // Update payment record with slip URL if a real paymentId is provided
  if (paymentId && paymentId !== "pending") {
    await db
      .update(payments)
      .set({ manualSlipUrl: url })
      .where(eq(payments.id, paymentId));
  }

  return NextResponse.json({ success: true, url, key });
}
