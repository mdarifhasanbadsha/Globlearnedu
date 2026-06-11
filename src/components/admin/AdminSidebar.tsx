"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  Building2,
  BookOpen,
  Briefcase,
  UserCheck,
  Settings,
  Mail,
  CalendarRange,
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
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Applications", href: "/admin/applications", icon: FileText, badge: "89" },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "Universities", href: "/admin/universities", icon: Building2 },
      { label: "Blog Posts", href: "/admin/blog", icon: BookOpen },
      { label: "Admission Scheduler", href: "/admin/admission-scheduler", icon: CalendarRange },
    ],
  },
  {
    section: "People",
    items: [
      { label: "Partners", href: "/admin/partners", icon: Briefcase },
      { label: "Staff", href: "/admin/staff", icon: UserCheck },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Email Templates", href: "/admin/email-templates", icon: Mail },
      { label: "Settings", href: "/admin/settings", icon: Settings },
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
            ? { backgroundColor: "rgba(41,171,226,0.15)", color: "#29ABE2" }
            : { color: "rgba(255,255,255,0.6)" }
        }
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
            style={{ backgroundColor: "#29ABE2" }}
          />
        )}
        <Icon
          size={16}
          style={{ color: active ? "#29ABE2" : "rgba(255,255,255,0.4)", flexShrink: 0 }}
        />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span
            className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: "#29ABE2", color: "#0A1628" }}
          >
            {item.badge}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0"
      style={{
        width: 240,
        backgroundColor: "#0A1628",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#C8102E" }}
          >
            <span className="text-white text-xs font-black">GL</span>
          </div>
          <div>
            <p className="text-xs font-black leading-tight" style={{ color: "white" }}>
              Globlearn
            </p>
            <p className="text-[10px] font-semibold leading-tight" style={{ color: "#29ABE2" }}>
              Admin Panel
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
              style={{ color: "rgba(255,255,255,0.28)" }}
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
      <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}
        >
          <ExternalLink size={13} />
          View Live Site
        </Link>
      </div>
    </aside>
  );
}
