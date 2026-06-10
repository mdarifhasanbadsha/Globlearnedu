"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const WHATSAPP_URL =
  "https://wa.me/8615655031556?text=" +
  encodeURIComponent("Hello! I need help with my application.");

export default function MobileDashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const tabStyle = (href: string) => ({
    flex: 1,
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "2px",
    textDecoration: "none",
    color: isActive(href) ? "#C8102E" : "#94a3b8",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  });

  // Unread notices badge — static indicator
  const hasUnread = true;

  return (
    <>
      {/* Fixed bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 block md:hidden bg-white border-t border-gray-200"
        style={{ height: "64px" }}
      >
        <div style={{ display: "flex", alignItems: "stretch", height: "100%" }}>

          {/* Home */}
          <Link href="/dashboard" style={tabStyle("/dashboard")}>
            <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>Home</span>
          </Link>

          {/* Application */}
          <Link href="/dashboard/application" style={tabStyle("/dashboard/application")}>
            <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>Application</span>
          </Link>

          {/* Notices — with red dot badge */}
          <Link href="/dashboard/notices" style={{ ...tabStyle("/dashboard/notices"), position: "relative" }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {hasUnread && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-4px",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#C8102E",
                    borderRadius: "50%",
                    border: "1.5px solid white",
                  }}
                />
              )}
            </span>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>Notices</span>
          </Link>

          {/* Track */}
          <Link href="/track" style={tabStyle("/track")}>
            <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>Track</span>
          </Link>

          {/* More */}
          <button onClick={() => setMoreOpen(true)} style={{ ...tabStyle("/more"), color: moreOpen ? "#C8102E" : "#94a3b8" }}>
            <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>More</span>
          </button>

        </div>
      </nav>

      {/* More sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden" style={{ display: "flex", alignItems: "flex-end" }}>
          {/* Overlay */}
          <div
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setMoreOpen(false)}
          />

          {/* Sheet */}
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 40px",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* Handle */}
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", backgroundColor: "#e2e8f0", margin: "0 auto 20px" }} />

            {/* Close */}
            <button
              onClick={() => setMoreOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "20px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#f1f5f9",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close"
            >
              <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              More Options
            </p>

            {/* Menu items */}
            {[
              {
                href: "/dashboard/documents",
                label: "Documents",
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                href: "/dashboard/payments",
                label: "Payments",
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
              },
              {
                href: "/dashboard/guide",
                label: "China Guide",
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
              {
                href: "/dashboard/profile",
                label: "Profile",
                icon: (
                  <svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 0",
                  borderBottom: "1px solid #f1f5f9",
                  textDecoration: "none",
                  color: "#1B3A6B",
                }}
              >
                <span style={{ color: "#64748b" }}>{item.icon}</span>
                <span style={{ fontSize: "15px", fontWeight: "500" }}>{item.label}</span>
                <svg style={{ width: "16px", height: "16px", color: "#cbd5e1", marginLeft: "auto" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                padding: "14px",
                marginTop: "16px",
                backgroundColor: "#25D366",
                color: "white",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "700",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
              }}
            >
              <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with Advisor
            </a>

            {/* Sign out */}
            <button
              onClick={() => router.push("/sign-out")}
              style={{
                display: "block",
                width: "100%",
                padding: "14px",
                marginTop: "10px",
                backgroundColor: "transparent",
                color: "#C8102E",
                border: "1.5px solid #fecaca",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
