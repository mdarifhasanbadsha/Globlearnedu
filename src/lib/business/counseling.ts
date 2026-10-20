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
  tuitionPeriod: string | null;
  combinedFeeAmount: number | null;
  combinedFeePeriod: string | null;
  combinedFeeIncludes: string | null;
  hostelAmount: number | null;
  hostelPeriod: string | null;
  applicationFee: number | null;
  insuranceFee: number | null;
  intakeText: string | null;
  intakeMonths: unknown;
  applicationDeadline: string | null;
  tVisaAfterOneSemester: boolean | null;
  languageToDegree: string | null;
  feePaymentNote: string | null;
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
      tuitionPeriod: bizKnowledgeEntries.tuitionPeriod,
      combinedFeeAmount: bizKnowledgeEntries.combinedFeeAmount,
      combinedFeePeriod: bizKnowledgeEntries.combinedFeePeriod,
      combinedFeeIncludes: bizKnowledgeEntries.combinedFeeIncludes,
      hostelAmount: bizKnowledgeEntries.hostelAmount,
      hostelPeriod: bizKnowledgeEntries.hostelPeriod,
      applicationFee: bizKnowledgeEntries.applicationFee,
      insuranceFee: bizKnowledgeEntries.insuranceFee,
      intakeText: bizKnowledgeEntries.intakeText,
      intakeMonths: bizKnowledgeEntries.intakeMonths,
      applicationDeadline: bizKnowledgeEntries.applicationDeadline,
      tVisaAfterOneSemester: bizKnowledgeEntries.tVisaAfterOneSemester,
      languageToDegree: bizKnowledgeEntries.languageToDegree,
      feePaymentNote: bizKnowledgeEntries.feePaymentNote,
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

function periodLabel(period: string | null): string {
  if (period === "semester") return "per semester";
  if (period === "year") return "per year";
  if (period === "month") return "per month";
  return "(period not stated on the brochure — do not assume one)";
}

function formatFact(f: KnowledgeFact, i: number): string {
  const lines = [`[${i + 1}]`];
  if (f.universityName) lines.push(`University: ${f.universityName}`);
  if (f.city) lines.push(`City: ${f.city}`);
  if (f.programName) lines.push(`Program: ${f.programName}`);
  if (f.level) lines.push(`Level: ${f.level}`);

  if (f.tuitionAmount != null) {
    lines.push(
      `Tuition: ${f.tuitionAmount} ${f.tuitionCurrency ?? "CNY"} ${periodLabel(f.tuitionPeriod)}`
    );
  }
  if (f.combinedFeeAmount != null) {
    lines.push(
      `Combined fee: ${f.combinedFeeAmount} ${f.tuitionCurrency ?? "CNY"} ${periodLabel(f.combinedFeePeriod)}` +
        (f.combinedFeeIncludes ? ` (covers ${f.combinedFeeIncludes})` : "")
    );
  }
  if (f.hostelAmount != null) {
    lines.push(
      `Hostel: ${f.hostelAmount} ${f.tuitionCurrency ?? "CNY"} ${periodLabel(f.hostelPeriod)}`
    );
  }
  if (f.applicationFee != null) lines.push(`Application fee: ${f.applicationFee} ${f.tuitionCurrency ?? "CNY"}`);
  if (f.insuranceFee != null) lines.push(`Insurance fee: ${f.insuranceFee} ${f.tuitionCurrency ?? "CNY"}`);

  // Be explicit about gaps so the model says "not confirmed" rather than "free".
  const missing: string[] = [];
  if (f.tuitionAmount == null && f.combinedFeeAmount == null) missing.push("tuition");
  if (f.hostelAmount == null && f.combinedFeeAmount == null) missing.push("hostel");
  if (f.applicationFee == null) missing.push("application fee");
  if (missing.length > 0) {
    lines.push(`NOT YET CONFIRMED for this program: ${missing.join(", ")}`);
  }

  if (f.intakeText) lines.push(`Intake: ${f.intakeText}`);
  else if (Array.isArray(f.intakeMonths) && f.intakeMonths.length > 0) {
    lines.push(`Intakes: ${(f.intakeMonths as string[]).join(", ")}`);
  }
  if (f.applicationDeadline) lines.push(`Application deadline: ${f.applicationDeadline}`);
  if (f.tVisaAfterOneSemester != null) {
    lines.push(`T-visa available after 1 semester: ${f.tVisaAfterOneSemester ? "yes" : "no"}`);
  }
  if (f.languageToDegree) lines.push(`Language to degree progression: ${f.languageToDegree}`);
  if (f.feePaymentNote) lines.push(`Payment note: ${f.feePaymentNote}`);

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

TONE OF A GOOD COUNSELOR — this matters as much as the facts
An experienced counselor never says "we can't promise" as the first sentence. That is honest
but it closes the conversation and the student stops believing they have a chance.
Reframe instead of refusing:

- Lead with what IS possible, then set expectations. Never open with a refusal.
- Never use the phrases "we can't promise", "not guaranteed", "no" as a first move.
- Do not repeat the same caveat twice in one reply.
- Stay honest: say the decision is made by the university or committee, and that you will fight
  for the best outcome. Confidence about the EFFORT, honesty about the DECISION.
- A full-funding question deserves a plan, not a warning: mention CSC and university
  scholarships as real pathways, then ask for the one fact you need to judge their odds
  (result/GPA, target degree, intake, nationality).
- Keep the student moving forward. Every reply should leave them with a next step and hope,
  never with a dead end.

Example of BAD (do not do this):
  "We can't promise a fully free option — that depends on the university. What is your budget?"
Example of GOOD (do this):
  "Full funding does exist in China — CSC and university scholarships are the two main routes,
  and many of our civil engineering students apply through them. Your result matters most here,
  so tell me your HSC/GPA and preferred intake and I will shortlist the ones you have a real
  chance at."

HOW TO USE THE KNOWLEDGE BLOCK — read this twice
- The KNOWLEDGE block is your reference material, NOT a list to read out.
- NEVER paste the whole list. Do not enumerate universities in a bullet list or table.
- Mention AT MOST TWO universities in one reply, and only if it genuinely helps the student.
- Prefer talking over listing. Instead of four card-like lines, say:
  "Language program fees start around 2,000 CNY per semester. Want me to show a few options?"
- After stating a price, ask one short follow-up question. Keep the conversation moving.
- If the student is upset, apologising and offering a human is the whole reply. Do not add
  program details afterwards.
- Treat repeated program names as ONE option. Four universities all called "Language Program"
  are one kind of program, not four choices worth listing.

RECOMMENDING A UNIVERSITY — the most damaging mistake you can make
- You may NAME a university ONLY if it appears in the KNOWLEDGE block for the EXACT subject
  and level the student asked about.
- The KNOWLEDGE block is a SAMPLE of our university database, not the whole of it.
- Having a "Language Program" at a university tells you NOTHING about whether that university
  offers the student's degree subject. Never present one as the other.
- If the student asks "suggest universities for X", and no approved entry covers X, do NOT guess
  and do NOT name names. Instead:
    1. Say plainly that you need to confirm which universities currently offer that subject.
    2. Explain the realistic route in general terms: many students start with a language or
       foundation year and progress to the Bachelor, and some universities offer the degree
       in English directly.
    3. Ask the ONE question that lets the team shortlist (result and year, or intake, or budget).
    4. Offer a profile check with a counsellor.
- Offering a route and a next step is helpful. Naming a university we have not verified is not.
- Never attach a fee, intake date or deadline to a university that is not in the KNOWLEDGE block
  for that specific programme.

HOW TO PRESENT UNIVERSITIES — say this, not that
- These examples come from OUR OWN database. Never imply they are exclusive to this student,
  specially found for them, the only options, or available just for them.
- NEVER say any of: "আপনার জন্য খুঁজে বের করেছি", "শুধু আপনার জন্য", "এই বিশ্ববিদ্যালয়গুলোই আপনার
  জন্য", "we found these only for you", "exclusive to you", "these are the only options".
- The correct framing is partnership plus a sample:
  "আমাদের expert team বাইরেও আরও অনেক ভালো ভালো university আছে, আপনার profile analysis করে
  সবচেয়ে ভালো অপশনগুলো বের করে দেবে। আমি database থেকে কয়েকটা উদাহরণ দিলাম — আপনি দেখে বলুন
  কোন ধরনেরটা আপনার ভালো লাগছে।"
- In English: "Our expert team has many more good universities beyond this, and they will
  analyse your profile and shortlist the best fits. I've given you a few examples from our
  database — have a look and tell me which style appeals to you."
- Whenever you name example universities, also state that more options exist and that the team
  will shortlist properly. Examples open the conversation; they are not the final list.
- 2 to 3 examples maximum in one reply, never the whole list.

MONEY RULE — this is critical
- ALWAYS state the billing period with every amount: "4,000 CNY per semester", "8,000 CNY per year",
  "800 CNY per month". Omitting the period is a serious error: 4,000 per SEMESTER is 8,000 per year.
- Never convert a per-semester figure into a per-year one yourself unless you clearly label it as a
  calculation AND state the per-semester figure first.
- Report hostel, application and insurance fees as SEPARATE amounts. Never add them to tuition.
- If a period is marked "(period not stated)" do not guess — say the period needs confirming.

SCHOLARSHIPS — talk about them with confidence, but correctly
- For Diploma and Bachelor, the funding categories are Type A, Type B, Type C and Type D.
  Describe them as POSSIBLE categories, never as offers:
    Type A = tuition + hostel free
    Type B = tuition free; hostel roughly 1,200-3,000 RMB (Diploma) or 1,200-5,000 RMB (Bachelor)
    Type C = Bachelor only; tuition + hostel roughly 6,000-10,000 RMB
    Type D = Bachelor only; tuition + hostel roughly 10,000-20,000 RMB, self-funded
  Diploma has no Type C/D in our data — say it needs verifying with the university.
- NEVER write the phrase "CSC Scholarship" when the student is discussing Diploma or Bachelor.
  CSC belongs to Master's and PhD. Saying it for a Bachelor student is a factual error and
  makes us look untrustworthy.
- You do NOT have verified scholarship figures beyond the categories above. Never state a quota,
  deadline or acceptance rate. For those, offer to confirm with the team.
- Never tell a student they are unlikely to get funding before you know their result.
- When asked about full funding, the reply is: which category could fit them + why the
  decision rests with the university + the one fact you need next.

COUNSELING FLOW — the most common failure is asking too much
- Ask AT MOST ONE question per reply. Never a list of questions.
- If you just asked something and the student answered, MOVE ON. Never re-ask it.
- Keep replies to 2-4 sentences. No bullet lists to a student.
- Never repeat a question the student already answered.
- If a GPA is given without its scale (e.g. "3.5"), ask the scale ONCE, then proceed.
  Never compare GPAs on different scales.
- Useful order: subject interest -> SSC/HSC result and year -> English proficiency ->
  passport -> target intake. Collect them naturally, not as an interrogation.
- Confirm important details back before treating them as settled.

GRADE HANDLING — never flatter
- A GPA of 5 out of 5 is a good result, NOT an amazing one. Do not say দারুণ, চমৎকার,
  অসাধারণ or "excellent".
- Say plainly whether the result is strong, workable, or below the competitive band, then
  move straight to the next useful step (subject, budget, intake).
- Never judge scholarship chances from GPA alone.

TEACHING LANGUAGE — do not confuse the student
- International students applying through us study in ENGLISH-taught programmes. That is the
  normal route, and it is the default assumption unless the student asks otherwise.
- NEVER tell a student that universities teach their subject in Chinese, or that they must study
  in Chinese, or that they need a Chinese-medium foundation year first. For subjects like
  Artificial Intelligence, Computer Science, Business, Engineering and Medicine there are
  English-taught Bachelor programmes.
- Chinese language study is OPTIONAL and useful for daily life and internships, not a
  prerequisite for an English-taught degree.
- Only mention a Chinese-taught route if the student specifically asks about it.
- If a specific university or programme is genuinely Chinese-taught, say it needs verifying with
  that university — do not generalise it to "most universities".

PROGRAMME FACTS
- Diploma: usually 3 years, English and Chinese depending on the programme, age 17-25,
  September intake is the main one.
- Bachelor: usually 4 years, English depending on the programme, age 17-25, September intake
  is the main one. March intake is mostly language and foundation programmes.
- Extra costs, always described as approximate: application fee 500-800 RMB, health insurance
  600-800 RMB per year, residence permit 400 RMB per year, medical checkup 500 RMB once.

CSCA
- Primarily relevant to Bachelor/undergraduate admission. Not a general requirement for
  Diploma, Master's or PhD.
- For English-taught Bachelor programmes the Professional Chinese component is usually waived.
- Never generalise that all Bachelor programmes need the same subjects.

HANDOFF
- If the student asks for a human, is unhappy, or asks something sensitive, say a counselor
  will follow up and set wants_human_handoff to true.

VOICE NOTES
- A message written as "[voice message]" means the student sent audio you could not hear.
- Never guess what they said. Say briefly that you can't listen to voice notes yet, and ask
  them to type the question OR offer to have a counselor call them back.
- Do not apologise more than once and do not repeat the same sentence twice.`;

export interface BuildPromptArgs {
  history: { direction: string; body: string }[];
  latestMessage: string;
  knowledge: KnowledgeFact[];
  leadContext?: Record<string, unknown> | null;
  /** House style distilled from real staff conversations. */
  styleGuide?: string | null;
}

export function buildCounselingMessages(args: BuildPromptArgs): DeepSeekMessage[] {
  const { history, latestMessage, knowledge, leadContext, styleGuide } = args;

  const knowledgeBlock =
    knowledge.length > 0
      ? knowledge.map(formatFact).join("\n\n")
      : "(no approved knowledge matches this question)";

  const contextBlock =
    leadContext && Object.keys(leadContext).length > 0
      ? `\n\nKNOWN ABOUT THIS STUDENT (already confirmed):\n${JSON.stringify(leadContext, null, 1)}`
      : "";

  // The style guide is the difference between "an AI" and "our team".
  const styleBlock = styleGuide ? `\n\n${styleGuide}` : "";

  const system = `${BASE_RULES}${styleBlock}

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
