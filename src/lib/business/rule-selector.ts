// ─────────────────────────────────────────────────────────────────────
// Rule selection.
//
// The full counselling prompt is ~5,800 tokens. Sending it on every message
// burned the owner's API budget and — more importantly — buried the model in
// 28 competing rule sections, which is what made replies repetitive and
// robotic.
//
// Core rules always ship. Everything else is included only when the student's
// message actually touches that topic, so the prompt stays short and the
// rules that matter are the ones the model can see.
// ─────────────────────────────────────────────────────────────────────

/** Sections that must always be present. */
export const CORE_SECTIONS = new Set([
  "WHO YOU ARE",
  "LANGUAGE",
  "GROUNDING",
  "COUNSELING FLOW",
  "HANDOFF",
  "SOUND LIKE A PERSON",
  "NEVER SEND A BROKEN",
  "EXTRACTION RULE",
  // Not topic-specific: never inventing a benefit applies to every business
  // answer, and getting it wrong costs a student real money.
  "NEVER INVENT A FACILITY",
  "PAYMENT POLICY",
]);

export interface Section {
  title: string;
  body: string;
  /** Included when the message matches any of these. */
  triggers?: RegExp;
}

/**
 * Split a prompt into titled sections. A section starts at a line beginning
 * with an ALL-CAPS title and ends at the next one.
 */
export function splitSections(prompt: string): Section[] {
  const lines = prompt.split("\n");
  const sections: Section[] = [];
  let cur: Section | null = null;

  for (const line of lines) {
    const m = line.match(/^([A-Z][A-Z0-9 ,\-—\/'’]{3,})(?:$| —)/);
    if (m && line.length < 90) {
      if (cur) sections.push(cur);
      cur = { title: m[1].trim(), body: "" };
    } else if (cur) {
      cur.body += line + "\n";
    }
  }
  if (cur) sections.push(cur);
  return sections;
}

/** Topics that pull in an otherwise optional section. */
const TRIGGERS: Record<string, RegExp> = {
  "DOCUMENT CHECKLISTS": /document|documents|ডকুমেন্ট|কাগজ|checklist|transcript|certificate|passport|পাসপোর্ট|ভিসা|visa|ielts|ভিডিও/i,
  "GL EDUCATION SERVICE CHARGES": /charge|fee|ফি|খরচ|taka|টাকা|price|package|প্যাকেজ|service|সার্ভিস|payment|পেমেন্ট|cost|budget|বাজেট|file|ফাইল|opening|ওপেনিং|চার্জ/i,
  "OFFICE, ADDRESS AND CONTACT": /office|অফিস|address|ঠিকানা|location|লোকেশন|map|where|কোথায়|contact|যোগাযোগ|phone|নম্বর|visit|আসতে/i,
  "MONEY RULE": /fee|tuition|hostel|টাকা|taka|cny|rmb|semester|yearly|বছর|সেমিস্টার|cost|খরচ|payment/i,
  "SCHOLARSHIPS": /scholarship|স্কলারশিপ|fund|funding|free|ফ্রি|type a|type b|type c|type d|টাকা লাগবে না|বিনা খরচ/i,
  "DOCUMENT": /document|ডকুমেন্ট|কাগজ|checklist/i,
  "CSCA": /csca/i,
  "GRADE HANDLING": /gpa|\d\.\d{1,2}|result|রেজাল্ট|grade|গ্রেড|hsc|ssc|পাশ|marks/i,
  "TEACHING LANGUAGE": /language|ভাষা|english|চীনা|chinese medium|ইংরেজি|medium/i,
  "PROGRAMME FACTS": /diploma|bachelor|master|phd|program|প্রোগ্রাম|duration|কত বছর|intake|ইনটেক|september|march/i,
  "RECOMMENDING A UNIVERSITY": /universit|বিশ্ববিদ্যালয়|কোন কলেজ|college|option|অপশন|suggest|সাজেস্ট|কোথায় পড়তে/i,
  "HOW TO PRESENT UNIVERSITIES": /universit|বিশ্ববিদ্যালয়|option|অপশন|suggest/i,
  "HOW TO USE THE KNOWLEDGE BLOCK": /universit|tuition|fee|intake|deadline|knowledge/i,
  "VOICE NOTES": /\[voice message\]/i,
  "REPLYING TO AN OLDER MESSAGE": /./,
  "SEVERAL SHORT MESSAGES AT ONCE": /./,
};

/**
 * Build the system prompt for one message: core sections plus only the
 * optional sections this message actually needs.
 */
export function selectPromptSections(
  prompt: string,
  message: string,
  extraContext = ""
): { prompt: string; included: string[]; dropped: string[] } {
  const sections = splitSections(prompt);
  const included: string[] = [];
  const dropped: string[] = [];

  let out = "";
  for (const s of sections) {
    const titleKey = s.title.split(" —")[0].trim();
    const isCore = [...CORE_SECTIONS].some((k) => titleKey.startsWith(k));
    const trigger = TRIGGERS[titleKey];
    const needsIt = isCore || !trigger || trigger.test(message);

    if (needsIt) {
      out += (s.title ? `${s.title}${s.body}` : s.body);
      included.push(titleKey);
    } else {
      dropped.push(titleKey);
    }
  }

  // Anything before the first titled section is preamble and always kept.
  const firstTitle = prompt.search(/^[A-Z][A-Z0-9 ,\-—\/'’]{3,}(?:$| —)/m);
  const preamble = firstTitle > 0 ? prompt.slice(0, firstTitle) : "";
  if (!out.startsWith(preamble) && preamble) out = preamble + out;

  return { prompt: out + extraContext, included, dropped };
}
