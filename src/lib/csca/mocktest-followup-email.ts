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
    '<div style="margin:0;background:#f1f5f9;padding:24px 10px;font-family:Arial,Helvetica,sans-serif;color:#0a1628">' +
      '<div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #dbe3ea;border-radius:16px;overflow:hidden">' +
        '<div style="background:#0a1628;color:#fff;padding:26px">' +
          '<div style="color:#ffd700;font-size:12px;font-weight:bold;letter-spacing:1.5px">GL EDUCATION · STUDY IN CHINA</div>' +
          '<h1 style="font-size:25px;margin:18px 0 8px">Thank you for taking our mock test</h1>' +
          '<p style="color:#dbe5f0;margin:0">' + safeTitle + '</p>' +
        '</div>' +
        '<div style="padding:26px">' +
          '<p style="font-size:16px">Hello ' + name + ',</p>' +
          '<p style="font-size:15px;line-height:1.75;color:#334155">Thank you for spending your time on a CSCA practice test arranged by GL Education. We hope the exercise helped you assess your preparation and identify what to practise next.</p>' +
          '<div style="background:#eff6ff;border-radius:12px;padding:18px;text-align:center;margin:20px 0">' +
            '<div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#52616b">Recorded result</div>' +
            '<div style="font-size:32px;font-weight:bold;color:#1b3a6b;margin-top:8px">' + safeScore + '</div>' +
            '<div style="font-size:13px;color:#52616b;margin-top:6px">' + input.questionCount + ' questions · ' + input.durationMinutes + ' minutes</div>' +
            '<p style="margin:18px 0 0"><a href="' + safeResult + '" style="' + button + 'background:#1b3a6b">View Result & Answer Explanations</a></p>' +
          '</div>' +
          '<h2 style="font-size:18px;margin:24px 0 8px">We are happy to help with your next steps</h2>' +
          '<p style="font-size:15px;line-height:1.75;color:#334155">You are welcome to contact GL Education if you need guidance with CSCA preparation, university admission in China, application planning, or your broader study-abroad journey. We will be glad to point you toward the relevant information and support.</p>' +
          '<p style="margin:20px 0"><a href="' + contactUrl + '" style="' + button + 'background:#c8102e">Contact GL Education on WhatsApp</a> <a href="https://globlearnedu.com/csca" style="' + button + 'background:#1b3a6b">CSCA Preparation Guide</a></p>' +
          '<p style="font-size:14px;line-height:1.7;color:#334155">Thank you again, and best wishes for your preparation.</p>' +
          '<p style="font-size:14px;line-height:1.7;color:#334155">Warm regards,<br><b>GL Education · Study in China</b></p>' +
          '<div style="border-top:1px solid #e2e8f0;margin-top:24px;padding-top:15px;font-size:11px;line-height:1.6;color:#64748b">This is a personal follow-up about a mock test you completed on the GL Education website. It is sent to the email address provided during exam entry. If you do not want further follow-up messages, reply to this email and tell our team.</div>' +
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
