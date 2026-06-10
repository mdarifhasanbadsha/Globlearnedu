import { Resend } from "resend";

export async function sendEmail(options: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email to:", options.to);
    return null;
  }
  const resend = new Resend(apiKey);
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@globlearnedu.com",
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text ?? options.html ?? "",
  });
}
