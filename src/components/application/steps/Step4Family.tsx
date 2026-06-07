import type { FormData } from "../types";
import { INPUT_CLS, LABEL_CLS } from "../types";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void };

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

const INCOME_RANGES = [
  "Under $5,000/year",
  "$5,000–$10,000/year",
  "$10,000–$25,000/year",
  "$25,000–$50,000/year",
  "$50,000–$100,000/year",
  "Over $100,000/year",
];

export default function Step4Family({ data, onChange }: Props) {
  function set(key: keyof FormData, val: string | boolean) {
    onChange({ [key]: val } as Partial<FormData>);
  }

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>
        Parent &amp; financial sponsor information
      </h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        This information is required for university admission and scholarship applications.
      </p>

      {/* Father */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Father's details
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Field label="Full name" required>
          <input type="text" value={data.fatherName} onChange={(e) => set("fatherName", e.target.value)} placeholder="e.g. Mohammed Rahman" className={INPUT_CLS} />
        </Field>
        <Field label="Occupation" required>
          <input type="text" value={data.fatherOccupation} onChange={(e) => set("fatherOccupation", e.target.value)} placeholder="e.g. Government officer" className={INPUT_CLS} />
        </Field>
        <Field label="Phone number" required>
          <input type="tel" value={data.fatherPhone} onChange={(e) => set("fatherPhone", e.target.value)} placeholder="+880..." className={INPUT_CLS} />
        </Field>
        <Field label="Email (optional)">
          <input type="email" value={data.fatherEmail} onChange={(e) => set("fatherEmail", e.target.value)} placeholder="father@email.com" className={INPUT_CLS} />
        </Field>
      </div>

      {/* Mother */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Mother's details
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Field label="Full name" required>
          <input type="text" value={data.motherName} onChange={(e) => set("motherName", e.target.value)} placeholder="e.g. Fatima Rahman" className={INPUT_CLS} />
        </Field>
        <Field label="Occupation" required>
          <input type="text" value={data.motherOccupation} onChange={(e) => set("motherOccupation", e.target.value)} placeholder="e.g. Homemaker" className={INPUT_CLS} />
        </Field>
        <Field label="Phone number" required>
          <input type="tel" value={data.motherPhone} onChange={(e) => set("motherPhone", e.target.value)} placeholder="+880..." className={INPUT_CLS} />
        </Field>
        <Field label="Email (optional)">
          <input type="email" value={data.motherEmail} onChange={(e) => set("motherEmail", e.target.value)} placeholder="mother@email.com" className={INPUT_CLS} />
        </Field>
      </div>

      {/* Sponsor toggle */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Financial sponsor
      </p>
      <div className="flex gap-3 mb-6">
        {[
          { value: false, label: "My parent is my sponsor" },
          { value: true, label: "Different sponsor" },
        ].map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => set("differentSponsor", opt.value)}
            className="px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all"
            style={{
              borderColor: data.differentSponsor === opt.value ? "#C8102E" : "#E2E8F0",
              backgroundColor: data.differentSponsor === opt.value ? "#FEF2F2" : "white",
              color: data.differentSponsor === opt.value ? "#C8102E" : "#475569",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Different sponsor fields */}
      {data.differentSponsor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Sponsor full name" required>
            <input type="text" value={data.sponsorName} onChange={(e) => set("sponsorName", e.target.value)} placeholder="Full name" className={INPUT_CLS} />
          </Field>
          <Field label="Relationship to applicant" required>
            <input type="text" value={data.sponsorRelationship} onChange={(e) => set("sponsorRelationship", e.target.value)} placeholder="e.g. Uncle, Employer" className={INPUT_CLS} />
          </Field>
          <Field label="Occupation" required>
            <input type="text" value={data.sponsorOccupation} onChange={(e) => set("sponsorOccupation", e.target.value)} placeholder="Occupation" className={INPUT_CLS} />
          </Field>
          <Field label="Phone number" required>
            <input type="tel" value={data.sponsorPhone} onChange={(e) => set("sponsorPhone", e.target.value)} placeholder="+..." className={INPUT_CLS} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Annual income (approximate)" required>
              <select value={data.sponsorIncome} onChange={(e) => set("sponsorIncome", e.target.value)} className={INPUT_CLS}>
                <option value="">Select range</option>
                {INCOME_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>
        </div>
      )}

      {/* Bank statement callout */}
      <div className="rounded-xl p-4 mt-8 border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FFD70040" }}>
        <p className="text-xs font-semibold" style={{ color: "#92610A" }}>
          💡 Bank statement showing minimum $5,000 USD equivalent will be required in Step 8 (Documents).
        </p>
      </div>
    </div>
  );
}
