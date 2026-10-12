import { sendEmail } from "@/lib/email/resend";

type ThankYouInput = {
  candidateName: string;
  candidateEmail: string;
  phone: string;
  subject: string;
  testNumber: number;
  score: number;
  totalMarks: number;
  questionCount: number;
  durationMinutes: number;
  resultToken: string;
};

const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) =>
  c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
);

export async function sendMockTestThankYouEmail(input: ThankYouInput) {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://globlearnedu.com").replace(/\/$/, "");
  const resultUrl = baseUrl + "/csca/mocktest/result/" + encodeURIComponent(input.resultToken);
  const testTitle = input.subject.charAt(0).toUpperCase() + input.subject.slice(1) + " · Mock Test " + input.testNumber;
  const score = Number(input.score).toFixed(2).replace(/\.00$/, "");
  const percent = input.totalMarks > 0 ? Math.round((input.score / input.totalMarks) * 100) : 0;
  const name = esc(input.candidateName);
  const safeTitle = esc(testTitle);
  const safeScore = esc(score + "/" + input.totalMarks + " (" + percent + "%)");
  const safeResult = esc(resultUrl);
  const waMessage = encodeURIComponent(
    "Hello GL Education, I recently completed " + testTitle +
    ". I would like guidance about CSCA preparation, admission to universities in China, or my study-abroad journey. Please share the available support. Thank you."
  );
  const contactUrl = "https://wa.me/8801993295109?text=" + waMessage;
  const button = "display:inline-block;padding:13px 18px;border-radius:10px;text-decoration:none;font-weight:700;color:#fff;margin:5px 5px 5px 0;";
  const html =
    '<div style="margin:0;background:#f1f5f9;padding:18px 10px;font-family:Arial,Helvetica,sans-serif;color:#0a1628">' +
      '<div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #dbe3ea;border-radius:12px;overflow:hidden">' +
        '<div style="background:#0a1628;color:#fff;padding:20px 22px">' +
          '<div style="color:#ffd700;font-size:11px;font-weight:bold;letter-spacing:1.2px">GL EDUCATION · STUDY IN CHINA</div>' +
          '<h1 style="font-size:21px;line-height:1.35;margin:12px 0 5px">Thank you for taking our CSCA mock test</h1>' +
          '<p style="color:#dbe5f0;font-size:13px;line-height:1.5;margin:0">' + safeTitle + '</p>' +
        '</div>' +
        '<div style="padding:20px 22px;font-size:14px;line-height:1.65;color:#334155">' +
          '<p style="margin:0 0 12px">Hello ' + name + ',</p>' +
          '<p style="margin:0 0 14px">Thank you for practising with GL Education. We hope the mock test helps you plan your next steps.</p>' +
          '<p style="margin:0 0 8px"><strong>Need guidance for studying in China?</strong></p>' +
          '<p style="margin:0 0 14px">We can help you explore CSCA preparation, university admission, scholarship opportunities, and universities in China that offer scholarships.</p>' +
          '<p style="margin:0 0 14px">GL Education has helped over 1,000 students pursue study opportunities in China.</p>' +
          '<p style="margin:16px 0 18px"><a href="' + contactUrl + '" style="' + button + 'background:#16a34a;margin:0 8px 8px 0">Chat with us on WhatsApp</a><a href="https://globlearnedu.com/csca" style="' + button + 'background:#1b3a6b;margin:0 0 8px">CSCA Preparation</a></p>' +
          '<p style="margin:0 0 12px">You can also reply to this email, and our team will be happy to guide you.</p>' +
          '<p style="margin:0">Best wishes,<br><strong>GL Education · Study in China</strong></p>' +
          '<div style="border-top:1px solid #e2e8f0;margin-top:18px;padding-top:10px;font-size:11px;line-height:1.5;color:#64748b">This is a follow-up to the CSCA mock test you completed. If you do not want further follow-up messages, reply to this email and let us know.</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  return sendEmail({
    to: input.candidateEmail,
    subject: "Thank you for taking a GL Education CSCA Mock Test",
    html,
    replyTo: "globlearnedu@outlook.com",
    templateName: "csca-mocktest-thank-you"
  });
}
