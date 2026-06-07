"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { label: "Universities", href: "/universities" },
  { label: "Programs", href: "/programs" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const ADMISSION_LINKS = [
  { label: "Apply Now", href: "/universities" },
  { label: "Track Application", href: "/track" },
  { label: "Partner Program", href: "/partner" },
  { label: "Refer & Earn", href: "/refer-and-earn" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const bar = document.getElementById("scroll-progress");
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[68px] border-b transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-slate-200 shadow-sm"
            : "bg-white border-slate-100"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              GE
            </div>
            <div className="hidden sm:block leading-none">
              <div className="font-bold text-[15px]" style={{ color: "#1B3A6B" }}>
                Globlearn
              </div>
              <div
                className="font-semibold text-[10px] tracking-[0.15em] uppercase"
                style={{ color: "#C8102E" }}
              >
                Education
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-[#C8102E] bg-red-50"
                    : "text-slate-600 hover:text-[#1B3A6B] hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admission 2025 dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 px-3 py-2 text-[13px] font-semibold rounded-lg text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#1B3A6B" }}
              >
                Admission 2025
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20">
                    {ADMISSION_LINKS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-[#1B3A6B] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <SignedOut>
              <Link
                href="/sign-in"
                className="hidden md:block text-[13px] font-medium text-slate-600 hover:text-[#1B3A6B] px-3 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <Link
              href="/universities"
              className="text-[13px] font-semibold text-white px-4 py-2 rounded-lg transition-colors bg-[#C8102E] hover:bg-[#A50D25]"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-[68px] left-0 right-0 bottom-0 bg-white overflow-y-auto">
            <nav className="p-4 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1B3A6B] rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-1 border-t border-slate-100">
                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Admission 2025
                </p>
                {ADMISSION_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-[#C8102E] rounded-xl transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="pt-3 mt-1 border-t border-slate-100 space-y-1">
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    Sign In
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="px-4 py-3">
                    <UserButton />
                  </div>
                </SignedIn>
                <Link
                  href="/universities"
                  className="block mx-4 py-3 text-center text-sm font-semibold text-white rounded-xl bg-[#C8102E]"
                >
                  Apply Now
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
