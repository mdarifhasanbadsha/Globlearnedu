const UNIVERSITY_NAMES = [
  "Peking University",
  "Tsinghua University",
  "Fudan University",
  "Zhejiang University",
  "Wuhan University",
  "Huazhong Univ. of Sci. & Tech.",
  "Shanghai Jiao Tong University",
  "Nanjing University",
  "Xi'an Jiaotong University",
  "Harbin Institute of Technology",
  "Sun Yat-sen University",
  "Sichuan University",
];

const SEPARATOR = " ✦ ";

const TEXT = UNIVERSITY_NAMES.join(SEPARATOR) + SEPARATOR;

export function UniversityMarquee() {
  return (
    <section className="py-10 bg-white border-y border-slate-100 overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
        Partner Universities in China
      </p>
      <div className="flex items-center overflow-hidden">
        <div
          className="flex items-center animate-marquee whitespace-nowrap"
          style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}
        >
          <span>{TEXT}{TEXT}</span>
        </div>
      </div>
    </section>
  );
}
