// ─────────────────────────────────────────────────────────────────────
// When to stop being the first responder.
//
// The owner's rule: after roughly ten turns the assistant should have the
// student's contact and hand the thread to a person. A conversation that runs
// past that is not making progress — it is going in circles, which is exactly
// what students complained about ("bar bar question kore").
//
// Two triggers, both fixed in code rather than left to the model:
//   1. The student has written MAX_AI_TURNS times and we still have no
//      contact. Ask for the number once, then hand over.
//   2. They show unmistakable intent (asked about fees, documents, intake,
//      how to apply). Do not make a warm student answer more questions —
//      say the team will take it from here.
// ─────────────────────────────────────────────────────────────────────

/** Turns after which the assistant must be closing, not still asking. */
export const MAX_AI_TURNS = 10;

/** Fewer turns are enough when the intent is unmistakable. */
export const INTENT_TURNS = 3;

/** Phrases that mean the student is serious, not browsing. */
const STRONG_INTENT =
  /(?:koto\s*taka|fee|ফি|খরচ|khoroch|documents|ডকুমেন্ট|কাগজ|apply|আবেদন|admission\s*nite|ভর্তি|intake|ইনটেক|kobe\s*start|কবে\s*শুরু|scholarship|স্কলারশিপ|passport|পাসপোর্ট|kivabe|কিভাবে|process|প্রসেস|deadline|ডেডলাইন)/i;

/** Did the student express clear intent to proceed? */
export function showsStrongIntent(message: string): boolean {
  return STRONG_INTENT.test(message.trim());
}

/** Do we already have a phone number for this student? */
export function hasContact(args: {
  phone?: string | null;
  leadPhone?: string | null;
}): boolean {
  return Boolean(args.phone || args.leadPhone);
}

export interface TurnDecision {
  /** Stop asking questions and close the conversation. */
  close: boolean;
  /** Ask for the contact number in this reply. */
  askContact: boolean;
  reason: string;
}

/**
 * Decide what this turn should do.
 *
 * `studentTurns` counts how many messages the student has sent, not how many
 * replies we sent — a student firing six lines is still one turn of effort for
 * them, but their engagement is real.
 */
export function decideTurn(args: {
  studentTurns: number;
  hasContact: boolean;
  strongIntent: boolean;
}): TurnDecision {
  const { studentTurns, hasContact, strongIntent } = args;

  if (hasContact) {
    // Contact already captured: the job is to hand over, not to ask more.
    return {
      close: studentTurns >= INTENT_TURNS || strongIntent,
      askContact: false,
      reason: "contact already captured",
    };
  }

  if (studentTurns >= MAX_AI_TURNS) {
    return {
      close: true,
      askContact: true,
      reason: `${studentTurns} turns without contact — closing`,
    };
  }

  if (strongIntent && studentTurns >= INTENT_TURNS) {
    return {
      close: true,
      askContact: true,
      reason: `strong intent after ${studentTurns} turns — handing over`,
    };
  }

  return { close: false, askContact: false, reason: "still gathering" };
}

/** Instructions added to the prompt when a turn must close. */
export function closingInstruction(askContact: boolean): string {
  const ask = askContact
    ? "\n- Ask for their WhatsApp number in ONE short sentence, naturally, as the last line."
    : "";
  return (
    "\n\nTHIS TURN MUST CLOSE THE CONVERSATION.\n" +
    "- Do NOT ask about anything else. No more questions about subject, results, intake or documents.\n" +
    "- Give the useful answer you already have, in 2-3 sentences.\n" +
    "- Say plainly that our team will give the rest of the information directly: " +
    '"বাকি বিস্তারিত আমাদের টিম আপনাকে জানিয়ে দেবে।"' +
    ask +
    "\n- Never keep collecting information the student already gave."
  );
}
