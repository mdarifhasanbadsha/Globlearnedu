import type { FormData } from "../types";
import { INPUT_CLS, LABEL_CLS, SELECT_CLS } from "../types";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void };

const ENGLISH_TESTS = [
  { id: "ielts", label: "IELTS", placeholder: "e.g. 6.5", hint: "Score 0.0–9.0" },
  { id: "toefl", label: "TOEFL iBT", placeholder: "e.g. 90", hint: "Score 0–120" },
  { id: "duolingo", label: "Duolingo English Test", placeholder: "e.g. 110", hint: "Score 10–160" },
  { id: "pte", label: "PTE Academic", placeholder: "e.g. 58", hint: "Score 10–90" },
  { id: "efset", label: "EFSET", placeholder: "e.g. 65", hint: "Score 1–100" },
  { id: "cambridge", label: "Cambridge (C1/C2)", placeholder: "e.g. C1 Merit", hint: "Grade" },
  { id: "moi", label: "MOI Letter", placeholder: "Institution name", hint: "Medium of Instruction letter" },
  { id: "none", label: "Not yet taken", placeholder: "", hint: "Conditional admission may be available" },
];

const HSK_LEVELS = ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"];
const HSKK_LEVELS = ["Beginner", "Intermediate", "Advanced"];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL_CLS}>{label} {required && <span style={{ color: "#C8102E" }}>*</span>}</label>
      {children}
    </div>
  );
}

export default function Step6Language({ data, onChange }: Props) {
  function set(key: keyof FormData, val: string | boolean) {
    onChange({ [key]: val } as Partial<FormData>);
  }

  const activeTest = ENGLISH_TESTS.find((t) => t.id === data.englishTestType);

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>Language proficiency</h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        Select your English test and enter your score. Chinese proficiency is optional.
      </p>

      {/* Program-specific language callout */}
      {(data.degreeLevel === "MBBS / Medicine" || data.degreeLevel === "mbbs") && (
        <div className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
          <p className="text-xs font-semibold" style={{ color: "#1B3A6B" }}>
            ℹ For MBBS programs: English proficiency is required. IELTS 5.5+ recommended. MOI letters accepted from recognised institutions.
          </p>
        </div>
      )}
      {(data.degreeLevel === "PhD" || data.degreeLevel === "phd" || data.degreeLevel === "PhD / Doctorate") && (
        <div className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: "#FFF7ED", borderColor: "#FED7AA" }}>
          <p className="text-xs font-semibold" style={{ color: "#92400E" }}>
            ℹ For PhD programs: Strong English proficiency is important. Most universities require IELTS 6.0+ or TOEFL 80+. HSK proficiency is a significant advantage for Chinese-medium doctoral research programs.
          </p>
        </div>
      )}
      {(data.degreeLevel === "Master's" || data.degreeLevel === "master" || data.degreeLevel === "Master's Degree") && (
        <div className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: "#F0FFF4", borderColor: "#BBF7D0" }}>
          <p className="text-xs font-semibold" style={{ color: "#166534" }}>
            ℹ For Master's programs: English proficiency is typically required. IELTS 5.5–6.5 or TOEFL 75–90 is the common requirement range depending on the university.
          </p>
        </div>
      )}
      {/* Generic fallback callout for other degree types */}
      {!["MBBS / Medicine", "mbbs", "PhD", "phd", "PhD / Doctorate", "Master's", "master", "Master's Degree"].includes(data.degreeLevel) && (
        <div className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
          <p className="text-xs font-semibold" style={{ color: "#1B3A6B" }}>
            ℹ English proficiency requirements vary by program and university. IELTS 5.0+ or equivalent is generally sufficient for undergraduate and language programs.
          </p>
        </div>
      )}
      <div className="mb-8" />

      {/* English test selector */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        English proficiency — select test type
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {ENGLISH_TESTS.map((test) => {
          const sel = data.englishTestType === test.id;
          return (
            <button
              key={test.id}
              type="button"
              onClick={() => set("englishTestType", test.id)}
              className="p-3 rounded-xl border-2 text-left transition-all"
              style={{ borderColor: sel ? "#C8102E" : "#E2E8F0", backgroundColor: sel ? "#FEF2F2" : "white" }}
            >
              <p className="text-xs font-bold leading-tight" style={{ color: sel ? "#C8102E" : "#1B3A6B" }}>{test.label}</p>
              <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "#94A3B8" }}>{test.hint}</p>
            </button>
          );
        })}
      </div>

      {/* Score + date fields (conditional) */}
      {data.englishTestType && data.englishTestType !== "none" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-5 border rounded-xl" style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFAFA" }}>
          <Field label={data.englishTestType === "moi" ? "Institution name" : "Score"} required>
            <input
              type="text"
              value={data.englishScore}
              onChange={(e) => set("englishScore", e.target.value)}
              placeholder={activeTest?.placeholder ?? ""}
              className={INPUT_CLS}
            />
          </Field>
          <Field label="Test date" required>
            <input
              type="month"
              value={data.englishTestDate}
              onChange={(e) => set("englishTestDate", e.target.value)}
              className={INPUT_CLS}
            />
          </Field>
          {data.englishTestType !== "moi" && (
            <div className="flex items-end">
              <p className="text-xs pb-3" style={{ color: "#94A3B8" }}>
                Upload certificate in Step 8 (Documents).
              </p>
            </div>
          )}
        </div>
      )}

      {data.englishTestType === "none" && (
        <div className="rounded-xl p-4 mb-8 border" style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <p className="text-xs font-semibold" style={{ color: "#166534" }}>
            You can still apply. Some universities offer conditional admission subject to English proficiency being demonstrated before arrival.
          </p>
        </div>
      )}

      {/* Chinese proficiency */}
      <p className="text-xs font-bold tracking-widest uppercase mb-4 pb-2" style={{ color: "#94A3B8", borderBottom: "1px solid #F1F5F9" }}>
        Chinese proficiency (optional)
      </p>
      <label className="flex items-center gap-2 cursor-pointer mb-5">
        <div
          className="w-10 h-5 rounded-full relative transition-colors"
          style={{ backgroundColor: data.hasChineseProficiency ? "#1B3A6B" : "#CBD5E1" }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
            style={{ left: data.hasChineseProficiency ? "calc(100% - 18px)" : "2px" }}
          />
        </div>
        <input
          type="checkbox"
          className="sr-only"
          checked={data.hasChineseProficiency}
          onChange={(e) => set("hasChineseProficiency", e.target.checked)}
        />
        <span className="text-sm" style={{ color: "#475569" }}>
          I have Chinese language proficiency (HSK / HSKK)
        </span>
      </label>

      {data.hasChineseProficiency && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 border rounded-xl" style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFAFA" }}>
          {/* HSK */}
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: "#1B3A6B" }}>HSK (Written)</p>
            <div className="space-y-3">
              <Field label="HSK level">
                <select value={data.hskLevel} onChange={(e) => set("hskLevel", e.target.value)} className={SELECT_CLS}>
                  <option value="">Select level</option>
                  {HSK_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Score">
                <input type="text" value={data.hskScore} onChange={(e) => set("hskScore", e.target.value)} placeholder="e.g. 245 / 300" className={INPUT_CLS} />
              </Field>
              <Field label="Test date">
                <input type="month" value={data.hskTestDate} onChange={(e) => set("hskTestDate", e.target.value)} className={INPUT_CLS} />
              </Field>
            </div>
          </div>
          {/* HSKK */}
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: "#1B3A6B" }}>HSKK (Speaking — optional)</p>
            <div className="space-y-3">
              <Field label="HSKK level">
                <select value={data.hskkLevel} onChange={(e) => set("hskkLevel", e.target.value)} className={SELECT_CLS}>
                  <option value="">Select level</option>
                  {HSKK_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Score">
                <input type="text" value={data.hskkScore} onChange={(e) => set("hskkScore", e.target.value)} placeholder="e.g. 72 / 100" className={INPUT_CLS} />
              </Field>
              <Field label="Test date">
                <input type="month" value={data.hskkTestDate} onChange={(e) => set("hskkTestDate", e.target.value)} className={INPUT_CLS} />
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
