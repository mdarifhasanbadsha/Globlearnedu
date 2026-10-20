// ─────────────────────────────────────────────────────────────────────
// Contact follow-up.
//
// When the assistant hands a student to a counsellor, the thread should not
// just go quiet. The owner's plan, which this implements:
//
//   30 min later   ask whether the team actually called
//   if not called   apologise, say the team has been informed, and confirm
//                   the number is correct
//   if confirmed    apologise for the delay and ask for a little more time
//   then            hand over to a human and stop
//
// A student who replies that they WERE called ends the sequence at once.
//
// Every message is generated from a fixed set, never by the model: this
// sequence is about reliability, and an apology that improvises is worse than
// one that is predictable.
// ─────────────────────────────────────────────────────────────────────

export const FIRST_WAIT_MINUTES = 30;
export const SECOND_WAIT_MINUTES = 60;
export const HUMAN_GRACE_MINUTES = 5;

export type FollowupStage =
  | "none"
  | "awaiting_call" // asked whether the call happened
  | "awaiting_number" // call did not happen; asked to confirm the number
  | "final_wait" // number confirmed; apologised, asking for a little time
  | "handed_off"; // human owns it; AI is finished

export interface FollowupState {
  stage: FollowupStage;
  /** When the next message becomes due. */
  dueAt: Date | null;
  /** When the current stage started, for the grace window. */
  stageAt: Date | null;
}

export const EMPTY_STATE: FollowupState = { stage: "none", dueAt: null, stageAt: null };

/** Was the call completed, per the student's own words? */
export function saysCalled(message: string): boolean {
  const m = message.trim();

  const callWord = /(?:call|কল|ফোন|phone|কথা)/i;
  const didHappen =
    /(?:diyech|diyeche|korech|korse|hoiyeche|hoyeche|esheche|peyechi|হয়েছে|হয় গেছে|হয় আছে|এসেছে|করেছে|দিয়েছে|পেয়েছি|কথা হয়ে)/i;
  const positive = /(?:^|\s)(?:yes|hae|haa|hyan|হ্যাঁ|হ্যা|জি)(?:\s|,|$)/i;
  const negative =
    /(?:^|\s)(?:no|na|nai|না|নাই)(?:\s|,|$)|call\s*nai|aseni|আসেনি|দেই\s*নাই|কল\s*নাই|কোনো\s*কল/i;

  if (negative.test(m)) return false;
  if (callWord.test(m) && didHappen.test(m)) return true;
  if (positive.test(m) && callWord.test(m)) return true;
  // "হয়েছে ভাই" with no negative — the student is confirming something happened.
  if (/হয়েছে|হয় গেছে|কথা হয়ে/i.test(m) && !negative.test(m)) return true;
  return false;
}

export function saysNotCalled(message: string): boolean {
  const m = message.trim();
  return (
    /\b(?:no|na|nai|নাই|না)\b/i.test(m) ||
    /call\s*(?:dei\s*)?nai|aseni|আসেনি|দেই\s*নাই|কোনো\s*কল\s*নাই|kol\s*dei\s*nai/i.test(m) ||
    /ekhono|এখনো|still/i.test(m)
  ) && !saysCalled(m);
}

/** A phone number, Bangladeshi or international. */
export function findPhoneNumber(message: string): string | null {
  const m = message.match(/(?:\+?88)?0?1\d{9}|\+\d{10,15}/);
  return m ? m[0] : null;
}

/** Should the follow-up sequence start for this conversation? */
export function shouldStartFollowup(aiState: string): boolean {
  return aiState === "handoff_requested";
}

export function firstDueAt(now = new Date()): Date {
  return new Date(now.getTime() + FIRST_WAIT_MINUTES * 60_000);
}

export function secondDueAt(now = new Date()): Date {
  return new Date(now.getTime() + SECOND_WAIT_MINUTES * 60_000);
}

export interface FollowupMessage {
  stage: FollowupStage;
  body: string;
  /** True when the AI must go completely quiet afterwards. */
  handOff: boolean;
}

/**
 * The message for the current stage. Fixed wording on purpose: the student is
 * already waiting on a promise, and a creative apology is the last thing they
 * need.
 */
export function followupMessage(stage: FollowupStage, studentName?: string | null): FollowupMessage | null {
  const who = studentName ? ` ${studentName}` : "";
  switch (stage) {
    case "awaiting_call":
      return {
        stage,
        body: `ভাইয়া${who}, ছোট করে জিজ্ঞেস করি — আমাদের টিম member কি আপনাকে কল দিয়েছিলেন? কথা হয়ে থাকলে জানাবেন, আর না হলে আমি এখনই টিমকে জানাচ্ছি। 🙂`,
        handOff: false,
      };
    case "awaiting_number":
      return {
        stage,
        body: `দুঃখিত ভাইয়া${who} — আমি টিমকে জানিয়ে দিয়েছি। আপনি যে নম্বরটা দিয়েছিলেন সেটা একবার মিলিয়ে নেবেন কি — ঠিক আছে? 🙂`,
        handOff: false,
      };
    case "final_wait":
      return {
        stage,
        body: `ধন্যবাদ ভাইয়া${who}। দেরির জন্য দুঃখিত — দয়া করে একটু সময় দিন, আমাদের টিম member দ্রুতই আপনার সাথে যোগাযোগ করবেন। 🙏`,
        handOff: true,
      };
    default:
      return null;
  }
}

/** The line sent when the student confirms the number is correct. */
export const NUMBER_CONFIRMED_REPLY =
  "ধন্যবাদ ভাইয়া। দেরির জন্য সত্যিই দুঃখিত — দয়া করে একটু সময় দিন, আমাদের টিম member দ্রুতই আপনার সাথে যোগাযোগ করবেন। 🙏";

/** The line sent once the AI has finished and a human owns the thread. */
export const HANDOFF_REPLY =
  "ধন্যবাদ ভাইয়া 🙂 এখান থেকে আমাদের একজন টিম member আপনার সাথে কথা বলবেন।";
