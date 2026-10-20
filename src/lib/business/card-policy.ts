// ─────────────────────────────────────────────────────────────
// When should cards appear?
//
// A human counselor does not paste a table of universities into every
// reply. They answer conversationally and only offer options when the
// student is actually asking to see options.
//
// Rules:
//   - never show cards on an apology / upset / handoff reply
//   - never show the same program name twice
//   - never show more than 3
//   - only show when the question is about exploring programs or fees
// ─────────────────────────────────────────────────────────────

import { UniversityCard } from "./chat-cards";

const EMOTIONAL = [
  "sorry", "upset", "apolog", "দুঃখিত", "আফসোস", "counselor will follow up",
  "টিমের সাথে", "check with our team", "not sure", "confirm with",
];

const ASKING_FOR_OPTIONS =
  /(which universities?|what universities|options?|show me|list|compare|cheapest|best|recommend|available|kon university|কোন ইউনিভার্সিটি|ছবি|dekh|দেখাও|any program|what programs)/i;

const ASKING_ABOUT_PROGRAM =
  /(language|bachelor|master|mbbs|degree|program|tuition|fee|taka|koto|খরচ|ফি|টাকা|deadline)/i;

export interface CardDecision {
  show: boolean;
  cards: UniversityCard[];
  reason: string;
}

/**
 * Decide whether this reply should carry program cards, and which.
 */
export function decideCards(args: {
  reply: string;
  question: string;
  candidates: UniversityCard[];
  turnIndex: number;
  alreadyShownCard: boolean;
}): CardDecision {
  const { reply, question, candidates, turnIndex, alreadyShownCard } = args;

  if (candidates.length === 0) {
    return { show: false, cards: [], reason: "no approved programs matched" };
  }

  const lower = reply.toLowerCase();

  // An apology or a handoff is not a moment to advertise.
  if (EMOTIONAL.some((p) => lower.includes(p))) {
    return { show: false, cards: [], reason: "reply is an apology or handoff" };
  }

  // First message: let the AI talk first, don't dump data immediately.
  if (turnIndex === 0 && !ASKING_FOR_OPTIONS.test(question)) {
    return { show: false, cards: [], reason: "opening turn, let the assistant speak" };
  }

  // Only when the student is probing programs or fees.
  const wantsPrograms = ASKING_FOR_OPTIONS.test(question) || ASKING_ABOUT_PROGRAM.test(question);
  if (!wantsPrograms) {
    return { show: false, cards: [], reason: "question is not about programs or fees" };
  }

  // Show once per conversation unless they explicitly ask for options again.
  if (alreadyShownCard && !ASKING_FOR_OPTIONS.test(question)) {
    return { show: false, cards: [], reason: "already shown; answer conversationally" };
  }

  // Deduplicate by program name, then by university, and cap at 3.
  const seenProgram = new Set<string>();
  const seenUni = new Set<string>();
  const picked: UniversityCard[] = [];

  for (const c of candidates) {
    const p = (c.programName ?? "").toLowerCase().trim();
    const u = c.universityName.toLowerCase().trim();
    if (p && seenProgram.has(p)) continue;
    if (seenUni.has(u)) continue;
    if (p) seenProgram.add(p);
    seenUni.add(u);
    picked.push(c);
    if (picked.length >= 3) break;
  }

  return { show: picked.length > 0, cards: picked, reason: "student asked about programs" };
}
