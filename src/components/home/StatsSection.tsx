"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { end: 500, suffix: "+", label: "Students Guided", sub: "across 30+ countries" },
  { end: 50, suffix: "+", label: "Partner Universities", sub: "985 & 211 elite institutions" },
  { end: 30, suffix: "+", label: "Countries Served", sub: "Africa, Middle East, South Asia" },
  { end: 99, suffix: "%", label: "Visa Guidance Success", sub: "based on student outcomes" },
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
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16" style={{ backgroundColor: "#1B3A6B" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2 text-white/40">
            Globlearn Education — By the Numbers
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Proven Track Record
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="px-6 py-10 text-center"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              <div
                className="text-5xl font-black mb-2 leading-none"
                style={{ color: "#FFD700" }}
              >
                <Counter end={stat.end} suffix={stat.suffix} />
              </div>
              <div className="text-white font-bold text-sm mb-1">{stat.label}</div>
              <div className="text-white/40 text-[11px]">{stat.sub}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-white/25 text-[11px] mt-6">
          * Visa decisions are made by the Chinese Embassy. Success rate reflects our guidance outcomes.
        </p>
      </div>
    </section>
  );
}
