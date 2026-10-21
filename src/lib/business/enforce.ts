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

  // First violation with a dedicated fallback wins.
  for (const v of violations) {
    const fb = FALLBACKS[v.rule];
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
