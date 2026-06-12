"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { COUNTRIES_LIST as COUNTRIES } from "@/lib/data/countries";

const INPUT_CLS =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] transition-colors";
const LABEL_CLS = "block text-sm font-semibold text-gray-700 mb-1.5";
const SELECT_CLS = INPUT_CLS;

const FUNDING_TYPES = [
  { id: "csc", label: "CSC Government Scholarship", desc: "Fully funded by Chinese Government" },
  { id: "university", label: "University Scholarship", desc: "Partial or full scholarship from university" },
  { id: "provincial", label: "Provincial Scholarship", desc: "Regional government scholarship" },
  { id: "self", label: "Self-Sponsored", desc: "Student funds own studies" },
];

const DEGREES = ["MBBS / Medicine", "Dentistry / Stomatology", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Language Program", "Foundation / Pre-University"];

type FormState = {
  fundingType: string;
  degreeLevel: string;
  // Personal
  surname: string;
  givenNames: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  // Contact
  whatsapp: string;
  email: string;
  addressCity: string;
  residenceCountry: string;
  emergencyName: string;
  emergencyPhone: string;
  // Notes
  notes: string;
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 40 }, (_, i) => String(2010 - i));

const EMPTY: FormState = {
  fundingType: "", degreeLevel: "",
  surname: "", givenNames: "", dobDay: "", dobMonth: "", dobYear: "",
  gender: "", nationality: "", passportNumber: "",
  whatsapp: "", email: "", addressCity: "", residenceCountry: "", emergencyName: "", emergencyPhone: "",
  notes: "",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL_CLS}>
        {label} {required && <span style={{ color: "#C8102E" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AddStudentPage() {
  const [data, setData] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  function set(k: keyof FormState, v: string) {
    setData((prev) => ({ ...prev, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "#F0FDF4" }}
        >
          <CheckCircle2 size={32} style={{ color: "#16A34A" }} />
        </div>
        <h2 className="text-xl font-black mb-2" style={{ color: "#1B3A6B" }}>
          Student submitted!
        </h2>
        <p className="text-sm mb-2" style={{ color: "#64748B" }}>
          <strong>{data.givenNames} {data.surname}</strong> has been submitted to the Globlearn Education team.
          An advisor will contact the student within 24 hours.
        </p>
        <p className="text-xs mb-8" style={{ color: "#94A3B8" }}>
          Commission of ¥2,000 will be credited upon admission confirmation.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setData(EMPTY); setSubmitted(false); }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#C8102E" }}
          >
            Add another student
          </button>
          <Link
            href="/partner/students"
            className="px-5 py-2.5 rounded-xl text-sm font-bold border"
            style={{ borderColor: "#E2E8F0", color: "#475569" }}
          >
            View all students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/partner/students" className="text-sm font-semibold flex items-center gap-1" style={{ color: "#64748B" }}>
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>
          Add a student
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Submit a new student referral. Globlearn Education will contact them and manage the application.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Program */}
        <div className="bg-white border rounded-2xl p-6" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-black mb-5" style={{ color: "#1B3A6B" }}>Program preferences</p>

          <div className="mb-5">
            <p className={LABEL_CLS}>Funding type <span style={{ color: "#C8102E" }}>*</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FUNDING_TYPES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => set("fundingType", f.id)}
                  className="p-3 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: data.fundingType === f.id ? "#C8102E" : "#E2E8F0",
                    backgroundColor: data.fundingType === f.id ? "#FEF2F2" : "white",
                  }}
                >
                  <p className="text-xs font-bold leading-tight" style={{ color: data.fundingType === f.id ? "#C8102E" : "#1B3A6B" }}>
                    {f.label}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Field label="Degree level" required>
            <select value={data.degreeLevel} onChange={(e) => set("degreeLevel", e.target.value)} className={SELECT_CLS} required>
              <option value="">Select degree</option>
              {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>

        {/* Section 2: Personal */}
        <div className="bg-white border rounded-2xl p-6" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-black mb-5" style={{ color: "#1B3A6B" }}>Personal information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Surname (as in passport)" required>
              <input type="text" value={data.surname} onChange={(e) => set("surname", e.target.value)} placeholder="Family name" className={INPUT_CLS} required />
            </Field>
            <Field label="Given names (as in passport)" required>
              <input type="text" value={data.givenNames} onChange={(e) => set("givenNames", e.target.value)} placeholder="First and middle names" className={INPUT_CLS} required />
            </Field>

            <div className="sm:col-span-2">
              <p className={LABEL_CLS}>Date of birth <span style={{ color: "#C8102E" }}>*</span></p>
              <div className="grid grid-cols-3 gap-2">
                <select value={data.dobDay} onChange={(e) => set("dobDay", e.target.value)} className={SELECT_CLS}>
                  <option value="">Day</option>
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={data.dobMonth} onChange={(e) => set("dobMonth", e.target.value)} className={SELECT_CLS}>
                  <option value="">Month</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={data.dobYear} onChange={(e) => set("dobYear", e.target.value)} className={SELECT_CLS}>
                  <option value="">Year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <Field label="Gender" required>
              <div className="flex gap-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => set("gender", g)}
                    className="flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all"
                    style={{
                      borderColor: data.gender === g ? "#1B3A6B" : "#E2E8F0",
                      backgroundColor: data.gender === g ? "#EEF4FF" : "white",
                      color: data.gender === g ? "#1B3A6B" : "#64748B",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Nationality" required>
              <select value={data.nationality} onChange={(e) => set("nationality", e.target.value)} className={SELECT_CLS} required>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Passport number">
              <input type="text" value={data.passportNumber} onChange={(e) => set("passportNumber", e.target.value)} placeholder="e.g. BK1234567" className={INPUT_CLS} />
            </Field>
          </div>
        </div>

        {/* Section 3: Contact */}
        <div className="bg-white border rounded-2xl p-6" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-black mb-5" style={{ color: "#1B3A6B" }}>Contact details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="WhatsApp number" required>
              <input type="tel" value={data.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+880 1712 345678" className={INPUT_CLS} required />
            </Field>
            <Field label="Email address" required>
              <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="student@email.com" className={INPUT_CLS} required />
            </Field>
            <Field label="City">
              <input type="text" value={data.addressCity} onChange={(e) => set("addressCity", e.target.value)} placeholder="e.g. Dhaka" className={INPUT_CLS} />
            </Field>
            <Field label="Country of residence" required>
              <select value={data.residenceCountry} onChange={(e) => set("residenceCountry", e.target.value)} className={SELECT_CLS} required>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white border rounded-2xl p-6" style={{ borderColor: "#E2E8F0" }}>
          <Field label="Notes for advisor (optional)">
            <textarea
              value={data.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              placeholder="Any additional context — timeline, special requirements, etc."
              className={INPUT_CLS}
            />
          </Field>
        </div>

        {/* Info */}
        <div className="rounded-xl p-4 border" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
          <p className="text-xs" style={{ color: "#1B3A6B" }}>
            <strong>What happens next:</strong> After submission, a Globlearn Education advisor will contact the student within 24 hours via WhatsApp. You will earn ¥2,000 commission upon their admission confirmation. The student completes their full application directly on our platform.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl text-base font-black text-white transition-all"
          style={{ backgroundColor: "#C8102E" }}
        >
          Submit student referral →
        </button>
      </form>
    </div>
  );
}
