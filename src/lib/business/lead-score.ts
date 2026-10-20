// ─────────────────────────────────────────────────────────────
// Deterministic lead scoring and categorisation.
//
// Runs on rules, not on the LLM, because:
//   - it must be reproducible and auditable for real student data
//   - a 500-thread backfill would cost a fortune in tokens
//   - the owner must be able to read WHY a lead is hot
//
// The AI is used elsewhere for conversation quality; here we score.
// ─────────────────────────────────────────────────────────────

export type Priority = "hot" | "warm" | "cold" | "ignore";

export interface LeadSignals {
  inboundCount: number;
  staffReplyCount: number;
  hasContact: boolean;
  contactChannel: string | null;
  askedFee: boolean;
  askedScholarship: boolean;
  askedVisa: boolean;
  askedApply: boolean;
  askedMBBS: boolean;
  askedLanguage: boolean;
  askedDegree: boolean;
  repeatedUntouched: boolean;
  daysSinceLastInbound: number;
  totalChars: number;
}

export interface LeadAssessment {
  score: number;
  priority: Priority;
  category: string;
  reasoning: string;
  nextAction: string | null;
  nextActionInDays: number | null;
  ignored: boolean;
  ignoreReason: string | null;
}

const RE_PHONE = String.raw`(?:\+?880[\s-]?\d{9,11}|\b01[3-9]\d{8}\b)`;
const RE_WHATSAPP = String.raw`(?:whatsapp|whats\s*app|wa\.me|হোয়াটসঅ্যাপ|হোয়াটস)`;

export function extractSignals(
  messages: { direction: string; authorKind: string; body: string; createdAt: Date }[]
): LeadSignals {
  const inbound = messages.filter((m) => m.direction === "in");
  const staff = messages.filter((m) => m.direction === "out" && m.authorKind === "staff");

  const allText = messages.map((m) => m.body).join("\n");
  const lower = allText.toLowerCase();

  const hasPhone = new RegExp(RE_PHONE).test(allText);
  const hasWhatsapp = new RegExp(RE_WHATSAPP, "i").test(allText);

  // A shared contact is only meaningful if the STUDENT wrote it.
  const studentText = inbound.map((m) => m.body).join("\n");
  const studentPhone = new RegExp(RE_PHONE).test(studentText);

  const lastInbound = inbound.length
    ? new Date(Math.max(...inbound.map((m) => new Date(m.createdAt).getTime())))
    : null;

  const daysSinceLastInbound = lastInbound
    ? Math.floor((Date.now() - lastInbound.getTime()) / 86_400_000)
    : 999;

  return {
    inboundCount: inbound.length,
    staffReplyCount: staff.length,
    hasContact: studentPhone,
    contactChannel: studentPhone ? "phone" : hasWhatsapp ? "whatsapp_mentioned" : null,
    askedFee: /tuition|fee|taka|koto|tk\b|খরচ|ফি|টাকা/i.test(allText),
    askedScholarship: /scholarship|scholor|স্কলার|বৃত্তি/i.test(allText),
    askedVisa: /visa|ভিসা/i.test(allText),
    askedApply: /apply|application|abedon|আবেদন/i.test(allText),
    askedMBBS: /mbbs|medicine|মেডিসিন|এমবিবিএস/i.test(allText),
    askedLanguage: /language|chinese|ভাষা|ল্যাঙ্গুয়েজ/i.test(allText),
    askedDegree: /bachelor|master|diploma|phd|degree|ব্যাচেলর|মাস্টার/i.test(allText),
    repeatedUntouched:
      inbound.length >= 2 && staff.length === 0,
    daysSinceLastInbound,
    totalChars: lower.length,
  };
}

/** Rules, in priority order. First match wins for the ignore case. */
export function assessLead(s: LeadSignals): LeadAssessment {
  const intentSignals = [
    s.askedFee && "fee",
    s.askedScholarship && "scholarship",
    s.askedVisa && "visa",
    s.askedApply && "application",
    s.askedMBBS && "mbbs",
    s.askedLanguage && "language",
    s.askedDegree && "degree",
  ].filter(Boolean) as string[];

  // ── IGNORE cases (a human or a bot left nothing actionable) ──
  if (s.inboundCount === 0) {
    return {
      score: 0,
      priority: "ignore",
      category: "no_student_message",
      reasoning: "No message from the student was ever recorded.",
      nextAction: null,
      nextActionInDays: null,
      ignored: true,
      ignoreReason: "no inbound message",
    };
  }

  if (s.totalChars < 12) {
    return {
      score: 5,
      priority: "ignore",
      category: "no_real_intent",
      reasoning: "Only a greeting or emoji, no question about studying.",
      nextAction: null,
      nextActionInDays: null,
      ignored: true,
      ignoreReason: "no real intent",
    };
  }

  // Student already shared a phone number: they are being handled off-platform.
  if (s.hasContact) {
    return {
      score: 60,
      priority: "warm",
      category: "contact_shared",
      reasoning:
        "Student shared a phone number, so this moved to WhatsApp or a call. Keep in CRM, do not cold-message again.",
      nextAction: "Confirm by phone that they received the program details",
      nextActionInDays: 2,
      ignored: false,
      ignoreReason: null,
    };
  }

  // ── SCORE ──
  let score = 20;
  score += Math.min(s.inboundCount * 6, 30);
  if (s.askedFee) score += 10;
  if (s.askedApply) score += 12;
  if (s.askedDegree) score += 8;
  if (s.askedScholarship) score += 6;
  if (s.daysSinceLastInbound <= 3) score += 15;
  else if (s.daysSinceLastInbound <= 14) score += 8;
  else if (s.daysSinceLastInbound > 90) score -= 15;
  if (s.repeatedUntouched) score += 10; // they asked twice and nobody answered

  score = Math.max(0, Math.min(100, score));

  let category = "general_enquiry";
  if (s.askedMBBS) category = "mbbs";
  else if (s.askedLanguage) category = "language_program";
  else if (s.askedDegree) category = "degree_program";
  else if (s.askedScholarship) category = "scholarship";

  if (s.askedVisa && s.askedApply) category = "visa_and_application";

  // ── PRIORITY + NEXT ACTION ──
  if (score >= 65) {
    return {
      score,
      priority: "hot",
      category,
      reasoning:
        `High intent: ${s.inboundCount} messages, asked about ${intentSignals.join(", ") || "several topics"}, active ${s.daysSinceLastInbound}d ago.`,
      nextAction: s.repeatedUntouched
        ? "Reply today - the student asked again and got no answer"
        : "Call or message today with the matching programs and fees",
      nextActionInDays: 0,
      ignored: false,
      ignoreReason: null,
    };
  }

  if (score >= 40) {
    return {
      score,
      priority: "warm",
      category,
      reasoning: `Moderate intent: ${s.inboundCount} messages, last activity ${s.daysSinceLastInbound}d ago.`,
      nextAction: "Send a short followup with two matching options",
      nextActionInDays: 2,
      ignored: false,
      ignoreReason: null,
    };
  }

  return {
    score,
    priority: s.daysSinceLastInbound > 120 ? "ignore" : "cold",
    category,
    reasoning:
      s.daysSinceLastInbound > 120
        ? `Only ${s.inboundCount} message(s) and nothing for ${s.daysSinceLastInbound} days.`
        : `Low intent: ${s.inboundCount} message(s), last activity ${s.daysSinceLastInbound}d ago.`,
    nextAction:
      s.daysSinceLastInbound > 120 ? null : "Add to a monthly nurture list, do not call",
    nextActionInDays: s.daysSinceLastInbound > 120 ? null : 30,
    ignored: s.daysSinceLastInbound > 120,
    ignoreReason: s.daysSinceLastInbound > 120 ? "stale over 120 days" : null,
  };
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  hot: "Hot - call today",
  warm: "Warm - follow up",
  cold: "Cold - nurture",
  ignore: "Ignore",
};
