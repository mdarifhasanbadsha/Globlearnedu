import { Upload, CheckCircle2, FileText } from "lucide-react";
import type { FormData } from "../types";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void };

type DocDef = {
  id: string;
  name: string;
  desc: string;
  required: boolean;
  condition?: "china" | "engtest" | "hsk" | "master_phd" | "language_hide";
};

const DOCUMENTS: DocDef[] = [
  { id: "passport", name: "Passport data page", desc: "Scan of the photo/data page only — not the full passport.", required: true },
  { id: "photo", name: "Passport-size photo", desc: "Recent, white background, formal dress. JPG only.", required: true },
  { id: "certificate", name: "Highest academic certificate", desc: "Degree certificate or high school diploma.", required: true },
  { id: "transcript", name: "Academic transcript", desc: "Official transcript showing all grades.", required: true },
  { id: "police", name: "Police clearance certificate", desc: "From your home country, issued within 6 months.", required: true },
  { id: "medical", name: "Physical examination report", desc: "From a recognised medical centre. Globlearn Education can provide the form.", required: true },
  { id: "bank", name: "Bank statement", desc: "Showing minimum $5,000 USD equivalent. Issued within 3 months.", required: true },
  { id: "english_cert", name: "English proficiency certificate", desc: "IELTS / TOEFL / Duolingo etc. — required if you selected a test in Step 6.", required: false },
  { id: "hsk_cert", name: "Chinese proficiency certificate (HSK)", desc: "HSK certificate — if applicable.", required: false },
  { id: "rec1", name: "Recommendation letter 1", desc: "Required for Master's and PhD. Must be from a Professor or academic supervisor.", required: false },
  { id: "rec2", name: "Recommendation letter 2", desc: "Required for Master's and PhD. Second academic reference.", required: false },
  { id: "intro_video", name: "Self-introduction video link", desc: "2–3 minute video introducing yourself. YouTube or Google Drive link. Optional but recommended.", required: false },
  { id: "equivalency", name: "Equivalency / ECA report", desc: "Required for some countries. Globlearn Education will advise if needed.", required: false },
  { id: "visa_copy", name: "Current visa / residence permit copy", desc: "Required if you are currently in China (Step 7).", required: false, condition: "china" },
  { id: "enrollment", name: "Current enrollment letter", desc: "Required if currently a student in China.", required: false, condition: "china" },
];

export default function Step8Documents({ data, onChange }: Props) {
  function handleFile(docId: string, file: File | null) {
    if (!file) return;
    onChange({ documents: { ...data.documents, [docId]: file.name } });
  }

  const visibleDocs = DOCUMENTS.filter((doc) => {
    if (doc.condition === "china" && !data.inChina) return false;
    return true;
  });

  const uploaded = Object.keys(data.documents).length;
  const requiredDocs = visibleDocs.filter((d) => d.required);
  const uploadedRequired = requiredDocs.filter((d) => data.documents[d.id]).length;

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>Upload your documents</h2>
      <p className="text-sm mb-3" style={{ color: "#64748B" }}>
        All documents must be clear, complete and in PDF or JPG format. Maximum 5MB per file.
      </p>

      {/* Progress */}
      <div className="flex items-center gap-3 p-4 rounded-xl border mb-8" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
          style={{ backgroundColor: uploadedRequired === requiredDocs.length && requiredDocs.length > 0 ? "#16A34A" : "#1B3A6B" }}
        >
          {uploaded}
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
            {uploaded} document{uploaded !== 1 ? "s" : ""} uploaded
          </p>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            {uploadedRequired} of {requiredDocs.length} required documents uploaded
          </p>
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {visibleDocs.map((doc) => {
          const uploaded = !!data.documents[doc.id];
          return (
            <div
              key={doc.id}
              className="flex items-start gap-4 p-4 rounded-xl border transition-colors"
              style={{
                borderColor: uploaded ? "#BBF7D0" : "#E2E8F0",
                backgroundColor: uploaded ? "#F0FDF4" : "white",
              }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {uploaded ? (
                  <CheckCircle2 size={20} style={{ color: "#16A34A" }} />
                ) : (
                  <FileText size={20} style={{ color: "#94A3B8" }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-bold leading-snug" style={{ color: "#1B3A6B" }}>
                    {doc.name}
                  </p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: doc.required ? "#FEF2F2" : "#F1F5F9",
                      color: doc.required ? "#C8102E" : "#64748B",
                    }}
                  >
                    {doc.required ? "Required" : "Optional"}
                  </span>
                  {doc.condition === "china" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
                      In China only
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: "#64748B" }}>{doc.desc}</p>
                {uploaded && (
                  <p className="text-xs mt-1 font-medium" style={{ color: "#16A34A" }}>
                    ✓ {data.documents[doc.id]}
                  </p>
                )}
              </div>

              {/* Upload button */}
              <label className="flex-shrink-0 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) => handleFile(doc.id, e.target.files?.[0] ?? null)}
                />
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors"
                  style={{
                    borderColor: uploaded ? "#BBF7D0" : "#E2E8F0",
                    backgroundColor: uploaded ? "#DCFCE7" : "white",
                    color: uploaded ? "#166534" : "#475569",
                  }}
                >
                  <Upload size={12} />
                  {uploaded ? "Replace" : "Upload"}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {/* Info callout */}
      <div className="rounded-xl p-4 mt-6 border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FFD70040" }}>
        <p className="text-xs font-semibold" style={{ color: "#92610A" }}>
          💡 Can't upload a document right now? You can save your progress and return later. Your application will not be submitted until you click &lsquo;Submit&rsquo; in Step 9.
        </p>
      </div>
    </div>
  );
}
