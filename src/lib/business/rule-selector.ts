// ─────────────────────────────────────────────────────────────────────
// Rule selection.
//
// The rulebook is ~3,500 tokens. Sending all of it on every message wastes the
// owner's budget and buries the model in competing rules — which is what made
// replies repetitive. Core rules always ship; the rest are included only when
// the message touches that topic.
// ─────────────────────────────────────────────────────────────────────

/** Sections that must always be present, by number. */
export const CORE_NUMBERS = new Set(["1", "2", "3", "4", "5", "7", "8", "10", "13", "14"]);

export interface Section {
  title: string;
  body: string;
  /** The original heading line, so it can be re-emitted verbatim. */
  raw?: string;
  /** The number in front of the title, when there is one. */
  num?: string;
}

/** A section starts at a ═══ numbered heading and ends at the next one. */
export function splitSections(prompt: string): Section[] {
  const lines = prompt.split("\n");
  const sections: Section[] = [];
  let cur: Section | null = null;

  for (const line of lines) {
    const m = line.match(/^\u2550+\s*(\d+)\.\s*(.+?)\s*\u2550+\s*$/);
    if (m) {
      if (cur) sections.push(cur);
      cur = { title: `${m[1]}. ${m[2]}`, body: "", raw: line, num: m[1] };
    } else if (cur) {
      cur.body += line + "\n";
    }
  }
  if (cur) sections.push(cur);
  return sections;
}

/**
 * Topics that pull in an otherwise optional section, keyed by section number.
 */
const TRIGGERS: Record<string, RegExp> = {
  // Documents
  "9": /document|ডকুমেন্ট|কাগজ|checklist|transcript|certificate|passport|পাসপোর্ট|ielts|ভিডিও/i,
  // Universities
  "11": /universit|বিশ্ববিদ্যালয়|college|কলেজ|option|অপশন|suggest|সাজেস্ট|কোথায় পড়তে/i,
  // Office and contact
  "12": /office|অফিস|address|ঠিকানা|location|লোকেশন|map|কোথায়|contact|যোগাযোগ|phone|নম্বর|visit|আসতে/i,
  // Grades
  "15": /gpa|\d\.\d{1,2}|result|রেজাল্ট|grade|গ্রেড|hsc|ssc|পাশ|marks/i,
  // Programmes, funding, intake, CSCA
  "16": /diploma|ডিপ্লোমা|bachelor|ব্যাচেলর|master|মাস্টার|phd|program|প্রোগ্রাম|duration|কত বছর|intake|ইনটেক|september|march|csca|scholarship|স্কলারশিপ|language|ভাষা/i,
  // "AI" means the subject
  "6": /\bai\b|এআই/i,
};

/** Sections that are needed on every turn. */
const ALWAYS = new Set(["17", "18", "19"]);

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
    const num = s.num ?? "";
    const trigger = TRIGGERS[num];
    const needsIt =
      CORE_NUMBERS.has(num) || ALWAYS.has(num) || !trigger || trigger.test(message);

    if (needsIt) {
      out += (s.raw ? `${s.raw}\n${s.body}` : s.body);
      included.push(s.title);
    } else {
      dropped.push(s.title);
    }
  }

  // Anything before the first heading is preamble and always kept.
  const firstHeading = prompt.search(/^\u2550+\s*\d+\./m);
  const preamble = firstHeading > 0 ? prompt.slice(0, firstHeading) : "";
  if (preamble && !out.startsWith(preamble)) out = preamble + out;

  return { prompt: out + extraContext, included, dropped };
}
