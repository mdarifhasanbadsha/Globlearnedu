"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const UNIVERSITIES = [
  { slug: "peking-university",                    name: "Peking University",  city: "Beijing",       qsRank: 14,  programs: ["MBBS", "Engineering", "Law", "Economics"],           scholarship: ["CSC", "University"] },
  { slug: "wuhan-university",                     name: "Wuhan University",   city: "Wuhan, Hubei",  qsRank: 220, programs: ["MBBS", "Computer Science", "Law", "Environment"],     scholarship: ["CSC", "University", "Provincial"] },
  { slug: "huazhong-university-science-technology", name: "HUST",             city: "Wuhan, Hubei",  qsRank: 275, programs: ["Engineering", "Medicine", "Business", "CS"],          scholarship: ["CSC", "University"] },
  { slug: "fudan-university",                     name: "Fudan University",   city: "Shanghai",      qsRank: 55,  programs: ["Medicine", "Economics", "Intl Studies", "Science"],   scholarship: ["CSC", "University"] },
  { slug: "zhejiang-university",                  name: "Zhejiang University",city: "Hangzhou",      qsRank: 44,  programs: ["Engineering", "Agriculture", "Medicine", "Mgmt"],     scholarship: ["CSC", "University"] },
  { slug: "sichuan-university",                   name: "Sichuan University", city: "Chengdu",       qsRank: 801, programs: ["MBBS", "Dentistry", "Engineering", "Arts"],           scholarship: ["CSC", "University", "Provincial", "Self-sponsored"] },
];

const BADGE: Record<string, { bg: string; color: string }> = {
  CSC:            { bg: "rgba(200,16,46,0.1)",   color: "#C8102E" },
  University:     { bg: "rgba(27,58,107,0.1)",   color: "#1B3A6B" },
  Provincial:     { bg: "rgba(41,171,226,0.12)", color: "#1a7fa8" },
  "Self-sponsored":{ bg: "rgba(255,215,0,0.15)", color: "#8a6f00" },
};

export function FeaturedUniversities() {
  const headingRef = useScrollAnimation();
  const gridRef    = useScrollAnimation(0.05);

  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "64px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

        {/* Heading */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="anim-fade-up"
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: "#C8102E", marginBottom: "8px" }}>
            Top Partner Universities
          </p>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: "900", color: "#1B3A6B", marginBottom: "8px" }}>
            Choose from China&apos;s Best
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "520px", margin: "0 auto" }}>
            We partner with 985 &amp; 211 elite universities across China, offering all scholarship types at every level.
          </p>
        </div>

        {/* Cards grid — stagger reveal */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
        >
          {UNIVERSITIES.map((uni) => (
            <div
              key={uni.slug}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
              }}
            >
              {/* Card header */}
              <div style={{ backgroundColor: "#1B3A6B", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <div>
                  <h3 style={{ color: "white", fontWeight: "700", fontSize: "14px", lineHeight: 1.3, marginBottom: "2px" }}>{uni.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>{uni.city}</p>
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "white", backgroundColor: "#C8102E", padding: "2px 6px", borderRadius: "4px" }}>985</span>
                    <span style={{ fontSize: "10px", fontWeight: "800", color: "white", backgroundColor: "#29ABE2", padding: "2px 6px", borderRadius: "4px" }}>211</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>QS Rank</div>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "white", lineHeight: 1.1 }}>#{uni.qsRank}</div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", marginBottom: "6px" }}>Programs</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
                    {uni.programs.map((p) => (
                      <span key={p} style={{ fontSize: "11px", color: "#475569", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", transition: "background-color 0.15s ease" }}>{p}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", marginBottom: "6px" }}>Scholarships</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {uni.scholarship.map((s) => {
                      const b = BADGE[s] ?? { bg: "#f1f5f9", color: "#475569" };
                      return (
                        <span key={s} style={{ fontSize: "11px", fontWeight: "600", backgroundColor: b.bg, color: b.color, padding: "2px 8px", borderRadius: "4px" }}>{s}</span>
                      );
                    })}
                  </div>
                </div>
                <Link
                  href={`/universities/${uni.slug}`}
                  style={{ display: "block", marginTop: "16px", padding: "10px", textAlign: "center", fontSize: "13px", fontWeight: "700", color: "white", backgroundColor: "#C8102E", borderRadius: "10px", textDecoration: "none", transition: "background-color 0.2s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#A50D25")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#C8102E")}
                >
                  View &amp; Apply
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/universities"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", borderRadius: "10px", border: "2px solid #1B3A6B", color: "#1B3A6B", fontSize: "14px", fontWeight: "700", textDecoration: "none", transition: "background-color 0.2s ease, color 0.2s ease" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1B3A6B"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1B3A6B"; }}
          >
            View All Universities
            <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
