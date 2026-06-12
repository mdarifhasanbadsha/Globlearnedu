"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type HeroProps = { applyHref?: string };

const STATS = [
  { value: "1,500+", label: "Universities" },
  { value: "5,000+", label: "Students Placed" },
  { value: "99%",    label: "Visa Guidance" },
  { value: "80+",    label: "Countries" },
];

const SLIDES = [
  { src: "/images/hero-china.jpg",   alt: "Guilin Li River karst mountains, China" },
  { src: "/images/hero-china-2.jpg", alt: "Great Wall of China" },
  { src: "/images/hero-china-3.jpg", alt: "Shanghai Pudong skyline, China" },
];

// Floating Chinese characters — education & culture themed
const SYMBOLS = [
  { char: "中", top: "8%",  left: "4%",  size: 30, anim: "symbol-float-a", dur: "12s", delay: "0s" },
  { char: "华", top: "14%", left: "91%", size: 24, anim: "symbol-float-b", dur: "15s", delay: "2.2s" },
  { char: "学", top: "38%", left: "94%", size: 34, anim: "symbol-float-c", dur: "10s", delay: "0.8s" },
  { char: "龙", top: "62%", left: "6%",  size: 38, anim: "symbol-float-a", dur: "14s", delay: "3s" },
  { char: "福", top: "76%", left: "88%", size: 26, anim: "symbol-float-b", dur: "11s", delay: "1.5s" },
  { char: "道", top: "22%", left: "16%", size: 20, anim: "symbol-float-c", dur: "18s", delay: "4s" },
  { char: "文", top: "82%", left: "18%", size: 22, anim: "symbol-float-a", dur: "13s", delay: "2.6s" },
  { char: "山", top: "48%", left: "2%",  size: 28, anim: "symbol-float-b", dur: "16s", delay: "1s" },
  { char: "天", top: "88%", left: "62%", size: 24, anim: "symbol-float-c", dur: "12s", delay: "3.5s" },
  { char: "人", top: "10%", left: "48%", size: 18, anim: "symbol-float-a", dur: "20s", delay: "0.3s" },
  { char: "心", top: "56%", left: "78%", size: 30, anim: "symbol-float-b", dur: "9s",  delay: "2s" },
  { char: "国", top: "30%", left: "75%", size: 22, anim: "symbol-float-c", dur: "15s", delay: "4.5s" },
];

const SLIDE_DURATION = 6000;

export function HeroSection({ applyHref = "/sign-up" }: HeroProps) {
  const [mounted,   setMounted]   = useState(false);
  const [current,   setCurrent]   = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // Normalised −0.5→0.5 for parallax
  const [mouse,     setMouse]     = useState({ x: 0, y: 0 });
  // Pixel position for cursor follower
  const [cursor,    setCursor]    = useState({ x: -300, y: -300 });

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  const advance = useCallback(() => {
    setCurrent(c => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(advance, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [advance]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = e.clientX - rect.left;
    const ry = e.clientY - rect.top;
    setMouse({ x: rx / rect.width - 0.5, y: ry / rect.height - 0.5 });
    setCursor({ x: rx, y: ry });
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setMouse({ x: 0, y: 0 });
    setCursor({ x: -300, y: -300 });
  }

  return (
    <section
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ backgroundColor: "#0A1628" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Slideshow — crossfade + Ken Burns always running, zero mouse response ── */}
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
            animation: i === current ? "ken-burns 22s ease-in-out infinite" : undefined,
            transition: "opacity 1.4s ease-in-out",
          }}
        />
      ))}

      {/* ── Dark gradient overlay ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(10,22,40,0.52) 0%, rgba(10,22,40,0.70) 55%, rgba(10,22,40,0.90) 100%)",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(10,22,40,0.55) 100%)",
        }}
      />

      {/* ── Grid overlay ── */}
      <div aria-hidden className="hero-grid" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.18, pointerEvents: "none" }} />

      {/* ── Floating Chinese symbols ── */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
        {SYMBOLS.map((s) => (
          <span
            key={s.char + s.top}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              fontSize: s.size,
              color: "rgba(255,255,255,0.08)",
              fontWeight: 900,
              fontFamily: "'Noto Serif SC', 'Source Han Serif', serif",
              animation: `${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`,
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            {s.char}
          </span>
        ))}
      </div>

      {/* ── Ambient orbs (respond to cursor with lag) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: "580px", height: "580px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,16,46,0.12) 0%, transparent 70%)",
          transform: `translate(${mouse.x * 36}px, ${mouse.y * 22}px)`,
          transition: "transform 0.8s ease-out",
          zIndex: 2, pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: "680px", height: "680px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(41,171,226,0.09) 0%, transparent 70%)",
          transform: `translate(${mouse.x * -36}px, ${mouse.y * -22}px)`,
          transition: "transform 1s ease-out",
          zIndex: 2, pointerEvents: "none",
        }}
      />

      {/* ── Cursor follower circle ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: cursor.x,
          top: cursor.y,
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          border: "1.5px solid rgba(200,16,46,0.55)",
          boxShadow: "0 0 18px rgba(200,16,46,0.25), inset 0 0 12px rgba(200,16,46,0.08)",
          animation: "cursor-ring-pulse 2.4s ease-in-out infinite",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease, left 0.12s cubic-bezier(0.25,0.46,0.45,0.94), top 0.12s cubic-bezier(0.25,0.46,0.45,0.94)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
      {/* Inner dot */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: cursor.x,
          top: cursor.y,
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.8)",
          transform: "translate(-50%, -50%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease, left 0.05s linear, top 0.05s linear",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* ── Slide dot indicators ── */}
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
