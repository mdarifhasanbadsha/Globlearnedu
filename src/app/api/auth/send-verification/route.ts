export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createToken } from "@/lib/auth/verification";
import { sendEmail } from "@/lib/email/resend";
import { emailVerificationTemplate } from "@/lib/email/templates";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://globlearnedu.com";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  const [user] = await db
    .select({ id: users.id, email: users.email, firstName: users.firstName, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ error: "already_verified" }, { status: 409 });

  const token = await createToken("verify", userId);
  const verifyUrl = `${BASE_URL}/verify-email?token=${token}`;

  const tpl = emailVerificationTemplate({
    firstName: user.firstName ?? user.email.split("@")[0],
    verifyUrl,
  });

  await sendEmail({ to: user.email, subject: tpl.subject, html: tpl.html });

  return NextResponse.json({ success: true });
}
