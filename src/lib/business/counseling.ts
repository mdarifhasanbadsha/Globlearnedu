// ─────────────────────────────────────────────────────────────
// Counseling brain: prompt construction, grounding, extraction.
// The AI may ONLY cite approved knowledge from biz_knowledge_entries.
// Existing app data (universities/programs) is deliberately not used.
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizKnowledgeEntries } from "@/lib/db/schema.business2";
import { eq, and, desc } from "drizzle-orm";
import type { DeepSeekMessage } from "@/lib/business/deepseek";

export interface KnowledgeFact {
  universityName: string | null;
  city: string | null;
  programName: string | null;
  level: string | null;
  tuitionAmount: number | null;
  tuitionCurrency: string | null;
  intakeMonths: unknown;
  applicationDeadline: string | null;
  requirements: unknown;
}

/** Load a bounded slice of APPROVED knowledge relevant to the visitor. */
export async function loadApprovedKnowledge(
  businessId: string,
  query: string,
  limit = 12
): Promise<KnowledgeFact[]> {
  const rows = await db
    .select({
      universityName: bizKnowledgeEntries.universityName,
      city: bizKnowledgeEntries.city,
      programName: bizKnowledgeEntries.programName,
      level: bizKnowledgeEntries.level,
      tuitionAmount: bizKnowledgeEntries.tuitionAmount,
      tuitionCurrency: bizKnowledgeEntries.tuitionCurrency,
      intakeMonths: bizKnowledgeEntries.intakeMonths,
      applicationDeadline: bizKnowledgeEntries.applicationDeadline,
      requirements: bizKnowledgeEntries.requirements,
    })
    .from(bizKnowledgeEntries)
    .where(
      and(
        eq(bizKnowledgeEntries.businessId, businessId),
        eq(bizKnowledgeEntries.status, "approved")
      )
    )
    .orderBy(desc(bizKnowledgeEntries.updatedAt))
    .limit(limit);

  if (rows.length === 0) return [];

  // Cheap relevance filter: prefer rows sharing a token with the query.
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9\u0980-\u09FF]+/)
    .filter((t) => t.length > 3);

  if (tokens.length === 0) return rows;

  const scored = rows.map((r) => {
    const hay = [
      r.universityName,
      r.city,
      r.programName,
      r.level,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const score = tokens.reduce((n, t) => (hay.includes(t) ? n + 1 : n), 0);
    return { r, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.r);
}

function formatFact(f: KnowledgeFact, i: number): string {
  const lines = [`[${i + 1}]`];
  if (f.universityName) lines.push(`University: ${f.universityName}`);
  if (f.city) lines.push(`City: ${f.city}`);
  if (f.programName) lines.push(`Program: ${f.programName}`);
  if (f.level) lines.push(`Level: ${f.level}`);
  if (f.tuitionAmount != null) {
    lines.push(`Tuition: ${f.tuitionAmount} ${f.tuitionCurrency ?? ""}`.trim());
  }
  if (Array.isArray(f.intakeMonths) && f.intakeMonths.length > 0) {
    lines.push(`Intakes: ${(f.intakeMonths as string[]).join(", ")}`);
  }
  if (f.applicationDeadline) lines.push(`Deadline: ${f.applicationDeadline}`);
  const req = f.requirements;
  if (req && typeof req === "object" && Object.keys(req as object).length > 0) {
    lines.push(`Requirements: ${JSON.stringify(req)}`);
  }
  return lines.join("\n");
}

const BASE_RULES = `You are the counseling assistant for GL Education, a Study in China consultancy.

LANGUAGE
- Reply in the language the student used: Bangla, English, or Banglish.
- Be warm, concise and respectful. Use neutral phrasing; never guess a person's gender from their name.

GROUNDING — this is strict
- You may state facts about universities, programs, tuition, intakes and deadlines ONLY from the
  KNOWLEDGE block below. This is verified, owner-approved data.
- If the KNOWLEDGE block has no entry for what the student asked, say you need to verify it with
  the team and offer to have a counselor confirm. Never invent universities, fees, deadlines,
  scholarships or requirements.
- Never guarantee: admission, scholarship approval, visa approval, or a specific start date.
- Visa matters are guidance only; the Chinese Embassy decides.
- Never quote a tuition figure without stating the currency exactly as given.

COUNSELING FLOW
- Collect, one question at a time, in a natural order: degree level -> subject area ->
  budget -> GPA with its scale -> preferred intake -> nationality.
- Ask at most ONE question per reply. Keep replies short (2-4 sentences) unless asked for detail.
- If a GPA is given without its scale (e.g. "3.5"), ask which scale it is out of (4 or 5 or other).
  Never compare GPAs on different scales.
- Confirm important details back before treating them as settled.
- Do not repeat a question the student already answered.

HANDOFF
- If the student asks for a human, is unhappy, or asks something sensitive, say a counselor
  will follow up and set wants_human_handoff to true.`;

export interface BuildPromptArgs {
  history: { direction: string; body: string }[];
  latestMessage: string;
  knowledge: KnowledgeFact[];
  leadContext?: Record<string, unknown> | null;
}

export function buildCounselingMessages(args: BuildPromptArgs): DeepSeekMessage[] {
  const { history, latestMessage, knowledge, leadContext } = args;

  const knowledgeBlock =
    knowledge.length > 0
      ? knowledge.map(formatFact).join("\n\n")
      : "(no approved knowledge matches this question)";

  const contextBlock =
    leadContext && Object.keys(leadContext).length > 0
      ? `\n\nKNOWN ABOUT THIS STUDENT (already confirmed):\n${JSON.stringify(leadContext, null, 1)}`
      : "";

  const system = `${BASE_RULES}

KNOWLEDGE (verified, owner-approved — the ONLY source of program facts):
${knowledgeBlock}${contextBlock}

Respond with a single JSON object only, no markdown fences and no prose outside it:
{"reply": "<your reply to the student>", "wants_human_handoff": false, "extracted": {"full_name": "", "phone": "", "email": "", "degree_level": "", "subject_interest": "", "gpa_value": null, "gpa_scale": null, "budget_amount": null, "budget_currency": "", "intake_target": "", "language_test": "", "nationality": ""}}

EXTRACTION RULE — important:
- Fill "extracted" from everything the student has told you in this conversation so far,
  not just the latest message. If they said "3.8 out of 4" earlier, keep gpa_value 3.8 and
  gpa_scale 4 in every later response.
- Never drop a value you already reported. Ask at most one question in "reply", but return
  ALL known fields each time.
- Omit fields the student has not clearly provided. Never guess a phone number or name.
- Only set gpa_value/gpa_scale together. Only set budget_amount when a currency is clear.`;

  const convo: DeepSeekMessage[] = history.slice(-16).map((m) => ({
    role: (m.direction === "out" ? "assistant" : "user") as "assistant" | "user",
    content: m.body,
  }));

  return [
    { role: "system", content: system },
    ...convo,
    { role: "user", content: latestMessage },
  ];
}

export interface ParsedReply {
  reply: string;
  wantsHumanHandoff: boolean;
  extracted: Record<string, unknown>;
}

/** Regex fallback: "3.8 out of 4", "GPA 4.5/5", "CGPA: 3.2 on a 4 point scale". */
function regexGpa(text: string): { gpa_value?: number; gpa_scale?: number } {
  const m =
    text.match(/(?:gpa|cgpa|grade)[^\d]{0,12}(\d{1,2}(?:\.\d{1,2})?)\s*(?:out of|\/|on|from)\s*(\d{1,2}(?:\.\d{1,2})?)/i) ??
    text.match(/(\d\.\d{1,2})\s*(?:out of|\/)\s*(\d(?:\.\d)?)/i);
  if (!m) return {};
  const value = Number(m[1]);
  const scale = Number(m[2]);
  if (!Number.isFinite(value) || !Number.isFinite(scale)) return {};
  if (value < 0 || scale <= 0 || value > scale) return {};
  return { gpa_value: value, gpa_scale: scale };
}

/** Parse the model's JSON, tolerating fences or stray prose. */
export function parseCounselingReply(raw: string, studentText = ""): ParsedReply {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  const regexFields = regexGpa(studentText);

  const fallback: ParsedReply = {
    reply: cleaned.trim(),
    wantsHumanHandoff: /human|counselor|agent|staff/i.test(cleaned) && /follow ?up|connect/i.test(cleaned),
    extracted: regexFields,
  };

  if (start === -1 || end === -1 || end <= start) return fallback;

  try {
    const obj = JSON.parse(cleaned.slice(start, end + 1));
    const reply = typeof obj.reply === "string" ? obj.reply.trim() : "";
    if (reply.length === 0) return fallback;

    const extracted =
      obj.extracted && typeof obj.extracted === "object" ? { ...obj.extracted } : {};

    // Deterministic backstop: if the model omitted a clearly-stated GPA,
    // recover it from the student's own words rather than losing the data.
    if (extracted.gpa_value == null && regexFields.gpa_value != null) {
      extracted.gpa_value = regexFields.gpa_value;
      extracted.gpa_scale = regexFields.gpa_scale;
    }

    return {
      reply,
      wantsHumanHandoff: obj.wants_human_handoff === true,
      extracted,
    };
  } catch {
    return fallback;
  }
}

/** Only accept values that look sane; never store a guessed phone. */
export function sanitizeExtracted(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  const str = (v: unknown, max: number): string | null => {
    if (typeof v !== "string") return null;
    const t = v.trim();
    return t.length > 0 && t.length <= max ? t : null;
  };
  const num = (v: unknown, min: number, max: number): number | null => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) && n >= min && n <= max ? n : null;
  };

  const name = str(input.full_name, 200);
  if (name) out.full_name = name;

  const phone = str(input.phone, 40);
  // Require at least 7 digits to avoid capturing stray numbers.
  if (phone && (phone.match(/\d/g) ?? []).length >= 7) out.phone = phone;

  const email = str(input.email, 255);
  if (email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) out.email = email;

  for (const [k, max] of [
    ["degree_level", 50],
    ["subject_interest", 200],
    ["budget_currency", 8],
    ["intake_target", 50],
    ["language_test", 100],
    ["nationality", 100],
  ] as const) {
    const v = str(input[k], max);
    if (v) out[k] = v;
  }

  // GPA must always be paired with a scale to be storable.
  const gpaValue = num(input.gpa_value, 0, 100);
  const gpaScale = num(input.gpa_scale, 0, 100);
  if (gpaValue != null && gpaScale != null) {
    out.gpa_value = gpaValue;
    out.gpa_scale = gpaScale;
  }

  const budget = num(input.budget_amount, 1, 100_000_000);
  if (budget != null) out.budget_amount = budget;

  return out;
}
