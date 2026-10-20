import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { canAccessBusiness } from "@/lib/business/config";
import BusinessSidebar from "./_BusinessNav";

export const dynamic = "force-dynamic";

export default async function BusinessLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;

  if (!session?.user) redirect("/sign-in?callbackUrl=/business");
  if (!canAccessBusiness(role)) redirect("/dashboard");

  const name =
    [session.user?.firstName, session.user?.lastName].filter(Boolean).join(" ") ||
    session.user?.email ||
    "Staff";

  return (
    <div className="min-h-screen lg:flex" style={{ backgroundColor: "#F1F5F9" }}>
      <BusinessSidebar userName={name} role={role ?? "staff"} />
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">{children}</div>
      </main>
    </div>
  );
}
