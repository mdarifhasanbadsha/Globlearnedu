"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const ADMISSION_LINKS = [
  { label: "Apply Now", href: "/universities" },
  { label: "All Universities", href: "/universities" },
  { label: "Programs", href: "/programs" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Track Application", href: "/track" },
  { label: "Partner Program", href: "/partner" },
  { label: "Refer & Earn", href: "/refer-and-earn" },
];

const WA_ICON = (
  <svg style={{ width: "16px", height: "16px", flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admissionExpanded, setAdmissionExpanded] = useState(false);
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
    setAdmissionExpanded(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Header bar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "68px",
          backgroundColor: "white",
          borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid #f1f5f9",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "0 20px",
            gap: "16px",
          }}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#1B3A6B",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "900",
                fontSize: "13px",
                letterSpacing: "-0.5px",
                flexShrink: 0,
              }}
            >
              GL
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: "800", fontSize: "14px", color: "#1B3A6B", letterSpacing: "0.04em" }}>
                GLOBLEARN
              </div>
              <div style={{ fontWeight: "600", fontSize: "11px", color: "#29ABE2", letterSpacing: "0.06em" }}>
                Education
              </div>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
            className="hidden lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "8px 13px",
                    fontSize: "13.5px",
                    fontWeight: "500",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: active ? "#C8102E" : "#374151",
                    backgroundColor: active ? "rgba(200,16,46,0.06)" : "transparent",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Admission dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 13px",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  color: "#374151",
                  backgroundColor: dropdownOpen ? "rgba(0,0,0,0.04)" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                Admission
                <svg
                  style={{
                    width: "13px",
                    height: "13px",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                  }}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 10 }}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "210px",
                      backgroundColor: "white",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                      border: "1px solid #f1f5f9",
                      padding: "6px",
                      zIndex: 20,
                    }}
                  >
                    {ADMISSION_LINKS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        style={{
                          display: "block",
                          padding: "9px 12px",
                          fontSize: "13px",
                          color: "#374151",
                          textDecoration: "none",
                          borderRadius: "8px",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                        }
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* ── Right actions ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            {/* WhatsApp — icon only on mobile, icon + text on md+ */}
            <a
              href="https://wa.me/message/globlearnedu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#25D366",
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                whiteSpace: "nowrap",
                minHeight: "44px",
              }}
            >
              {WA_ICON}
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Login / UserButton — desktop only */}
            <SignedOut>
              <Link
                href="/sign-in"
                className="hidden sm:block"
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1.5px solid #1B3A6B",
                  color: "#1B3A6B",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Login
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="hidden sm:block">
                <UserButton />
              </div>
            </SignedIn>

            {/* Apply Now — desktop only */}
            <Link
              href="/universities"
              className="hidden sm:flex"
              style={{
                alignItems: "center",
                padding: "9px 18px",
                borderRadius: "8px",
                backgroundColor: "#C8102E",
                color: "white",
                fontSize: "13px",
                fontWeight: "700",
                textDecoration: "none",
                whiteSpace: "nowrap",
                minHeight: "44px",
              }}
            >
              Apply Now
            </Link>

            {/* Hamburger — below lg */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden"
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: mobileOpen ? "rgba(0,0,0,0.05)" : "transparent",
                cursor: "pointer",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "44px",
                minWidth: "44px",
              }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile right-side drawer ── */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40 }}
          className="lg:hidden"
        >
          {/* Overlay */}
          <div
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer — right side, 75% width */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "75vw",
              maxWidth: "320px",
              backgroundColor: "white",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-4px 0 32px rgba(0,0,0,0.15)",
            }}
          >
            {/* Drawer header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontWeight: "800", fontSize: "13px", color: "#1B3A6B", letterSpacing: "0.04em" }}>GLOBLEARN</div>
                <div style={{ fontWeight: "600", fontSize: "10px", color: "#29ABE2", letterSpacing: "0.06em" }}>Education</div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ padding: "8px", border: "none", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
                aria-label="Close menu"
              >
                <svg style={{ width: "20px", height: "20px", color: "#374151" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ padding: "12px 16px", flex: 1, overflowY: "auto" }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "12px 12px",
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#111827",
                    textDecoration: "none",
                    borderRadius: "8px",
                    minHeight: "44px",
                    lineHeight: "20px",
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {/* Admission expandable */}
              <button
                onClick={() => setAdmissionExpanded((v) => !v)}
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 12px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#111827",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  minHeight: "44px",
                }}
              >
                Admission
                <svg
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: admissionExpanded ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {admissionExpanded && (
                <div
                  style={{
                    paddingLeft: "12px",
                    borderLeft: "2px solid #f1f5f9",
                    marginLeft: "12px",
                    marginBottom: "4px",
                  }}
                >
                  {ADMISSION_LINKS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      style={{
                        display: "block",
                        padding: "10px 12px",
                        fontSize: "14px",
                        color: "#374151",
                        textDecoration: "none",
                        borderRadius: "6px",
                        minHeight: "44px",
                        lineHeight: "24px",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            {/* Bottom buttons */}
            <div
              style={{
                padding: "16px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <a
                href="https://wa.me/message/globlearnedu"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "13px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: "#25D366",
                  borderRadius: "10px",
                  textDecoration: "none",
                  minHeight: "48px",
                }}
              >
                <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
              <SignedOut>
                <Link
                  href="/sign-in"
                  style={{
                    display: "block",
                    padding: "13px 16px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1B3A6B",
                    border: "1.5px solid #1B3A6B",
                    borderRadius: "10px",
                    textDecoration: "none",
                    minHeight: "48px",
                  }}
                >
                  Login
                </Link>
              </SignedOut>
              <SignedIn>
                <div style={{ padding: "8px 0" }}>
                  <UserButton />
                </div>
              </SignedIn>
              <Link
                href="/universities"
                style={{
                  display: "block",
                  padding: "13px 16px",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: "#C8102E",
                  borderRadius: "10px",
                  textDecoration: "none",
                  minHeight: "48px",
                }}
              >
                Apply Now — Affordable Cost
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
