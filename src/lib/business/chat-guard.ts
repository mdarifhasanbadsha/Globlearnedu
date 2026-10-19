// ─────────────────────────────────────────────────────────────
// Website chat — public (guest) endpoints.
// No auth by design, so every request is rate limited and every
// response is scoped to the caller's own session token.
// ─────────────────────────────────────────────────────────────

import { db } from "@/lib/db";
import { bizRateLimits } from "@/lib/db/schema.business2";
import { eq, and, sql } from "drizzle-orm";

export const RATE_WINDOW_MS = 60_000;

/** Returns true when the caller is over budget for this window. */
export async function isRateLimited(bucketKey: string, limit: number): Promise<boolean> {
  const windowStart = new Date(Math.floor(Date.now() / RATE_WINDOW_MS) * RATE_WINDOW_MS);

  try {
    const [row] = await db
      .insert(bizRateLimits)
      .values({ bucketKey, windowStart, count: 1 })
      .onConflictDoUpdate({
        target: [bizRateLimits.bucketKey, bizRateLimits.windowStart],
        set: { count: sql`${bizRateLimits.count} + 1` },
      })
      .returning({ count: bizRateLimits.count });

    return (row?.count ?? 0) > limit;
  } catch {
    // Never let a limiter failure block a real student.
    return false;
  }
}

// Guest tokens are random and unguessable — never sequential IDs.
const TOKEN_RE = /^g_[a-f0-9]{32}$/;

export function isValidGuestToken(token: unknown): token is string {
  return typeof token === "string" && TOKEN_RE.test(token);
}

export function newGuestToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return "g_" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
