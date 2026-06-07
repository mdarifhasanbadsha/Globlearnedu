import Link from "next/link";

const STATS = [
  { value: "500+", label: "Students Guided" },
  { value: "50+", label: "Partner Universities" },
  { value: "30+", label: "Countries Served" },
  { value: "99%", label: "Visa Guidance Success" },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center hero-grid"
      style={{ backgroundColor: "#0A1628" }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(27,58,107,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,22,40,0.6))",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6 py-24 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-white/15 backdrop-blur-sm">
          <span
            className="w-2 h-2 rounded-full animate-pulse-dot flex-shrink-0"
            style={{ backgroundColor: "#C8102E" }}
          />
          <span className="text-white/80 text-xs font-semibold tracking-wide">
            Admission 2025 — Now Open
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[2.6rem] sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-black text-white leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto">
          Study in China with{" "}
          <span className="gradient-text">Full Scholarship</span>{" "}
          Support
        </h1>

        {/* Subheadline */}
        <p className="text-white/65 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Globlearn Education empowers students from Africa, Middle East & South Asia to access
          world-class Chinese universities. Transparent fees. Expert visa guidance.
          All four scholarship types — equal support for every pathway.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Link
            href="/universities"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-[15px] transition-all hover:scale-[1.02] active:scale-95 bg-[#C8102E] hover:bg-[#A50D25]"
            style={{ boxShadow: "0 8px 32px rgba(200,16,46,0.4)" }}
          >
            Apply Now — Affordable Cost
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/universities"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[15px] text-white border border-white/25 backdrop-blur-sm hover:bg-white/10 transition-all"
          >
            Explore Universities
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 py-5 text-center ${
                i < STATS.length - 1 ? "border-r border-white/10" : ""
              } ${i >= 2 ? "border-t lg:border-t-0 border-white/10" : ""}`}
              style={{ backgroundColor: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
            >
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/50 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="mt-6 text-white/30 text-[11px]">
          * Visa decisions are made by the Chinese Embassy. 99% reflects our guidance success based on student outcomes.
        </p>
      </div>
    </section>
  );
}
