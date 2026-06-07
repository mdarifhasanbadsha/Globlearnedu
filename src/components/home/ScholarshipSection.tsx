import Link from "next/link";

const SCHOLARSHIPS = [
  {
    type: "CSC Government",
    badge: "Full Coverage",
    badgeColor: "#C8102E",
    description:
      "China Scholarship Council (CSC) is the most prestigious government scholarship covering full tuition, accommodation and a monthly living stipend.",
    covers: ["Full Tuition", "Accommodation", "Monthly Stipend", "Medical Insurance"],
    deadline: "March 2027",
    competition: "Highly Competitive",
  },
  {
    type: "University Scholarship",
    badge: "Partial to Full",
    badgeColor: "#1B3A6B",
    description:
      "Offered directly by Chinese universities, these scholarships range from partial tuition waivers to full coverage. Rolling applications, easier to obtain.",
    covers: ["Tuition Waiver", "Some include Stipend", "Accommodation (varies)"],
    deadline: "Rolling",
    competition: "Moderate",
  },
  {
    type: "Provincial Scholarship",
    badge: "Regional Award",
    badgeColor: "#29ABE2",
    description:
      "Provincial government scholarships are region-specific awards with less competition than CSC. Strong coverage for eligible applicants.",
    covers: ["Partial/Full Tuition", "Living Allowance (varies)", "Provincial Support"],
    deadline: "April–May 2027",
    competition: "Low–Moderate",
  },
  {
    type: "Self-Sponsored",
    badge: "Affordable Cost",
    badgeColor: "#8a6f00",
    description:
      "For students who prefer to fund their studies independently. Tuition at Chinese universities is significantly lower than Western alternatives.",
    covers: ["Affordable Tuition", "No Application Fee", "Full Program Access"],
    deadline: "Flexible",
    competition: "Open to All",
  },
];

export function ScholarshipSection() {
  return (
    <section className="py-12 lg:py-16" style={{ backgroundColor: "#F8FAFF" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#C8102E" }}
          >
            Scholarship Options
          </p>
          <h2
            className="text-2xl lg:text-4xl font-black"
            style={{ color: "#1B3A6B" }}
          >
            Every Student Has a Pathway
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl mx-auto">
            Globlearn Education supports all four scholarship types equally.
            Whether you are aiming for a fully-funded CSC award or a self-sponsored program,
            we help you find the right fit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {SCHOLARSHIPS.map((s) => (
            <div
              key={s.type}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
            >
              <div className="p-5 flex-1">
                <span
                  className="inline-block text-[10px] font-bold text-white px-2.5 py-1 rounded-full mb-3 uppercase tracking-wide"
                  style={{ backgroundColor: s.badgeColor }}
                >
                  {s.badge}
                </span>
                <h3 className="font-black text-slate-900 text-base mb-2">{s.type}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{s.description}</p>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  What&apos;s Covered
                </p>
                <ul className="space-y-1 mb-4">
                  {s.covers.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: s.badgeColor }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 text-[11px]">
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase tracking-wider">Deadline</span>
                    <span className="font-semibold text-slate-700">{s.deadline}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase tracking-wider">Competition</span>
                    <span className="font-semibold text-slate-700">{s.competition}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <Link
                  href="/universities"
                  className="block w-full text-center text-xs font-semibold py-2.5 rounded-xl border-2 transition-all hover:text-white"
                  style={{ borderColor: s.badgeColor, color: s.badgeColor }}
                >
                  Apply via this Route
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400">
          Not sure which scholarship suits you?{" "}
          <Link href="/contact" className="font-semibold hover:underline" style={{ color: "#1B3A6B" }}>
            Talk to our team — it&apos;s free
          </Link>
        </p>
      </div>
    </section>
  );
}
