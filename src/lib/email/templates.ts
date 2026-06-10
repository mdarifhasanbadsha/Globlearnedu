const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://globlearnedu.com";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8615655031556";

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Globlearn Education</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0A1628;padding:24px 32px;">
            <div style="color:#fff;font-weight:800;font-size:18px;letter-spacing:0.05em;">GLOBLEARN <span style="color:#29ABE2;">Education</span></div>
          </td>
        </tr>
        <tr><td style="padding:32px;">${content}</td></tr>
        <tr>
          <td style="background:#F8FAFC;padding:20px 32px;border-top:1px solid #E5E7EB;">
            <p style="margin:0 0 6px;font-size:12px;color:#6B7280;text-align:center;">
              Globlearn Education &middot; globlearnedu.com &middot; info@globlearnedu.com
            </p>
            <p style="margin:0 0 6px;font-size:11px;color:#9CA3AF;text-align:center;">
              Trusted by 5,000+ students from 80+ countries
            </p>
            <p style="margin:0;font-size:11px;color:#D1D5DB;text-align:center;">
              <a href="${BASE_URL}/privacy" style="color:#D1D5DB;">Privacy Policy</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:#C8102E;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;margin:8px 0;">${text}</a>`;
}

function whatsappButton(message: string): string {
  const encoded = encodeURIComponent(message);
  return `<a href="https://wa.me/${WHATSAPP}?text=${encoded}" style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;margin:8px 0;">WhatsApp Us</a>`;
}

function infoBox(content: string, color = "#1B3A6B"): string {
  return `<div style="background:#EEF4FF;border-left:4px solid ${color};border-radius:0 8px 8px 0;padding:14px 16px;margin:16px 0;font-size:13px;color:#1E3A5F;line-height:1.6;">${content}</div>`;
}

export function applicationReceivedStudent(data: {
  studentName: string;
  applicationId: string;
  universities: string[];
  program: string;
  trackingUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Application received — ${data.applicationId} | Globlearn Education`,
    html: baseTemplate(`
      <h2 style="color:#1B3A6B;font-size:22px;margin:0 0 8px;">Application received!</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.studentName}</strong>,</p>
      <p style="font-size:14px;color:#374151;line-height:1.7;">Your application to study in China through Globlearn Education has been received. Our team will review your documents within 24 hours.</p>
      ${infoBox(`<strong>Application ID:</strong> ${data.applicationId}<br><strong>Program:</strong> ${data.program}<br><strong>Universities:</strong> ${data.universities.join(", ")}`)}
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("Track my application", data.trackingUrl)}
        <br>
        ${whatsappButton(`Hi! I just submitted my application ${data.applicationId}. Please confirm you received it.`)}
      </div>
      <p style="font-size:13px;color:#9CA3AF;">Save your Application ID: <strong>${data.applicationId}</strong></p>
    `),
  };
}

export function applicationReceivedPartner(data: {
  partnerName: string;
  studentName: string;
  applicationId: string;
  program: string;
}): { subject: string; html: string } {
  return {
    subject: `New student application — ${data.studentName} | Globlearn Education`,
    html: baseTemplate(`
      <h2 style="color:#1B3A6B;font-size:22px;margin:0 0 8px;">New student application received</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.partnerName}</strong>,</p>
      <p style="font-size:14px;color:#374151;line-height:1.7;">A new student application has been submitted under your partner account.</p>
      ${infoBox(`<strong>Student:</strong> ${data.studentName}<br><strong>Application ID:</strong> ${data.applicationId}<br><strong>Program:</strong> ${data.program}`)}
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("View in partner dashboard", `${BASE_URL}/partner`)}
      </div>
    `),
  };
}

export function statusUpdateEmail(data: {
  studentName: string;
  applicationId: string;
  newStatus: string;
  statusDescription: string;
  nextStep: string;
  trackingUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Application update — ${data.newStatus} | ${data.applicationId}`,
    html: baseTemplate(`
      <h2 style="color:#1B3A6B;font-size:22px;margin:0 0 8px;">Application status update</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.studentName}</strong>,</p>
      ${infoBox(`<strong>Status:</strong> ${data.newStatus}<br>${data.statusDescription}`)}
      <p style="font-size:14px;color:#374151;line-height:1.7;"><strong>Next step:</strong> ${data.nextStep}</p>
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("Track my application", data.trackingUrl)}
        ${whatsappButton(`Hi! I got an update on my application ${data.applicationId}. I have a question.`)}
      </div>
    `),
  };
}

export function admissionOfferEmail(data: {
  studentName: string;
  applicationId: string;
  universityName: string;
  programName: string;
  scholarshipType: string;
  intakeDate: string;
  staffName: string;
  trackingUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Congratulations ${data.studentName} — Admitted to ${data.universityName}!`,
    html: baseTemplate(`
      <div style="text-align:center;padding:20px 0;">
        <h2 style="color:#1B3A6B;font-size:26px;margin:0 0 8px;">Congratulations — You are admitted!</h2>
      </div>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.studentName}</strong>,</p>
      <p style="font-size:14px;color:#374151;line-height:1.7;">You have been officially admitted to <strong>${data.universityName}</strong>!</p>
      ${infoBox(`
        <strong>University:</strong> ${data.universityName}<br>
        <strong>Program:</strong> ${data.programName}<br>
        <strong>Scholarship:</strong> ${data.scholarshipType}<br>
        <strong>Intake:</strong> ${data.intakeDate}<br>
        <strong>Application ID:</strong> ${data.applicationId}
      `)}
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("Confirm my acceptance", `${BASE_URL}/dashboard`)}
        <br>
        ${whatsappButton(`Hi! I received my admission offer from ${data.universityName}! Application: ${data.applicationId}. What are my next steps?`)}
      </div>
    `),
  };
}

export function documentActionRequiredEmail(data: {
  studentName: string;
  applicationId: string;
  section: string;
  instructions: string;
}): { subject: string; html: string } {
  return {
    subject: `Action required on your application — ${data.applicationId}`,
    html: baseTemplate(`
      <h2 style="color:#C8102E;font-size:22px;margin:0 0 8px;">Action required</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.studentName}</strong>,</p>
      ${infoBox(`<strong>Section:</strong> ${data.section}<br><strong>Instructions:</strong> ${data.instructions}`, "#C8102E")}
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("Update my application", `${BASE_URL}/dashboard/application`)}
        ${whatsappButton(`Hi! I received an action required notice for my application ${data.applicationId}. Can you help?`)}
      </div>
    `),
  };
}

export function paymentConfirmationEmail(data: {
  studentName: string;
  applicationId: string;
  amount: string;
  currency: string;
  paymentType: string;
  receiptUrl?: string;
}): { subject: string; html: string } {
  return {
    subject: `Payment confirmed — ${data.applicationId} | Globlearn Education`,
    html: baseTemplate(`
      <h2 style="color:#166534;font-size:22px;margin:0 0 8px;">Payment confirmed</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.studentName}</strong>,</p>
      ${infoBox(`
        <strong>Application ID:</strong> ${data.applicationId}<br>
        <strong>Payment type:</strong> ${data.paymentType}<br>
        <strong>Amount:</strong> ${data.amount} ${data.currency}<br>
        <strong>Status:</strong> Confirmed
      `, "#166534")}
      ${data.receiptUrl ? `<p style="text-align:center;margin:16px 0;"><a href="${data.receiptUrl}" style="color:#C8102E;font-weight:600;">Download receipt</a></p>` : ""}
      <div style="text-align:center;margin:20px 0;">
        ${ctaButton("View my dashboard", `${BASE_URL}/dashboard`)}
      </div>
    `),
  };
}

export function admissionCompleteEmail(data: {
  studentName: string;
  applicationId: string;
  universityName: string;
  programName: string;
  guideUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Your admission is complete — China journey begins! | Globlearn Education`,
    html: baseTemplate(`
      <div style="text-align:center;padding:20px 0;">
        <h2 style="color:#1B3A6B;font-size:26px;margin:0 0 8px;">Your China journey begins!</h2>
      </div>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.studentName}</strong>,</p>
      <p style="font-size:14px;color:#374151;line-height:1.7;">Congratulations — your admission process is fully complete at <strong>${data.universityName}</strong>.</p>
      ${infoBox(`
        <strong>University:</strong> ${data.universityName}<br>
        <strong>Program:</strong> ${data.programName}<br>
        <strong>Application ID:</strong> ${data.applicationId}<br>
        <strong>Status:</strong> Complete
      `, "#166534")}
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("View my China guide", data.guideUrl)}
        ${whatsappButton("Hi! My admission is complete. I need help preparing for departure to China.")}
      </div>
    `),
  };
}

export function partnerApprovedEmail(data: {
  partnerName: string;
  agencyName: string;
}): { subject: string; html: string } {
  return {
    subject: `Partner account approved — Welcome to Globlearn Education`,
    html: baseTemplate(`
      <h2 style="color:#1B3A6B;font-size:22px;margin:0 0 8px;">Welcome to Globlearn Education Partner Network!</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.partnerName}</strong>,</p>
      <p style="font-size:14px;color:#374151;line-height:1.7;">Your partner account for <strong>${data.agencyName}</strong> has been approved.</p>
      ${infoBox(`
        1. Submit students from your partner dashboard<br>
        2. Globlearn Education handles everything — documents, applications, scholarships<br>
        3. You earn commission after successful admission<br>
        4. Track all your students in real time
      `)}
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("Access partner dashboard", `${BASE_URL}/partner`)}
        ${whatsappButton("Hi! My partner account was just approved. I want to discuss submitting students.")}
      </div>
    `),
  };
}

export function referralCommissionEmail(data: {
  referrerName: string;
  referredStudentFirstName: string;
  commissionAmount: string;
  totalEarned: string;
}): { subject: string; html: string } {
  return {
    subject: `Commission earned — ${data.commissionAmount} | Globlearn Education`,
    html: baseTemplate(`
      <h2 style="color:#92610A;font-size:22px;margin:0 0 8px;">Commission earned!</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.referrerName}</strong>,</p>
      ${infoBox(`
        <strong>Referred student:</strong> ${data.referredStudentFirstName}<br>
        <strong>Commission earned:</strong> ${data.commissionAmount}<br>
        <strong>Total earned to date:</strong> ${data.totalEarned}
      `, "#92610A")}
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("View my earnings", `${BASE_URL}/dashboard`)}
      </div>
    `),
  };
}

export function interviewScheduledEmail(data: {
  studentName: string;
  applicationId: string;
  universityName: string;
  interviewDate: string;
  interviewTime: string;
  timezone: string;
  platform: string;
  link?: string;
  duration: string;
  language: string;
  guidelines: string;
}): { subject: string; html: string } {
  return {
    subject: `Interview scheduled — ${data.universityName} | ${data.applicationId}`,
    html: baseTemplate(`
      <h2 style="color:#1B3A6B;font-size:22px;margin:0 0 8px;">Interview scheduled</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.studentName}</strong>,</p>
      ${infoBox(`
        <strong>Date:</strong> ${data.interviewDate}<br>
        <strong>Time:</strong> ${data.interviewTime} (${data.timezone})<br>
        <strong>Platform:</strong> ${data.platform}<br>
        <strong>Duration:</strong> ${data.duration}<br>
        <strong>Language:</strong> ${data.language}
      `)}
      <p style="font-size:14px;color:#374151;line-height:1.7;"><strong>Guidelines:</strong> ${data.guidelines}</p>
      ${data.link ? `<div style="text-align:center;margin:20px 0;">${ctaButton("Join interview", data.link)}</div>` : ""}
      <div style="text-align:center;margin:16px 0;">
        ${whatsappButton(`Hi! I have an interview with ${data.universityName} on ${data.interviewDate}. Can you help me prepare?`)}
      </div>
    `),
  };
}

export function visaGuidancePackEmail(data: {
  studentName: string;
  applicationId: string;
  universityName: string;
  visaGuideUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `Your China visa guidance pack is ready — ${data.applicationId}`,
    html: baseTemplate(`
      <h2 style="color:#1B3A6B;font-size:22px;margin:0 0 8px;">Your visa guidance pack is ready</h2>
      <p style="font-size:15px;color:#374151;">Dear <strong>${data.studentName}</strong>,</p>
      ${infoBox(`
        <strong>University:</strong> ${data.universityName}<br>
        <strong>Next step:</strong> Apply for your X1 student visa at the Chinese Embassy<br>
        <strong>Globlearn Education guidance success:</strong> 99% of our guided students receive their visa
      `)}
      <p style="font-size:12px;color:#9CA3AF;font-style:italic;">Visa approval is at the sole discretion of the Chinese Embassy or Consulate in your country. Globlearn Education prepares and guides your application — we do not guarantee visa issuance.</p>
      <div style="text-align:center;margin:24px 0;">
        ${ctaButton("View my visa guide", data.visaGuideUrl)}
        ${whatsappButton(`Hi! I received my visa guidance pack for application ${data.applicationId}. I have questions.`)}
      </div>
    `),
  };
}
