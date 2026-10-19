import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { canAccessBusiness } from "@/lib/business/config";

export const dynamic = "force-dynamic";

/**
 * Shared guard for every /api/business route.
 * Authorization is resolved server-side from the session — the browser
 * never supplies a business_id.
 */
export async function requireBusinessUser() {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!canAccessBusiness(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return {
    userId: session.user.id as string,
    role: role as string,
  };
}
