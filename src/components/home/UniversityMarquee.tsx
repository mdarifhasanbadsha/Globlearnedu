const UNIVERSITIES = [
  { abbr: "PKU", name: "Peking University" },
  { abbr: "THU", name: "Tsinghua University" },
  { abbr: "FUDAN", name: "Fudan University" },
  { abbr: "ZJU", name: "Zhejiang University" },
  { abbr: "WHU", name: "Wuhan University" },
  { abbr: "HUST", name: "Huazhong Univ. of Sci. & Tech." },
  { abbr: "SJTU", name: "Shanghai Jiao Tong Univ." },
  { abbr: "NJU", name: "Nanjing University" },
  { abbr: "XJTU", name: "Xi'an Jiao Tong University" },
  { abbr: "HIT", name: "Harbin Institute of Technology" },
  { abbr: "SYSU", name: "Sun Yat-sen University" },
  { abbr: "SCU", name: "Sichuan University" },
  { abbr: "CUHK-SZ", name: "CUHK Shenzhen" },
  { abbr: "WUST", name: "Wuhan Univ. of Science & Tech." },
];

export function UniversityMarquee() {
  const doubled = [...UNIVERSITIES, ...UNIVERSITIES];

  return (
    <section className="py-10 bg-white border-y border-slate-100 overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
        Partner Universities in China
      </p>
      <div className="flex items-center animate-marquee whitespace-nowrap">
        {doubled.map((uni, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-3 mx-5 flex-shrink-0"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              {uni.abbr.slice(0, 2)}
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                {uni.abbr}
              </div>
              <div className="text-xs text-slate-600 font-medium leading-tight max-w-[160px] truncate">
                {uni.name}
              </div>
            </div>
            <span className="ml-5 text-slate-200">|</span>
          </div>
        ))}
      </div>
    </section>
  );
}
