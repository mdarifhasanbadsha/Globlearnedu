"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FEATURES = [
  {
    title: "Expert Guidance",
    description: "Navigate CSC, University, Provincial and Self-sponsored scholarship applications with our experienced team by your side.",
    bg: "#EFF6FF", iconColor: "#1B3A6B",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  {
    title: "Affordable Cost",
    description: "Transparent fees with no hidden charges — ever. Chinese universities offer among the most affordable quality education globally.",
    bg: "#FFF7ED", iconColor: "#C8102E",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    title: "All 4 Scholarship Types",
    description: "We support CSC Government, University, Provincial and Self-sponsored pathways equally — every student has a route to China.",
    bg: "#F0FDF4", iconColor: "#15803d",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  },
  {
    title: "99% Visa Guidance",
    description: "Our expert team prepares your X1 student visa file thoroughly. 99% of our students successfully obtain their visa on first attempt.",
    bg: "#EEF2FF", iconColor: "#4f46e5",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    title: "Post-Arrival Support",
    description: "We guide you from airport arrival to campus check-in — accommodation assistance, city orientation and ongoing support in China.",
    bg: "#FFF0F6", iconColor: "#be185d",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    title: "Real-Time Tracking",
    description: "Track every step of your application online — document status, university responses, admission letters and JW202 updates.",
    bg: "#F0FDFA", iconColor: "#0d9488",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
];

export function WhyChooseUs() {
  const headingRef = useScrollAnimation();
  const gridRef    = useScrollAnimation(0.05);

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">

        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="anim-fade-up text-center mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C8102E" }}>
            Why Globlearn Education
          </p>
          <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "#1B3A6B" }}>
            Your Success is Our Mission
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            From your first inquiry to arriving on campus — we are with you at every step.
          </p>
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl p-6 border border-slate-100"
              style={{
                backgroundColor: feature.bg,
                borderLeft: `3px solid transparent`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-left-color 0.3s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderLeftColor = feature.iconColor;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderLeftColor = "transparent";
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor: feature.iconColor,
                  color: "white",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "rotate(6deg) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
