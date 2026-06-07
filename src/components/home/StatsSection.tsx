"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    end: 280,
    suffix: "+",
    label: "Universities",
    sub: "partner institutions in China",
  },
  {
    end: 5000,
    suffix: "+",
    label: "Students Placed",
    sub: "successfully enrolled across programs",
  },
  {
    end: 99,
    suffix: "%",
    label: "Visa Guidance",
    sub: "success rate based on student outcomes",
  },
  {
    end: 80,
    suffix: "+",
    label: "Countries",
    sub: "Africa, Middle East, South Asia & beyond",
  },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const steps = 60;
          const duration = 1800;
          const stepVal = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += stepVal;
            if (current >= end) {
              current = end;
              clearInterval(timer);
            }
            setCount(Math.round(current));
          }, duration / steps);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {count >= 1000 ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section style={{ backgroundColor: "#1B3A6B", padding: "64px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "8px",
            }}
          >
            Globlearn Education — By the Numbers
          </p>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: "900",
              color: "white",
            }}
          >
            Proven Track Record
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1px",
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
          className="lg:grid-cols-4"
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "40px 24px",
                textAlign: "center",
                backgroundColor: "#1B3A6B",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  fontWeight: "900",
                  color: "#FFD700",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                <Counter end={stat.end} suffix={stat.suffix} />
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "white",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.22)",
            fontSize: "11px",
            marginTop: "20px",
          }}
        >
          * Visa decisions are made by the Chinese Embassy. Success rate reflects our guidance outcomes.
        </p>
      </div>
    </section>
  );
}
