const NOTICES = [
  "🎓 2026–2027 CSC Scholarship applications now open — deadline March 15, 2027",
  "🏛️ University Scholarship applications open — Rolling basis, limited seats available",
  "🌍 Students from 80+ countries guided successfully to Chinese universities",
  "📋 99% visa guidance success rate — Expert team ready to assist you",
  "💰 Transparent fees — Affordable cost, no hidden charges, ever",
];

export function NoticeBanner() {
  const doubled = [...NOTICES, ...NOTICES];

  return (
    <div
      className="overflow-hidden py-2.5"
      style={{ backgroundColor: "#1B3A6B" }}
    >
      <div className="flex items-center animate-marquee whitespace-nowrap">
        {doubled.map((notice, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 text-white/90 text-xs font-medium px-6"
          >
            {notice}
            <span style={{ color: "#FFD700" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
