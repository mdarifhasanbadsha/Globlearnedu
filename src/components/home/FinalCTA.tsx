import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#0A1628" }}>
      {/* Background decoration */}
      <div
        className="absolute inset-0 hero-grid opacity-40 pointer-events-none"
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(200,16,46,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 lg:px-6 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-white/15"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse-dot"
            style={{ backgroundColor: "#FFD700" }}
          />
          <span className="text-white/70 text-xs font-semibold tracking-wide">
            Applications Open for 2025 Intake
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          Ready to Start Your{" "}
          <span className="gradient-text">China Journey?</span>
        </h2>

        <p className="text-white/60 text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Join 500+ students from 30+ countries who chose Globlearn Education to guide them
          to top Chinese universities. Transparent fees. Expert support. All scholarship types.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/universities"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-95 bg-[#C8102E] hover:bg-[#A50D25]"
            style={{ boxShadow: "0 8px 32px rgba(200,16,46,0.45)" }}
          >
            Apply Now — Affordable Cost
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border border-white/25 text-white hover:bg-white/10 transition-all"
          >
            Talk to Our Team
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs">
          {[
            "No hidden fees",
            "CSC · University · Provincial · Self-sponsored",
            "99% Visa Guidance Success",
            "24/7 Support",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#FFD700" }}
              />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
