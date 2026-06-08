import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import AdminSidebar from "~/components/admin/AdminSidebar";
import AdminTopBar from "~/components/admin/AdminTopBar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const userName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : (user?.emailAddresses?.[0]?.emailAddress ?? "Admin");
  const userInitials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : userName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8FAFC" }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar userName={userName} userInitials={userInitials} />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
