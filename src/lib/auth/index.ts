import { type NextRequest } from 'next/server';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import type { UserRole } from '~/types';

export async function getUserRole(req: NextRequest): Promise<UserRole | null> {
  const auth = getAuth(req);
  if (!auth.userId) return null;
  const user = await clerkClient.users.getUser(auth.userId);
  return (user.publicMetadata?.role as UserRole | undefined) ?? null;
}

export function isStudent(role: string | null): role is 'student' {
  return role === 'student';
}

export function isPartner(role: string | null): role is 'partner' {
  return role === 'partner';
}

export function isStaff(role: string | null): role is 'staff' {
  return role === 'staff';
}

export function isAdmin(role: string | null): role is 'admin' {
  return role === 'admin';
}

export function requireRole(role: UserRole | null, expected: UserRole[]) {
  return role !== null && expected.includes(role);
}
