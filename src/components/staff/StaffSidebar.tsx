"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  FileSearch,
  Bell,
  User,
  ExternalLink,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
};

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Work",
    items: [
      { label: "Application Queue", href: "/staff", icon: ClipboardList, exact: true, badge: "12" },
      { label: "My Reviews", href: "/staff/applications", icon: FileSearch },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Notices", href: "/staff/notices", icon: Bell, badge: "2" },
      { label: "Profile", href: "/staff/profile", icon: User },
    ],
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link href={item.href}>
      <span
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm font-medium transition-colors relative"
        style={
          active
            ? { backgroundColor: "rgba(5,150,105,0.1)", color: "#059669" }
            : { color: "#475569" }
        }
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
            style={{ backgroundColor: "#059669" }}
          />
        )}
        <Icon size={16} style={{ color: active ? "#059669" : "#64748B", flexShrink: 0 }} />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: active ? "#059669" : "#1B3A6B" }}
          >
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function StaffSidebar() {
  const pathname = usePathname();

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 border-r"
      style={{ width: 240, backgroundColor: "white", borderColor: "#E2E8F0", minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "#E2E8F0" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#059669" }}
          >
            <span className="text-white text-xs font-black">GL</span>
          </div>
          <div>
            <p className="text-xs font-black leading-tight" style={{ color: "#1B3A6B" }}>
              Globlearn
            </p>
            <p className="text-[10px] font-semibold leading-tight" style={{ color: "#059669" }}>
              Staff Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.section} className="mb-5">
            <p
              className="px-6 pb-2 text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "#94A3B8" }}
            >
              {section.section}
            </p>
            {section.items.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(item)} />
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: "#E2E8F0" }}>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold border transition-colors"
          style={{ borderColor: "#E2E8F0", color: "#64748B" }}
        >
          <ExternalLink size={13} />
          View Site
        </Link>
      </div>
    </aside>
  );
}
