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

export function isUsableReply(reply: string, studentText: string): QualityVerdict {
  const text = reply.trim();

  if (text.length === 0) return { ok: false, reason: "empty" };

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
