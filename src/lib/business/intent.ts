// ─────────────────────────────────────────────────────────────────────
// Message intent classification.
//
// Not every message deserves an AI call. Some are greetings, some are
// off-topic, some are attempts to make the assistant break character, and a
// few are abuse. Each needs a different response:
//
//   greeting / thanks  -> a short friendly reply, no model needed
//   off-topic          -> redirect once, gently, no model needed
//   manipulation       -> refuse plainly, no model needed
//   abuse              -> de-escalate, and stop spending on them
//   genuine            -> full AI answer
//
// The guiding rule: a student is never punished for being confusing. Only
// clear abuse and clear manipulation are refused, and even then politely.
// ─────────────────────────────────────────────────────────────────────

export type Intent =
  | "greeting"
  | "thanks"
  | "goodbye"
  | "off_topic"
  | "manipulation"
  | "abuse"
  | "empty"
  | "genuine";

export interface Classified {
  intent: Intent;
  /** True when this can be answered without calling the model. */
  handled: boolean;
  /** The reply to send, when handled. Null means "let the model answer". */
  reply: string | null;
  /** Why, for logging and for the lab. */
  reason: string;
}

const GREETING =
  /^(?:(?:hi+|hello+|hey+|হ্যালো|হাই|salam|সালাম)(?:\s*(?:bhai|bhaiya|vai|ভাই|ভাইয়া|bro|sir|apu|আপু))?|assalamu?\s*alaikum|আসসালামু?\s*আলাইকুম|good\s*(?:morning|afternoon|evening|night)|(?:kemon|কেমন)\s*(?:achen|আছেন)|(?:ki|কি)\s*(?:obostha|অবস্থা))[\s!.,।]*$/i;

const THANKS =
  /^(?:thanks?|thank\s*you|thx|ty|ধন্যবাদ|thanks\s*bro|tnx|ok\s*thanks|okay\s*thanks)[\s!.,।]*$/i;

const GOODBYE =
  /^(?:bye|goodbye|allah\s*hafez|আল্লাহ\s*হাফেজ|see\s*you|পরে\s*কথা\s*বলব|ok\s*bye)[\s!.,।]*$/i;

/**
 * Attempts to make the assistant abandon its role, reveal internals, or
 * produce something it must not. Matched by intent, not by exact phrase.
 */
const MANIPULATION: RegExp[] = [
  // "ignore all your previous instructions" puts three filler words between
  // the verb and the noun, so a fixed two-word gap missed the commonest form.
  /ignore\s+(?:[\w']+\s+){0,4}(?:instructions?|rules?|prompts?|guidelines?|directions?)\b/i,
  /forget\s+(?:[\w']+\s+){0,4}(?:instructions?|rules?|prompts?|everything)\b/i,
  /(?:system|developer)\s*(?:prompt|message)|আপনার\s*(?:নির্দেশনা|প্রম্পট|সিস্টেম)/i,
  /(?:pretend|act)\s+(?:to\s+be|as)\s+(?:a\s+)?(?:different|another|no\s+restrictions?|unrestricted)/i,
  /jailbreak|DAN\s+mode|developer\s+mode/i,
  /(?:show|tell|give)\s+(?:me\s+)?(?:your|the)\s+(?:api|token|key|password|secret)/i,
  /(?:fax|doctor|official)\s+(?:letter|certificate).*(?:banate|বানাতে)|(?:নকল|ভুয়া|জাল)\s*(?:সার্টিফিকেট|ডকুমেন্ট|পাসপোর্ট)/i,
  /(?:bribe|ঘুষ|টাকা\s*দিয়ে\s*কাজ)\s*(?:করা|দিয়ে|admission)/i,
  /(?:nijer|নিজের)\s*(?:নামে|নাম)\s*(?:নকল|ভুয়া|ফেক)|(?:fake|forge|forged)\s+(?:certificate|document|transcript|passport)/i,
];

/** Clear abuse aimed at the assistant or the team. */
const ABUSE: RegExp[] = [
  /\b(?:fuck|f\*ck|shit|bastard|idiot|stupid|moron|retard|bitch|asshole)\b/i,
  /(?:খানকি|মাগি|শুয়োরের|কুত্তা|গাধা|বোকা|চোদ|বাল)/i,
  /(?:tui|তুই)\s*(?:ekta\s*)?(?:gadha|বোকা|pagol|পাগল)/i,
];

/** Recognised topics. Anything outside these is off-topic. */
const TOPIC_WORDS =
  /china|চায়না|চীন|universit|বিশ্ববিদ্যালয়|college|কলেজ|scholarship|স্কলারশিপ|diploma|ডিপ্লোমা|bachelor|ব্যাচেলর|master|মাস্টার|phd|পিএইচডি|language|ভাষা|hsk|csca|visa|ভিসা|admission|ভর্তি|apply|আবেদন|fee|ফি|খরচ|taka|টাকা|tuition|tuition|hostel|হোস্টেল|document|ডকুমেন্ট|কাগজ|passport|পাসপোর্ট|ielts|gpa|result|রেজাল্ট|office|অফিস|address|ঠিকানা|intake|ইনটেক|mbbs|engineering|ইঞ্জিনিয়ারিং|business|computer|cse|ai\b|medicine|nursing|pharmacy|program|প্রোগ্রাম|student|স্টুডেন্ট|study|পড়াশোনা|পড়তে|course|কোর্স|opportunit|সুযোগ|deadline|ট্রান্সক্রিপ্ট|transcript|bank|ব্যাংক|phone|নম্বর|number|call|কল|whatsapp|contact|যোগাযোগ|ম্যাপ|map|location|counsel|কাউন্সেল|help|সাহায্য|info|তথ্য|details|বিস্তারিত|price|charge|চার্জ|package|প্যাকেজ|english|ইংরেজি|semester|সেমিস্টার|year|বছর|age|বয়স|কবে|when|where|কোথায়|কত|how/i;

/** Obvious off-topic: entertainment, homework, unrelated services. */
const OFF_TOPIC_HINTS =
  /(?:write|লিখে)\s*(?:me\s*)?(?:a\s*)?(?:poem|story|essay|গল্প|কবিতা|রচনা)|(?:movie|মুভি|song|গান|game|গেম|cricket|ক্রিকেট|football|ফুটবল|weather|আবহাওয়া|recipe|রেসিপি|joke|কৌতুক)|(?:hack|হ্যাক|pirat|পাইরেসি|torrent)|(?:bitcoin|crypto|লটারি|lottery|জুয়া)|(?:girlfriend|boyfriend|প্রেম|dating)|(?:loan|ঋণ|লোন\s*দেন)|(?:visa\s*card|credit\s*card|ক্রেডিট\s*কার্ড).*(?:বানাতে|banate)/i;

/**
 * Classify one message BEFORE any model call.
 *
 * Deliberately conservative: an unclear message is treated as genuine, because
 * wrongly dismissing a real student is far worse than paying for a few extra
 * tokens.
 */
export function classifyMessage(raw: string): Classified {
  const text = raw.trim();
  const low = text.toLowerCase();

  if (text.length === 0) {
    return { intent: "empty", handled: true, reply: null, reason: "empty message" };
  }

  // Abuse is checked first: it must never reach the model, both to avoid
  // spending tokens and so the reply is calm and scripted rather than
  // improvised.
  if (ABUSE.some((re) => re.test(text))) {
    return {
      intent: "abuse",
      handled: true,
      reply:
        "ভাইয়া, আমি আপনার প্রশ্নের উত্তর দিতে প্রস্তুত — তবে একটু ভদ্র ভাষায় বললে ভালো হয়। 🙏 চায়না পড়াশোনা নিয়ে কী জানতে চান?",
      reason: "abusive language",
    };
  }

  if (MANIPULATION.some((re) => re.test(text))) {
    return {
      intent: "manipulation",
      handled: true,
      reply:
        "এই বিষয়ে আমি সাহায্য করতে পারব না — তবে চায়না পড়াশোনা, ভর্তি, স্কলারশিপ বা খরচ নিয়ে যেকোনো প্রশ্নে আমি আছি। বলুন, কী জানতে চান?",
      reason: "attempt to break scope",
    };
  }

  // A short greeting or thanks does not need the model.
  if (GREETING.test(text)) {
    // Match the greeting they used. "hi" gets "Hello", not "ওয়ালাইকুম আসসালাম" —
    // answering a plain hi with a religious greeting reads as a template.
    const saidSalam = /salam|সালাম|assalamu/i.test(text);
    const isBangla = /[\u0980-\u09FF]/.test(text);
    const saidBanglaGreeting = /হ্যালো|হাই|কেমন|কি অবস্থা/i.test(text);

    const reply = saidSalam
      ? "ওয়ালাইকুম আসসালাম! 🙂 চায়না নিয়ে কী জানতে চান — কোন প্রোগ্রাম বা কোন বিষয়ে পড়তে চান?"
      : isBangla || saidBanglaGreeting
        ? "হ্যালো ভাইয়া! 🙂 চায়না নিয়ে কী জানতে চান — কোন প্রোগ্রাম বা কোন বিষয়ে পড়তে চান?"
        : "Hello ভাইয়া! 🙂 কী জানতে চান — চায়নার কোন প্রোগ্রাম বা কোন বিষয়ে পড়তে চান?";

    return {
      intent: "greeting",
      handled: true,
      reply,
      reason: saidSalam ? "salam greeting" : "greeting",
    };
  }
  if (THANKS.test(text)) {
    return {
      intent: "thanks",
      handled: true,
      reply: "আপনাকেও ধন্যবাদ! 🙂 আর কিছু জানতে চাইলে নির্দ্বিধায় বলবেন।",
      reason: "thanks",
    };
  }
  if (GOODBYE.test(text)) {
    return {
      intent: "goodbye",
      handled: true,
      reply: "আল্লাহ হাফেজ! 🙂 যখনই দরকার, আমাদের লিখবেন।",
      reason: "goodbye",
    };
  }

  // Off-topic only when it matches an unrelated request AND has no study-in-China
  // vocabulary at all. One stray keyword keeps it genuine.
  if (OFF_TOPIC_HINTS.test(text) && !TOPIC_WORDS.test(text)) {
    return {
      intent: "off_topic",
      handled: true,
      reply:
        "এটা আমার কাজের বাইরে — আমি শুধু চায়না পড়াশোনা নিয়ে সাহায্য করি। 😊 প্রোগ্রাম, খরচ, স্কলারশিপ বা ভর্তি নিয়ে যা জানতে চান, জিজ্ঞেস করুন।",
      reason: "unrelated topic",
    };
  }

  return { intent: "genuine", handled: false, reply: null, reason: "needs the model" };
}

/**
 * After several off-topic or abusive turns, stop spending on the model.
 * Tracked per conversation by the caller.
 */
export function shouldStopSpending(strikeCount: number): boolean {
  return strikeCount >= 5;
}
