"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, FileText, FolderOpen, Bell,
  MessageCircle, MapPin, CreditCard, Map, Lock,
} from "lucide-react";

const WA_ADVISOR = "https://wa.me/8615655031556?text=Hi!%20%F0%9F%91%8B%20I%20need%20help%20with%20my%20application.%20Can%20you%20assist?";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
  external?: boolean;
  locked?: boolean;
};

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "My Application",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
      { label: "My Application", href: "/dashboard/application", icon: FileText },
      { label: "Documents", href: "/dashboard/documents", icon: FolderOpen },
      { label: "Notices", href: "/dashboard/notices", icon: Bell, badge: 2 },
    ],
  },
  {
    section: "Support",
    items: [
      { label: "Message Advisor", href: WA_ADVISOR, icon: MessageCircle, external: true },
      { label: "Track Application", href: "/track", icon: MapPin },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
      { label: "China Guide", href: "/dashboard/guide", icon: Map, locked: true },
    ],
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  const content = (
    <span
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm font-medium transition-colors relative"
      style={
        active
          ? { backgroundColor: "#C8102E10", color: "#C8102E" }
          : item.locked
          ? { color: "#CBD5E1" }
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
        style={{ color: active ? "#C8102E" : item.locked ? "#CBD5E1" : "#64748B", flexShrink: 0 }}
      />
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
          style={{ backgroundColor: "#C8102E" }}
        >
          {item.badge}
        </span>
      ) : null}
      {item.locked ? (
        <Lock size={12} style={{ color: "#CBD5E1" }} />
      ) : null}
    </span>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  if (item.locked) {
    return <span className="cursor-not-allowed">{content}</span>;
  }
  return <Link href={item.href}>{content}</Link>;
}

export default function DashboardSidebar() {
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
              Education
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
          href={WA_ADVISOR}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageCircle size={15} />
          WhatsApp advisor
        </a>
        <p className="text-center text-[10px] mt-2" style={{ color: "#94A3B8" }}>
          Replies in 5 min · 24/7
        </p>
      </div>
    </aside>
  );
}
