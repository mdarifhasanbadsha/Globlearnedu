"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Users, UserPlus, DollarSign,
  Bell, User, MessageCircle,
} from "lucide-react";

const WA_SUPPORT =
  "https://wa.me/8615655031556?text=Hi!%20I%27m%20a%20Globlearn%20Education%20partner%20and%20need%20assistance.";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
};

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Portal",
    items: [
      { label: "Dashboard", href: "/partner", icon: LayoutDashboard, exact: true },
      { label: "My Students", href: "/partner/students", icon: Users },
      { label: "Add Student", href: "/partner/add-student", icon: UserPlus, badge: "NEW" },
      { label: "Commissions", href: "/partner/commission", icon: DollarSign },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Notices", href: "/partner/notices", icon: Bell, badge: "1" },
      { label: "Profile", href: "/partner/profile", icon: User },
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
            ? { backgroundColor: "#C8102E10", color: "#C8102E" }
            : { color: "#475569" }
        }
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
            style={{ backgroundColor: "#C8102E" }}
          />
        )}
        <Icon
          size={16}
          style={{ color: active ? "#C8102E" : "#64748B", flexShrink: 0 }}
        />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: item.badge === "NEW" ? "#C8102E" : "#1B3A6B" }}
          >
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function PartnerSidebar() {
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
            style={{ backgroundColor: "#1B3A6B" }}
          >
            <span className="text-white text-xs font-black">GL</span>
          </div>
          <div>
            <p className="text-xs font-black leading-tight" style={{ color: "#1B3A6B" }}>
              Globlearn
            </p>
            <p className="text-[10px] font-medium leading-tight" style={{ color: "#94A3B8" }}>
              Partner Portal
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

      {/* Bottom WhatsApp */}
      <div className="p-4 border-t" style={{ borderColor: "#E2E8F0" }}>
        <a
          href={WA_SUPPORT}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={15} />
          Partner support
        </a>
        <p className="text-center text-[10px] mt-2" style={{ color: "#94A3B8" }}>
          Replies in 5 min · 24/7
        </p>
      </div>
    </aside>
  );
}
