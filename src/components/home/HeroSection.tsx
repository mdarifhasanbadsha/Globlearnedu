import Link from "next/link";

const STATS = [
  { value: "280+", label: "Universities" },
  { value: "5,000+", label: "Students Placed" },
  { value: "99%", label: "Visa Guidance" },
  { value: "80+", label: "Countries" },
];

export function HeroSection() {
  return (
    <section
      className="hero-grid"
      style={{
        backgroundColor: "#0A1628",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
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

      <div
        style={{
          position: "relative",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "28px",
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
            Admission 2025 — Now Open
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            color: "white",
            fontSize: "clamp(2.2rem, 6vw, 4.2rem)",
            fontWeight: "900",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "24px",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Study in China with{" "}
          <span className="gradient-text">Full Scholarship</span>
          {" "}Support
        </h1>

        {/* Subheadline */}
        <p
          style={{
            color: "rgba(255,255,255,0.62)",
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            lineHeight: 1.7,
            maxWidth: "640px",
            margin: "0 auto 40px",
          }}
        >
          Globlearn Education empowers students from Africa, Middle East &amp; South Asia
          to access world-class Chinese universities. Transparent fees. Expert visa guidance.
          All four scholarship types — equal support for every pathway.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "56px",
          }}
        >
          <Link
            href="/universities"
            style={{
              display: "inline-flex",
              alignItems: "center",
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

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            maxWidth: "720px",
            margin: "0 auto",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "20px 16px",
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
                  fontSize: "28px",
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
                  fontSize: "11px",
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
            marginTop: "20px",
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
