"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  hint?: string;
}

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Daily work",
    items: [
      { href: "/business", label: "Dashboard", icon: "▦" },
      { href: "/business/inbox", label: "Inbox", icon: "✉" },
      { href: "/business/leads", label: "Leads", icon: "◉" },
      { href: "/business/followups", label: "Followups", icon: "◷" },
    ],
  },
  {
    title: "Knowledge",
    items: [
      { href: "/business/knowledge", label: "Universities", icon: "▤" },
      { href: "/business/style", label: "Brand voice", icon: "✎" },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/business/connections", label: "Channels", icon: "⇄" },
      { href: "/business/setup", label: "Health", icon: "⚙" },
    ],
  },
];

export default function BusinessSidebar({
  userName,
  role,
}: {
  userName: string;
  role: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/business" ? pathname === "/business" : pathname.startsWith(href);

  const nav = (
    <nav className="space-y-5">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {g.title}
          </div>
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-base leading-none w-4 text-center" aria-hidden>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0A1628] text-white">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-sm truncate">GL Education</span>
            <span className="text-[#29ABE2] text-xs">Business</span>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="p-2 -mr-2 text-white/80 hover:text-white"
          >
            <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
          </button>
        </div>
        {open && (
          <div className="px-3 pb-4 border-t border-white/10 pt-3">
            {nav}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/60 truncate">{userName}</span>
              <Link href="/" className="text-[#29ABE2] hover:underline shrink-0 ml-2">
                View site
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 bg-[#0A1628] text-white min-h-screen p-4">
        <Link href="/business" className="block px-2 mb-6">
          <div className="font-bold text-base leading-tight">GL Education</div>
          <div className="text-[#29ABE2] text-xs font-medium">Business</div>
        </Link>

        <div className="flex-1">{nav}</div>

        <div className="pt-4 mt-4 border-t border-white/10">
          <div className="px-2 text-sm text-white/90 truncate">{userName}</div>
          <div className="px-2 text-[11px] text-white/40 uppercase tracking-wide mb-3">{role}</div>
          <Link
            href="/"
            className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10"
          >
            ← View site
          </Link>
        </div>
      </aside>
    </>
  );
}
