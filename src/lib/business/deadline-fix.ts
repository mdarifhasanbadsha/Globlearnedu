// ─────────────────────────────────────────────────────────────
// Brochure year correction.
//
// Real brochures in circulation are often printed for a previous year
// and never updated. The owner's rule (confirmed 2026-10):
//
//   - A deadline already in the PAST is stale.
//   - A January deadline belongs to the NEXT year (e.g. January -> 2027
//     when the current intake cycle is 2027).
//   - A December deadline belongs to the CURRENT cycle year (2026).
//
// We therefore roll a past deadline forward year by year until it is in
// the future, which turns "30 Jan 2026" into "30 Jan 2027" without
// touching the day or month printed on the brochure.
// ─────────────────────────────────────────────────────────────

import { parseLooseDate } from "./sanity";

export interface DeadlineFix {
  changed: boolean;
  original: string;
  corrected: string;
  reason?: string;
}

function formatLike(original: string, date: Date): string {
  // Preserve the brochure's own style where we can.
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const monthShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ][date.getUTCMonth()];
  const monthFull = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][date.getUTCMonth()];

  // "31, Dec 2026" style
  if (/^\d{1,2},\s*[A-Za-z]+\s+\d{4}$/.test(original.trim())) {
    return `${day}, ${monthShort} ${year}`;
  }
  // "31 December 2026" style
  if (/^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/.test(original.trim())) {
    return `${day} ${monthFull} ${year}`;
  }
  // ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(original.trim())) {
    return `${year}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return `${day}, ${monthShort} ${year}`;
}

/**
 * Roll a stale deadline forward until it is in the future.
 * Day and month are never changed — only the year.
 */
export function correctDeadline(
  deadlineText: string | null,
  now: Date = new Date(),
  maxYearsForward = 5
): DeadlineFix {
  const original = (deadlineText ?? "").trim();
  if (!original) {
    return { changed: false, original, corrected: original };
  }

  const parsed = parseLooseDate(original);
  if (!parsed) {
    return {
      changed: false,
      original,
      corrected: original,
      reason: "Could not read as a date; leave for manual review.",
    };
  }

  // Already in the future: keep exactly as printed.
  if (parsed.getTime() >= now.getTime()) {
    return { changed: false, original, corrected: original };
  }

  const rolled = new Date(parsed.getTime());
  let yearsAdded = 0;
  while (rolled.getTime() < now.getTime() && yearsAdded < maxYearsForward) {
    rolled.setUTCFullYear(rolled.getUTCFullYear() + 1);
    yearsAdded++;
  }

  // Guard against 29 February landing on a non-leap year.
  if (rolled.getUTCDate() !== parsed.getUTCDate()) {
    return {
      changed: false,
      original,
      corrected: original,
      reason: "29 February could not be rolled forward safely; check manually.",
    };
  }

  return {
    changed: true,
    original,
    corrected: formatLike(original, rolled),
    reason: `Year was stale (past date); rolled forward ${yearsAdded} year(s) to ${rolled.getUTCFullYear()}. Day and month unchanged.`,
  };
}
