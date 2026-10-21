// ─────────────────────────────────────────────────────────────────────
// Rest mode.
//
// Some conversations stop being productive: nonsense, repeated jokes, attempts
// to make the assistant break character. Continuing to answer burns the API
// budget, floods the inbox and makes the AI look foolish.
//
// The owner's decision: exit gracefully, stay quiet for 15 minutes, then come
// back only if the student asks something genuine.
//
// The exit must never sound like a punishment. It says plainly that we cannot
// help further and offers a phone call — which is honest, keeps the door open,
// and gives the student a real way forward instead of silence.
// ─────────────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const REST_MINUTES = 15;

/**
 * The graceful exit. Never a punishment, never a complaint about the student:
 * it says plainly that we cannot help further right now and offers a phone
 * call, which keeps the door open and is honest.
 */
export const REST_REPLY =
  "দুঃখিত ভাইয়া, এই আলোচনায় আমি আপনাকে আর ভালোভাবে সাহায্য করতে পারছি না। ভর্তি, খরচ বা স্কলারশিপ নিয়ে সত্যিই কিছু জানার থাকলে আমাদের অফিসে সরাসরি কথা বলতে পারেন — +8801901923239 (Call/WhatsApp)। 🙏";

/** How many non-genuine turns before we step away. */
export const REST_AFTER_STRIKES = 4;

/**
 * Strikes are consecutive. One genuine question resets the count, because a
 * student who jokes and then asks about fees is a real student.
 */
export function nextStrikeCount(current: number, intent: string): number {
  const countsAsStrike =
    intent === "off_topic" || intent === "manipulation" || intent === "abuse" || intent === "nonsense";
  return countsAsStrike ? current + 1 : 0;
}

export function shouldRest(strikes: number): boolean {
  return strikes >= REST_AFTER_STRIKES;
}

export function restUntil(now = new Date()): Date {
  return new Date(now.getTime() + REST_MINUTES * 60_000);
}

export function isResting(restingUntil: Date | null | undefined, now = new Date()): boolean {
  if (!restingUntil) return false;
  return new Date(restingUntil).getTime() > now.getTime();
}

export function minutesLeft(restingUntil: Date, now = new Date()): number {
  return Math.max(0, Math.ceil((new Date(restingUntil).getTime() - now.getTime()) / 60_000));
}

/**
 * Has a genuinely helpful question arrived? Chat vocabulary counts, and so do
 * the words a student uses when they come back seriously.
 */
const GENUINE_WORDS =
  /diploma|ডিপ্লোমা|bachelor|ব্যাচেলর|master|মাস্টার|phd|পিএইচডি|scholarship|স্কলারশিপ|universit|বিশ্ববিদ্যালয়|fee|ফি|খরচ|charge|চার্জ|টাকা|taka|visa|ভিসা|document|ডকুমেন্ট|intake|ইন্টেক|hsc|ssc|gpa|result|রেজাল্ট|apply|আবেদন|ভর্তি|admission|program|প্রোগ্রাম|subject|বিষয়|office|অফিস|সালাম|salam|hello|hi\b|হ্যালো|হাই|sorry|দুঃখিত|hostel|হোস্টেল|language|ভাষা|mbbs|engineering|ইঞ্জিনিয়ারিং|কথা\s*বল|জানতে|help|সাহায্য/i;

export function looksGenuine(message: string): boolean {
  return GENUINE_WORDS.test(message);
}

export interface RestDecision {
  /** True when the AI must stay silent for this message. */
  silent: boolean;
  /** True when the rest just expired and we should say so politely. */
  resuming: boolean;
  /** Minutes left, for logging. */
  minutes: number;
}

/**
 * Decide what to do with a message while a conversation is resting.
 *
 *   still resting + not genuine  -> stay silent
 *   still resting + genuine      -> resume now (the owner's call: a real
 *                                   question always wins over the timer)
 *   rest expired                 -> resume quietly on the next message
 */
export function decideRest(
  message: string,
  restingUntil: Date | null | undefined,
  now = new Date()
): RestDecision {
  const resting = isResting(restingUntil, now);

  if (!resting) {
    return { silent: false, resuming: false, minutes: 0 };
  }

  const left = minutesLeft(restingUntil as Date, now);
  if (looksGenuine(message)) {
    return { silent: false, resuming: true, minutes: left };
  }

  return { silent: true, resuming: false, minutes: left };
}

/** Persist the state. All writes are best effort; they never block a reply. */
export async function enterRest(conversationId: string): Promise<void> {
  try {
    await db.execute(
      sql`update biz_conversations set resting_until = ${new Date(
        Date.now() + REST_MINUTES * 60_000
      )} where id = ${conversationId}`
    );
  } catch {
    /* column not applied yet — rest mode simply stays off */
  }
}

export async function leaveRest(conversationId: string): Promise<void> {
  try {
    await db.execute(
      sql`update biz_conversations set resting_until = null where id = ${conversationId}`
    );
  } catch {
    /* nothing to clear */
  }
}

export async function bumpStrikes(conversationId: string, intent: string): Promise<number> {
  try {
    const rows: any[] = await db
      .execute(sql`select strike_count from biz_conversations where id = ${conversationId} limit 1`)
      .then((r: any) => r?.rows ?? r ?? []);
    const current = Number(rows?.[0]?.strike_count ?? 0);
    const next = nextStrikeCount(current, intent);
    await db.execute(
      sql`update biz_conversations set strike_count = ${next}, updated_at = now() where id = ${conversationId}`
    );
    return next;
  } catch {
    return 0;
  }
}
