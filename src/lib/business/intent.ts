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
  | "acknowledgement"
  | "call_request"
  | "off_topic"
  | "manipulation"
  | "abuse"
  | "self_query"
  | "empty"
  | "genuine";

/**
 * Bare acknowledgements: "ok", "okay", "alright", "thik ache", "ধন্যবাদ".
 *
 * These need NO reply at all. In production every "Ok" produced the same
 * paragraph about a representative calling tomorrow, four times running. A
 * person says ok back once, or says nothing — they do not restate the plan.
 * Answering an acknowledgement is the clearest sign a machine is present.
 */
const ACKNOWLEDGEMENT =
  /^(?:ok+|okay+|o\.?k\.?|k|alright|all\s*right|fine|hmm+|thik\s*(?:ache|ase|hobe|hai)|আচ্ছা|ঠিক\s*আছে|হুম+|ha+n+|yeah|yep|yup|yes|got\s*it|noted|done|thanks|thank\s*you|ধন্যবাদ|ok\s*(?:thanks|vaiya|vai|bhai|bro|sir|আছে)|good|great|nice)[\s!.,।🙂😊👍]*$/i;

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
  // "tumi ekta pagol bot" — an insult aimed at the assistant, not a question
  // about it. Without this it matched the identity check and got a polite
  // introduction instead of a calm reply to the insult.
  /(?:pagol|পাগল|bokachoda|বোকা|gadha|গাধা)/i,
];

/** Recognised topics. Anything outside these is off-topic. */
const TOPIC_WORDS =
  /china|চায়না|চীন|universit|বিশ্ববিদ্যালয়|college|কলেজ|scholarship|স্কলারশিপ|diploma|ডিপ্লোমা|bachelor|ব্যাচেলর|master|মাস্টার|phd|পিএইচডি|language|ভাষা|hsk|csca|visa|ভিসা|admission|ভর্তি|apply|আবেদন|fee|ফি|খরচ|taka|টাকা|tuition|tuition|hostel|হোস্টেল|document|ডকুমেন্ট|কাগজ|passport|পাসপোর্ট|ielts|gpa|result|রেজাল্ট|office|অফিস|address|ঠিকানা|intake|ইনটেক|mbbs|engineering|ইঞ্জিনিয়ারিং|business|computer|cse|ai\b|medicine|nursing|pharmacy|program|প্রোগ্রাম|student|স্টুডেন্ট|study|পড়াশোনা|পড়তে|course|কোর্স|opportunit|সুযোগ|deadline|ট্রান্সক্রিপ্ট|transcript|bank|ব্যাংক|phone|নম্বর|number|call|কল|whatsapp|contact|যোগাযোগ|ম্যাপ|map|location|counsel|কাউন্সেল|help|সাহায্য|info|তথ্য|details|বিস্তারিত|price|charge|চার্জ|package|প্যাকেজ|english|ইংরেজি|semester|সেমিস্টার|year|বছর|age|বয়স|কবে|when|where|কোথায়|কত|how/i;

/** Obvious off-topic: entertainment, homework, unrelated services. */
const OFF_TOPIC_HINTS =
  /(?:write|লিখে)\s*(?:me\s*)?(?:a\s*)?(?:poem|story|essay|গল্প|কবিতা|রচনা)|(?:movie|মুভি|song|গান|game|গেম|cricket|ক্রিকেট|football|ফুটবল|weather|আবহাওয়া|recipe|রেসিপি|joke|কৌতুক)|(?:hack|হ্যাক|pirat|পাইরেসি|torrent)|(?:bitcoin|crypto|লটারি|lottery|জুয়া)|(?:girlfriend|boyfriend|প্রেম|dating)|(?:loan|ঋণ|লোন\s*দেন)|(?:visa\s*card|credit\s*card|ক্রেডিট\s*কার্ড).*(?:বানাতে|banate)|(?:ceo|মালিক|owner|chairman|founder|প্রতিষ্ঠাতা)\s*(?:k|কে|ke|কে\?|ki|কে\b)|(?:python|javascript|java\b|php|html|css|c\+\+|coding|program(?:ming)?\s*(?:language|code)|brute\s*force)/i;

/**
 * Requests for real work outside counselling: writing code, counting to 100,
 * explaining a programming language. None of this is our job, and answering it
 * turns a counsellor into a general-purpose chatbot — which is exactly what a
 * student testing us is looking for.
 */
const WANTS_HOMEWORK =
  /(?:give|write|make|show|create|de|dao|lekho|likho|koro)\s*(?:me\s*)?(?:a\s*)?(?:python|javascript|java|php|c\+\+|code|script|program|function)|(?:tell|explain|about|ki)\s*(?:me\s*)?(?:about\s*)?(?:python|javascript|java|php|c\+\+|programming\s+language)/i;

/**
 * Counting on demand. A student asking us to type 1-100 is testing whether the
 * counsellor is a general chatbot, so it is refused however it is phrased —
 * including when "admission" is tagged on to make it look like a real request.
 */
const COUNTING_TASK = /(?:\btell\s*|\btype\s*(?:koro|kore|korbo)?\s*|\bcount\s*|\bgun[oe]\s*)\d{1,3}\s*(?:-|to|porjonto|theke)\s*\d{1,3}\b|\b\d{1,3}\s*(?:-|to|porjonto)\s*\d{2,3}\b/i;

/**
 * Questions about the assistant itself. These are the ones a student uses to
 * find out whether they are talking to software, and they must be answered by
 * a fixed, human line — never improvised by the model.
 */
const SELF_QUERY =
  /(?:tumi|tumi|apni|you|তুমি|আপনি)\s*(?:ki|কি|are\s+you)?\s*(?:ekta\s*|একটা\s*)?(?:ai|এআই|robot|রোবট|bot|বট|manush|মানুষ|human|software|program)\b|(?:tomar|apnar|your|তোমার|আপনার)\s*(?:model|মডেল|ai|এআই|system|সিস্টেম|name|নাম|programming|প্রোগ্রামিং)|(?:are\s+you|is this)\s+(?:a\s+)?(?:bot|robot|ai|human|real)|who\s+are\s+you|tumi\s+ke\b/i;

/**
 * Classify one message BEFORE any model call.
 *
 * Deliberately conservative: an unclear message is treated as genuine, because
 * wrongly dismissing a real student is far worse than paying for a few extra
 * tokens.
 */

/**
 * Is this message genuinely English, or Bangla typed in Latin letters?
 *
 * Banglish is full of Bangla function words (korte, parbo, kemon, bhai, taka)
 * and those never appear in English. If any are present, it is Banglish and the
 * reply must be in Bangla.
 */
const BANGLISH_MARKERS =
  /\b(?:korte|korbo|korben|kore|koro|kemon|kemne|kivabe|kibhabe|parbo|parben|parchi|hobe|hoy|ache|achhe|nai|nei|bhai|vai|vaiya|koto|kotha|kothay|taka|din|den|bolen|bolbo|ekta|apni|apnader|amar|tomar|tar|kemon|lagbe|lagche|jante|chen|chai|valo|bhalo|dhonnobad|salam|assalamu|bujhlam|bujhte)\b/i;

function looksEnglish(text: string): boolean {
  const hasBangla = /[\u0980-\u09FF]/.test(text);
  if (hasBangla) return false;
  if (BANGLISH_MARKERS.test(text)) return false;
  const latin = (text.match(/[a-zA-Z]/g) ?? []).length;
  return latin > 0;
}

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
      ? "ওয়ালাইকুম আসসালাম! 🙂 আমি আহসান, GL Education থেকে। চায়না নিয়ে কী জানতে চান — কোন প্রোগ্রাম বা কোন বিষয়ে?"
      : isBangla || saidBanglaGreeting
        ? "হ্যালো ভাইয়া! 🙂 আমি আহসান, GL Education থেকে। চায়না নিয়ে কী জানতে চান — কোন প্রোগ্রাম বা কোন বিষয়ে?"
        : "Hello ভাইয়া! 🙂 আমি আহসান, GL Education থেকে। কী জানতে চান — কোন প্রোগ্রাম বা কোন বিষয়ে পড়তে চান?";

    return {
      intent: "greeting",
      handled: true,
      reply,
      reason: saidSalam ? "salam greeting" : "greeting",
    };
  }
  // Wants to talk on the phone. Give the WhatsApp line immediately — this is a
  // student ready to speak to a person, and a counselling paragraph wastes the
  // one moment they were willing to call.
  // static import at the top; classifyMessage is synchronous
  if (isCallRequest(text)) {
    // Banglish must get Bangla, not English.
    //
    // This used to treat any Latin-script message as English, so "call korte
    // parbo?" — pure Banglish — was answered in English while the whole
    // conversation had been Bangla. A message counts as English only when it
    // reads as English words, not as Bangla typed in Latin letters.
    const english = looksEnglish(text);
    return {
      intent: "call_request",
      handled: true,
      reply: callReply(english ? "en" : "bn"),
      reason: "asked for a phone call",
    };
  }

  // A bare "ok" is the end of a thought, not a new question. Reply is null so
  // the caller stays quiet; a person does not answer an acknowledgement, and
  // answering it is what produced four identical paragraphs in production.
  // A bare emoji is an acknowledgement too — a thumbs-up needs no answer.
  const lettersOnly = text.replace(/[\s!.,。\u0964\u3002\p{Emoji}\p{Extended_Pictographic}]/gu, "");
  if (lettersOnly.length === 0 && text.length > 0) {
    return {
      intent: "acknowledgement",
      handled: true,
      reply: null,
      reason: "emoji only",
    };
  }

  if (ACKNOWLEDGEMENT.test(text)) {
    return {
      intent: "acknowledgement",
      handled: true,
      reply: null,
      reason: "acknowledgement — no reply needed",
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
  // Questions about the assistant itself. Answered here, by a fixed line, so
  // the model can never improvise "আমার মডেল বা টেকনিক্যাল ডিটেইলস নেই".
  // The answer is warm, does not claim to be a human being, and does not
  // announce being software either — then returns to the student's need.
  if (SELF_QUERY.test(text)) {
    return {
      intent: "self_query",
      handled: true,
      reply:
        "আমি GL Education-এর কাউন্সেলর টিমের একজন 🙂 চায়নায় পড়াশোনা আর ভর্তির ব্যাপারে আপনাকে সাহায্য করাই আমার কাজ। সরাসরি কারও সাথে কথা বলতে চাইলে এই নম্বরে কল করতে পারেন — +8801901923239। বলুন, কী জানতে চান?",
      reason: "question about the assistant",
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

  // Writing code, explaining a programming language, counting on demand: real
  // work, but not our work. A counsellor who writes your Python becomes a
  // general chatbot the moment someone tests it, so this is refused plainly
  // and warmly — and only when no study-in-China vocabulary is present.
  if (
    WANTS_HOMEWORK.test(text) ||
    (OFF_TOPIC_HINTS.test(text) && !TOPIC_WORDS.test(text)) ||
    // Counting is checked WITHOUT the topic-word escape: "type koro 1-100 then
    // ami admission nibo" tags a real word onto a chatbot test to slip past.
    COUNTING_TASK.test(text)
  ) {
    return {
      intent: "off_topic",
      handled: true,
      reply:
        "এটা আমি করে দিতে পারব না ভাইয়া 🙂 আমি GL Education-এর কাউন্সেলর — চায়নায় পড়াশোনা, ভর্তি, খরচ আর স্কলারশিপ নিয়ে সাহায্য করি। ওই ব্যাপারে কিছু জানতে চাইলে বলুন, আমি পূর্ণ সাহায্য করব।",
      reason: "outside counselling scope",
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

import { isCallRequest, callReply } from "@/lib/business/call-request";