// ─────────────────────────────────────────────────────────────────────
// Reply quality gate.
//
// A wrong or empty reply is worse than making the student wait. These
// checks run after the model answers and before anything is sent, and they
// target the specific failures seen in production:
//
//   "আহেন ভাই"            — a fragment, not an answer
//   "GL Education যান"    — a broken half-sentence
//   repeating the student — parroting instead of answering
// ─────────────────────────────────────────────────────────────────────

export interface QualityVerdict {
  ok: boolean;
  reason?: string;
}

/** Words that only make sense inside a longer sentence. */
const DANGLING_ENDINGS = [
  "যান",
  "যান।",
  "করুন",
  "করেন",
  "ভাইয়া।",
  "bhaya",
  "vaiya",
];

const FILLER_ONLY = /^(?:আহেন|আছেন|ok|okay|হুম|হ্যা|হ্যাঁ|ঠিক আছে|ভালো|ধন্যবাদ|thanks|thank you|got it|noted)[\s।.!?]*$/i;

/**
 * Talking about being an AI, a model, or one's own technical details.
 *
 * This is not merely untidy — it ends the conversation. A student told
 * "আমার মডেল বা টেকনিক্যাল ডিটেইলস আমার কাছে নেই" stops treating us as a
 * counsellor and starts probing the software. In production one thread sent
 * that same sentence fourteen times because every reply mentioned the model.
 */
export const SELF_REVEAL =
  /(?:আমার|মডেলের|টেকনিক্যালের|আমাদের)\s*(?:নিজের\s*)?(?:মডেল|টেকনিক্যাল\s*ডিটেইলস|প্রোগ্রাম|সিস্টেম)|আমি\s*(?:নিজের|আমার|একটি|একটা)?\s*(?:মডেল|টেকনিক্যাল|AI|এআই|রোবট|বট|চ্যাটবট|কাউন্সেলিং\s*অ্যাসিস্ট্যান্ট)|কাউন্সেলিং\s*অ্যাসিস্ট্যান্ট|(?:GL\s*Education\s*)?Assistant\b|counseling\s*assistant|as an AI|I(?:'m| am) an AI|language model|techn(?:ical)?\s*details|আমার\s*প্রোগ্রামিং/i;

/**
 * Blaming the student for repetition. They did not repeat anything — our own
 * reply was re-ingested, or we answered twice. Saying this to them is the
 * rudest thing this system has done.
 */
export const BLAMES_STUDENT =
  /(?:মেসেজটা|মেসেজটি|মেসেজ)\s*(?:বারবার|কয়েকবার|একাধিকবার)?\s*(?:কপি|রিপিট|repeat|duplicate)|আপনি\s*(?:বারবার|একই\s*কথা)\s*(?:লিখেছেন|বলেছেন|করেছেন)|you (?:repeated|sent|typed) (?:the )?(?:same|it)|duplicate message/i;

/** The calm exit when a conversation stops being productive. */
export const REST_REPLY =
  "ভাইয়া, আমি এখানে চায়নায় পড়াশোনার ব্যাপারে সাহায্য করার জন্য আছি — এখন মনে হচ্ছে আমার উত্তরগুলো আপনার কাজে লাগছে না। আপনি চাইলে সরাসরি কল বা WhatsApp করতে পারেন: +8801901923239, ওখানে আমাদের টিম বিস্তারিতভাবে সাহায্য করতে পারবে। 🙏";

/**
 * Anything that is clearly not a study-in-China question but asks for real
 * work: writing code, the weather, our CEO, browsing a website.
 */
export const IRRELEVANT_TASK =
  /(?:python|javascript|java|php|code|coding|program(?:me)?\s*(?:ta|lekho|de|din)|script|hack|brute\s*force)/i;

export function isUsableReply(reply: string, studentText: string): QualityVerdict {
  const text = reply.trim();

  if (text.length === 0) return { ok: false, reason: "empty" };

  // Talking about being software ends the counselling relationship.
  if (SELF_REVEAL.test(text)) return { ok: false, reason: "self_reveal" };

  // Never blame the student for repetition.
  if (BLAMES_STUDENT.test(text)) return { ok: false, reason: "blames_student" };

  // Too short to be a real answer. Genuine short replies still carry a verb
  // or a question mark, so length alone is not the only test.
  if (text.length < 12 && !/[?？]/.test(text)) {
    return { ok: false, reason: "too short" };
  }

  if (FILLER_ONLY.test(text)) return { ok: false, reason: "filler only" };

  // A reply ending on a dangling imperative is a truncated sentence.
  for (const d of DANGLING_ENDINGS) {
    if (new RegExp(`\\s${d.slice(0, -1)}\\s*[।.!?]?$`).test(text)) {
      return { ok: false, reason: `dangling ending "${d}"` };
    }
  }

  // Parroting the student's own message back.
  const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
  const student = norm(studentText);
  if (student.length > 6 && norm(text) === student) {
    return { ok: false, reason: "echoes the student" };
  }

  // No letters at all (punctuation, emoji only).
  if (!/[a-zA-Z\u0980-\u09FF]/.test(text)) {
    return { ok: false, reason: "no text" };
  }

  // Repeated sentence, which usually means the model stalled.
  const sentences = text.split(/[।.!?\n]+/).map((s) => s.trim()).filter((s) => s.length > 15);
  if (sentences.length >= 2) {
    const uniq = new Set(sentences);
    if (uniq.size === 1) return { ok: false, reason: "same sentence repeated" };
  }

  return { ok: true };
}

/**
 * Too formal Bangla that reads like a government form, not a counsellor.
 * The model reverts to this under pressure, so it is corrected after.
 */
const STIFF_PHRASES: [RegExp, string][] = [
  [/আপনার একাডেমিক ব্যাকগ্রাউন্ডটা? শেয়ার করবেন/gi, "আপনার রেজাল্টটা বলবেন"],
  [/একাডেমিক ব্যাকগ্রাউন্ড/gi, "রেজাল্ট"],
  [/শেয়ার করবেন প্লিজ/gi, "বলবেন"],
  [/অনুগ্রহ করে/g, ""],
];

export function softenBangla(reply: string): string {
  let out = reply;
  for (const [rx, to] of STIFF_PHRASES) out = out.replace(rx, to);
  return out.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Make a reply read cleanly in a chat bubble.
 *
 * The model regularly produces "করুন।আপনি" or "CNY/year.Tell me" — a
 * missing space after a sentence end runs two thoughts together, which is
 * what "messages not using proper spaces" looks like on the phone.
 */
export function formatForChat(reply: string): string {
  let out = reply.replace(/\r\n/g, "\n");

  // Protect URLs first. The sentence-spacing rule below would turn
  // "https://maps.app.goo.gl/x" into "https://maps. app. goo. gl/x",
  // which is a broken link — invisible until a student taps it.
  const urls: string[] = [];
  out = out.replace(/https?:\/\/[^\s)<>"'।]+/g, (m) => {
    urls.push(m);
    return `\u0000URL${urls.length - 1}\u0000`;
  });

  // Missing space after sentence-ending punctuation when a letter follows.
  // Bangla danda (।), Latin full stop, and question/exclamation marks.
  out = out.replace(/([।.!?])(?=[\u0980-\u09FFA-Za-z])/g, "$1 ");

  // Space before punctuation that should hug the previous word.
  out = out.replace(/\s+([।,.!?])/g, "$1");

  // Collapse any run of horizontal whitespace.
  out = out.replace(/[ \t]{2,}/g, " ");

  // A long single block is hard to read: split into short paragraphs at
  // sentence boundaries when there is no newline at all.
  if (!out.includes("\n") && out.replace(/\u0000URL\d+\u0000/g, "").length > 220) {
    const sentences = out.split(/(?<=[।.!?])\s+/);
    const chunks: string[] = [];
    let cur = "";
    for (const s of sentences) {
      if (cur.length + s.length > 180 && cur.length > 0) {
        chunks.push(cur.trim());
        cur = "";
      }
      cur += (cur ? " " : "") + s;
    }
    if (cur.trim()) chunks.push(cur.trim());
    out = chunks.join("\n\n");
  }

  // Tidy spacing at line boundaries.
  out = out
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Restore every URL exactly as the model produced it.
  out = out.replace(/\u0000URL(\d+)\u0000/g, (_, i) => urls[Number(i)] ?? "");

  return out;
}
