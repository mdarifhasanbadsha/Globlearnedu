import Link from "next/link";

type HeroProps = { applyHref?: string };

const STATS = [
  { value: "280+", label: "Universities" },
  { value: "5,000+", label: "Students Placed" },
  { value: "99%", label: "Visa Guidance" },
  { value: "80+", label: "Countries" },
];

export function HeroSection({ applyHref = "/sign-up" }: HeroProps) {
  return (
    <section
      className="hero-grid min-h-screen flex items-center relative overflow-hidden"
      style={{ backgroundColor: "#0A1628" }}
    >
      {/* Top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse at center, rgba(27,58,107,0.6) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative w-full max-w-5xl mx-auto px-4 lg:px-6 py-16 lg:py-24 text-center">
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "24px",
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#C8102E",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "0.03em",
            }}
          >
            Admission 2026–2027 — Now Open
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          Your Future Begins in China{" "}
          <span className="gradient-text">— Start Today.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-sm sm:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Globlearn Education has helped{" "}
          <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>5,000+ students</span>{" "}
          from{" "}
          <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>80+ countries</span>{" "}
          gain admission to China&apos;s top universities — with expert scholarship guidance
          and end-to-end support.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center mb-12">
          <Link
            href={applyHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px 32px",
              borderRadius: "10px",
              backgroundColor: "#C8102E",
              color: "white",
              fontWeight: "700",
              fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(200,16,46,0.4)",
            }}
          >
            Apply Now — Affordable Cost
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <Link
            href="/universities"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 32px",
              borderRadius: "10px",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "white",
              fontWeight: "600",
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            Explore Universities
          </Link>
        </div>

        {/* Stats row — 2×2 on mobile, 4×1 on desktop */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "20px 12px",
                textAlign: "center",
                backgroundColor: "rgba(255,255,255,0.03)",
                borderRight:
                  i < STATS.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1.4rem, 4vw, 1.75rem)",
                  fontWeight: "900",
                  color: "white",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p
          style={{
            marginTop: "16px",
            color: "rgba(255,255,255,0.25)",
            fontSize: "11px",
          }}
        >
          * Visa decisions are made by the Chinese Embassy. 99% reflects our guidance success based on student outcomes.
        </p>
      </div>
    </section>
  );
}
