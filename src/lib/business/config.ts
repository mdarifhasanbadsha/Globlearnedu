// ─────────────────────────────────────────────────────────────
// Business constants and helpers for the /business area.
// Single-business boundary now; business_id carried for future use.
// ─────────────────────────────────────────────────────────────

/**
 * GL Education is the only configured business for this phase.
 * Resolved server-side only — never trusted from the browser.
 */
export const PRIMARY_BUSINESS_ID = "18a043a9-0160-4e2f-800a-413f6ff8de6f";

export const BUSINESS_NAME = "GL Education";
export const BUSINESS_TIMEZONE = process.env.BUSINESS_TIMEZONE || "Asia/Dhaka";

export function getBusinessId(): string {
  const fromEnv = process.env.BUSINESS_ID?.trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fromEnv ?? "")
    ? (fromEnv as string)
    : PRIMARY_BUSINESS_ID;
}

/** Explicit role gate for the business area. */
export function canAccessBusiness(role: string | null | undefined): boolean {
  return role === "admin" || role === "staff";
}
