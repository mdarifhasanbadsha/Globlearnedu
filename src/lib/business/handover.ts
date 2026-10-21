// ─────────────────────────────────────────────────────────────────────
// When to stop being the first responder.
//
// The owner's rule: a student should get ten exchanges before we ask for a
// contact and hand them to a person. A conversation that keeps asking
// questions past that is going in circles, which is what students complained
// about ("bar bar question kore").
//
// The mistake this file now avoids: treating "how much does it cost" as
// intent. That is the FIRST question of every enquiry, not a decision to
// proceed — and acting on it asked for a phone number three messages in, which
// drives a new student away before they have learned anything.
// ─────────────────────────────────────────────────────────────────────

/** Turns after which the assistant must be closing, not still asking. */
export const MAX_AI_TURNS = 10;

/**
 * A student who says they want to proceed is handed over early — but only
 * after enough real conversation for the team to have something to work with.
 */
export const MIN_TURNS_FOR_HANDOVER = 6;

/**
 * Phrases that mean the student has decided to go ahead, as opposed to
 * gathering information. Deliberately narrow: fee, documents, intake and
 * "kivabe" are excluded because every enquiry starts with them.
 */
const STRONG_INTENT =
  /(?:apply\s*(?:korte\s*chai|kortesi|korchi)|আবেদন\s*কর|admission\s*(?:nibo|nite\s*chai|নিব|নিতে\s*চাই)|enroll|shuru\s*korte\s*chai|শুরু\s*করতে\s*চাই|processed|প্রসেস\s*শুরু|documents?\s*ready|ডকুমেন্ট\s*রেডি|passport\s*(?:ache|আছে))/i;

/** Did the student say they want to proceed? */
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
 * `studentTurns` counts the student's messages, not our replies — a student
 * sending six lines in one burst is one turn of effort for them.
 */
export function decideTurn(args: {
  studentTurns: number;
  hasContact: boolean;
  strongIntent: boolean;
}): TurnDecision {
  const { studentTurns, hasContact, strongIntent } = args;

  // Ten turns without a contact is going in circles: close and ask, once.
  if (!hasContact && studentTurns >= MAX_AI_TURNS) {
    return {
      close: true,
      askContact: true,
      reason: `${studentTurns} turns without contact — closing`,
    };
  }

  // They said they want to proceed. Hand over, but only after a real
  // conversation — never on the first few messages.
  if (strongIntent && studentTurns >= MIN_TURNS_FOR_HANDOVER) {
    return {
      close: true,
      askContact: !hasContact,
      reason: "student wants to proceed — handing over",
    };
  }

  return { close: false, askContact: false, reason: "still gathering" };
}

/**
 * Instructions added when this turn should wrap up.
 *
 * The owner's rule: never demand a number. Answer what they asked, then — only
 * in a special case — mention that we offer free one-to-one counselling and
 * they may leave a contact if they wish. It is an invitation with a way out,
 * not a condition for being helped.
 */
export function closingInstruction(askContact: boolean): string {
  const invite = askContact
    ? "\n- Then, as a SEPARATE short line at the very end, invite them gently — this is optional and " +
      "they must be able to ignore it:\n" +
      '  "চাইলে আপনার contact number-টা এখানে রেখে যেতে পারেন — আমরা 1:1 counselling-টা ফ্রিতে ' +
      'দিই, আমাদের একজন বিস্তারিত কথা বলে দেবেন।"\n' +
      "- Never phrase it as a requirement, never repeat it if you have already asked, and never say " +
      "the number is already with us."
    : "";
  return (
    "\n\nANSWER, THEN WRAP UP — in this order.\n" +
    "- FIRST answer what they actually asked. That answer comes first, in 2-3 sentences, and it must " +
    "be about their question — not about universities or fees if they asked about something else.\n" +
    "- Do NOT ask any more questions about subject, results, intake or documents.\n" +
    "- Say what happens next: our team will give the remaining detail directly — " +
    '"বাকি বিস্তারিত আমাদের টিম আপনাকে জানিয়ে দেবেন।"' +
    invite
  );
}

/**
 * Instructions for a turn that should simply answer well.
 *
 * Used every turn, not only the closing one: a reply must lead with the thing
 * they asked. The most common complaint from the owner's test was an answer
 * that opened with university talk no matter what the question was.
 */
export const ANSWER_FIRST_INSTRUCTION =
  "\n\nANSWER THE QUESTION THEY ASKED, FIRST.\n" +
  "- Your first sentence answers exactly what they asked. Nothing comes before it.\n" +
  "- Their question decides the topic. Ask about hostel cost and the first sentence is about\n" +
  "  hostel cost — not universities, not documents, not what we lack.\n" +
  "- Do not open with university availability or your own caveats unless that is what was asked.\n" +
  "- Never repeat a sentence you already sent. If they ask again, add something new or move\n" +
  "  them forward — never resend the same answer.\n" +
  "- Example: they ask about hostel cost. Lead with the hostel figure, then anything else.";
