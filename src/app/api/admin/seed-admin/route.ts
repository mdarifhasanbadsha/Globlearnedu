export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const SEED_EMAIL = "admin@globlearnedu.com";
const SEED_PASSWORD = "GlobAdmin2026!";

export async function GET() {
  return POST();
}

export async function POST() {
  const existing = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.email, SEED_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    if (existing[0].role === "admin") {
      return NextResponse.json({ message: "Admin account already exists." }, { status: 200 });
    }
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.email, SEED_EMAIL));
    return NextResponse.json({ message: "Existing user promoted to admin." }, { status: 200 });
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);

  await db.insert(users).values({
    email: SEED_EMAIL,
    passwordHash,
    firstName: "Admin",
    lastName: "Globlearn",
    name: "Admin Globlearn",
    role: "admin",
    isActive: true,
  });

  return NextResponse.json(
    { message: "Admin account created.", email: SEED_EMAIL },
    { status: 201 }
  );
}
