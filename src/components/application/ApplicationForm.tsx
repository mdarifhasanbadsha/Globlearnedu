"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { FormData } from "./types";
import { INITIAL_FORM } from "./types";
import StepIndicator from "./StepIndicator";
import Step1Program from "./steps/Step1Program";
import Step2Personal from "./steps/Step2Personal";
import Step3Contact from "./steps/Step3Contact";
import Step4Family from "./steps/Step4Family";
import Step5Academic from "./steps/Step5Academic";
import Step6Language from "./steps/Step6Language";
import Step7ChinaStatus from "./steps/Step7ChinaStatus";
import Step8Documents from "./steps/Step8Documents";
import Step9Review from "./steps/Step9Review";

const SCHOLARSHIP_MAP: Record<string, "csc" | "university" | "provincial" | "self_sponsored"> = {
  csc:        "csc",
  university: "university",
  provincial: "provincial",
  self:       "self_sponsored",
};

const DEGREE_MAP: Record<string, "bachelor" | "master" | "phd" | "language" | "diploma" | "foundation" | "short_course" | "mbbs"> = {
  "MBBS / Medicine":                "mbbs",
  "Bachelor's":                     "bachelor",
  "Master's":                       "master",
  "PhD":                            "phd",
  "Chinese Language":               "language",
  "Diploma":                        "diploma",
  "Foundation / Pre-University":    "foundation",
  "Short Course / Exchange":        "short_course",
};

const STEP_LABELS = [
  "Program", "Personal", "Contact", "Family", "Academic",
  "Language", "China Status", "Documents", "Review & Pay",
];

const TOTAL = 9;

type PaymentConfig = {
  alipayQrUrl: string;
  wechatQrUrl: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  bankSwift: string;
  depositAmount: number;
};

type Props = {
  initialData?: Partial<FormData>;
  applicationId?: string;
  paymentConfig?: PaymentConfig;
};

export default function ApplicationForm({ initialData, applicationId, paymentConfig }: Props = {}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({ ...INITIAL_FORM, ...initialData });
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState(applicationId ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const isModification = !!applicationId;

  function update(updates: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  function next() { setStep((s) => Math.min(TOTAL, s + 1)); window.scrollTo(0, 0); }
  function back() { setStep((s) => Math.max(1, s - 1)); window.scrollTo(0, 0); }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    const scholarshipType = SCHOLARSHIP_MAP[data.fundingType];
    const programLevel    = DEGREE_MAP[data.degreeLevel];

    if (!scholarshipType || !programLevel) {
      setSubmitError("Please complete Step 1 — funding type and degree level are required.");
      setSubmitting(false);
      return;
    }

    if (data.selectedUniversities.length === 0) {
      setSubmitError("Please select at least one university in Step 1.");
      setSubmitting(false);
      return;
    }

    try {
      if (isModification) {
        // MODIFICATION MODE — send all form data to resubmit API
        const payload = {
          // Step 1
          scholarshipType,
          programLevel,
          selectedUniversities: data.selectedUniversities.map((u) => ({
            universityId:   u.id,
            universityName: u.nameEn,
            programName:    data.universityMajors[u.id] || programLevel,
            expectedMajor:  data.universityMajors[u.id] || "",
          })),
          // Step 2 — send in form format; API normalises
          surname: data.surname,
          givenNames: data.givenNames,
          dobYear: data.dobYear, dobMonth: data.dobMonth, dobDay: data.dobDay,
          gender: data.gender,
          nationality: data.nationality,
          passportNumber: data.passportNumber,
          passportExpiryYear: data.passportExpiryYear,
          passportExpiryMonth: data.passportExpiryMonth,
          passportExpiryDay: data.passportExpiryDay,
          religion: data.religion,
          // Step 3
          whatsapp: data.whatsapp,
          email: data.email,
          address: data.address,
          addressCity: data.addressCity,
          addressPostcode: data.addressPostcode,
          residenceCountry: data.residenceCountry,
          // Step 4
          fatherName: data.fatherName, fatherOccupation: data.fatherOccupation, fatherPhone: data.fatherPhone,
          motherName: data.motherName, motherOccupation: data.motherOccupation, motherPhone: data.motherPhone,
          differentSponsor: data.differentSponsor,
          sponsorName: data.sponsorName, sponsorRelationship: data.sponsorRelationship,
          sponsorOccupation: data.sponsorOccupation, sponsorPhone: data.sponsorPhone,
          sponsorIncome: data.sponsorIncome,
          // Step 5
          academicHistory: data.academicHistory,
          workHistory: data.workHistory,
          // Step 6
          englishTestType: data.englishTestType, englishScore: data.englishScore, englishTestDate: data.englishTestDate,
          hasChineseProficiency: data.hasChineseProficiency,
          hskLevel: data.hskLevel, hskScore: data.hskScore,
          hskkLevel: data.hskkLevel, hskkScore: data.hskkScore,
          // Step 7
          inChina: data.inChina,
          chinaVisaType: data.chinaVisaType, chinaVisaEntry: data.chinaVisaEntry, chinaVisaExpiry: data.chinaVisaExpiry,
          chinaCurrentUniversity: data.chinaCurrentUniversity, chinaCurrentAddress: data.chinaCurrentAddress,
        };

        const res = await fetch(`/api/applications/${applicationId}/resubmit`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });

        const result = await res.json();
        if (res.ok && result.ok) {
          setAppId(result.applicationNumber ?? applicationId ?? "");
          setSubmitted(true);
        } else {
          setSubmitError(typeof result.error === "string" ? result.error : "Submission failed. Please try again.");
        }
      } else {
        // NEW APPLICATION MODE — create new
        const payload = {
          scholarshipType,
          programLevel,
          selectedUniversities: data.selectedUniversities.map((u) => ({
            universityId:   u.id,
            universityName: u.nameEn,
            programName:    data.universityMajors[u.id] || programLevel,
            expectedMajor:  data.universityMajors[u.id] || "",
          })),
        };

        const res = await fetch("/api/applications", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });

        const result = await res.json();
        if (res.ok && result.application?.applicationNumber) {
          setAppId(result.application.applicationNumber);
          setSubmitted(true);
        } else {
          setSubmitError(typeof result.error === "string" ? result.error : "Submission failed. Please try again or contact your advisor.");
        }
      }
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepProps = { data, onChange: update };

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator current={step} total={TOTAL} labels={STEP_LABELS} />

      <div className="bg-white rounded-2xl border p-6 md:p-8" style={{ borderColor: "#E2E8F0" }}>
        {step === 1 && <Step1Program {...stepProps} />}
        {step === 2 && <Step2Personal {...stepProps} />}
        {step === 3 && <Step3Contact {...stepProps} />}
        {step === 4 && <Step4Family {...stepProps} />}
        {step === 5 && <Step5Academic {...stepProps} />}
        {step === 6 && <Step6Language {...stepProps} />}
        {step === 7 && <Step7ChinaStatus {...stepProps} />}
        {step === 8 && <Step8Documents {...stepProps} />}
        {step === 9 && (
          <Step9Review
            {...stepProps}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitError={submitError}
            paymentConfig={paymentConfig}
          />
        )}

        {/* Nav buttons (not shown on Step 9 — it has its own submit) */}
        {step < 9 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: "#F1F5F9" }}>
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-30"
              style={{ borderColor: "#E2E8F0", color: "#475569" }}
            >
              <ChevronLeft size={15} />
              Back
            </button>
            <button
              onClick={next}
              className="px-7 py-2.5 rounded-lg text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: "#C8102E" }}
            >
              Save &amp; Continue →
            </button>
          </div>
        )}
      </div>

      {/* Success modal */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl" style={{ backgroundColor: "#F0FDF4" }}>
              {isModification ? "✅" : "🎉"}
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: "#1B3A6B" }}>
              {isModification ? "Application Updated!" : "Application submitted!"}
            </h2>
            <p className="text-sm mb-2" style={{ color: "#64748B" }}>Your Application ID is:</p>
            <p className="text-lg font-mono font-black mb-4" style={{ color: "#C8102E" }}>{appId}</p>
            <p className="text-sm mb-8" style={{ color: "#64748B" }}>
              {isModification
                ? "Your updated application has been sent back for review. Globlearn Education will review the changes and notify you shortly."
                : "Globlearn Education will review your application within 24 hours. You can track progress in your dashboard."}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/dashboard/application"
                className="flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: "#C8102E" }}
              >
                View my application →
              </a>
              <a
                href={`https://wa.me/8615655031556?text=${encodeURIComponent(isModification
                  ? `Hi! I have updated my application ${appId} as requested. Please review.`
                  : `Hi! I just submitted my application ${appId}. What are the next steps?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                WhatsApp your advisor →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
