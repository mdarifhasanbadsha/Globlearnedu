const TESTIMONIALS = [
  {
    name: "Amara O.",
    country: "Nigeria",
    flag: "🇳🇬",
    program: "MBBS — Wuhan University",
    scholarship: "CSC Scholarship",
    quote:
      "I received a full CSC Scholarship for my MBBS at Wuhan University. Globlearn Education guided me through every document, every deadline. The process was transparent — no hidden fees, no false promises. I arrived in China with confidence.",
    year: "2024",
  },
  {
    name: "Ahmed K.",
    country: "Pakistan",
    flag: "🇵🇰",
    program: "Software Engineering — HUST",
    scholarship: "University Scholarship",
    quote:
      "I didn't know about University Scholarships until Globlearn Education showed me the option. They matched me with HUST and secured a partial tuition waiver. The cost was very affordable. I am now in my second year and loving Wuhan.",
    year: "2024",
  },
  {
    name: "Fatima R.",
    country: "Kenya",
    flag: "🇰🇪",
    program: "International Business — SCU",
    scholarship: "Provincial Scholarship",
    quote:
      "From my application to landing at Chengdu airport — Globlearn Education was with me. Their visa guidance is real. I got my X1 student visa approved on the first attempt. The team was available whenever I had questions.",
    year: "2025",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#C8102E" }}
          >
            Student Stories
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black"
            style={{ color: "#1B3A6B" }}
          >
            Real Students. Real Results.
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            Hear from students who made their China study dream a reality with Globlearn Education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              {/* Quote */}
              <div
                className="text-3xl font-black leading-none mb-3"
                style={{ color: "#C8102E" }}
              >
                &ldquo;
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-5 italic">
                {t.quote}
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ backgroundColor: "#1B3A6B" }}
                >
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {t.name}
                    <span>{t.flag}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{t.program}</div>
                  <div
                    className="text-[10px] font-semibold mt-0.5"
                    style={{ color: "#29ABE2" }}
                  >
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
