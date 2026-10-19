// ─────────────────────────────────────────────────────────────
// Knowledge extraction: brochure / image -> structured draft entries.
// Uses DeepSeek vision (deepseek-flash supports image input).
// Extraction output is ALWAYS draft; a human must approve before
// the counseling brain may cite it.
// ─────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `Read this document image carefully and extract every university and program you can see.

Return JSON only, no markdown fences:
{
  "university_name": "",
  "university_name_cn": "",
  "city": "",
  "province": "",
  "university_type": "Public|Private|",
  "programs": [
    {
      "program_name": "",
      "level": "bachelor|master|phd|language|diploma|foundation|short_course|mbbs",
      "duration": "",
      "teaching_language": "",
      "tuition_amount": null,
      "tuition_currency": "CNY",
      "tuition_period": "semester|year|month|",
      "hostel_amount": null,
      "hostel_period": "semester|year|month|",
      "application_fee": null,
      "insurance_fee": null,
      "intake_text": "",
      "intake_months": [],
      "application_deadline": "",
      "t_visa_after_one_semester": null,
      "language_to_degree": "",
      "fee_payment_note": "",
      "requirements": {},
      "notes": ""
    }
  ],
  "uncertain": ["list anything unclear, unreadable or ambiguous here"]
}

Rules:
- Copy numbers EXACTLY as printed. Do not round, convert currency, or infer a missing fee.
- "tuition_period" MUST reflect what the page says: "/Semester" -> "semester", "/Year" -> "year",
  "/Month" -> "month". Never assume a period. This matters enormously — saying 4000 per YEAR when
  the brochure says 4000 per SEMESTER understates the cost by half.
- Copy intake and deadline text verbatim into intake_text / application_deadline, including the year.
  Do not reformat dates.
- Include hostel, application and insurance fees as separate numbers WITHOUT adding them to tuition.
- If a value is not visible on the page, use null or "" — never guess.
- Put anything you are unsure about in "uncertain" so a human can check it.
- Do not invent programs, scholarships, deadlines or requirements.`;

export interface ExtractedProgram {
  program_name?: string | null;
  level?: string | null;
  duration?: string | null;
  teaching_language?: string | null;
  tuition_amount?: number | null;
  tuition_currency?: string | null;
  tuition_period?: string | null;
  hostel_amount?: number | null;
  hostel_period?: string | null;
  application_fee?: number | null;
  insurance_fee?: number | null;
  intake_text?: string | null;
  intake_months?: string[] | null;
  application_deadline?: string | null;
  t_visa_after_one_semester?: boolean | null;
  language_to_degree?: string | null;
  fee_payment_note?: string | null;
  requirements?: Record<string, unknown> | null;
  notes?: string | null;
}

export interface ExtractionResult {
  university_name: string | null;
  university_name_cn: string | null;
  city: string | null;
  province: string | null;
  university_type: string | null;
  programs: ExtractedProgram[];
  uncertain: string[];
}

const LEVELS = new Set([
  "bachelor", "master", "phd", "language", "diploma", "foundation", "short_course", "mbbs",
]);

const PERIODS = new Set(["semester", "year", "month"]);

/** Parse the vision model's JSON, tolerating fences and prose. */
export function parseExtraction(raw: string): ExtractionResult {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const s = cleaned.indexOf("{");
  const e = cleaned.lastIndexOf("}");

  const empty: ExtractionResult = {
    university_name: null,
    university_name_cn: null,
    city: null,
    province: null,
    university_type: null,
    programs: [],
    uncertain: ["Could not parse the model output — review the source manually."],
  };

  if (s === -1 || e === -1 || e <= s) return empty;

  let obj: any;
  try {
    obj = JSON.parse(cleaned.slice(s, e + 1));
  } catch {
    return empty;
  }

  const str = (v: unknown): string | null =>
    typeof v === "string" && v.trim().length > 0 ? v.trim() : null;

  const int = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.round(v) : null;

  const period = (v: unknown): string | null => {
    const p = str(v)?.toLowerCase() ?? null;
    return p && PERIODS.has(p) ? p : null;
  };

  const programs: ExtractedProgram[] = Array.isArray(obj.programs)
    ? obj.programs.slice(0, 50).map((p: any) => {
        const level = str(p?.level)?.toLowerCase() ?? null;

        return {
          program_name: str(p?.program_name),
          level: level && LEVELS.has(level) ? level : null,
          duration: str(p?.duration),
          teaching_language: str(p?.teaching_language),
          tuition_amount: int(p?.tuition_amount),
          tuition_currency: str(p?.tuition_currency)?.toUpperCase().slice(0, 8) ?? null,
          tuition_period: period(p?.tuition_period),
          hostel_amount: int(p?.hostel_amount),
          hostel_period: period(p?.hostel_period),
          application_fee: int(p?.application_fee),
          insurance_fee: int(p?.insurance_fee),
          intake_text: str(p?.intake_text),
          intake_months: Array.isArray(p?.intake_months)
            ? p.intake_months
                .filter((m: unknown) => typeof m === "string")
                .slice(0, 12)
            : [],
          application_deadline: str(p?.application_deadline),
          t_visa_after_one_semester:
            typeof p?.t_visa_after_one_semester === "boolean"
              ? p.t_visa_after_one_semester
              : null,
          language_to_degree: str(p?.language_to_degree),
          fee_payment_note: str(p?.fee_payment_note),
          requirements:
            p?.requirements && typeof p.requirements === "object" && !Array.isArray(p.requirements)
              ? p.requirements
              : {},
          notes: str(p?.notes),
        };
      })
    : [];

  return {
    university_name: str(obj.university_name),
    university_name_cn: str(obj.university_name_cn),
    city: str(obj.city),
    province: str(obj.province),
    university_type: str(obj.university_type),
    programs,
    uncertain: Array.isArray(obj.uncertain)
      ? obj.uncertain.filter((u: unknown) => typeof u === "string").slice(0, 20)
      : [],
  };
}

import type { DeepSeekMessage } from "@/lib/business/deepseek";

export function buildVisionMessages(dataUrl: string, title: string): DeepSeekMessage[] {
  return [
    {
      role: "system",
      content:
        "You extract structured program data from education brochures. " +
        "Accuracy matters far more than completeness. Never guess a number.",
    },
    {
      role: "user",
      content: [
        { type: "text", text: `${EXTRACTION_PROMPT}\n\nDocument title: ${title}` },
        { type: "image_url", image_url: { url: dataUrl } },
      ],
    },
  ];
}

export { EXTRACTION_PROMPT };
