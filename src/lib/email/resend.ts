import { Resend } from "resend";
import { db } from "@/lib/db";
import { emailLogs } from "@/lib/db/schema";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@globlearnedu.com";
const FROM_NAME = "Globlearn Education";

// Lazy singleton — never initialize at module level (Cloudflare build constraint)
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  templateName?: string;
  applicationId?: string;
}

export async function sendEmail(options: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email to:", options.to);
    return { success: false, error: "not_configured" };
  }

  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  let sendSuccess = false;
  let errorMsg: string | undefined;

  try {
    const result = await getResend().emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipients,
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo || FROM_EMAIL,
    });
    // Resend SDK v1 may return an error object inside result instead of throwing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyResult = result as any;
    if (anyResult?.error) {
      const msg = typeof anyResult.error === "string" ? anyResult.error : JSON.stringify(anyResult.error);
      console.error("[email] Resend API error:", msg);
      errorMsg = msg;
      return { success: false, error: anyResult.error };
    }
    sendSuccess = true;
    return { success: true, id: anyResult?.id ?? anyResult?.data?.id };
  } catch (error) {
    console.error("[email] send error:", error);
    errorMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error };
  } finally {
    // Always log — fire and forget, never block the caller
    for (const recipient of recipients) {
      db.insert(emailLogs).values({
        recipientEmail: recipient,
        subject: options.subject,
        body: options.html.substring(0, 5000),
        templateName: options.templateName ?? null,
        applicationId: options.applicationId ?? null,
        status: sendSuccess ? "sent" : "failed",
        errorMessage: errorMsg ?? null,
      }).catch(() => { /* non-critical */ });
    }
  }
}
