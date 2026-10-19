import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { canAccessBusiness, BUSINESS_NAME } from "@/lib/business/config";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/business", label: "Overview" },
  { href: "/business/inbox", label: "Inbox" },
  { href: "/business/setup", label: "Setup" },
];

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
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      <header className="bg-[#0A1628] text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/business" className="font-bold text-sm md:text-base truncate">
              {BUSINESS_NAME}
              <span className="text-[#29ABE2]"> · Business</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs md:text-sm shrink-0">
            <span className="hidden sm:inline text-white/60">{name}</span>
            <span className="px-2 py-1 rounded bg-white/10 uppercase tracking-wide text-[10px]">
              {role}
            </span>
            <Link href="/" className="text-[#29ABE2] hover:underline">
              Site
            </Link>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-2 md:px-6 flex gap-1 overflow-x-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 md:px-4 py-3 text-sm font-medium text-[#1B3A6B] hover:bg-slate-50 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-6 pb-24">{children}</main>
    </div>
  );
}
