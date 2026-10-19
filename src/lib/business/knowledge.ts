// ─────────────────────────────────────────────────────────────
// Knowledge extraction: brochure / image -> structured draft entries.
// Uses DeepSeek vision (deepseek-flash supports image input).
// Extraction output is ALWAYS draft; a human must approve before
// the counseling brain may cite it.
// ─────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `Read this document image carefully and extract every university program you can see.

Return JSON only, no markdown fences:
{
  "university_name": "",
  "city": "",
  "programs": [
    {
      "program_name": "",
      "level": "bachelor|master|phd|language|diploma|foundation|short_course|mbbs",
      "duration": "",
      "teaching_language": "",
      "tuition_amount": null,
      "tuition_currency": "CNY",
      "intake_months": [],
      "application_deadline": "",
      "requirements": {},
      "notes": ""
    }
  ],
  "uncertain": ["list anything unclear, unreadable or ambiguous here"]
}

Rules:
- Copy numbers EXACTLY as printed. Do not round, convert currency, or infer a missing fee.
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
  intake_months?: string[] | null;
  application_deadline?: string | null;
  requirements?: Record<string, unknown> | null;
  notes?: string | null;
}

export interface ExtractionResult {
  university_name: string | null;
  city: string | null;
  programs: ExtractedProgram[];
  uncertain: string[];
}

const LEVELS = new Set([
  "bachelor", "master", "phd", "language", "diploma", "foundation", "short_course", "mbbs",
]);

/** Parse the vision model's JSON, tolerating fences and prose. */
export function parseExtraction(raw: string): ExtractionResult {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const s = cleaned.indexOf("{");
  const e = cleaned.lastIndexOf("}");

  const empty: ExtractionResult = {
    university_name: null,
    city: null,
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

  const programs: ExtractedProgram[] = Array.isArray(obj.programs)
    ? obj.programs.slice(0, 50).map((p: any) => {
        const amount =
          typeof p?.tuition_amount === "number" && Number.isFinite(p.tuition_amount)
            ? Math.round(p.tuition_amount)
            : null;

        const level = str(p?.level)?.toLowerCase() ?? null;

        return {
          program_name: str(p?.program_name),
          level: level && LEVELS.has(level) ? level : null,
          duration: str(p?.duration),
          teaching_language: str(p?.teaching_language),
          tuition_amount: amount,
          tuition_currency: str(p?.tuition_currency)?.toUpperCase().slice(0, 8) ?? null,
          intake_months: Array.isArray(p?.intake_months)
            ? p.intake_months
                .filter((m: unknown) => typeof m === "string")
                .slice(0, 12)
            : [],
          application_deadline: str(p?.application_deadline),
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
    city: str(obj.city),
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
