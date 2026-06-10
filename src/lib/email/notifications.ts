import { sendEmail } from "./resend";
import * as templates from "./templates";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://globlearnedu.com";

export async function sendApplicationReceivedNotification(data: {
  studentEmail: string;
  studentName: string;
  applicationId: string;
  universities: string[];
  program: string;
  partnerEmail?: string;
  partnerName?: string;
}) {
  const studentTemplate = templates.applicationReceivedStudent({
    studentName: data.studentName,
    applicationId: data.applicationId,
    universities: data.universities,
    program: data.program,
    trackingUrl: `${BASE_URL}/track?id=${data.applicationId}`,
  });
  await sendEmail({ to: data.studentEmail, ...studentTemplate });

  if (data.partnerEmail && data.partnerName) {
    const partnerTemplate = templates.applicationReceivedPartner({
      partnerName: data.partnerName,
      studentName: data.studentName,
      applicationId: data.applicationId,
      program: data.program,
    });
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
  const template = templates.statusUpdateEmail({
    ...data,
    trackingUrl: `${BASE_URL}/track?id=${data.applicationId}`,
  });
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
  const template = templates.admissionOfferEmail({
    ...data,
    trackingUrl: `${BASE_URL}/track?id=${data.applicationId}`,
  });
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
