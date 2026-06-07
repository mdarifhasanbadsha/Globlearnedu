import type { FormData } from "../types";
import { INPUT_CLS, LABEL_CLS, SELECT_CLS } from "../types";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void };

const VISA_TYPES = [
  "Student X1", "Student X2", "Tourist L",
  "Business M", "Work Z", "Other",
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL_CLS}>{label} {required && <span style={{ color: "#C8102E" }}>*</span>}</label>
      {children}
    </div>
  );
}

export default function Step7ChinaStatus({ data, onChange }: Props) {
  function set(key: keyof FormData, val: string | boolean) {
    onChange({ [key]: val } as Partial<FormData>);
  }

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>
        Are you currently in China?
      </h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        This affects your visa process — we need to know your current location.
      </p>

      {/* Toggle */}
      <div className="flex gap-3 mb-8">
        {[
          { val: false, label: "No — I am outside China" },
          { val: true, label: "Yes — I am currently in China" },
        ].map((opt) => (
          <button
            key={String(opt.val)}
            type="button"
            onClick={() => set("inChina", opt.val)}
            className="flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all"
            style={{
              borderColor: data.inChina === opt.val ? "#C8102E" : "#E2E8F0",
              backgroundColor: data.inChina === opt.val ? "#FEF2F2" : "white",
              color: data.inChina === opt.val ? "#C8102E" : "#475569",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Not in China */}
      {!data.inChina && (
        <div className="rounded-xl p-6 border text-center" style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>
            You will apply for your X1 student visa from your home country after receiving your admission notice.
          </p>
          <p className="text-xs mt-2" style={{ color: "#166534" }}>
            Globlearn Education will guide you through the embassy process once your offer is confirmed.
          </p>
        </div>
      )}

      {/* In China */}
      {data.inChina && (
        <div>
          {/* Red warning */}
          <div className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: "#FEF2F2", borderColor: "#C8102E20" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "#C8102E" }}>⚠ Important</p>
            <p className="text-xs" style={{ color: "#C8102E" }}>
              If your current visa is expiring soon, please inform us immediately on WhatsApp. Overstaying a visa in China has serious consequences.
            </p>
          </div>

          {/* Visa details */}
          <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
            Current visa details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Field label="Current visa type" required>
              <select value={data.chinaVisaType} onChange={(e) => set("chinaVisaType", e.target.value)} className={SELECT_CLS}>
                <option value="">Select visa type</option>
                {VISA_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            <div /> {/* spacer */}
            <Field label="Visa entry date" required>
              <input type="date" value={data.chinaVisaEntry} onChange={(e) => set("chinaVisaEntry", e.target.value)} className={INPUT_CLS} />
            </Field>
            <Field label="Visa expiry date" required>
              <input type="date" value={data.chinaVisaExpiry} onChange={(e) => set("chinaVisaExpiry", e.target.value)} className={INPUT_CLS} />
            </Field>
          </div>

          <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
            Current location in China
          </p>
          <div className="space-y-4 mb-6">
            <Field label="Current university / institution (if student — optional)">
              <input type="text" value={data.chinaCurrentUniversity} onChange={(e) => set("chinaCurrentUniversity", e.target.value)} placeholder="e.g. Hubei University of Technology" className={INPUT_CLS} />
            </Field>
            <Field label="Current address in China" required>
              <textarea value={data.chinaCurrentAddress} onChange={(e) => set("chinaCurrentAddress", e.target.value)} rows={2} placeholder="Building, floor, room number, street, city" className={INPUT_CLS} />
            </Field>
          </div>

          {/* Acknowledgement */}
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border" style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFAFA" }}>
            <input
              type="checkbox"
              checked={data.chinaAcknowledge}
              onChange={(e) => set("chinaAcknowledge", e.target.checked)}
              className="mt-0.5 accent-[#1B3A6B]"
            />
            <span className="text-sm" style={{ color: "#475569" }}>
              I understand that changing visa status within China requires specific procedures. Globlearn Education will advise me on the correct process for my situation.
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
