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
 * Never imply the listed universities are exclusive to this student.
 * Examples come from our database; the team shortlists more options.
 */
export const EXCLUSIVITY_PHRASES = [
  "শুধু আপনার জন্য",
  "আপনার জন্যই",
  "আপনার জন্য খুঁজে বের করেছি",
  "এইগুলোই আপনার",
  "only for you",
  "exclusive to you",
  "these are the only options",
  "found these just for you",
  "specially for you",
  "only these universities",
  "no other options",
];

/**
 * The document checklist is fixed. Extra notes and the wrong currency are
 * both defects: they change what the student thinks they must prepare.
 */
export function checkDocumentList(reply: string): PolicyViolation[] {
  const out: PolicyViolation[] = [];
  const isDocList = /ডকুমেন্ট|document|কাগজ/i.test(reply) && /[০-৯\d]+\.\s/.test(reply);
  if (!isDocList) return out;

  if (/মূল কপি|ইংরেজি অনুবাদ|notariz|attest|translat/i.test(reply)) {
    out.push({ rule: "document_note_added", detail: "added a copy/translation note" });
  }
  if (/\bUSD\b|\$|dollar|ডলার/i.test(reply)) {
    out.push({ rule: "wrong_currency", detail: "bank statement must be in RMB" });
  }
  return out;
}

/**
 * A counsellor does not introduce themselves as software. Saying "I am an
 * AI" ends the illusion of a conversation and reads as a helpdesk bot.
 * This checks the shop window, not the ethics: if asked directly whether
 * they are human, the AI still answers honestly.
 */
export function checkSelfReveal(reply: string, question?: string | null): PolicyViolation[] {
  const out: PolicyViolation[] = [];

  const askedIfHuman = /(?:are you|are u|tu?mi)\s*(?:a\s*)?(?:human|manush|রোবট|robot)|মানুষ তো|তুমি কি মানুষ/i.test(
    question ?? ""
  );

  // Only flag unprompted self-description as software.
  if (!askedIfHuman) {
    const reveal =
      /আমি (?:একটি|একটা)?\s*(?:AI|এআই|রোবট|বট|চ্যাটবট|ভার্চুয়াল)|as an AI|I am an AI|I'm an AI|I am a bot|I'm a bot|language model|কৃত্রিম বুদ্ধিমত্তা হিসেবে|আমি শুধু একটা প্রোগ্রাম/i;
    const m = reply.match(reveal);
    if (m) out.push({ rule: "self_reveal", detail: m[0] });
  }

  // Referring to instructions the student cannot see.
  const meta =
    /(?:আমার|আমাকে)\s*(?:যে )?(?:নির্দেশনা|নিয়ম|গাইডলাইন|ইনস্ট্রাকশন)|(?:my|the)\s+(?:instructions|guidelines|system prompt)|KNOWLEDGE block/i;
  const mm = reply.match(meta);
  if (mm) out.push({ rule: "meta_reference", detail: mm[0] });

  return out;
}

/**
 * A price answered as a bare number reads like a shopkeeper, not a counsellor.
 * The reply must give the figure AND say what it covers, so the number means
 * something to the student.
 */
export function checkPriceQuality(reply: string, question?: string | null): PolicyViolation[] {
  const out: PolicyViolation[] = [];
  const askedPrice = /fee|ফি|খরচ|charge|চার্জ|টাকা|taka|price|cost|কত/i.test(question ?? "");
  if (!askedPrice) return out;

  const hasAmount = /[০-৯]{2,3}[,\u066C]?[০-৯]{3}|\d{2,3},\d{3}/.test(reply);
  if (!hasAmount) return out;

  const givesContext =
    /সার্ভিস|service|অন্তর্ভুক্ত|includes?|আবেদন|application|ভিসা|visa|পুরো|support|সাপোর্ট|সহায়তা/i.test(
      reply
    );
  const asksAboutThem =
    /চাচ্ছেন|ভাবছেন|আগ্রহী|কোন প্রোগ্রাম|কোন লেভেল|কবে|intake|plan|পরিকল্পনা/i.test(reply);

  if (!givesContext) {
    out.push({ rule: "bare_price", detail: "quoted a number without saying what it covers" });
  }
  if (!asksAboutThem) {
    out.push({ rule: "no_interest", detail: "did not ask anything about the student" });
  }

  return out;
}


/**
 * The student must never hear how we store information.
 *
 * "আমাদের ডেটাবেসে নেই" tells them nothing useful and reveals that a machine
 * is reading a table. A person would say the team will confirm it.
 */
const INTERNAL_WORDS =
  /ডেটাবেস|database|আমাদের রেকর্ড|our records|এন্ট্রি নেই|no entry|সিস্টেমে|in the system|আমার কাছে নেই|আমার কাছে আছে|নোট করে রেখেছি/i;

export function checkNoInternals(reply: string): PolicyViolation[] {
  const m = reply.match(INTERNAL_WORDS);
  if (m) {
    return [{ rule: "mentions_internals", detail: m[0] }];
  }
  return [];
}


/**
 * "We have nothing for you" loses the student on the spot.
 *
 * The sample the model is given is not our whole database, so an absent
 * university means "not in this excerpt", never "we cannot help". The honest
 * and useful sentence is that we have many good options and the team will give
 * the details. Blocking the dead-end wording is safer than trusting each reply
 * to phrase it well.
 */
const DEAD_END =
  /(?:এন্ট্রি\s*নেই|এন্ট্রি\s*নাই|তথ্য\s*নেই\s*—|আমাদের\s*কাছে\s*নেই|কোনো\s*অপশন\s*নেই|কোনো\s*বিশ্ববিদ্যালয়\s*নেই|no\s+options|do(?:es)?\s+not\s+have\s+(?:any|that)|nothing\s+available|we\s+have\s+nothing)/i;

export function checkNoDeadEnd(reply: string): PolicyViolation[] {
  const m = reply.match(DEAD_END);
  return m ? [{ rule: "dead_end_wording", detail: m[0] }] : [];
}

/**
 * A wall of university names is unreadable and makes a student pick blindly.
 * At most three examples, never the whole database — which is also a resource
 * leak, because the list is much of the value in what we know.
 */
export function checkUniversityListLength(reply: string): PolicyViolation[] {
  const out: PolicyViolation[] = [];
  const re = new RegExp(KNOWN_UNIVERSITY_PATTERN.source, "g");
  const names = new Set(
    (reply.match(re) ?? []).map((n) => n.toLowerCase().replace(/\s+/g, " "))
  );
  if (names.size > 3) {
    out.push({ rule: "too_many_universities", detail: `named ${names.size}` });
  }
  return out;
}

/** Naming universities must come with "there are many more" framing. */
export const MORE_OPTIONS_HINT =
  /আরও|অনেক|বেশি|বাইরে|analysis|analyze|shortlist|team|counselor|counsellor|expert|verify|যাচাই|বিশ্লেষণ|টিম/i;

// The only official contact details. Anything else is an invention.
export const OFFICE = {
  address:
    "House No. 1, Road No. 14, Nikunjo-2, Khilkhet, Dhaka-1229, Bangladesh",
  phone: "+8801901923239",
  maps: "https://maps.app.goo.gl/pi4P5j9KHKSib8va6",
};

// Any phone-like number that is not the official one.
const PHONE_LIKE = /\+?8?8?0?1\d{9}|\+?\d{11,15}/g;

/**
 * Catch an invented phone number, a wrong address or a made-up Maps link.
 * The AI is told to copy these exactly, so drifting is a real defect.
 */
export function checkContactAccuracy(reply: string): PolicyViolation[] {
  const out: PolicyViolation[] = [];

  const digits = (s: string) => s.replace(/[^\d]/g, "");

  for (const m of reply.match(PHONE_LIKE) ?? []) {
    const d = digits(m);
    // 5-digit or smaller strings are prices, years or counts, not phones.
    if (d.length < 10) continue;
    if (digits(OFFICE.phone).endsWith(d) || d.endsWith(digits(OFFICE.phone))) continue;
    out.push({ rule: "wrong_phone", detail: m });
  }

  // A maps link that differs from ours. The pattern must not swallow a
  // trailing sentence full stop, or every correct link looks like a typo.
  const linkRe = /https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.[a-z.]+)\/[^\s)<>"'।]*/gi;
  for (const m of reply.match(linkRe) ?? []) {
    const clean = m.replace(/[.,;]+$/, "");
    if (clean !== OFFICE.maps && !clean.startsWith(OFFICE.maps)) {
      out.push({ rule: "wrong_maps_link", detail: clean });
    }
  }

  return out;
}

/**
 * Promises about when a human will respond. We do not control the
 * counsellor's schedule, so a specific day or time must never be given.
 */
export const TIMED_PROMISE = [
  /কাল(?!ক)/, // কাল = tomorrow (but not কালক = calculating)
  /আগামীকাল/,
  /আজ\s*সন্ধ্যায়/,
  /সন্ধ্যার\s*মধ্যে/,
  /১\s*ঘণ্টার\s*মধ্যে/,
  /এক\s*ঘণ্টার\s*মধ্যে/,
  /\b(?:tomorrow|tonight|this evening|by tonight)\b/i,
  /\bwithin\s+(?:an?\s+)?(?:hour|1|one|2|two|30|10|15)\s*(?:minutes?|hours?)?\b/i,
  /\b(?:at|by)\s+\d{1,2}\s*(?::\d{2})?\s*(?:am|pm|টায়|টার)\b/i,
  /\b\d{1,2}\s*(?:am|pm)\b/i,
];

/**
 * The honest way to set expectations: team busy, contact soon, no clock.
 */
export const BUSY_DISCLOSURE =
  /busy|ব্যস্ত|একটু\s*সময়|অল্প\s*সময়ের\s*মধ্যে|শীঘ্রই|দ্রুত|as\s*soon\s*as\s*possible|soon/i;

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
  opts: {
    level?: string | null;
    question?: string | null;
    allowedUniversities?: string[] | null;
    /** True once the student has already shared a phone number. */
    numberAlreadyKnown?: boolean;
  } = {}
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
  // A numbered list is CORRECT when the student asked for a checklist.
  // It is only wrong when they were simply chatting.
  const askedForList =
    /document|requirement|checklist|কি কি|কী কী|ডকুমেন্ট|কাগজ|কাগজপত্র|তালিকা|paper/i.test(
      opts.question ?? ""
    );
  // `\d` does not match Bangla numerals, so the range is explicit.
  const hasListLine = /^\s*(?:[-•*]|[\d\u09E6-\u09EF]+[.)])\s+/m.test(reply);
  if (!askedForList && hasListLine) {
    out.push({ rule: "bullet_list", detail: "reply is a list, not a chat message" });
  }

  // Claiming the options are exclusive to this student, or that they are
  // the only ones available. The team always shortlists more.
  const exclusive = EXCLUSIVITY_PHRASES.filter((p) =>
    reply.toLowerCase().includes(p.toLowerCase())
  );
  if (exclusive.length > 0) {
    out.push({ rule: "exclusive_claim", detail: exclusive.join(", ") });
  }

  // Name universities without saying more options exist.
  if (KNOWN_UNIVERSITY_PATTERN.test(reply) && !MORE_OPTIONS_HINT.test(reply)) {
    out.push({
      rule: "missing_more_options",
      detail: "named universities without saying the team has many more",
    });
  }

  // Promising a human will call on a specific day or at a specific time.
  // We cannot control the counsellor's schedule, and a missed promise costs
  // more trust than an honest "soon".
  const timed = TIMED_PROMISE.find((rx) => rx.test(reply));
  if (timed) {
    out.push({ rule: "timed_promise", detail: String(timed) });
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

  // Naming a university requires an approved entry for that exact subject.
  // The caller passes the universities it is allowed to mention.
  if (opts.allowedUniversities && opts.allowedUniversities.length === 0) {
    const named = KNOWN_UNIVERSITY_PATTERN.test(reply);
    if (named) {
      out.push({
        rule: "unverified_university",
        detail: "named a university with no approved knowledge for this question",
      });
    }
  }

  // Contact details must be exactly ours.
  out.push(...checkContactAccuracy(reply));
  out.push(...checkSelfReveal(reply, opts.question));
  out.push(...checkDocumentList(reply));
  out.push(...checkPriceQuality(reply, opts.question));
  out.push(...checkUniversityListLength(reply));
  out.push(...checkNoInternals(reply));
  out.push(...checkNoDeadEnd(reply));

  // Repeating "your number is with us" after it was already given reads
  // like a call-centre script and the student stops reading.
  const repeatNumber =
    /আপনার\s*নম্বর(?:টা|টি)?\s*(?:আমাদের\s*কাছে|নিয়ে\s*নিচ্ছি|পেয়ে\s*গেছি)|your\s*number\s*(?:is|has been)\s*(?:with us|noted|saved)/i;
  if (repeatNumber.test(reply) && opts.numberAlreadyKnown) {
    out.push({ rule: "repeated_number_mention", detail: "number offered again after being given" });
  }

  return out;
}

/**
 * A university name in a reply. Used only to detect names the model was
 * not entitled to produce, so it errs toward catching too much.
 */
export const KNOWN_UNIVERSITY_PATTERN =
  /\b(?:[A-Z][A-Za-z'’.-]*\s+){0,4}(?:University|Institute|College|Polytechnic|Academy)\b(?: of [A-Z][A-Za-z ]+)?/;
