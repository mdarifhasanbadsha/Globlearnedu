import { sendEmail } from "./resend";
import * as templates from "./templates";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://globlearnedu.com";

// Substitute {{variableName}} placeholders in a template string
function render(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (str, [key, value]) => str.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value ?? ""),
    template
  );
}

// Look up an active DB template override by triggerEvent
async function getDbTemplate(triggerEvent: string): Promise<{ subject: string; bodyHtml: string } | null> {
  try {
    const [row] = await db
      .select({ subject: emailTemplates.subject, bodyHtml: emailTemplates.bodyHtml })
      .from(emailTemplates)
      .where(and(eq(emailTemplates.triggerEvent, triggerEvent), eq(emailTemplates.isActive, true)))
      .limit(1);
    if (row?.bodyHtml) return { subject: row.subject, bodyHtml: row.bodyHtml };
  } catch { /* DB unavailable — fall back to hardcoded */ }
  return null;
}

export async function sendApplicationReceivedNotification(data: {
  studentEmail: string;
  studentName: string;
  applicationId: string;
  universities: string[];
  program: string;
  partnerEmail?: string;
  partnerName?: string;
}) {
  const trackingUrl = `${BASE_URL}/track?id=${data.applicationId}`;
  const studentVars = {
    studentName: data.studentName,
    applicationId: data.applicationId,
    universities: data.universities.join(", "),
    program: data.program,
    trackingUrl,
  };
  const dbStudent = await getDbTemplate("application_received_student");
  const studentTemplate = dbStudent
    ? { subject: render(dbStudent.subject, studentVars), html: render(dbStudent.bodyHtml, studentVars) }
    : templates.applicationReceivedStudent({ ...studentVars, universities: data.universities });
  await sendEmail({ to: data.studentEmail, ...studentTemplate });

  if (data.partnerEmail && data.partnerName) {
    const partnerVars = {
      partnerName: data.partnerName,
      studentName: data.studentName,
      applicationId: data.applicationId,
      program: data.program,
    };
    const dbPartner = await getDbTemplate("application_received_partner");
    const partnerTemplate = dbPartner
      ? { subject: render(dbPartner.subject, partnerVars), html: render(dbPartner.bodyHtml, partnerVars) }
      : templates.applicationReceivedPartner(partnerVars);
    await sendEmail({ to: data.partnerEmail, ...partnerTemplate });
  }
}

export async function sendStatusUpdateNotification(data: {
  studentEmail: string;
  studentName: string;
  applicationId: string;
  newStatus: string;
  statusDescription: string;
  nextStep: string;
}) {
  const vars = {
    studentName: data.studentName,
    applicationId: data.applicationId,
    newStatus: data.newStatus,
    statusDescription: data.statusDescription,
    nextStep: data.nextStep,
    trackingUrl: `${BASE_URL}/track?id=${data.applicationId}`,
  };
  const dbT = await getDbTemplate("status_update");
  const template = dbT
    ? { subject: render(dbT.subject, vars), html: render(dbT.bodyHtml, vars) }
    : templates.statusUpdateEmail({ ...vars });
  await sendEmail({ to: data.studentEmail, ...template });
}

export async function sendAdmissionOfferNotification(data: {
  studentEmail: string;
  studentName: string;
  applicationId: string;
  universityName: string;
  programName: string;
  scholarshipType: string;
  intakeDate: string;
  staffName: string;
}) {
  const vars = {
    studentName: data.studentName,
    applicationId: data.applicationId,
    universityName: data.universityName,
    programName: data.programName,
    scholarshipType: data.scholarshipType,
    intakeDate: data.intakeDate,
    staffName: data.staffName,
    trackingUrl: `${BASE_URL}/track?id=${data.applicationId}`,
  };
  const dbT = await getDbTemplate("admission_offer");
  const template = dbT
    ? { subject: render(dbT.subject, vars), html: render(dbT.bodyHtml, vars) }
    : templates.admissionOfferEmail({ ...vars });
  await sendEmail({ to: data.studentEmail, ...template });
}

export const STATUS_DESCRIPTIONS: Record<string, { description: string; nextStep: string }> = {
  under_review: {
    description: "Globlearn Education is reviewing your documents.",
    nextStep: "Wait for document approval — usually within 24 hours.",
  },
  documents_approved: {
    description: "All your documents have been verified and approved.",
    nextStep: "Globlearn Education is now preparing your university submissions.",
  },
  applied_per_university: {
    description: "Your application has been formally submitted to your chosen universities.",
    nextStep: "The university admissions office will review your file — this takes 2–8 weeks.",
  },
  processing: {
    description: "Your application is being actively reviewed by the university.",
    nextStep: "Be patient — the university will respond with a decision. We will notify you immediately.",
  },
  interview: {
    description: "The university has requested an interview with you.",
    nextStep: "Check your email for interview details. Prepare well — Globlearn Education can help.",
  },
  pre_admission: {
    description: "The university has provisionally accepted your application.",
    nextStep: "Please confirm your acceptance through your dashboard.",
  },
  student_confirms: {
    description: "You have confirmed your offer. Final admission letter is being prepared.",
    nextStep: "Wait for your official admission letter and JW202 form.",
  },
  final_admission: {
    description: "You have received your official admission letter and JW202 form.",
    nextStep: "Begin your X1 student visa application. Globlearn Education will guide you.",
  },
  service_charge_payment: {
    description: "Please pay the Globlearn Education service charge to complete your admission.",
    nextStep: "Pay via Alipay, WeChat or bank transfer. Contact us if you need assistance.",
  },
  complete: {
    description: "Your admission is fully complete. Congratulations!",
    nextStep: "Check your pre-departure guide and prepare for your China journey.",
  },
};
