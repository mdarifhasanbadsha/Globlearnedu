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

const STEP_LABELS = [
  "Program", "Personal", "Contact", "Family", "Academic",
  "Language", "China Status", "Documents", "Review & Pay",
];

const TOTAL = 9;

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  function update(updates: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  function next() { setStep((s) => Math.min(TOTAL, s + 1)); window.scrollTo(0, 0); }
  function back() { setStep((s) => Math.max(1, s - 1)); window.scrollTo(0, 0); }

  const stepProps = { data, onChange: update };

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator current={step} total={TOTAL} labels={STEP_LABELS} />

      <div
        className="bg-white rounded-2xl border p-6 md:p-8"
        style={{ borderColor: "#E2E8F0" }}
      >
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
            onSubmit={() => setSubmitted(true)}
          />
        )}

        {/* Nav buttons (not shown on Step 9 — it has its own submit) */}
        {step < 9 && (
          <div
            className="flex items-center justify-between mt-8 pt-6 border-t"
            style={{ borderColor: "#F1F5F9" }}
          >
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
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl"
              style={{ backgroundColor: "#F0FDF4" }}
            >
              🎉
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: "#1B3A6B" }}>
              Application submitted!
            </h2>
            <p className="text-sm mb-2" style={{ color: "#64748B" }}>
              Your Application ID is:
            </p>
            <p className="text-lg font-mono font-black mb-4" style={{ color: "#C8102E" }}>
              APP-2026-XXXX
            </p>
            <p className="text-sm mb-8" style={{ color: "#64748B" }}>
              Globlearn Education will review your application within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/dashboard"
                className="flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: "#C8102E" }}
              >
                Track my application →
              </a>
              <a
                href="https://wa.me/8615655031556?text=Hi!%20I%20just%20submitted%20my%20application%20APP-2026-XXXX.%20What%20are%20the%20next%20steps?"
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
