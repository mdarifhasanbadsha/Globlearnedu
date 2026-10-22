// ─────────────────────────────────────────────────────────────────────
// Call requests.
//
// A student who wants to talk on the phone must not get a counselling
// paragraph — they need a way to reach us right now. We hand over the
// WhatsApp line and say plainly that the consultant answers there within 24
// hours. Saying "24 hours" is honest: it is a promise we can keep, unlike
// "someone will call you".
// ─────────────────────────────────────────────────────────────────────

/** The WhatsApp line students should use for voice/call contact. */
export const WHATSAPP_NUMBER = "+8801901923239";
export const WHATSAPP_LINK = "https://wa.me/8801901923239";

/** Recognise a request to speak by voice. */
export const CALL_REQUEST =
  /(?:call\s*(?:korte|korbo|koro|korben|diben|dite|dile|kore)?|phone\s*(?:korte|kore|diben|number)|kol\s*(?:dibo|dite|diben|korbo)?|ফোন\s*(?:করতে|করবো|করবেন|দিতে|দিবেন|নম্বর|কল)|কল\s*(?:দিবো|দিতে|দিবেন|করতে|করবেন)|কথা\s*বলতে|কথা\s*বলবো|কথা\s*বলবেন|talk\s*(?:to|with)|speak\s*(?:to|with)|voice\s*call|video\s*call|নম্বর\s*দেন|নম্বর\s*দিন|number\s*den|number\s*din|number\s*ta|(?:your|the)\s*(?:phone\s*)?number|give\s*me\s*(?:your|the)?\s*(?:phone\s*)?number|whats\s*(?:is|')?s?\s*your\s*number)/i;

/** The student wants to be phoned, or wants our number to call. */
export function isCallRequest(message: string): boolean {
  const m = message.trim();
  if (!m) return false;
  if (!CALL_REQUEST.test(m)) return false;

  // A call that already happened is a conversation about the past, not a
  // request for a new one. 'call korechilo' / 'call hoyeche' / 'call diyechilo'
  // must reach the follow-up logic, not this canned reply.
  if (
    /(?:korech|korse|diyech|diyeche|hoiye|hoye|esheche|peyech|hocche|hoyech)\w*|করেছে|দিয়েছে|হয়েছে|হয়|পেয়েছি|এসেছে|হচ্চে|হয়েছে/i.test(m)
  ) {
    return false;
  }
  return true;
}

/**
 * What to send. Bangla by default, English if the student wrote in English.
 * Deliberately one short message: a student who wants to call will call.
 */
export function callReply(lang: "bn" | "en"): string {
  if (lang === "en") {
    return (
      `Of course — talking is easier anyway. Call or WhatsApp me on ${WHATSAPP_NUMBER} and speak to a consultant directly. ` +
      `What time works for you, so I can make sure someone is ready?`
    );
  }
  return (
    `একদম ভাইয়া, সরাসরি কথা বললে অনেক সহজ 🙂 এই নম্বরেই call বা WhatsApp করতে পারেন — ${WHATSAPP_NUMBER}। ` +
    `আপনার জন্য কখন সুবিধা, সকালে নাকি বিকেলে?`
  );
}

