"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [trackOpen, setTrackOpen] = useState(false);

  // Hide on authenticated portal routes — those have their own nav
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/partner") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff")
  ) return null;
  const [trackId, setTrackId] = useState("");

  function handleTrack() {
    const id = trackId.trim();
    if (id) {
      router.push(`/track?id=${encodeURIComponent(id)}`);
      setTrackOpen(false);
      setTrackId("");
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200"
        style={{ height: "64px" }}
      >
        <div style={{ display: "flex", alignItems: "stretch", height: "100%" }}>

          {/* Home */}
          <Link
            href="/"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              textDecoration: "none",
              color: isActive("/") ? "#C8102E" : "#94a3b8",
            }}
          >
            <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>Home</span>
          </Link>

          {/* Search */}
          <Link
            href="/universities"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              textDecoration: "none",
              color: isActive("/universities") ? "#C8102E" : "#94a3b8",
            }}
          >
            <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>Search</span>
          </Link>

          {/* Apply — red elevated pill */}
          <Link
            href="/universities"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: "8px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                marginTop: "-20px",
                borderRadius: "50%",
                backgroundColor: "#C8102E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(200,16,46,0.45)",
              }}
            >
              <svg style={{ width: "22px", height: "22px", color: "white" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span style={{ fontSize: "10px", fontWeight: "600", color: "#C8102E", marginTop: "2px" }}>Apply</span>
          </Link>

          {/* Track — opens bottom sheet */}
          <button
            onClick={() => setTrackOpen(true)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#94a3b8",
            }}
          >
            <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>Track</span>
          </button>

          {/* Profile */}
          <Link
            href="/sign-in"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              textDecoration: "none",
              color: isActive("/sign-in") || isActive("/dashboard") ? "#C8102E" : "#94a3b8",
            }}
          >
            <svg style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: "500" }}>Profile</span>
          </Link>

        </div>
      </nav>

      {/* Track bottom sheet */}
      {trackOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          {/* Dark overlay */}
          <div
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setTrackOpen(false)}
          />

          {/* Sheet */}
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 32px",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setTrackOpen(false)}
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
              <svg style={{ width: "16px", height: "16px", color: "#374151" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Handle */}
            <div
              style={{
                width: "40px",
                height: "4px",
                borderRadius: "2px",
                backgroundColor: "#e2e8f0",
                margin: "0 auto 20px",
              }}
            />

            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#1B3A6B", marginBottom: "6px" }}>
              Track Your Application
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
              Enter your Application ID or Passport Number to check your status.
            </p>

            <input
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="e.g. MB20260608001 or Passport No."
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "15px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0",
                outline: "none",
                marginBottom: "12px",
                color: "#111827",
              }}
            />

            <button
              onClick={handleTrack}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "15px",
                fontWeight: "700",
                color: "white",
                backgroundColor: "#C8102E",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(200,16,46,0.35)",
                marginBottom: "12px",
              }}
            >
              Track Application
            </button>

            <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8" }}>
              No login needed to track your application
            </p>
          </div>
        </div>
      )}
    </>
  );
}
