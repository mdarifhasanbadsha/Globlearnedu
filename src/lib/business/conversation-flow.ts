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
    [/language|ল্যাঙ্গুয়েজ|ভাষা/i, "Chinese Language"],
  ];

  // The LAST thing the student said decides. A student who says
  // "Diploma korbo na ami" has told us they are NOT doing Diploma — reading
  // "diploma" as their choice and answering "তাহলে Diploma" is a
  // misunderstanding that makes them repeat themselves in frustration.
  for (let i = history.length - 1; i >= 0; i--) {
    const h = history[i];
    if (h.direction !== "in") continue;

    // Negation: "X korbo na", "X lagbe na", "not X", "X chai na".
    const negated = h.body.match(
      /(diploma|ডিপ্লোমা|bachelor|ব্যাচেলর|master'?s?|মাস্টার|phd|পিএইচডি)\s*(?:korte|kore|korbo|lagbe|chai|chai na)?\s*na\b|(?:not|no)\s+(diploma|bachelor|master'?s?|phd)/i
    );
    if (negated) {
      const word = (negated[1] ?? negated[2] ?? "").toLowerCase();
      known.rejected_level = /dip/i.test(word) ? "Diploma" : /bach/i.test(word) ? "Bachelor" : word;
      continue;
    }

    for (const [rx, label] of levelPatterns) {
      if (rx.test(h.body)) {
        known.degree_level = label;
        break;
      }
    }
    if (known.degree_level) break;
  }

  // A bare "AI" is the SUBJECT Artificial Intelligence, never the word for
  // this assistant. Treating it as anything else makes the AI ask "which
  // subject?" after the student already said it.
  const subjectRe =
    /\b(artificial intelligence|computer science|software engineering|business administration|\bbusiness\b|civil engineering|mechanical engineering|electrical engineering|engineering|\bmbbs\b|medicine|nursing|pharmacy|\bai\b|architecture|accounting|economics|fashion design)\b|(?:কৃত্রিম বুদ্ধিমত্তা|কম্পিউটার সায়েন্স|ব্যবসায় প্রশাসন|সিভিল ইঞ্জিনিয়ারিং|মেডিসিন|নার্সিং|ফ্যাশন ডিজাইন)/i;
  for (let i = history.length - 1; i >= 0 && !known.subject_interest; i--) {
    const h = history[i];
    if (h.direction !== "in") continue;
    const m = h.body.match(subjectRe);
    if (m) {
      known.subject_interest =
        m[0].toLowerCase() === "ai" ? "Artificial Intelligence" : m[0];
      break;
    }
    // A message that is only "AI" (or ends with it) also counts. `\b` fails
    // when Bangla text sits right beside the Latin word, which is exactly
    // what students type.
    if (/(?:^|[\s,.!?।])ai(?:$|[\s,.!?।])/i.test(h.body.trim())) {
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
