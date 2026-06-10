export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = schema.safeParse({ email: searchParams.get("email") });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Valid ?email= query param required." },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  const existing = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json({ error: `No user found with email: ${email}` }, { status: 404 });
  }

  await db.update(users).set({ role: "admin" }).where(eq(users.email, email));

  return NextResponse.json({ message: `${email} is now an admin.` }, { status: 200 });
}
