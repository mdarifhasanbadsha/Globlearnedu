import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "~/components/dashboard/DashboardSidebar";
import DashboardTopBar from "~/components/dashboard/DashboardTopBar";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "Student";

  const userName = firstName ? `${firstName}${lastName ? " " + lastName : ""}` : email;
  const userInitials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : firstName
      ? firstName[0]
      : email[0].toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8FAFC" }}>
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar userName={userName} userInitials={userInitials} />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
