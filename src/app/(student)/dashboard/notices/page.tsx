import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { notifications as notifTable } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import NoticesClient from "./_NoticesClient";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;

  const notices = await db
    .select()
    .from(notifTable)
    .where(eq(notifTable.userId, userId))
    .orderBy(desc(notifTable.createdAt))
    .limit(100);

  return <NoticesClient notices={notices} />;
}
