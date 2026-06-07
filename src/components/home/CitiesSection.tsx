const CITIES = [
  {
    name: "Beijing",
    desc: "National capital. Home to Peking & Tsinghua universities — the Harvard & MIT of China.",
    universities: 26,
    highlight: "PKU · THU · BUAA",
  },
  {
    name: "Shanghai",
    desc: "China's financial hub. Cosmopolitan city with world-class universities and industry access.",
    universities: 18,
    highlight: "Fudan · SJTU · Tongji",
  },
  {
    name: "Wuhan",
    desc: "Central China's education capital. Largest student city by population. Affordable living.",
    universities: 12,
    highlight: "WHU · HUST · WUST",
  },
  {
    name: "Chengdu",
    desc: "Vibrant western city famous for quality of life, culture and Sichuan University.",
    universities: 8,
    highlight: "SCU · UESTC · SWUFE",
  },
  {
    name: "Xi'an",
    desc: "Ancient capital with leading engineering & technology universities. Affordable cost.",
    universities: 7,
    highlight: "XJTU · NPU · NWU",
  },
  {
    name: "Nanjing",
    desc: "Historic city in Jiangsu. Strong in medicine, agriculture and environmental sciences.",
    universities: 9,
    highlight: "NJU · SEU · NMU",
  },
  {
    name: "Guangzhou",
    desc: "South China's trade hub. Proximity to Hong Kong. Strong medical programs.",
    universities: 11,
    highlight: "SYSU · SCUT · GMU",
  },
  {
    name: "Harbin",
    desc: "Northern China's ice city. Harbin Institute of Technology — top engineering school.",
    universities: 6,
    highlight: "HIT · HEU · HMU",
  },
];

export function CitiesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#C8102E" }}
          >
            Study Destinations
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black"
            style={{ color: "#1B3A6B" }}
          >
            Choose Your City in China
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            From Beijing to Harbin, Globlearn Education helps you find the perfect city
            and university match for your goals and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CITIES.map((city, i) => (
            <div
              key={city.name}
              className="rounded-2xl p-5 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group cursor-default"
              style={{ backgroundColor: i % 2 === 0 ? "#F8FAFF" : "#FFFBF5" }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-black text-lg" style={{ color: "#1B3A6B" }}>
                  {city.name}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex-shrink-0">
                  {city.universities} unis
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{city.desc}</p>
              <p
                className="text-[11px] font-semibold"
                style={{ color: "#29ABE2" }}
              >
                {city.highlight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
