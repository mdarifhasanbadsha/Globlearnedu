export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth/verification";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  const result = await verifyToken(token, "verify");
  if (!result.valid) {
    return NextResponse.json(
      { error: result.error === "expired" ? "Link has expired. Please request a new verification email." : "Invalid verification link." },
      { status: 400 }
    );
  }

  const [user] = await db
    .select({ id: users.id, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, result.userId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.emailVerified) {
    return NextResponse.json({ success: true, alreadyVerified: true });
  }

  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.id, result.userId));

  return NextResponse.json({ success: true });
}
