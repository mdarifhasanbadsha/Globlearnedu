import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, notifications } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import StaffSidebar from "~/components/staff/StaffSidebar";
import StaffTopBar from "~/components/staff/StaffTopBar";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const firstName = (session.user as any).firstName ?? "";
  const lastName = (session.user as any).lastName ?? "";
  const email = session.user.email ?? "Staff";

  const userName = firstName || lastName ? `${firstName} ${lastName}`.trim() : email;
  const userInitials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : userName.slice(0, 2).toUpperCase();

  // Real queue badge: submitted applications with no assigned staff
  const queueRows = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.status, "submitted"), isNull(applications.assignedStaffId)));

  // Real unread notices count for this staff user
  const notifRows = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(and(eq(notifications.userId, session.user.id!), eq(notifications.isRead, false)));

  const queueCount = queueRows.length;
  const unreadCount = notifRows.length;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8FAFC" }}>
      <StaffSidebar queueCount={queueCount} unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <StaffTopBar userName={userName} userInitials={userInitials} />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
