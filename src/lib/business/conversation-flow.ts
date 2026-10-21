// ─────────────────────────────────────────────────────────────
// Human-feel helpers for Messenger: a typing indicator, message
// batching, and quoted-message awareness.
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizMessages } from "@/lib/db/schema.business";
import { and, eq, gt, desc } from "drizzle-orm";

// ── typing indicator ───────────────────────────────────────────────────
// Meta shows "typing…" to the student for up to ~20s per send_action call.
// We start it before generating and stop it when the reply is sent, so the
// wait feels like a person composing rather than a machine pausing.
export const TYPING_REFRESH_MS = 12_000;

export async function sendTypingOn(psid: string): Promise<boolean> {
  return sendAction(psid, "typing_on");
}

export async function sendTypingOff(psid: string): Promise<boolean> {
  return sendAction(psid, "typing_off");
}

async function sendAction(psid: string, action: "typing_on" | "typing_off" | "mark_seen") {
  const token = process.env.META_PAGE_ACCESS_TOKEN?.trim();
  if (!token) return false;
  const version = process.env.META_GRAPH_VERSION?.trim() || "v26.0";

  try {
    const res = await fetch(`https://graph.facebook.com/${version}/me/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: psid },
        sender_action: action,
        access_token: token,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── message batching ───────────────────────────────────────────────────
// A student often types "vai", then "AI te bachelor", then "koto taka" in a
// few seconds. Answering each one produces three robotic replies to one
// thought. We wait for them to stop typing, then answer once.
export const BATCH_QUIET_MS = 4_000;

/**
 * How long to wait when a student is clearly in the middle of several messages.
 *
 * Four seconds is right for a single thought. But a student firing six
 * questions in a row would get six answers, repeating themselves — which reads
 * terribly. When more than one message arrives inside this window the reply is
 * deliberately delayed, so the whole burst gets exactly ONE answer.
 */
export const BURST_WAIT_MS = 30_000;

/**
 * Did the student send more than one message recently? If so, wait longer
 * before answering — they are mid-thought and will keep going.
 */
export function looksLikeBurst(
  messages: { body: string; createdAt: Date }[],
  now = new Date(),
  windowMs = BURST_WAIT_MS
): boolean {
  if (messages.length < 2) return false;
  const newest = new Date(messages[messages.length - 1].createdAt).getTime();
  // Only a burst if the messages are close together in time.
  return now.getTime() - newest < windowMs;
}

/**
 * The inbound messages that arrived in the same burst, oldest first.
 * Anything older than the quiet window belongs to an earlier thought.
 */
export async function recentInboundBurst(
  conversationId: string,
  quietMs = BATCH_QUIET_MS
): Promise<{ id: string; body: string; createdAt: Date }[]> {
  const since = new Date(Date.now() - Math.max(quietMs * 4, 20_000));
  const rows = await db
    .select({ id: bizMessages.id, body: bizMessages.body, createdAt: bizMessages.createdAt })
    .from(bizMessages)
    .where(
      and(
        eq(bizMessages.conversationId, conversationId),
        eq(bizMessages.direction, "in"),
        gt(bizMessages.createdAt, since)
      )
    )
    .orderBy(desc(bizMessages.createdAt))
    .limit(10);

  return rows.reverse();
}

/**
 * Should this message be answered now, or is the student likely to keep
 * typing? We answer once the newest inbound is at least `quietMs` old.
 */
export function burstSettled(
  newest: Date | null,
  now = new Date(),
  quietMs = BATCH_QUIET_MS
): boolean {
  if (!newest) return false;
  return now.getTime() - new Date(newest).getTime() >= quietMs;
}

/** Join a burst into one natural turn for the model. */
export function joinBurst(messages: { body: string }[]): string {
  const parts = messages
    .map((m) => m.body.trim())
    .filter((b) => b.length > 0);
  return parts.join("\n");
}

// ── quoted / previous messages ─────────────────────────────────────────
// Messaging webhooks can carry `reply_to` with the message being replied to.
// Feeding that to the model lets "ai ta koto?" resolve to the earlier topic.
export interface QuotedContext {
  text: string;
  mid: string | null;
}

export function quotedFromEvent(ev: any): QuotedContext | null {
  const reply = ev?.message?.reply_to;
  if (!reply) return null;
  const text = typeof reply.text === "string" ? reply.text.trim() : "";
  if (!text) return null;
  return { text, mid: typeof reply.mid === "string" ? reply.mid : null };
}

/** Format a quote so the model cannot confuse it with the new message. */
export function formatQuote(q: QuotedContext | null): string | null {
  if (!q) return null;
  return `[The student is replying to this earlier message: "${q.text.slice(0, 400)}"]`;
}

// ── known facts ────────────────────────────────────────────────────────
/**
 * Everything the student has already told us, read straight from the
 * transcript.
 *
 * Without this the model re-asks questions it has the answers to — the most
 * visible failure in a chat, where it asks "which subject?" one message
 * after the student named the subject. Reading the transcript rather than
 * the lead row keeps it independent of extraction timing.
 */
export function knownFacts(history: { direction: string; body: string }[]): Record<string, string> | null {
  const known: Record<string, string> = {};
  const all = history
    .filter((h) => h.direction === "in")
    .map((h) => h.body)
    .join(" ");

  // Level. Bangla words are matched too — students write "ডিপ্লোমা" far more
  // often than "diploma", and missing it causes the question to be re-asked.
  const levelPatterns: [RegExp, string][] = [
    [/phd|পিএইচডি/i, "PhD"],
    [/master'?s?|মাস্টার্স|মাস্টার/i, "Master's"],
    [/diploma|ডিপ্লোমা|ডিপ্লোমাতে|ডিপ্লোমার/i, "Diploma"],
    [/bachelor|ব্যাচেলর|স্নাতক/i, "Bachelor"],
    [/language|ল্যাঙ্গুয়েজ|ভাষা/i, "Language"],
  ];

  // The LAST thing the student said decides. A student who says
  // "Diploma korbo na ami" has told us they are NOT doing Diploma — reading
  // "diploma" as their choice and answering "তাহলে Diploma" is a
  // misunderstanding that makes them repeat themselves in frustration.
  //
  // Within ONE message, a later mention also wins: "age diploma korbo
  // vabsilam, but CST niye bachelor korbo" ends on bachelor.
  let rejected: string | null = null;
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    if (h.direction !== "in") continue;

    // Negation inside this message: "X korbo na", "not X".
    // "diploma korbo na, bachelor korbo" has BOTH words; the negated one must be
    // dropped and the affirmatively chosen one kept.
    const negated = h.body.match(
      /(diploma|ডিপ্লোমা|bachelor|ব্যাচেলর|master'?s?|মাস্টার|phd|পিএইচডি)\s*(?:korte|kore|korbo|lagbe|chai)?\s*na\b|(?:not|no)\s+(diploma|bachelor|master'?s?|phd)/i
    );
    if (negated) {
      const word = (negated[1] ?? negated[2] ?? "").toLowerCase();
      rejected = /dip/i.test(word) ? "Diploma" : /bach/i.test(word) ? "Bachelor" : word;

      // Do not `continue`: the same sentence often chooses something else.
      // "diploma korbo na, bachelor korbo" negates Diploma AND selects Bachelor,
      // and stopping here lost the choice the student actually made.
      const rest = h.body.replace(new RegExp(negated[0], "gi"), " ");
      let chosen: string | null = null;
      for (const [rx, label] of levelPatterns) {
        if (new RegExp(rx.source, "gi").test(rest)) chosen = label;
      }
      if (chosen && chosen !== rejected) {
        known.degree_level = chosen;
        break;
      }
      continue;
    }

    // Take the LAST level mentioned in this message, not the first.
    let lastLabel: string | null = null;
    for (const [rx, label] of levelPatterns) {
      const m = h.body.match(new RegExp(rx.source, "gi"));
      if (m) lastLabel = label;
    }
    if (lastLabel) {
      known.degree_level = lastLabel;
      break;
    }
  }
  if (rejected) {
    known.rejected_level = rejected;
    if (known.degree_level === rejected) delete known.degree_level;
  }

  // A bare "AI" is the SUBJECT Artificial Intelligence, never the word for
  // this assistant. Treating it as anything else makes the AI ask "which
  // subject?" after the student already said it.
  //
  // CST is Computer Science & Technology, the abbreviation students and
  // Bangladeshi families actually use; missing it loses a whole subject.
  const subjectRe =
    /\b(artificial intelligence|computer science(?: and technology)?|software engineering|business administration|\bbusiness\b|civil engineering|mechanical engineering|electrical engineering|engineering|\bmbbs\b|medicine|nursing|pharmacy|\bai\b|\bcst\b|\beee\b|\bcse\b|information technology|architecture|accounting|economics|fashion design)\b|(?:কৃত্রিম বুদ্ধিমত্তা|কম্পিউটার সায়েন্স|ব্যবসায় প্রশাসন|সিভিল ইঞ্জিনিয়ারিং|মেডিসিন|নার্সিং|ফ্যাশন ডিজাইন)/i;

  // The most recent subject wins, and a message that announces a change of
  // mind invalidates everything said before it.
  const CHANGE_OF_MIND =
    /(?:notun\s*kore|নতুন\s*করে|notun\s*kotha|আর\s*নতুন|change\s*kor|বদল|poriborton|আগের\s*কথা|ager\s*kotha|vabsilam|ভাবসিলাম|actually|আসলে)/i;

  let cutoff = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    if (h.direction !== "in") continue;
    if (CHANGE_OF_MIND.test(h.body)) {
      // Everything at or before this message is superseded by what follows.
      cutoff = i;
      break;
    }
  }

  const recent = history.slice(cutoff).filter((h) => h.direction === "in");

  for (let i = recent.length - 1; i >= 0 && !known.subject_interest; i--) {
    const body = recent[i].body;
    const m = body.match(subjectRe);
    if (m) {
      const raw = m[0].toLowerCase();
      // Expand the abbreviations so the model never has to guess.
      if (raw === "ai") known.subject_interest = "Artificial Intelligence";
      else if (raw === "cst") known.subject_interest = "Computer Science and Technology (CST)";
      else if (raw === "cse") known.subject_interest = "Computer Science and Engineering (CSE)";
      else if (raw === "eee") known.subject_interest = "Electrical and Electronic Engineering (EEE)";
      else known.subject_interest = m[0];
      break;
    }
    // A message that is only "AI" (or ends with it) also counts. `\b` fails
    // when Bangla text sits right beside the Latin word, which is exactly
    // what students type.
    if (/(?:^|[\s,.!?।])ai(?:$|[\s,.!?।])/i.test(body.trim())) {
      known.subject_interest = "Artificial Intelligence";
    }
  }

  // GPA with its scale, in the forms students actually use:
  //   "4.50 er moddhe 5", "3.8/4", "GPA 4.5 out of 5", "4.20"
  const gpa = all.match(
    /\b(\d(?:\.\d{1,2})?)\s*(?:\/\s*(\d)|\s*(?:er|of|out of)\s*(?:moddhe\s*)?(\d))|\b(?:gpa)\s*(\d(?:\.\d{1,2})?)/i
  );
  if (gpa) {
    const value = gpa[1] ?? gpa[4];
    const scale = gpa[2] ?? gpa[3];
    if (value) known.gpa_value = value;
    if (scale) known.gpa_scale = scale;
  }

  const phone = all.match(/(?:\+?88)?01\d{9}/);
  if (phone) known.phone = phone[0];

  const intake = all.match(/\b(march|september|january|april|october)\s*(20\d{2})\b/i);
  if (intake) known.intake = `${intake[1]} ${intake[2]}`;

  // HSC / SSC year and group. Students answer "2022/ science" or
  // "HSC 2021, commerce", and if this is not remembered the AI asks again —
  // which is exactly what makes them say "shob e bolsi".
  const hscYear = all.match(/\b(?:hsc|ssc)?\s*(20(?:0\d|1\d|2\d))\b/i);
  if (hscYear) known.exam_year = hscYear[1];

  const group = all.match(/\b(science|commerce|business studies|arts|humanities)\b/i);
  if (group) known.exam_group = group[1];

  return Object.keys(known).length > 0 ? known : null;
}

/**
 * A one-line recap of the conversation so far.
 *
 * Once a thread passes the history window, the oldest messages are cut and
 * the model loses the thread of what was discussed. Rather than raising the
 * window forever — which costs tokens on every message — the earlier turns
 * are compressed into a short recap that stays cheap.
 */
export function conversationRecap(
  history: { direction: string; body: string }[],
  keepRecent = 20
): string | null {
  if (history.length <= keepRecent) return null;

  const older = history.slice(0, history.length - keepRecent);
  const asked = older
    .filter((h) => h.direction === "in")
    .map((h) => h.body.replace(/\s+/g, " ").trim())
    .filter((b) => b.length > 1 && !/^\[/.test(b))
    .slice(-12);
  const told = older
    .filter((h) => h.direction === "out")
    .map((h) => h.body.replace(/\s+/g, " ").trim())
    .filter((b) => b.length > 1)
    .slice(-6);

  if (asked.length === 0 && told.length === 0) return null;

  const lines = [
    "EARLIER IN THIS CONVERSATION (compressed — do not repeat any of it):",
    asked.length ? `Student asked about: ${asked.map((a) => `"${a.slice(0, 90)}"`).join(", ")}` : "",
    told.length ? `We already told them: ${told.map((t) => `"${t.slice(0, 80)}"`).join(", ")}` : "",
    "Do not re-explain these points. Continue from where the conversation actually is.",
  ].filter(Boolean);

  return lines.join("\n");
}
