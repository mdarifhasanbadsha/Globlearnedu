import { sendEmail } from "@/lib/email/resend";

type SubmissionEmailInput = {
  candidateName: string;
  candidateEmail: string;
  phone: string;
  subject: string;
  testNumber: number;
  score: number;
  totalMarks: number;
  questionCount: number;
  durationMinutes: number;
  awayCount: number;
  token: string;
  submittedAt: string;
};

const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) =>
  c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
);

export async function sendMockTestSubmissionEmails(input: SubmissionEmailInput) {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://globlearnedu.com").replace(/\/$/, "");
  const resultUrl = baseUrl + "/csca/mocktest/result/" + encodeURIComponent(input.token);
  const subjectTitle = input.subject.charAt(0).toUpperCase() + input.subject.slice(1);
  const testTitle = subjectTitle + " · Mock Test " + input.testNumber;
  const percent = input.totalMarks ? Math.round((input.score / input.totalMarks) * 100) : 0;
  const scoreLabel = Number(input.score).toFixed(2).replace(/\.00$/, "");
  const submitted = new Date(input.submittedAt).toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "short"
  });
  const teacherMessage = "Hello GL Education, my name is " + input.candidateName + " and my phone number is " + input.phone + ". I completed " + testTitle + " and scored " +
    scoreLabel + "/" + input.totalMarks + " (" + percent +
    "%). I would like guidance about CSCA preparation and studying in China. Please share the available support and next steps.";
  const teacherUrl = "https://wa.me/8801993295109?text=" + encodeURIComponent(teacherMessage);
  const rawPhone = input.phone.replace(/[^0-9]/g, "");
  const whatsappPhone = rawPhone.startsWith("0") ? "88" + rawPhone : rawPhone;
  const contactMessage = "Hello " + input.candidateName +
    ", thank you for taking the CSCA Mock Test by GL Education — " + testTitle +
    ". Your score is " + scoreLabel + "/" + input.totalMarks + " (" + percent +
    "%). If you need any help or assistance with CSCA preparation or studying in China, please do not hesitate to contact us. GL Education · Study in China.";
  const studentEsc = esc(input.candidateName);
  const testEsc = esc(testTitle);
  const scoreEsc = esc(scoreLabel + "/" + input.totalMarks + " (" + percent + "%)");
  const phoneEsc = esc(input.phone);
  const emailEsc = esc(input.candidateEmail);
  const dateEsc = esc(submitted);
  const urlEsc = esc(resultUrl);
  const button = "display:inline-block;padding:13px 18px;border-radius:10px;text-decoration:none;font-weight:700;color:#ffffff;margin:5px 5px 5px 0;";
  const frame = '<div style="margin:0;background:#f1f5f9;padding:24px 10px;font-family:Arial,Helvetica,sans-serif;color:#0a1628"><div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #dbe3ea;border-radius:16px;overflow:hidden"><div style="background:#0a1628;color:#fff;padding:24px"><div style="color:#ffd700;font-size:12px;font-weight:bold;letter-spacing:1.5px">GL EDUCATION · STUDY IN CHINA</div>';
  const studentHtml = frame +
    '<h1 style="font-size:24px;margin:16px 0 6px">Your CSCA Mock Test Result</h1><p style="color:#dbe5f0;margin:0">' + testEsc +
    '</p></div><div style="padding:24px"><p>Hello ' + studentEsc +
    ',</p><p>Thank you for completing a GL Education CSCA mock examination. Your result is ready.</p>' +
    '<div style="background:#eff6ff;border-radius:12px;padding:20px;text-align:center"><div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#52616b">Your score</div><div style="font-size:38px;font-weight:bold;color:#1b3a6b;margin-top:8px">' +
    scoreEsc + '</div><div style="font-size:13px;color:#52616b;margin-top:6px">' +
    input.questionCount + ' questions · ' + input.durationMinutes + ' minutes · Submitted ' + dateEsc +
    '</div></div><p style="margin-top:22px">View or save your result report:</p><p><a href="' + urlEsc +
    '" style="' + button + 'background:#1b3a6b">View My Result</a></p><h3 style="margin-top:24px">Join the CSCA student community</h3><p>Connect with other students, share preparation tips and receive updates.</p><p><a href="https://chat.whatsapp.com/IHhgPyOj4fQCzLsTJAoq1g" style="' +
    button + 'background:#16a34a">Click to Join CSCA Discussion Group</a></p><p style="margin-top:22px">Need guidance about CSCA preparation or studying in China? Our team is happy to help.</p><p><a href="' +
    teacherUrl + '" style="' + button + 'background:#c8102e">Contact for Study in China</a></p><p style="font-size:12px;color:#64748b;margin-top:24px">This is a practice result, not an official CSCA score report.</p></div></div></div>';

  const adminHtml = frame +
    '<h1 style="font-size:21px;line-height:1.35;margin:12px 0 5px">New CSCA Mock Test Submission</h1><p style="font-size:13px;color:#dbe5f0;line-height:1.5;margin:0">A student has completed a mock test.</p></div>' +
    '<div style="padding:20px 22px"><h2 style="font-size:18px;margin:0 0 12px">' + studentEsc + '</h2>' +
    '<table role="presentation" style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.5">' +
    '<tr><td style="width:36%;padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#64748b">Test</td><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:bold">' + testEsc + '</td></tr>' +
    '<tr><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#64748b">Phone</td><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">' + phoneEsc + '</td></tr>' +
    '<tr><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#64748b">Email</td><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;word-break:break-word">' + emailEsc + '</td></tr>' +
    '<tr><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#64748b">Score</td><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:bold">' + scoreEsc + '</td></tr>' +
    '<tr><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#64748b">Screen departures</td><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0">' + input.awayCount + '</td></tr>' +
    '<tr><td style="padding:8px 10px;color:#64748b">Submitted</td><td style="padding:8px 10px">' + dateEsc + '</td></tr></table>' +
    '<p style="margin:18px 0 0;line-height:1.5"><a href="' + urlEsc + '" style="' + button + 'background:#1b3a6b;margin:0 8px 8px 0">Open Result</a><a href="https://wa.me/' + whatsappPhone +
    '?text=' + encodeURIComponent(contactMessage) + '" style="' + button + 'background:#16a34a;margin:0 0 8px">WhatsApp Student</a></p></div></div></div>';

  const [student, admin] = await Promise.all([
    sendEmail({
      to: input.candidateEmail,
      subject: "Your GL Education CSCA Mock Test Result — " + testTitle,
      html: studentHtml,
      replyTo: "globlearnedu@outlook.com",
      templateName: "csca-mocktest-student-result"
    }),
    sendEmail({
      to: "globlearnedu@outlook.com",
      subject: "New CSCA Mock Test Result — " + testTitle + " — " + input.candidateName,
      html: adminHtml,
      replyTo: "globlearnedu@outlook.com",
      templateName: "csca-mocktest-admin-notification"
    })
  ]);

  if (!student.success || !admin.success) {
    console.error("[csca-mocktest] Email delivery issue", { student: student.success, admin: admin.success });
  }
  return { studentSent: student.success, adminSent: admin.success };
}
