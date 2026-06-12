"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type HeroProps = { applyHref?: string };

const STATS = [
  { value: "280+",   label: "Universities" },
  { value: "5,000+", label: "Students Placed" },
  { value: "99%",    label: "Visa Guidance" },
  { value: "80+",    label: "Countries" },
];

// Local photos — permanent, never break
const SLIDES = [
  { src: "/images/hero-china.jpg",   alt: "Guilin Li River karst mountains, China" },
  { src: "/images/hero-china-2.jpg", alt: "Great Wall of China" },
  { src: "/images/hero-china-3.jpg", alt: "Shanghai Pudong skyline, China" },
];

const SLIDE_DURATION = 6000; // ms per slide

export function HeroSection({ applyHref = "/sign-up" }: HeroProps) {
  const [mounted,    setMounted]    = useState(false);
  const [current,    setCurrent]    = useState(0);
  const [isHovered,  setIsHovered]  = useState(false);
  const [mouse,      setMouse]      = useState({ x: 0, y: 0 });

  // Entrance animation
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  // Auto-advance slideshow
  const advance = useCallback(() => {
    setCurrent(c => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(advance, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [advance]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left)  / rect.width  - 0.5; // −0.5 → 0.5
    const y = (e.clientY - rect.top)   / rect.height - 0.5;
    setMouse({ x, y });
  }

  return (
    <section
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ backgroundColor: "#0A1628" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMouse({ x: 0, y: 0 }); }}
    >
      {/* ── Slideshow photos — crossfade, Ken Burns idle, parallax on hover ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden
          style={{
            position: "absolute",
            inset: "-8%",
            backgroundImage: `url('${slide.src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform, opacity",
            opacity: i === current ? 1 : 0,
            ...(i === current && isHovered
              ? {
                  transform: `translate(${mouse.x * -22}px, ${mouse.y * -14}px) scale(1.12)`,
                  transition: "opacity 1.4s ease-in-out, transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)",
                }
              : i === current
              ? {
                  animation: "ken-burns 22s ease-in-out infinite",
                  transition: "opacity 1.4s ease-in-out",
                }
              : {
                  transition: "opacity 1.4s ease-in-out",
                }),
          }}
        />
      ))}

      {/* ── Dark overlay ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to bottom, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0.72) 55%, rgba(10,22,40,0.92) 100%)",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(10,22,40,0.5) 100%)",
        }}
      />

      {/* ── Grid overlay ── */}
      <div aria-hidden className="hero-grid" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.2, pointerEvents: "none" }} />

      {/* ── Orbs — respond to cursor ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,16,46,0.13) 0%, transparent 70%)",
          transform: `translate(${mouse.x * 38}px, ${mouse.y * 24}px)`,
          transition: "transform 0.7s ease-out",
          zIndex: 2, pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41,171,226,0.10) 0%, transparent 70%)",
          transform: `translate(${mouse.x * -38}px, ${mouse.y * -24}px)`,
          transition: "transform 0.9s ease-out",
          zIndex: 2, pointerEvents: "none",
        }}
      />

      {/* ── Slide dots ── */}
      <div
        style={{
          position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "8px", zIndex: 10,
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              transition: "width 0.3s ease, background-color 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative w-full max-w-5xl mx-auto px-4 lg:px-6 py-16 lg:py-24 text-center" style={{ zIndex: 10 }}>

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 mb-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{
            transitionDelay: "0.1s",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: "999px",
            padding: "6px 16px",
            backgroundColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#C8102E", flexShrink: 0, display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", fontWeight: "600", letterSpacing: "0.03em" }}>
            Admission 2026–2027 — Now Open
          </span>
        </div>

        {/* H1 */}
        <h1
          className={`text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ letterSpacing: "-0.02em", transitionDelay: "0.3s" }}
        >
          Your Future Begins in China{" "}
          <span className="gradient-text">— Start Today.</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-sm sm:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "0.5s" }}
        >
          Globlearn Education has helped{" "}
          <span style={{ color: "rgba(255,255,255,0.92)", fontWeight: 600 }}>5,000+ students</span>{" "}
          from{" "}
          <span style={{ color: "rgba(255,255,255,0.92)", fontWeight: 600 }}>80+ countries</span>{" "}
          gain admission to China&apos;s top universities — with expert scholarship guidance and end-to-end support.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row flex-wrap gap-3 justify-center mb-12 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "0.7s" }}
        >
          <Link
            href={applyHref}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "14px 32px", borderRadius: "10px",
              backgroundColor: "#C8102E", color: "white",
              fontWeight: "700", fontSize: "15px", textDecoration: "none",
              animation: "cta-pulse-glow 3s ease-in-out infinite",
              transition: "transform 0.2s ease, background-color 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.backgroundColor = "#A50D25"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.backgroundColor = "#C8102E"; }}
          >
            Apply Now — Affordable Cost
            <svg style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/universities"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "14px 32px", borderRadius: "10px",
              border: "1.5px solid rgba(255,255,255,0.28)",
              backgroundColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(6px)",
              color: "white", fontWeight: "600", fontSize: "15px", textDecoration: "none",
              transition: "border-color 0.2s, background-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.13)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}
          >
            Explore Universities
          </Link>
        </div>

        {/* Stats row */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto rounded-2xl overflow-hidden transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
            transitionDelay: "0.9s",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "20px 12px", textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ fontSize: "clamp(1.4rem,4vw,1.75rem)", fontWeight: "900", color: "white", lineHeight: 1, marginBottom: "6px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "10px", fontWeight: "500", color: "rgba(255,255,255,0.48)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p
          className={`transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
          style={{ marginTop: "16px", color: "rgba(255,255,255,0.22)", fontSize: "11px", transitionDelay: "1.1s" }}
        >
          * Visa decisions are made by the Chinese Embassy. 99% reflects our guidance success based on student outcomes.
        </p>
      </div>
    </section>
  );
}
