"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import type { FormData } from "../types";
import { universitiesData } from "~/lib/data/universities";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void; onSubmit: () => void };

function ReviewSection({ title, items, editStep }: { title: string; items: { label: string; value: string }[]; editStep?: number }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border rounded-xl overflow-hidden mb-4" style={{ borderColor: "#E2E8F0" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-5 py-4 text-left"
        style={{ backgroundColor: "#F8FAFC" }}
      >
        <span className="text-sm font-bold" style={{ color: "#1B3A6B" }}>{title}</span>
        <div className="flex items-center gap-3">
          {editStep && (
            <span className="text-xs font-semibold" style={{ color: "#C8102E" }}>
              Edit (Step {editStep})
            </span>
          )}
          {open ? <ChevronUp size={15} style={{ color: "#94A3B8" }} /> : <ChevronDown size={15} style={{ color: "#94A3B8" }} />}
        </div>
      </button>
      {open && (
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#94A3B8" }}>{item.label}</p>
              <p className="text-sm" style={{ color: item.value ? "#1B3A6B" : "#CBD5E1" }}>
                {item.value || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const TERMS = [
  "I confirm all information provided is accurate and complete. I understand that providing false information will result in application cancellation.",
  "I authorise Globlearn Education to submit my application to the selected universities on my behalf.",
  "I understand the 500 RMB application deposit is non-refundable after submission.",
  "I have read and agree to Globlearn Education's Terms of Service and Privacy Policy.",
];

export default function Step9Review({ data, onChange, onSubmit }: Props) {
  const [payTab, setPayTab] = useState<"card" | "qr" | "bank">("card");
  const [payProof, setPayProof] = useState<string>("");

  const uniNames = data.selectedUniversities
    .map((s) => universitiesData[s]?.name ?? s)
    .join(", ");

  const allTerms = data.term1 && data.term2 && data.term3 && data.term4;

  const docsUploaded = Object.keys(data.documents).length;
  const missingRequired = ["passport", "photo", "certificate", "transcript", "police", "medical", "bank"]
    .filter((id) => !data.documents[id]);

  function setTerm(n: 1 | 2 | 3 | 4, val: boolean) {
    onChange({ [`term${n}`]: val } as Partial<FormData>);
  }

  function handleProof(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) { setPayProof(f.name); onChange({ paymentProof: f.name }); }
  }

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>Review your application</h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        Please review all sections carefully before submitting. After submission, you can update documents by contacting your advisor.
      </p>

      {/* Missing docs warning */}
      {missingRequired.length > 0 && (
        <div className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: "#FEF2F2", borderColor: "#C8102E20" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#C8102E" }}>
            ⚠ {missingRequired.length} required document{missingRequired.length > 1 ? "s" : ""} missing
          </p>
          <p className="text-xs" style={{ color: "#C8102E" }}>
            You can still submit but must upload them within 7 days or your application may be delayed.
          </p>
        </div>
      )}

      {/* Review sections */}
      <ReviewSection
        title="Program & Universities"
        editStep={1}
        items={[
          { label: "Funding type", value: data.fundingType },
          { label: "Degree level", value: data.degreeLevel },
          { label: "Selected universities", value: uniNames },
        ]}
      />
      <ReviewSection
        title="Personal Information"
        editStep={2}
        items={[
          { label: "Full name", value: `${data.givenNames} ${data.surname}`.trim() },
          { label: "Date of birth", value: `${data.dobDay} ${data.dobMonth} ${data.dobYear}`.trim() },
          { label: "Nationality", value: data.nationality },
          { label: "Passport number", value: data.passportNumber },
          { label: "Gender", value: data.gender },
          { label: "Marital status", value: data.maritalStatus },
        ]}
      />
      <ReviewSection
        title="Contact Details"
        editStep={3}
        items={[
          { label: "WhatsApp", value: data.whatsapp },
          { label: "Email", value: data.email },
          { label: "City", value: data.addressCity },
          { label: "Country", value: data.residenceCountry },
          { label: "Emergency contact", value: data.emergencyName },
          { label: "Emergency phone", value: data.emergencyPhone },
        ]}
      />
      <ReviewSection
        title="Family & Sponsor"
        editStep={4}
        items={[
          { label: "Father", value: data.fatherName },
          { label: "Mother", value: data.motherName },
          { label: "Sponsor", value: data.differentSponsor ? data.sponsorName : "Parent" },
        ]}
      />
      <ReviewSection
        title="Academic Background"
        editStep={5}
        items={data.academicHistory.map((a, i) => ({
          label: `Qualification ${i + 1}`,
          value: `${a.degree}${a.institution ? " · " + a.institution : ""}`,
        }))}
      />
      <ReviewSection
        title="Language Proficiency"
        editStep={6}
        items={[
          { label: "English test", value: data.englishTestType },
          { label: "Score", value: data.englishScore },
          { label: "Test date", value: data.englishTestDate },
          { label: "HSK level", value: data.hasChineseProficiency ? data.hskLevel : "Not applicable" },
        ]}
      />
      <ReviewSection
        title="China Status"
        editStep={7}
        items={[{ label: "Currently in China", value: data.inChina ? "Yes" : "No" },
          ...(data.inChina ? [{ label: "Visa type", value: data.chinaVisaType }, { label: "Visa expiry", value: data.chinaVisaExpiry }] : [])
        ]}
      />
      <ReviewSection
        title="Documents"
        editStep={8}
        items={[
          { label: "Uploaded", value: `${docsUploaded} document${docsUploaded !== 1 ? "s" : ""}` },
          { label: "Missing required", value: missingRequired.length === 0 ? "None ✓" : missingRequired.length + " missing" },
        ]}
      />

      {/* Terms */}
      <div className="mt-8 mb-6">
        <p className="text-sm font-bold mb-4 pb-2" style={{ color: "#1B3A6B", borderBottom: "1px solid #F1F5F9" }}>
          Terms &amp; acknowledgements — all required
        </p>
        <div className="space-y-3">
          {TERMS.map((term, i) => {
            const n = (i + 1) as 1 | 2 | 3 | 4;
            const checked = [data.term1, data.term2, data.term3, data.term4][i];
            return (
              <label key={i} className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border transition-colors" style={{ borderColor: checked ? "#BBF7D0" : "#E2E8F0", backgroundColor: checked ? "#F0FDF4" : "white" }}>
                <input type="checkbox" checked={checked} onChange={(e) => setTerm(n, e.target.checked)} className="mt-0.5 accent-[#1B3A6B]" />
                <span className="text-sm" style={{ color: "#475569" }}>{term}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Payment */}
      <div className="border rounded-2xl overflow-hidden mb-6" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
          <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>Application deposit — 500 RMB</p>
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Pay now to submit your application. Non-refundable after submission.</p>
        </div>
        {/* Payment tabs */}
        <div className="flex border-b" style={{ borderColor: "#E2E8F0" }}>
          {(["card", "qr", "bank"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setPayTab(tab); onChange({ paymentMethod: tab }); }}
              className="flex-1 py-3 text-xs font-bold transition-colors"
              style={{
                borderBottom: payTab === tab ? "2px solid #C8102E" : "2px solid transparent",
                color: payTab === tab ? "#C8102E" : "#94A3B8",
                backgroundColor: "white",
              }}
            >
              {tab === "card" ? "💳 Card" : tab === "qr" ? "📱 WeChat / Alipay" : "🏦 Bank Transfer"}
            </button>
          ))}
        </div>

        <div className="p-6">
          {payTab === "card" && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-5">Pay securely by credit or debit card.</p>
              <button
                type="button"
                className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: "#C8102E" }}
                onClick={() => alert("Stripe integration coming in Phase 4")}
              >
                Pay 500 RMB by card →
              </button>
              <p className="text-xs mt-3" style={{ color: "#94A3B8" }}>Secured by Stripe. Card details never stored by Globlearn Education.</p>
            </div>
          )}

          {payTab === "qr" && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-5">Scan with WeChat Pay or Alipay.</p>
              <div className="w-48 h-48 mx-auto rounded-xl border-2 border-dashed flex items-center justify-center mb-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
                <p className="text-xs text-center px-4" style={{ color: "#CBD5E1" }}>QR code will appear here after your advisor confirms</p>
              </div>
              <p className="text-xs mb-3" style={{ color: "#64748B" }}>After paying, upload your payment screenshot:</p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 border rounded-lg cursor-pointer text-sm font-semibold transition-colors" style={{ borderColor: "#E2E8F0", color: "#475569" }}>
                <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleProof} />
                <Upload size={14} />
                {payProof || "Upload payment screenshot"}
              </label>
            </div>
          )}

          {payTab === "bank" && (
            <div>
              <p className="text-sm text-gray-600 mb-4">Transfer directly to our bank account.</p>
              <div className="border rounded-xl overflow-hidden mb-5" style={{ borderColor: "#E2E8F0" }}>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Bank", "To be provided by your advisor"],
                      ["Account name", "Globlearn Education"],
                      ["Account number", "Contact your advisor for details"],
                      ["Reference", `Your passport number`],
                      ["Amount", "500 RMB"],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-t" style={{ borderColor: "#F1F5F9" }}>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: "#64748B", width: "40%" }}>{k}</td>
                        <td className="px-4 py-3 text-xs font-semibold" style={{ color: "#1B3A6B" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mb-3" style={{ color: "#64748B" }}>After transferring, upload your transfer receipt:</p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 border rounded-lg cursor-pointer text-sm font-semibold transition-colors" style={{ borderColor: "#E2E8F0", color: "#475569" }}>
                <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleProof} />
                <Upload size={14} />
                {payProof || "Upload transfer receipt"}
              </label>
            </div>
          )}

          <div className="mt-5 pt-5 border-t" style={{ borderColor: "#F1F5F9" }}>
            <p className="text-xs text-center mb-3" style={{ color: "#94A3B8" }}>
              Your application will be reviewed within 24 hours of payment confirmation.
            </p>
            <div className="flex justify-center">
              <a
                href="https://wa.me/8615655031556?text=Hi!%20I%20need%20help%20with%20payment%20for%20my%20application."
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold"
                style={{ color: "#25D366" }}
              >
                Need payment help? WhatsApp us →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!allTerms}
        className="w-full py-4 rounded-xl text-base font-black text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#C8102E" }}
      >
        Submit application &amp; pay 500 RMB deposit →
      </button>
      {!allTerms && (
        <p className="text-xs text-center mt-2" style={{ color: "#94A3B8" }}>
          Please check all 4 boxes above to submit.
        </p>
      )}
    </div>
  );
}
