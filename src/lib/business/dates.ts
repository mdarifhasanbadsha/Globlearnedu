// ─────────────────────────────────────────────────────────────
// Deterministic date formatting.
//
// Calling toLocaleDateString() during a server render uses the server
// locale/timezone, while the browser uses the client's. The two strings
// disagree and React raises a hydration mismatch (error #418). These
// helpers pin the timezone and locale so server and client agree.
// ─────────────────────────────────────────────────────────────

const TZ = process.env.BUSINESS_TIMEZONE || "Asia/Dhaka";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATETIME_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return DATE_FMT.format(d);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return DATETIME_FMT.format(d);
}

/** Group numbers the same way on server and client. */
export function formatNumber(n: number | null | undefined): string {
  return (n ?? 0).toLocaleString("en-GB");
}
