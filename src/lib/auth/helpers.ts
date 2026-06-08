import { auth } from "./config";
import { redirect } from "next/navigation";
import type { UserRole } from "./types";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  const role = (session.user as any).role as UserRole;
  if (!allowedRoles.includes(role)) redirect("/dashboard");
  return session;
}

export async function getOptionalSession() {
  return auth();
}
