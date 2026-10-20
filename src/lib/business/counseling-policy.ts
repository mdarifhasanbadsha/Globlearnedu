// ─────────────────────────────────────────────────────────────
// GL Education counseling policy (source: GL_Education_AI_Learning_Chart).
//
// This is the owner's own council rules encoded as hard constraints, not
// soft prompt advice. The model ignored "be conversational" when it was a
// single line among many, so the rules here are:
//   - explicit prohibitions the reply is checked against
//   - a grade-interpretation table so 5/5 is not flattery
//   - a one-question rule
//   - required intake/profile facts
// ─────────────────────────────────────────────────────────────

/** Phrases that must never appear in a reply to a student. */
export const BANNED_PHRASES = [
  "CSC scholarship", // never volunteered for Diploma/Bachelor
  "সিএসসি স্কলারশিপ",
  "guaranteed",
  "guarantee you",
  "নিশ্চিত পাবেন",
  "নিশ্চিতভাবে পাবেন",
  "100% scholarship",
  "সবাই পায়",
  "সবাই পাবে",
];

/** Hollow praise that makes replies feel robotic and insincere. */
export const EMPTY_PRAISE = [
  "দারুণ",
  "চমৎকার",
  "অসাধারণ",
  "খুব ভালো",
  "দুর্দান্ত",
  "great job",
  "excellent",
  "amazing",
  "wonderful",
];

/**
 * How to read a grade WITHOUT flattering the student.
 * A GPA of 5 on a 5 scale is normal-to-good, not "amazing".
 */
export interface GradeReading {
  band: "strong" | "good" | "moderate" | "weak";
  note: string;
}

export function readGrade(value: number, scale: number): GradeReading {
  if (!Number.isFinite(value) || !Number.isFinite(scale) || scale <= 0) {
    return { band: "moderate", note: "result could not be interpreted" };
  }
  const pct = (value / scale) * 100;

  if (pct >= 85) {
    return {
      band: "strong",
      note: "a strong result for scholarship consideration; competition is still the deciding factor",
    };
  }
  if (pct >= 70) {
    return {
      band: "good",
      note: "a workable result; subject choice and English level matter as much as the number",
    };
  }
  if (pct >= 55) {
    return {
      band: "moderate",
      note: "below the competitive band for top funding; realistic options still exist",
    };
  }
  return {
    band: "weak",
    note: "funding will be difficult; focus on self-funded or lower-cost routes",
  };
}

/**
 * Rules derived from the owner's chart. Kept as data so the lab and the
 * live prompt cannot drift apart.
 */
export const COUNSELING_RULES = `GL EDUCATION COUNSELING POLICY — these are binding, not suggestions.

WHO YOU ARE
You are a friendly, practical student counsellor for GL Education. You talk like a person
in a Messenger chat: simple Bangla (or the student's language), short, warm, specific.

QUESTION DISCIPLINE — the most common failure
- Ask AT MOST ONE question per reply. Never a list of questions.
- Never repeat a question the student already answered.
- If you just asked something and they answered, MOVE ON. Do not ask it again.
- If their answer is ambiguous, resolve it in one short question, then proceed.

GRADE HANDLING — never flatter
- A GPA of 5 out of 5 is a good result, NOT an amazing one. Do not say দারুণ / চমৎকার /
  অসাধারণ / extremely good.
- State plainly whether the result is strong, workable, or below the competitive band.
- Immediately continue to the next useful step: subject, budget, or intake.
- If a number is given without a scale, ask the scale ONCE, then never again.
- Never judge scholarship chances from GPA alone.

SCHOLARSHIP — strict
- NEVER write the phrase "CSC Scholarship" when discussing Diploma or Bachelor.
  CSC is for Master's and PhD. Mentioning it here is a factual error.
- Speak only of funding CATEGORIES: Type A (tuition + hostel free), Type B (tuition free,
  hostel 1,200-3,000 Diploma / 1,200-5,000 Bachelor RMB), Type C (tuition + hostel
  6,000-10,000 Bachelor), Type D (10,000-20,000 Bachelor, self-funded). Diploma has no
  Type C/D in our data - say it must be verified with the university.
- These are POSSIBLE categories, never guaranteed offers.
- Never promise admission, visa, scholarship, or an exact cost.

PROGRAMME FACTS
- Diploma: usually 3 years, English and Chinese depending on programme, age 17-25.
- Bachelor: usually 4 years, English depending on programme, age 17-25.
- September intake is the main one for both; March intake is mostly language and foundation.
- Application fee 500-800 RMB; insurance 600-800 RMB/year; residence permit 400 RMB/year;
  medical checkup 500 RMB once. Say these are approximate.

CSCA
- Primarily relevant to Bachelor/undergraduate admission.
- Not a general requirement for Diploma, Master's or PhD.
- For English-taught Bachelor, the Professional Chinese component is usually waived.
- Never generalise "all Bachelor needs the same subjects".

PROFILE INTAKE — collect naturally, not as an interrogation
Needed eventually: age, SSC GPA + passing year, HSC GPA + passing year, preferred subject,
English proficiency, passport status, target intake.
Ask for them one at a time as the conversation allows.

REQUIRED CLOSING BEHAVIOUR
- Every reply ends by moving the conversation ONE step forward.
- If the student has given enough detail, offer a profile check / free counselling.
- Keep replies to 2-4 sentences. No bullet lists to a student in Messenger.`;

/** Objective check of a reply against the policy. */
export interface PolicyViolation {
  rule: string;
  detail: string;
}

export function checkReplyPolicy(
  reply: string,
  opts: { level?: string | null; question?: string | null } = {}
): PolicyViolation[] {
  const out: PolicyViolation[] = [];
  const lower = reply.toLowerCase();

  for (const p of BANNED_PHRASES) {
    if (lower.includes(p.toLowerCase())) {
      out.push({ rule: "banned_phrase", detail: p });
    }
  }

  // CSC only belongs in Master/PhD conversations.
  const level = (opts.level ?? "").toLowerCase();
  const isUnderGrad = level.includes("diploma") || level.includes("bachelor");
  if (isUnderGrad && /csc\b/i.test(reply) && !/csca/i.test(reply)) {
    out.push({ rule: "csc_in_undergraduate", detail: "CSC mentioned for Diploma/Bachelor" });
  }

  // Multiple questions in one reply.
  const qMarks = (reply.match(/[?？]/g) ?? []).length;
  if (qMarks > 1) {
    out.push({ rule: "multiple_questions", detail: `${qMarks} questions in one reply` });
  }

  // Hollow praise.
  const praise = EMPTY_PRAISE.filter((w) => reply.includes(w));
  if (praise.length > 0) {
    out.push({ rule: "empty_praise", detail: praise.join(", ") });
  }

  // Bullet lists read like a brochure, not a chat.
  if (/^\s*[-•*]\s+/m.test(reply) || /^\s*\d+\.\s+/m.test(reply)) {
    out.push({ rule: "bullet_list", detail: "reply is a list, not a chat message" });
  }

  // International students take English-taught programmes. Claiming the
  // subject is taught in Chinese, or that a Chinese foundation year comes
  // first, is wrong and scares students off.
  const chineseMedium =
    /(most|many|usually|generally)\s+universities\s+teach[^.]*in\s+chinese/i.test(reply) ||
    /teach(es)?\s+(it|this|the subject)\s+in\s+chinese/i.test(reply) ||
    /\b(chinese[- ]medium|chinese-taught)\s+(is\s+)?(required|necessary|mandatory)/i.test(reply) ||
    /চীনা?\s*ভাষায়\s*(পড়া|পড়ানো|পড়াশোনা)\s*(লাগবে|প্রয়োজন|বাধ্যতামূলক)/.test(reply) ||
    /(বেশিরভাগ|অধিকাংশ)\s*বিশ্ববিদ্যালয়ে?\s*চীনা/.test(reply);
  if (chineseMedium) {
    out.push({ rule: "chinese_medium_claim", detail: "implied Chinese-taught is the norm" });
  }

  return out;
}
