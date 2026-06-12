"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const STEPS = [
  { num: "01", title: "Submit Application",   desc: "Fill in our online application form with your academic background, preferred universities and scholarship type.", time: "Day 1" },
  { num: "02", title: "Document Collection",  desc: "Our team provides a personalised checklist and guides you through gathering all required documents correctly.", time: "Week 1–2" },
  { num: "03", title: "University Selection", desc: "We match your profile to suitable universities and scholarship opportunities, then submit applications on your behalf.", time: "Week 2–3" },
  { num: "04", title: "Pre-Admission Letter", desc: "Receive conditional admission letters from shortlisted universities. We negotiate and confirm your best offer.", time: "Week 4–8" },
  { num: "05", title: "JW202 Form",           desc: "The university issues your JW202 — the official Chinese government visa application form required for your X1 visa.", time: "Week 8–10" },
  { num: "06", title: "Visa & Arrival",       desc: "We guide you through the X1 student visa application process. Upon approval, we support your arrival and campus check-in.", time: "Week 10–12" },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative bg-white rounded-2xl border border-slate-200 shadow-sm p-6 anim-fade-up"
      style={{
        transitionDelay: `${index * 0.1}s`,
        transition: "opacity 0.5s ease, transform 0.5s ease, background-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = "#FAFBFF";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)";
        const circle = e.currentTarget.querySelector<HTMLElement>(".step-circle");
        if (circle) circle.style.backgroundColor = "#C8102E";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = "white";
        e.currentTarget.style.boxShadow = "";
        const circle = e.currentTarget.querySelector<HTMLElement>(".step-circle");
        if (circle) circle.style.backgroundColor = "#1B3A6B";
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="step-circle w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style={{ backgroundColor: "#1B3A6B", transition: "background-color 0.2s ease, transform 0.3s ease" }}
        >
          {step.num}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm leading-tight">{step.title}</h3>
          <span className="text-[10px] font-semibold" style={{ color: "#C8102E" }}>{step.time}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
    </div>
  );
}

export function ProcessSection() {
  const headingRef = useScrollAnimation();

  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">

        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="anim-fade-up text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C8102E" }}>
            How It Works
          </p>
          <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "#1B3A6B" }}>
            Your Journey to China — Step by Step
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            From your first application to landing in China — a clear, transparent process guided by Globlearn Education at every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-colors bg-[#C8102E] hover:bg-[#A50D25]"
            style={{ boxShadow: "0 4px 20px rgba(200,16,46,0.3)" }}
          >
            Start Your Application Today
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
