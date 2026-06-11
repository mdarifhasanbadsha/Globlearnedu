export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createToken } from "@/lib/auth/verification";
import { sendEmail } from "@/lib/email/resend";
import { passwordResetTemplate } from "@/lib/email/templates";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://globlearnedu.com";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // Always return success to prevent email enumeration
  const [user] = await db
    .select({ id: users.id, email: users.email, firstName: users.firstName, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user || !user.passwordHash) {
    return NextResponse.json({ success: true });
  }

  const token = await createToken("reset", user.id);
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const tpl = passwordResetTemplate({
    firstName: user.firstName ?? user.email.split("@")[0],
    resetUrl,
  });

  await sendEmail({ to: user.email, subject: tpl.subject, html: tpl.html });

  return NextResponse.json({ success: true });
}
