import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import DashboardSidebar from "~/components/dashboard/DashboardSidebar";
import DashboardTopBar from "~/components/dashboard/DashboardTopBar";
import MobileDashboardNav from "~/components/dashboard/MobileDashboardNav";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as any)?.role as string | undefined;
  if (role === "admin" || role === "staff") redirect("/admin");
  if (role === "partner") redirect("/partner");

  const unreadRows = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(and(eq(notifications.userId, session.user.id), eq(notifications.isRead, false)));
  const unreadCount = unreadRows.length;

  const firstName = (session.user as any).firstName ?? "";
  const lastName = (session.user as any).lastName ?? "";
  const email = session.user.email ?? "Student";

  const userName = firstName
    ? `${firstName}${lastName ? " " + lastName : ""}`
    : email;
  const userInitials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : firstName
      ? firstName[0]
      : email[0].toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8FAFC" }}>
      <DashboardSidebar unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar userName={userName} userInitials={userInitials} role={(session.user as any).role ?? "student"} />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
      </div>
      <MobileDashboardNav />
    </div>
  );
}
