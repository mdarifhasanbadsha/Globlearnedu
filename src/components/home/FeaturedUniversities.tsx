import Link from "next/link";

const UNIVERSITIES = [
  {
    slug: "peking-university",
    name: "Peking University",
    city: "Beijing",
    qsRank: 14,
    programs: ["MBBS", "Engineering", "Law", "Economics"],
    scholarship: ["CSC", "University"],
  },
  {
    slug: "wuhan-university",
    name: "Wuhan University",
    city: "Wuhan, Hubei",
    qsRank: 220,
    programs: ["MBBS", "Computer Science", "Law", "Environmental Science"],
    scholarship: ["CSC", "University", "Provincial"],
  },
  {
    slug: "huazhong-university-science-technology",
    name: "Huazhong Univ. of Sci. & Tech.",
    city: "Wuhan, Hubei",
    qsRank: 275,
    programs: ["Engineering", "Medicine", "Business", "CS"],
    scholarship: ["CSC", "University"],
  },
  {
    slug: "fudan-university",
    name: "Fudan University",
    city: "Shanghai",
    qsRank: 55,
    programs: ["Medicine", "Economics", "International Studies", "Science"],
    scholarship: ["CSC", "University"],
  },
  {
    slug: "zhejiang-university",
    name: "Zhejiang University",
    city: "Hangzhou",
    qsRank: 44,
    programs: ["Engineering", "Agriculture", "Medicine", "Management"],
    scholarship: ["CSC", "University"],
  },
  {
    slug: "sichuan-university",
    name: "Sichuan University",
    city: "Chengdu",
    qsRank: 801,
    programs: ["MBBS", "Dentistry", "Engineering", "Arts"],
    scholarship: ["CSC", "University", "Provincial", "Self-sponsored"],
  },
];

const SCHOLARSHIP_COLORS: Record<string, string> = {
  CSC: "bg-red-50 text-[#C8102E]",
  University: "bg-blue-50 text-[#1B3A6B]",
  Provincial: "bg-sky-50 text-[#1a7fa8]",
  "Self-sponsored": "bg-yellow-50 text-[#8a6f00]",
};

export function FeaturedUniversities() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#C8102E" }}
          >
            Top Partner Universities
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black"
            style={{ color: "#1B3A6B" }}
          >
            Choose from China&apos;s Best
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            We partner with 985 &amp; 211 elite universities across China, offering all scholarship
            types at every level.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {UNIVERSITIES.map((uni) => (
            <div
              key={uni.slug}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
            >
              <div
                className="px-5 py-4 text-white"
                style={{ backgroundColor: "#1B3A6B" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{uni.name}</h3>
                    <p className="text-white/60 text-xs mt-0.5">{uni.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] font-bold text-white/50 uppercase">QS Rank</div>
                    <div className="font-black text-lg text-white leading-tight">
                      #{uni.qsRank}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: "#C8102E" }}
                  >
                    985
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: "#29ABE2" }}
                  >
                    211
                  </span>
                </div>
              </div>

              <div className="px-5 py-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Popular Programs
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {uni.programs.map((p) => (
                      <span
                        key={p}
                        className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Scholarships Available
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {uni.scholarship.map((s) => (
                      <span
                        key={s}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          SCHOLARSHIP_COLORS[s] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/universities/${uni.slug}`}
                  className="mt-4 block w-full text-center text-[13px] font-semibold text-white py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#A50D25] transition-colors"
                >
                  View &amp; Apply
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 border-[#1B3A6B] text-[#1B3A6B] hover:bg-[#1B3A6B] hover:text-white transition-all"
          >
            View All Universities
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
