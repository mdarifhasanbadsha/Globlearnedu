export { auth, signIn, signOut } from "./config";
export { requireAuth, requireRole, getOptionalSession } from "./helpers";
export type { UserRole } from "./types";

export function isStudent(role: string | null): role is "student" {
  return role === "student";
}
export function isPartner(role: string | null): role is "partner" {
  return role === "partner";
}
export function isStaff(role: string | null): role is "staff" {
  return role === "staff";
}
export function isAdmin(role: string | null): role is "admin" {
  return role === "admin";
}
