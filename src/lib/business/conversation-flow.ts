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
  if (/diploma|ডিপ্লোমা|ডিপ্লোমাতে|ডিপ্লোমার/i.test(all)) known.degree_level = "Diploma";
  else if (/master'?s?|মাস্টার্স|মাস্টার/i.test(all)) known.degree_level = "Master's";
  else if (/\bphd\b|পিএইচডি/i.test(all)) known.degree_level = "PhD";
  else if (/bachelor|ব্যাচেলর|স্নাতক/i.test(all)) known.degree_level = "Bachelor";
  else if (/language|ল্যাঙ্গুয়েজ|ভাষা/i.test(all)) known.degree_level = "Chinese Language";

  const subject = all.match(
    /\b(artificial intelligence|computer science|software engineering|business administration|\bbusiness\b|civil engineering|mechanical engineering|electrical engineering|engineering|\bmbbs\b|medicine|nursing|pharmacy|\bai\b|architecture|accounting|economics|fashion design)\b|(?:কৃত্রিম বুদ্ধিমত্তা|কম্পিউটার সায়েন্স|ব্যবসায় প্রশাসন|সিভিল ইঞ্জিনিয়ারিং|মেডিসিন|নার্সিং|ফ্যাশন ডিজাইন)/i
  );
  if (subject) known.subject_interest = subject[0];

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
