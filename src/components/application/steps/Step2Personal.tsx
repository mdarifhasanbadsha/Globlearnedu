import type { FormData } from "../types";
import { INPUT_CLS, LABEL_CLS, SELECT_CLS, COUNTRIES } from "../types";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void };

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
// Age range 15–75: born 2009 → 1950
const YEARS_DOB    = Array.from({ length: 60 }, (_, i) => String(2009 - i));
const YEARS_ISSUE  = Array.from({ length: 30 }, (_, i) => String(2026 - i));
const YEARS_EXPIRY = Array.from({ length: 20 }, (_, i) => String(2025 + i));

const MONTH_NUMS: Record<string, number> = {
  January:1,February:2,March:3,April:4,May:5,June:6,
  July:7,August:8,September:9,October:10,November:11,December:12,
};

function expiryWarning(day: string, month: string, year: string): string | null {
  if (!day || !month || !year) return null;
  const expiry = new Date(Number(year), MONTH_NUMS[month] - 1, Number(day));
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() + 18);
  if (expiry < new Date()) return "⚠ Passport appears to have already expired. Please renew before applying.";
  if (expiry < cutoff)    return "⚠ Passport expires within 18 months. Universities and Chinese visa authorities require at least 18 months validity at the time of entry. Consider renewing.";
  return null;
}

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

export default function Step2Personal({ data, onChange }: Props) {
  function set(key: keyof FormData, val: string) {
    onChange({ [key]: val } as Partial<FormData>);
  }

  const passportExpiryAlert = expiryWarning(data.passportExpiryDay, data.passportExpiryMonth, data.passportExpiryYear);

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>Personal information</h2>
      <p className="text-sm mb-6" style={{ color: "#64748B" }}>
        Enter your details exactly as they appear on your passport.
      </p>

      {/* Info callout */}
      <div className="rounded-xl p-4 mb-8 border" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
        <p className="text-xs font-semibold" style={{ color: "#1B3A6B" }}>
          ℹ Your name must match your passport exactly. Globlearn Education will use this for all university submissions and visa applications.
        </p>
      </div>

      {/* Name */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Name (as per passport)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Field label="Surname (family name)" required>
          <input
            type="text"
            value={data.surname}
            onChange={(e) => set("surname", e.target.value)}
            placeholder="e.g. RAHMAN"
            className={INPUT_CLS}
          />
        </Field>
        <Field label="Given name(s)" required>
          <input
            type="text"
            value={data.givenNames}
            onChange={(e) => set("givenNames", e.target.value)}
            placeholder="e.g. AHMED FARHAN"
            className={INPUT_CLS}
          />
        </Field>
      </div>

      {/* DOB */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Date of birth
      </p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Field label="Day" required>
          <select value={data.dobDay} onChange={(e) => set("dobDay", e.target.value)} className={SELECT_CLS}>
            <option value="">Day</option>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Month" required>
          <select value={data.dobMonth} onChange={(e) => set("dobMonth", e.target.value)} className={SELECT_CLS}>
            <option value="">Month</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Year" required>
          <select value={data.dobYear} onChange={(e) => set("dobYear", e.target.value)} className={SELECT_CLS}>
            <option value="">Year</option>
            {YEARS_DOB.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>

      {/* Gender + Nationality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Field label="Gender" required>
          <div className="flex gap-3">
            {["Male", "Female", "Prefer not to say"].map((g) => (
              <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={data.gender === g}
                  onChange={() => set("gender", g)}
                  className="accent-[#C8102E]"
                />
                <span className="text-sm text-gray-700">{g}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Nationality" required>
          <select value={data.nationality} onChange={(e) => set("nationality", e.target.value)} className={SELECT_CLS}>
            <option value="">Select country</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      {/* Passport */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Passport details
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Passport number" required>
          <input
            type="text"
            value={data.passportNumber}
            onChange={(e) => set("passportNumber", e.target.value)}
            placeholder="e.g. BK1234567"
            className={INPUT_CLS}
          />
        </Field>
        <div>
          <label className={LABEL_CLS}>Passport issue date <span style={{ color: "#C8102E" }}>*</span></label>
          <div className="grid grid-cols-3 gap-2">
            <select value={data.passportIssueDay} onChange={(e) => set("passportIssueDay", e.target.value)} className={SELECT_CLS}>
              <option value="">Day</option>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={data.passportIssueMonth} onChange={(e) => set("passportIssueMonth", e.target.value)} className={SELECT_CLS}>
              <option value="">Month</option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={data.passportIssueYear} onChange={(e) => set("passportIssueYear", e.target.value)} className={SELECT_CLS}>
              <option value="">Year</option>
              {YEARS_ISSUE.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLS}>Passport expiry date <span style={{ color: "#C8102E" }}>*</span></label>
        <div className="grid grid-cols-3 gap-2 sm:w-1/2">
          <select value={data.passportExpiryDay} onChange={(e) => set("passportExpiryDay", e.target.value)} className={SELECT_CLS}>
            <option value="">Day</option>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={data.passportExpiryMonth} onChange={(e) => set("passportExpiryMonth", e.target.value)} className={SELECT_CLS}>
            <option value="">Month</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={data.passportExpiryYear} onChange={(e) => set("passportExpiryYear", e.target.value)} className={SELECT_CLS}>
            <option value="">Year</option>
            {YEARS_EXPIRY.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {passportExpiryAlert && (
          <div className="mt-2 rounded-lg px-3 py-2 text-xs font-semibold" style={{ backgroundColor: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}>
            {passportExpiryAlert}
          </div>
        )}
      </div>

      {/* Religion + Marital status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Religion (optional)">
          <input
            type="text"
            value={data.religion}
            onChange={(e) => set("religion", e.target.value)}
            placeholder="e.g. Islam, Christianity…"
            className={INPUT_CLS}
          />
        </Field>
        <Field label="Marital status" required>
          <select value={data.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value)} className={SELECT_CLS}>
            <option value="">Select</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>
        </Field>
      </div>
    </div>
  );
}
