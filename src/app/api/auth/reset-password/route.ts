export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth/verification";

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Must contain at least one number";
  return null;
}

export async function POST(request: NextRequest) {
  const { token, password } = await request.json();
  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
  }

  const validationError = validatePassword(password);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const result = await verifyToken(token, "reset");
  if (!result.valid) {
    return NextResponse.json(
      { error: result.error === "expired" ? "This reset link has expired. Please request a new one." : "Invalid reset link." },
      { status: 400 }
    );
  }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, result.userId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const passwordHash = await bcrypt.hash(password, 12);

  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, result.userId));

  return NextResponse.json({ success: true });
}
