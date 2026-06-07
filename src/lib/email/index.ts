import Resend from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: { to: string; subject: string; html?: string; text?: string }) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'noreply@globlearnedu.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
