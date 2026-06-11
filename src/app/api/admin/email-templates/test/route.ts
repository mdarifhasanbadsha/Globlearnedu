import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { sendEmail } from "@/lib/email/resend";

export const dynamic = "force-dynamic";

// POST /api/admin/email-templates/test
// Body: { to: string, subject: string, bodyHtml: string }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "staff"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to, subject, bodyHtml } = await req.json();

  if (!to || !subject || !bodyHtml) {
    return NextResponse.json({ error: "to, subject and bodyHtml are required" }, { status: 400 });
  }

  // Substitute any remaining {{variableName}} placeholders with [VARIABLE_NAME] for preview
  const previewHtml = bodyHtml.replace(/\{\{(\w+)\}\}/g, (_: string, name: string) => `[${name.toUpperCase()}]`);

  const result = await sendEmail({
    to,
    subject: `[TEST] ${subject.replace(/\{\{(\w+)\}\}/g, (_: string, name: string) => `[${name.toUpperCase()}]`)}`,
    html: previewHtml,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Failed to send test email" }, { status: 500 });
  }

  return NextResponse.json({ success: true, messageId: result.id ?? null });
}
