"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TRUST_BADGES = [
  "No hidden fees",
  "CSC · University · Provincial · Self-sponsored",
  "99% Visa Guidance Success",
  "24/7 Support",
];

export function FinalCTA() {
  const sectionRef = useScrollAnimation(0.1);
  const badgesRef  = useScrollAnimation(0.2);

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#0A1628" }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />

      {/* Animated orbs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,16,46,0.08) 0%, transparent 70%)",
          animation: "orb-drift-1 22s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41,171,226,0.07) 0%, transparent 70%)",
          animation: "orb-drift-2 26s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Top glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,16,46,0.12) 0%, transparent 70%)" }}
      />

      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="anim-fade-up relative mx-auto max-w-3xl px-4 lg:px-6 text-center"
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-white/15"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#FFD700", animation: "pulse 2s infinite" }} />
          <span className="text-white/70 text-xs font-semibold tracking-wide">
            Applications Open for 2026–2027 Intake
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          Ready to Start Your{" "}
          <span className="gradient-text">China Journey?</span>
        </h2>

        <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Join 5,000+ students from 80+ countries who chose Globlearn Education to guide them to top Chinese universities. Transparent fees. Expert support. All four scholarship types.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/universities"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base transition-all active:scale-95"
            style={{ backgroundColor: "#C8102E", animation: "cta-pulse-glow 3s ease-in-out infinite" }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "#A50D25";
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "#C8102E";
              e.currentTarget.style.transform = "none";
            }}
          >
            Apply Now — Affordable Cost
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border border-white/25 text-white transition-all"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Talk to Our Team
          </Link>
        </div>

        {/* Trust badges — stagger reveal */}
        <div
          ref={badgesRef as React.RefObject<HTMLDivElement>}
          className="anim-stagger flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/40 text-xs"
        >
          {TRUST_BADGES.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#FFD700" }} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
