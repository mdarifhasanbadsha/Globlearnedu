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
export function isRepeated(
  reply: string,
  earlierReplies: string[],
  currentQuestion?: string | null,
  earlierQuestions?: string[] | null
): boolean {
  // Comparing the TEXT alone was wrong: three different questions — intake,
  // file opening, a repeat of cost — all received "I won't repeat myself"
  // because the answers happened to share wording with an earlier one. A
  // duplicate only matters when the student is genuinely asking the same thing.
  if (earlierReplies.length === 0) return false;

  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

  const now = norm(reply);
  if (now.length < 25) return false;

  const words = (s: string) => new Set(norm(s).split(" ").filter(Boolean));
  const overlap = (x: Set<string>, y: Set<string>) => {
    let shared = 0;
    for (const w of x) if (y.has(w)) shared++;
    return shared / Math.max(x.size, y.size, 1);
  };

  // If we cannot see the earlier questions, we cannot tell whether this is a
  // repeat — and guessing "yes" replaced live answers with "I won't repeat
  // myself", including a first-time "CST te kon university ache?". Absent
  // evidence, let the answer through.
  if (!currentQuestion || !earlierQuestions || earlierQuestions.length === 0) {
    return false;
  }

  const q = words(currentQuestion);
  const askedSame = earlierQuestions.some((e) => overlap(q, words(e)) > 0.6);
  if (!askedSame) return false;

  return earlierReplies.some((r) => {
    const before = norm(r);
    if (!before) return false;
    if (before === now) return true;
    return overlap(words(reply), words(r)) > 0.85;
  });
}

/** What to send instead of a duplicate. */
/**
 * What to send instead of a repeat.
 *
 * The previous wording — "একই কথা আবার বললাম না ভাইয়া" — drew attention to the
 * repetition and sounded like a machine scolding the student. A person who has
 * already answered simply says something short and moves on.
 */
export const DUPLICATE_INSTEAD =
  "একটু ভাঙিয়ে বলি ভাইয়া 🙂 আপনি ঠিক কোন বিষয়টা জানতে চান — খরচ, কোন বিশ্ববিদ্যালয়, নাকি ডকুমেন্ট? " +
  "যেটা দরকার সেটাই বলব।";

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

/** The reassuring opener used when a first cost answer jumped to figures. */
function reassuranceFallback(question: string | null | undefined): string {
  const q = (question ?? "").toLowerCase();
  const language = /language|চীনা ভাষা|ভাষা|chinese course/.test(q);

  if (language) {
    return (
      "চায়না ল্যাঙ্গুয়েজ প্রোগ্রামের খরচ ভাবনার চেয়ে অনেক কম, ভাইয়া 🙂 " +
      "টিউশন, হোস্টেল আর কয়েকটা একবারের খরচের মধ্যে ভাগ হয়, আর পুরো প্রসেসে আমরা পাশে থাকি।\n\n" +
      "আপনি কি ৬ মাসের কোর্স ভাবছেন, নাকি ১ বছরের? সেটা বললে বাস্তব একটা ধারণা দিতে পারব।"
    );
  }

  return (
    "চায়নায় পড়াশোনা ভাবনার চেয়ে অনেক বেশি affordable ভাইয়া 🙂 " +
    "খরচটা মূলত টিউশন, হোস্টেল আর কয়েকটা একবারের খরচের মধ্যে ভাগ হয়, আর পুরো প্রসেসে আমরা পাশে থাকি।\n\n" +
    "আপনি কোন লেভেলে আর কোন সাবজেক্টে পড়তে চান? সেই অনুযায়ী বাস্তব একটা ধারণা দিতে পারব।"
  );
}

/**
 * Used when an answer explained why something might not be possible.
 *
 * The replacement keeps whatever useful content the reply had and re-frames the
 * uncertainty as a next step, so the student leaves with a route rather than a
 * closed door.
 */
function hopeFallback(original: string): string {
  // Strip the sentences that carry the doubt; keep the rest if it has substance.
  const sentences = original
    .split(/(?<=[।.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  const hopeful = sentences.filter(
    (s) =>
      !/(?:নিশ্চিত\s*করে\s*বলতে\s*পারছি\s*না|নিশ্চিত\s*নই|আমার\s*কাছে\s*নেই|জানা\s*নেই|কলেজভেদে\s*আলাদা|i\s*cannot\s*confirm|cannot\s*confirm)/i.test(
        s
      )
  );

  const kept = hopeful.join(" ").trim();

  return (
    (kept.length > 40 ? kept + "\n\n" : "") +
    "তবে চিন্তার কিছু নেই ভাইয়া 🙂 আপনার প্রোফাইলটা দেখে আমাদের টিম যেসব কলেজে আপনার জন্য ভালো সুযোগ আছে " +
    "সেগুলো বেছে দেবে, আর কী কী করলে অপশন আরও বাড়বে সেটাও জানাবে। " +
    "চাইলে আপনার contact number-টা এখানে রেখে যেতে পারেন — আমাদের একজন ফ্রিতে 1:1 counselling-এ বিস্তারিত বলে দেবেন।"
  );
}

/** What March funding actually is, when the model oversold it. */
function marchFundingFallback(): string {
  return (
    "মার্চ ইনটেকে বেশিরভাগ ক্ষেত্রে **partial scholarship** ভাইয়া — টিউশন আর হোস্টেলের একটা অংশ " +
    "আপনাকে দিতে হয়, বাকিটা বিশ্ববিদ্যালয় বহন করে।\n\n" +
    "সম্পূর্ণ ফ্রি টিউশন আর হোস্টেলের প্যাকেজ সাধারণত সেপ্টেম্বর ইনটেকের সাথে আসে, আর সেটা " +
    "প্রতিযোগিতামূলক। মার্চে যেটা পাওয়া যায় সেটা আংশিক — এটা জানা থাকলে হিসাবটা পরিষ্কার হয়।\n\n" +
    "আপনার প্রোফাইল অনুযায়ী মার্চে কতটা পাওয়া যাবে, সেটা আমাদের টিম যাচাই করে জানাবে — " +
    "চাইলে আপনার contact number-টা এখানে রেখে যেতে পারেন।"
  );
}


/**
 * The same question, asked again and again.
 *
 * When a student repeats a question the duplicate guard replaced the answer with
 * a short line — sensible once. Sending that line four times to four identical
 * messages is worse than the repetition it was meant to prevent: the thread reads
 * like a machine arguing with itself.
 *
 * The second time, answer the question properly. Our service charge does not
 * depend on anything we have failed to look up, so repeating it is correct and
 * useful; it was only the long generic paragraph that needed avoiding.
 */
export function repeatedAnswerFallback(question: string | null | undefined): string {
  const q = (question ?? "").toLowerCase();

  if (/language|\u09b2\u09cd\u09af\u09be\u0999\u09cd\u0997\u09c1\u09df\u09c7\u099c|\u09ad\u09be\u09b7\u09be/.test(q)) {
    return (
      "ভাইয়া, চীনা ল্যাঙ্গুয়েজ কোর্সের সার্ভিস চার্জ ৬ মাসে ৬৯,০০০ টাকা, ১ বছরে ৯৯,০০০ টাকা 🙂 " +
      "টিউশন আর হোস্টেল এর বাইরে, সেটা বিশ্ববিদ্যালয়ভেদে আলাদা। " +
      "৬ মাস না ১ বছর — কোনটা ভাবছেন?"
    );
  }
  if (/khoroch|\u0996\u09b0\u099a|fee|\u09ab\u09bf|cost|taka|\u099f\u09be\u0995\u09be/.test(q)) {
    return (
      "ভাইয়া, Diploma আর Bachelor-এ আমাদের সার্ভিস চার্জ ৯৯,০০০ টাকা, Master's-এ ১,২০,০০০ টাকা 🙂 " +
      "টিউশন শুরু প্রতি সেমিস্টারে প্রায় ২,০০০ CNY থেকে, হোস্টেল মাসে ৩০০ CNY থেকে। " +
      "আপনি কোন লেভেলে যাচ্ছেন?"
    );
  }
  return (
    "ভাইয়া, প্রশ্নটা আবার বলছি 🙂 আপনি কোন লেভেলে আর কোন সাবজেক্টে পড়তে চান — " +
    "সেটা জানালে ঠিকঠাক উত্তর দিতে পারব।"
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
    "march_full_funding",
    "hope_killing",
    "cost_incomplete",
    "cost_not_reassuring",
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
    const fb =
      v.rule === "march_full_funding"
        ? marchFundingFallback()
        : v.rule === "cost_incomplete"
          ? costFallback(opts.question)
        : v.rule === "hope_killing"
          ? hopeFallback(reply)
          : v.rule === "cost_not_reassuring"
          ? reassuranceFallback(opts.question)
          : FALLBACKS[v.rule];
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
