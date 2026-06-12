import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import WhatsAppButton from "~/components/shared/WhatsAppButton";
import WhatsAppNudge from "~/components/shared/WhatsAppNudge";
import ApplyButton from "~/components/shared/ApplyButton";

export const metadata: Metadata = {
  title: "China Scholarships 2026 — CSC, University & Provincial",
  description: "Complete guide to scholarships for studying in China in 2026: CSC Government Scholarship, University Scholarships, Provincial Awards, and Self-Sponsored. Globlearn Education applies to all types simultaneously.",
  keywords: [
    "CSC scholarship 2026",
    "China government scholarship",
    "Chinese university scholarship international students",
    "study in China for free 2026",
    "CSC scholarship application",
    "provincial scholarship China",
  ],
};

const SCHOLARSHIPS = [
  {
    id: "csc",
    badge: "Most Competitive",
    badgeColor: "#1B3A6B",
    title: "CSC Government Scholarship",
    subtitle: "Chinese Government Scholarship — China Scholarship Council",
    stipend: "¥2,500–¥3,500 / month",
    tuition: "Full tuition covered",
    accommodation: "Free university dormitory",
    description:
      "The China Scholarship Council (CSC) scholarship is the flagship Chinese government scholarship for international students. It covers full tuition, free university accommodation, and pays a monthly living stipend. It is the most competitive scholarship — but also the most valuable. Thousands of students from Africa, the Middle East, and South Asia receive CSC scholarships each year.",
    eligibility: [
      "Non-Chinese national, under 35 (Bachelor's), under 45 (Master's/PhD)",
      "Strong academic record — typically 70%+ or GPA 3.0+",
      "Applying to a program relevant to your previous study",
      "Good health — medical certificate required",
      "No previous CSC scholarship (for the same level)",
    ],
    howToApply: [
      "Apply through the CSC online system (csc.edu.cn) — Embassy or University channel",
      "Embassy channel: allocated by your country's Ministry of Education/Embassy",
      "University channel: apply directly through your target university's CSC portal",
      "Globlearn Education manages the full application on your behalf",
    ],
    deadline: "March–April 2026 (most universities)",
    color: "#1B3A6B",
    bg: "#EEF4FF",
  },
  {
    id: "university",
    badge: "Most Accessible",
    badgeColor: "#29ABE2",
    title: "University Scholarship",
    subtitle: "Institution-level award — rolling applications",
    stipend: "Varies (some include stipend)",
    tuition: "50–100% tuition waiver",
    accommodation: "Varies by university",
    description:
      "University-level scholarships are offered directly by Chinese universities — independent of the CSC system. They are less competitive than CSC and many are available on a rolling basis. Most 985 and 211 universities offer merit-based scholarships ranging from 50% to full tuition waivers. Some also include a modest monthly stipend.",
    eligibility: [
      "Non-Chinese national with good academic standing",
      "Applying to an eligible program at the offering university",
      "Minimum GPA or exam grade as specified by each university",
      "Some require IELTS 6.0+ for English-medium programs",
    ],
    howToApply: [
      "Apply directly on the university's international student portal",
      "Submit scholarship application simultaneously with your admission application",
      "Globlearn Education applies to multiple universities at once to maximise your options",
    ],
    deadline: "April–June 2026 (varies by university)",
    color: "#29ABE2",
    bg: "#E0F2FE",
  },
  {
    id: "provincial",
    badge: "Less Known — High Value",
    badgeColor: "#92610A",
    title: "Provincial Government Scholarship",
    subtitle: "Regional government awards — Jiangsu, Hubei, Shandong & more",
    stipend: "¥1,000–¥3,000 / month",
    tuition: "Full or partial tuition",
    accommodation: "Subsidised or free",
    description:
      "Provincial scholarships are funded by Chinese provincial governments — not the central government — and are often overlooked by students and agents. Provinces like Jiangsu, Hubei, Shandong, Zhejiang, and Guangdong run large annual scholarship programs for international students at universities in their region. Competition is lower than CSC, and success rates are higher for well-prepared applicants.",
    eligibility: [
      "Enrolled or applying to a university in the relevant province",
      "Non-Chinese national with good academic record",
      "Meets the province's minimum academic threshold (varies)",
      "Some provinces prioritise students from specific regions or with specific programs",
    ],
    howToApply: [
      "Apply through the provincial scholarship portal — each province has its own system",
      "Applications typically submitted through the university to the provincial education bureau",
      "Globlearn Education identifies which provincial scholarships match your profile",
    ],
    deadline: "Varies by province — typically April–July 2026",
    color: "#92610A",
    bg: "#FFFBEB",
  },
  {
    id: "self",
    badge: "Always Available",
    badgeColor: "#166534",
    title: "Self-Sponsored",
    subtitle: "Affordable tuition — pay your own way",
    stipend: "N/A",
    tuition: "¥14,000–¥35,000 / year",
    accommodation: "University dorm ¥6,000–¥12,000 / year",
    description:
      "Self-sponsored study in China is dramatically more affordable than equivalent programs in the UK, USA, Australia, or Canada. Even without a scholarship, Chinese university tuition (¥14,000–¥35,000/year) is 5–10× lower than Western alternatives. Living costs in most Chinese university cities are ¥1,200–¥2,500/month. Globlearn Education applies for scholarships on your behalf even if you are initially self-sponsored — many students receive awards after arrival.",
    eligibility: [
      "Open to all international applicants who meet university admission requirements",
      "No competitive scholarship application required",
      "Can still apply for scholarships simultaneously — many are awarded after admission",
    ],
    howToApply: [
      "Apply for university admission through normal channels",
      "Globlearn Education simultaneously applies for any eligible scholarships",
      "Pay tuition directly to the university — no agent fee until admission confirmed",
    ],
    deadline: "Rolling — most universities accept until June 2026 for September intake",
    color: "#166534",
    bg: "#F0FDF4",
  },
];

const COMPARISON = [
  { label: "Tuition covered", csc: "✅ 100%", university: "✅ 50–100%", provincial: "✅ 50–100%", self: "❌ You pay" },
  { label: "Monthly stipend", csc: "✅ ¥2,500–¥3,500", university: "Varies", provincial: "✅ ¥1,000–¥3,000", self: "❌ None" },
  { label: "Accommodation", csc: "✅ Free dorm", university: "Varies", provincial: "Subsidised", self: "You pay" },
  { label: "Competition level", csc: "🔴 High", university: "🟡 Medium", provincial: "🟢 Lower", self: "🟢 None" },
  { label: "Deadline (2026)", csc: "Mar–Apr", university: "Apr–Jun", provincial: "Apr–Jul", self: "Rolling" },
  { label: "Who applies", csc: "Globlearn", university: "Globlearn", provincial: "Globlearn", self: "Globlearn" },
];

export default function ScholarshipsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">Scholarships 2026</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            4 Ways to Fund Your<br className="hidden md:block" /> China University Education
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Globlearn Education applies to all four scholarship types simultaneously — maximising your chances of funding your studies in China.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ApplyButton />
            <WhatsAppButton
              size="lg"
              label="Check my eligibility"
              message="Hi! 👋 I want to know which scholarships I can get to study in China. My background is — [tell us about yourself]."
            />
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "¥2,500–¥3,500", label: "CSC monthly stipend" },
            { value: "Full", label: "Tuition (CSC & University)" },
            { value: "4 Types", label: "Applied simultaneously" },
            { value: "99%", label: "Visa guidance success*" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-[#C8102E] mb-1">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-4">* Visa guidance outcomes, not a guarantee. Visa decisions made by Chinese Embassy.</p>
      </section>

      {/* Scholarship detail cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-8">
          {SCHOLARSHIPS.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: `${s.color}30`, backgroundColor: "white" }}
            >
              {/* Header */}
              <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3" style={{ backgroundColor: s.bg }}>
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white self-start"
                  style={{ backgroundColor: s.badgeColor }}
                >
                  {s.badge}
                </span>
                <div>
                  <h2 className="text-lg font-black" style={{ color: s.color }}>{s.title}</h2>
                  <p className="text-xs font-medium text-gray-500">{s.subtitle}</p>
                </div>
              </div>

              <div className="p-6">
                {/* Coverage pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    { label: "Tuition", value: s.tuition },
                    { label: "Stipend", value: s.stipend },
                    { label: "Accommodation", value: s.accommodation },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: s.bg }}>
                      <span className="text-gray-500">{item.label}: </span>
                      <span className="font-bold" style={{ color: s.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">{s.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: s.color }}>Eligibility</p>
                    <ul className="space-y-2">
                      {s.eligibility.map((e) => (
                        <li key={e} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: s.color }} />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: s.color }}>How to Apply</p>
                    <ul className="space-y-2">
                      {s.howToApply.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                          <ChevronRight size={14} className="mt-0.5 flex-shrink-0" style={{ color: s.color }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs text-gray-400">
                      <span className="font-semibold">2026 Deadline:</span> {s.deadline}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <WhatsAppNudge
          message="Hi! 👋 I want to know which scholarship I can get. My background is — [tell us about yourself]."
          label="Not sure which scholarship you qualify for? Ask us in 5 minutes →"
        />
      </div>

      {/* Comparison table */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Quick Comparison</p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">Scholarship Types at a Glance</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1B3A6B] text-white">
                  <th className="text-left px-4 py-4 font-semibold">Feature</th>
                  <th className="text-center px-4 py-4 font-semibold">CSC</th>
                  <th className="text-center px-4 py-4 font-semibold">University</th>
                  <th className="text-center px-4 py-4 font-semibold">Provincial</th>
                  <th className="text-center px-4 py-4 font-semibold">Self-Funded</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-semibold text-[#1B3A6B]">{row.label}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.csc}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.university}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.provincial}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.self}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Globlearn Education applies to all eligible scholarship types simultaneously — you don't have to choose just one.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ backgroundColor: "#0A1628" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-4">Ready to apply for your scholarship?</h2>
          <p className="text-white/60 text-sm mb-8">
            Globlearn Education prepares your CSC, University, and Provincial scholarship applications simultaneously — maximising your funding chances with one service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ApplyButton label="Apply Now — Affordable Cost" />
            <WhatsAppButton
              size="lg"
              label="Ask about my eligibility"
              message="Hi! 👋 I want to apply for a scholarship to study in China. What options do I have?"
            />
          </div>
        </div>
      </section>
    </>
  );
}
