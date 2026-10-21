// ─────────────────────────────────────────────────────────────────────
// Reply enforcement.
//
// One place that applies every policy rule and, when a reply breaks one,
// produces a safe replacement instead of sending it.
//
// This exists because the rules were being written but never executed: the
// policy module had seventeen checks and neither the web widget nor Messenger
// called it. That is how "আমাদের ডেটাবেসে ... নেই" kept reaching students for a
// week after it was banned.
// ─────────────────────────────────────────────────────────────────────

import { checkReplyPolicy, type PolicyViolation } from "@/lib/business/counseling-policy";

export interface Enforcement {
  reply: string;
  violations: PolicyViolation[];
  /** True when the original reply was replaced. */
  replaced: boolean;
}

/**
 * Fallbacks for the violations a student must never see. Each is written to be
 * warm and useful on its own, because it replaces an answer they asked for.
 */
const FALLBACKS: Record<string, string> = {
  mentions_internals:
    "এই বিষয়ে বিস্তারিতটা আমাদের টিম আপনাকে জানিয়ে দেবে ভাইয়া 🙂 আরও কিছু জানতে চাইলে বলুন।",
  dead_end_wording:
    "আমাদের কাছে চায়নায় অনেক ভালো ভালো university আর program আছে ভাইয়া — আপনার লেভেল আর সাবজেক্ট অনুযায়ী যেগুলো সবচেয়ে ভালো, সেগুলোর বিস্তারিত আমাদের team member আপনাকে জানাবে। চাইলে আপনার contact number-টা এখানে রেখে যেতে পারেন।",
  self_reveal:
    "আমি GL Education-এর কাউন্সেলর টিমের একজন 🙂 চায়নায় পড়াশোনা নিয়ে আপনাকে সাহায্য করাই আমার কাজ।",
  too_many_universities:
    "আমাদের টিম আপনার প্রোফাইল দেখে সবচেয়ে ভালো কয়েকটা অপশন বের করে জানিয়ে দেবে ভাইয়া 🙂 আরও কিছু জানতে চাইলে বলুন।",
  repeated_number_mention:
    "ঠিক আছে ভাইয়া 🙂 আরও কিছু জানতে চাইলে বলুন।",
  // A price answer with only our fee would read as the cost of studying in
  // China. Replace it with the complete picture, lowest figures first.
};

/** A general replacement when no specific fallback exists. */
const GENERIC_FALLBACK =
  "একটু ভেবে বলি ভাইয়া — আপনি ঠিক কী জানতে চান, সেটা একবার বলবেন? 🙂";


/**
 * Has this exact answer already been sent in this conversation?
 *
 * The owner's test found the same paragraph coming back when a student asked
 * twice ("khoroch kemon?" then "taka koto lagbe?"). Repeating yourself is the
 * clearest sign of a machine, so a duplicate is replaced with a short line that
 * moves the conversation forward instead.
 */
export function isRepeated(reply: string, earlierReplies: string[]): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

  const now = norm(reply);
  if (now.length < 25) return false;

  return earlierReplies.some((r) => {
    const before = norm(r);
    if (!before) return false;
    if (before === now) return true;
    // Near-duplicate: most of the words overlap.
    const a = new Set(now.split(" "));
    const b = new Set(before.split(" "));
    let shared = 0;
    for (const w of a) if (b.has(w)) shared++;
    const ratio = shared / Math.max(a.size, b.size);
    return ratio > 0.85;
  });
}

/** What to send instead of a duplicate. */
export const DUPLICATE_INSTEAD =
  "একই কথা আবার বললাম না ভাইয়া 🙂 উপরের উত্তরটা কি কাজে লাগছে? আর কিছু জানতে চাইলে বলুন — অথবা চাইলে আপনার contact number-টা এখানে রেখে যেতে পারেন, আমাদের একজন ফ্রিতে 1:1 counselling-এ বিস্তারিত কথা বলে দেবেন।";

/**
 * Apply policy to a reply.
 *
 * Only violations that would genuinely harm the student replace the text.
 * Style issues such as a slightly long list are reported but allowed through,
 * because swapping a good answer for a generic one is worse than a small
 * imperfection.
 */
/** The language-course fee, since a language question has no tuition term. */
function languageHint(question: string | null | undefined): string {
  const q = (question ?? "").toLowerCase();
  if (/language|চীনা ভাষা|ভাষা|chinese course/.test(q)) {
    return (
      "চায়না ল্যাঙ্গুয়েজ প্রোগ্রামের টিউশন শুরু হয় প্রতি সেমিস্টারে প্রায় ২,০০০ CNY থেকে, " +
      "হোস্টেল প্রায় ৩০০ CNY প্রতি মাসে।"
    );
  }
  return (
    "টিউশন শুরু হয় প্রতি সেমিস্টারে প্রায় ২,০০০ CNY থেকে, আর হোস্টেল প্রায় ৩০০ CNY থেকে প্রতি মাসে।"
  );
}

/** The complete cost answer, shaped by what was actually asked. */
function costFallback(question: string | null | undefined): string {
  const q = (question ?? "").toLowerCase();
  const languageOnly = /language|চীনা ভাষা|ভাষা|chinese course/.test(q);

  const tuitionLine = languageOnly
    ? "চায়না ল্যাঙ্গুয়েজ প্রোগ্রামের টিউশন শুরু হয় প্রতি সেমিস্টারে প্রায় ২,০০০ CNY থেকে, হোস্টেল প্রায় ৩০০ CNY প্রতি মাসে।"
    : "টিউশন শুরু হয় প্রতি সেমিস্টারে প্রায় ২,০০০ CNY থেকে, আর হোস্টেল প্রায় ৩০০ CNY থেকে প্রতি মাসে।";

  const serviceLine = languageOnly
    ? "আমাদের সার্ভিস চার্জ আলাদা — ৬ মাসের ল্যাঙ্গুয়েজ কোর্সে ৬৯,০০০ টাকা, ১ বছরে ৯৯,০০০ টাকা।"
    : "আমাদের সার্ভিস চার্জ আলাদা — Diploma/Bachelor-এ ৯৯,০০০ টাকা, যাতে আবেদন থেকে ভিসা পর্যন্ত পুরো কাজটা আমরা দেখি।";

  const closing = languageOnly
    ? "আপনি কি ৬ মাসের কোর্স ভাবছেন নাকি ১ বছরের?"
    : "আপনি কোন লেভেলে আর কোন সাবজেক্টে পড়তে চান?";

  return (
    "চায়নায় পড়াশোনা ভাবনার চেয়ে অনেক বেশি affordable ভাইয়া 🙂\n\n" +
    tuitionLine +
    " এর বাইরে application fee, insurance আর medical checkup মিলিয়ে একবারে প্রায় ২,০০০–২,৫০০ CNY লাগে। " +
    serviceLine +
    "\n\n" +
    closing
  );
}

export function enforceReply(
  reply: string,
  opts: {
    level?: string | null;
    question?: string | null;
    allowedUniversities?: string[] | null;
    numberAlreadyKnown?: boolean;
  } = {}
): Enforcement {
  const violations = checkReplyPolicy(reply, opts);
  if (violations.length === 0) {
    return { reply, violations, replaced: false };
  }

  // Priority matters. A reply that withheld the numbers the student asked
  // for must be replaced by one that supplies them, even if it also trips a
  // wording rule — otherwise a generic "the team will tell you" wins and the
  // student still has no answer. This happened in production: a language-fee
  // question was answered with the team line and every figure disappeared.
  const PRIORITY = [
    "cost_incomplete",
    "too_many_universities",
    "mentions_internals",
    "dead_end_wording",
    "self_reveal",
    "repeated_number_mention",
  ];

  const ordered = [...violations].sort(
    (a, b) => PRIORITY.indexOf(a.rule) - PRIORITY.indexOf(b.rule)
  );

  // First violation with a dedicated fallback wins, in priority order.
  for (const v of ordered) {
    const fb = v.rule === "cost_incomplete" ? costFallback(opts.question) : FALLBACKS[v.rule];
    if (fb) {
      console.log(`[policy] replaced reply for ${v.rule} (${v.detail ?? ""})`);
      return { reply: fb, violations, replaced: true };
    }
  }

  // Violations with no fallback are recorded and the reply is sent unchanged.
  // Silently blanking a real answer would leave the student worse off.
  for (const v of violations) {
    console.log(`[policy] noted ${v.rule} (${v.detail ?? ""}) — reply kept`);
  }
  return { reply, violations, replaced: false };
}
