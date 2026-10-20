// ─────────────────────────────────────────────────────────────
// University cards and quick replies for chat.
//
// The reference product sends structured cards and tap buttons instead
// of walls of text. For Study in China the equivalent is a program card
// (university, city, fee, deadline) plus tappable follow-ups.
// ─────────────────────────────────────────────────────────────

export interface UniversityCard {
  universityName: string;
  city: string | null;
  programName: string | null;
  tuitionLabel: string;
  deadline: string | null;
  intake: string | null;
}

export interface QuickReply {
  label: string;
  /** Text sent to the API when tapped; label is what the student sees. */
  send: string;
}

/** Build the display label for a fee, always with its period. */
export function feeLabel(
  amount: number | null,
  currency: string | null,
  period: string | null
): string {
  if (amount == null) return "Fee not confirmed";
  const cur = currency ?? "CNY";
  const p =
    period === "semester" ? "per semester"
    : period === "year" ? "per year"
    : period === "month" ? "per month"
    : "";
  return `${amount.toLocaleString()} ${cur}${p ? " " + p : ""}`;
}

/**
 * Turn approved knowledge into cards the UI can render.
 * Cards never expose rows that are not approved.
 */
export function toCards(
  facts: {
    universityName: string | null;
    city: string | null;
    programName: string | null;
    tuitionAmount: number | null;
    tuitionCurrency: string | null;
    tuitionPeriod: string | null;
    applicationDeadline: string | null;
    intakeText: string | null;
  }[]
): UniversityCard[] {
  return facts
    .filter((f) => f.universityName)
    .slice(0, 4)
    .map((f) => ({
      universityName: f.universityName as string,
      city: f.city,
      programName: f.programName,
      tuitionLabel: feeLabel(f.tuitionAmount, f.tuitionCurrency, f.tuitionPeriod),
      deadline: f.applicationDeadline,
      intake: f.intakeText,
    }));
}

/**
 * Suggest tappable next steps. Chosen from what the student has not yet
 * told us, so the chips stay useful rather than decorative.
 */
export function suggestQuickReplies(input: {
  askedAboutFee?: boolean;
  hasDegree?: boolean;
  hasGpa?: boolean;
  hasContact?: boolean;
}): QuickReply[] {
  const out: QuickReply[] = [];

  if (!input.hasDegree) {
    out.push({ label: "Bachelor", send: "I am interested in a bachelor degree" });
    out.push({ label: "Master", send: "I am interested in a master degree" });
    out.push({ label: "Language program", send: "I am interested in a language program" });
  } else if (!input.askedAboutFee) {
    out.push({ label: "How much is tuition?", send: "How much is the tuition for this?" });
  }

  if (!input.hasGpa) {
    out.push({ label: "I have HSC result", send: "I have completed HSC / higher secondary" });
  }

  out.push({ label: "Talk to a counselor", send: "I would like to speak to a counselor" });

  return out.slice(0, 4);
}
