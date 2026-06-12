"use client";

import { useCountUp, useScrollAnimation } from "@/hooks/useScrollAnimation";

type StatConfig = { target: number; suffix: string; label: string; sub: string };

const STATS: StatConfig[] = [
  { target: 1500, suffix: "+",  label: "Universities",     sub: "Chinese universities in our database" },
  { target: 5000, suffix: "+",  label: "Students Placed",  sub: "successfully enrolled across programs" },
  { target: 99,   suffix: "%",  label: "Visa Guidance",    sub: "success rate based on student outcomes" },
  { target: 80,   suffix: "+",  label: "Countries",        sub: "nationalities served worldwide" },
];

function StatCard({ stat }: { stat: StatConfig }) {
  const numRef = useCountUp(stat.target);
  return (
    <div
      style={{ padding: "32px 20px", textAlign: "center", backgroundColor: "#1B3A6B" }}
    >
      <div style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "900", color: "#FFD700", lineHeight: 1, marginBottom: "8px", display: "flex", alignItems: "baseline", justifyContent: "center", gap: "2px" }}>
        <span ref={numRef as React.RefObject<HTMLSpanElement>}>{stat.target.toLocaleString()}</span>
        <span>{stat.suffix}</span>
      </div>
      <div style={{ fontSize: "14px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
        {stat.label}
      </div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)" }}>
        {stat.sub}
      </div>
    </div>
  );
}

export function StatsSection() {
  const headingRef = useScrollAnimation();

  return (
    <section style={{ backgroundColor: "#1B3A6B", padding: "64px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="anim-fade-up"
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>
            Globlearn Education — By the Numbers
          </p>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: "900", color: "white" }}>
            Proven Track Record
          </h2>
        </div>

        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: "1px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden" }}
        >
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.22)", fontSize: "11px", marginTop: "20px" }}>
          * Visa decisions are made by the Chinese Embassy. Success rate reflects our guidance outcomes.
        </p>
      </div>
    </section>
  );
}
