"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TESTIMONIALS = [
  {
    name: "Amara O.",
    country: "Nigeria",
    flag: "🇳🇬",
    program: "MBBS — Wuhan University",
    scholarship: "CSC Scholarship",
    quote: "I received a full CSC Scholarship for my MBBS at Wuhan University. Globlearn Education guided me through every document, every deadline. The process was transparent — no hidden fees, no false promises. I arrived in China with confidence.",
    year: "2024",
    stars: 5,
  },
  {
    name: "Ahmed K.",
    country: "Pakistan",
    flag: "🇵🇰",
    program: "Software Engineering — HUST",
    scholarship: "University Scholarship",
    quote: "I didn't know about University Scholarships until Globlearn Education showed me the option. They matched me with HUST and secured a partial tuition waiver. The cost was very affordable. I am now in my second year and loving Wuhan.",
    year: "2024",
    stars: 5,
  },
  {
    name: "Fatima R.",
    country: "Kenya",
    flag: "🇰🇪",
    program: "International Business — SCU",
    scholarship: "Provincial Scholarship",
    quote: "From my application to landing at Chengdu airport — Globlearn Education was with me. Their visa guidance is real. I got my X1 student visa approved on the first attempt. The team was available whenever I had questions.",
    year: "2025",
    stars: 5,
  },
];

export function TestimonialsSection() {
  const headingRef = useScrollAnimation();
  const gridRef    = useScrollAnimation(0.05);

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">

        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="anim-fade-up text-center mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C8102E" }}>
            Student Stories
          </p>
          <h2 className="text-2xl lg:text-4xl font-black" style={{ color: "#1B3A6B" }}>
            Real Students. Real Results.
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            Hear from students who made their China study dream a reality with Globlearn Education.
          </p>
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="anim-stagger flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex-shrink-0 w-[85vw] md:w-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col"
              style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg
                    key={i}
                    style={{ width: "14px", height: "14px", color: "#FFD700", animationDelay: `${i * 0.08}s` }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <div className="text-3xl font-black leading-none mb-3" style={{ color: "#C8102E" }}>&ldquo;</div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-5 italic">{t.quote}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ backgroundColor: "#1B3A6B" }}
                >
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {t.name} <span>{t.flag}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{t.program}</div>
                  <div className="text-[10px] font-semibold mt-0.5" style={{ color: "#29ABE2" }}>
                    {t.scholarship} · {t.year}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
