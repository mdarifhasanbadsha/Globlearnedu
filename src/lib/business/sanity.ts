// ─────────────────────────────────────────────────────────────
// Knowledge sanity checks.
// Brochures frequently contain stale or impossible dates. Rather than
// trusting them, flag entries whose deadline contradicts their intake
// year so a human confirms before a student is quoted a past date.
// ─────────────────────────────────────────────────────────────

export interface SanityIssue {
  field: string;
  message: string;
}

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/** Accept full names and abbreviations ("Dec", "January", "Sept"). */
function monthIndex(name: string): number {
  const n = name.trim().toLowerCase();
  if (n.length < 3) return -1;

  const exact = MONTHS.indexOf(n);
  if (exact >= 0) return exact;

  // Prefix match, but only when unambiguous (so "ju" is rejected).
  const hits = MONTHS.map((m, i) => (m.startsWith(n) ? i : -1)).filter((i) => i >= 0);
  return hits.length === 1 ? hits[0] : -1;
}

/**
 * Extract a date from strings like "31, Dec 2026", "30 January 2026",
 * "2026-05-15". Returns null when no unambiguous date can be read.
 */
export function parseLooseDate(text: string | null): Date | null {
  if (!text) return null;
  const t = text.trim();

  // ISO form
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const d = new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // "31, Dec 2026" / "30 January 2026" / "Jan 30, 2026" / "31 Dec 2026"
  // Separators may be a comma, whitespace, or comma+whitespace.
  const SEP = "(?:[,\\s]+)";
  const m =
    t.match(new RegExp(`(\\d{1,2})${SEP}([A-Za-z]+)${SEP}(\\d{4})`)) ??
    t.match(new RegExp(`([A-Za-z]+)${SEP}(\\d{1,2})${SEP}(\\d{4})`));
  if (!m) return null;

  let day: number, mon: string, year: number;
  if (/^\d+$/.test(m[1])) {
    day = +m[1];
    mon = m[2];
    year = +m[3];
  } else {
    mon = m[1];
    day = +m[2];
    year = +m[3];
  }

  const mi = monthIndex(mon);
  if (mi < 0 || day < 1 || day > 31) return null;

  const d = new Date(Date.UTC(year, mi, day));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Year mentioned in an intake string, e.g. "March (Spring) 2027" -> 2027. */
export function intakeYear(intakeText: string | null): number | null {
  if (!intakeText) return null;
  const m = intakeText.match(/\b(20\d{2})\b/);
  return m ? Number(m[1]) : null;
}

/**
 * Flag deadlines that are in the past, or that fall before the intake year
 * in a way that suggests a typo (e.g. March 2027 intake, Jan 2026 deadline).
 */
export function checkEntry(fields: {
  intakeText?: string | null;
  applicationDeadline?: string | null;
  tuitionAmount?: number | null;
  tuitionPeriod?: string | null;
  now?: Date;
}): SanityIssue[] {
  const issues: SanityIssue[] = [];
  const now = fields.now ?? new Date();

  const deadline = parseLooseDate(fields.applicationDeadline ?? null);
  if (fields.applicationDeadline && !deadline) {
    issues.push({
      field: "applicationDeadline",
      message: `Deadline "${fields.applicationDeadline}" could not be read as a date.`,
    });
  }

  if (deadline) {
    if (deadline.getTime() < now.getTime()) {
      issues.push({
        field: "applicationDeadline",
        message: `Deadline ${fields.applicationDeadline} is already in the past.`,
      });
    }

    const iy = intakeYear(fields.intakeText ?? null);
    // A deadline in the calendar year before the intake is normal (e.g. 31 Dec 2026
    // for a March 2027 intake). Only a gap of 2+ years signals a typo.
    if (iy && iy - deadline.getUTCFullYear() >= 2) {
      issues.push({
        field: "applicationDeadline",
        message:
          `Deadline year (${deadline.getUTCFullYear()}) is ${iy - deadline.getUTCFullYear()} years ` +
          `before the intake year (${iy}). Likely a typo in the brochure — confirm before quoting it.`,
      });
    }
  }

  if (fields.tuitionAmount != null && fields.tuitionAmount > 0 && !fields.tuitionPeriod) {
    issues.push({
      field: "tuitionPeriod",
      message: "Tuition has no billing period (per semester / year / month).",
    });
  }

  if (fields.tuitionAmount != null && fields.tuitionAmount > 200_000) {
    issues.push({
      field: "tuitionAmount",
      message: `Tuition ${fields.tuitionAmount} looks implausibly high for a language program.`,
    });
  }

  return issues;
}
