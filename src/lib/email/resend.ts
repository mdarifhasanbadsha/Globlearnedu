import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@globlearnedu.com";
const FROM_NAME = "Globlearn Education";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email to:", options.to);
    return { success: false, error: "not_configured" };
  }
  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo || FROM_EMAIL,
    });
    return { success: true, id: (result as any)?.id ?? (result as any)?.data?.id };
  } catch (error) {
    console.error("[email] send error:", error);
    return { success: false, error };
  }
}
