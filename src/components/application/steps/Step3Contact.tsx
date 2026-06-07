import type { FormData } from "../types";
import { INPUT_CLS, LABEL_CLS, SELECT_CLS, COUNTRIES } from "../types";

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

export default function Step3Contact({ data, onChange }: Props) {
  function set(key: keyof FormData, val: string) {
    onChange({ [key]: val } as Partial<FormData>);
  }

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>
        Contact details &amp; address
      </h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        We use your WhatsApp number as the primary contact for all application updates.
      </p>

      {/* Contact */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Contact information
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Field label="WhatsApp number (with country code)" required>
          <input
            type="tel"
            value={data.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="e.g. +8801712345678"
            className={INPUT_CLS}
          />
        </Field>
        <Field label="Email address" required>
          <input
            type="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="your@email.com"
            className={INPUT_CLS}
          />
        </Field>
      </div>

      {/* Current address */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Current address
      </p>
      <div className="space-y-4 mb-8">
        <Field label="Street address (building, flat, street)" required>
          <textarea
            value={data.address}
            onChange={(e) => set("address", e.target.value)}
            rows={2}
            placeholder="e.g. 45 Green Road, Flat 3B"
            className={INPUT_CLS}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="City / Town" required>
            <input
              type="text"
              value={data.addressCity}
              onChange={(e) => set("addressCity", e.target.value)}
              placeholder="e.g. Dhaka"
              className={INPUT_CLS}
            />
          </Field>
          <Field label="Postcode / ZIP (optional)">
            <input
              type="text"
              value={data.addressPostcode}
              onChange={(e) => set("addressPostcode", e.target.value)}
              placeholder="e.g. 1000"
              className={INPUT_CLS}
            />
          </Field>
          <Field label="Country of residence" required>
            <select
              value={data.residenceCountry}
              onChange={(e) => set("residenceCountry", e.target.value)}
              className={SELECT_CLS}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Emergency contact */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Emergency contact
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Full name" required>
          <input
            type="text"
            value={data.emergencyName}
            onChange={(e) => set("emergencyName", e.target.value)}
            placeholder="e.g. Fatima Rahman"
            className={INPUT_CLS}
          />
        </Field>
        <Field label="Phone number" required>
          <input
            type="tel"
            value={data.emergencyPhone}
            onChange={(e) => set("emergencyPhone", e.target.value)}
            placeholder="e.g. +8801987654321"
            className={INPUT_CLS}
          />
        </Field>
        <Field label="Relationship to you" required>
          <input
            type="text"
            value={data.emergencyRelationship}
            onChange={(e) => set("emergencyRelationship", e.target.value)}
            placeholder="e.g. Mother, Father, Spouse"
            className={INPUT_CLS}
          />
        </Field>
      </div>
    </div>
  );
}
