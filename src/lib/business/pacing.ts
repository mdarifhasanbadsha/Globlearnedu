// ─────────────────────────────────────────────────────────────
// Natural response pacing.
//
// The model answers in ~1-1.5s, which reads as robotic. A human
// counselor visibly reads, thinks, then types. We therefore hold the
// "typing" indicator for a believable span.
//
// Rules (owner-confirmed): never fabricate long waits, never leave the
// student staring at silence, and never exceed a hard cap.
// ─────────────────────────────────────────────────────────────

export interface Pacing {
  /** Minimum ms to keep showing "typing". */
  minMs: number;
  /** Hard ceiling for the whole turn. */
  maxMs: number;
  /** Human-facing reason, used for logs only. */
  reason: string;
}

const SIMPLE = /^(hi|hello|hey|assalamu|আসসালামু|salam|ok|thanks|thank you|ধন্যবাদ)\b/i;

const COMPLEX =
  /(visa|ভিসা|scholarship|স্কলার|tuition|fee|fees|taka|টাকা|খরচ|deadline|cost|price|eligib|requirement|document|passport|gpa|intake|apply|আবেদন|how much|koto)/i;

/** Decide how long this turn should visibly take. */
export function planPacing(question: string, modelMs: number): Pacing {
  const q = question.trim();

  if (q.length < 12 || SIMPLE.test(q)) {
    return { minMs: 1200, maxMs: 4000, reason: "short greeting" };
  }

  if (COMPLEX.test(q)) {
    // Fees and visa need visible "checking" — but bounded.
    return { minMs: 5000, maxMs: 14_000, reason: "fee/visa/program question" };
  }

  return { minMs: 2500, maxMs: 9_000, reason: "normal question" };
}

/**
 * Remaining time to wait, given how long the model already took.
 * Returns 0 when the real latency is already believable.
 */
export function remainingDelay(pacing: Pacing, modelMs: number): number {
  if (modelMs >= pacing.minMs) return 0;
  return Math.max(0, Math.min(pacing.minMs - modelMs, pacing.maxMs - modelMs));
}

/** True when the turn is taking so long we should reassure the student. */
export function isTooSlow(pacing: Pacing, elapsedMs: number): boolean {
  return elapsedMs > pacing.maxMs;
}

export const KEEP_WAITING_TEXT =
  "One moment please — I'm checking the details with our team.";
