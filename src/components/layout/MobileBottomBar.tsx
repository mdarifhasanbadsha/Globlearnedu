"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  isPrimary?: boolean;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Universities",
    href: "/universities",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    label: "Apply",
    href: "/universities",
    isPrimary: true,
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "Track",
    href: "/track",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: "More",
    href: "/about",
    icon: (
      <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
];

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-slate-200">
      <div className="flex items-stretch h-[60px]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-end pb-2"
              >
                <div
                  className="w-12 h-12 -mt-5 rounded-full flex items-center justify-center text-white shadow-lg"
                  style={{
                    backgroundColor: "#C8102E",
                    boxShadow: "0 4px 20px rgba(200,16,46,0.4)",
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-[10px] font-semibold mt-1"
                  style={{ color: "#C8102E" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? "text-[#C8102E]" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
