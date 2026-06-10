import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is required");
    _resend = new Resend(apiKey);
  }
  return _resend;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  return getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@globlearnedu.com",
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text ?? options.html ?? "",
  });
}
