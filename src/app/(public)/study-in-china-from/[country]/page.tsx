import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  CheckCircle2,
  Users,
  GraduationCap,
  Globe,
  ArrowRight,
  BookOpen,
  MapPin,
} from "lucide-react";
import ApplyCTA from "~/components/shared/ApplyCTA";
import ApplyButton from "~/components/shared/ApplyButton";
import WhatsAppButton from "~/components/shared/WhatsAppButton";
import { countriesData, countriesList } from "~/lib/data/countries";

export async function generateStaticParams() {
  return Object.keys(countriesData).map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const data = countriesData[country];
  if (!data) return { title: "Country Not Found" };
  return {
    title: `Study in China from ${data.name} 2026 — Scholarships, MBBS & Universities`,
    description: `${data.studentsInChina} students from ${data.name} study in China. Complete 2026 guide: CSC scholarship, MBBS programs, top universities, visa from ${data.embassyCity} Embassy, and step-by-step application with Globlearn Education.`,
    keywords: [
      `study in China from ${data.name}`,
      `China scholarship ${data.name} 2026`,
      `CSC scholarship ${data.name} 2026`,
      `MBBS in China for ${data.name} students`,
      `Chinese university admission ${data.name}`,
      `${data.name} students China visa`,
      `study abroad China ${data.name} 2026`,
      `Chinese government scholarship ${data.name}`,
    ],
  };
}

const JOURNEY_STEPS = [
  { step: "01", title: "Assessment", body: "We review your academics, budget, and career goal and match you to the right university and program." },
  { step: "02", title: "Application", body: "We prepare and submit your university application, scholarship forms, and all supporting documents." },
  { step: "03", title: "Scholarship", body: "We apply to CSC, university-level, and provincial scholarships simultaneously on your behalf." },
  { step: "04", title: "Visa Guidance", body: "We prepare your visa documents and guide you through the Chinese Embassy process in your country." },
  { step: "05", title: "Arrival Support", body: "We assist with airport pickup coordination, Residence Permit, and your first weeks on campus." },
];

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const data = countriesData[country];
  if (!data) notFound();

  const otherCountries = countriesList
    .filter((c) => c.slug !== country && c.continent === data.continent)
    .slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/universities" className="hover:text-white transition-colors">Universities</Link>
            <ChevronRight size={14} />
            <span className="text-white">Study from {data.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-5xl" role="img" aria-label={data.name}>{data.flag}</span>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2]">
                    {data.region}
                  </p>
                  <p className="text-white/60 text-sm">{data.continent}</p>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                Study in China from {data.name}<br />
                <span className="text-[#29ABE2] text-3xl md:text-4xl">2026 Complete Guide</span>
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-xl leading-relaxed">
                {data.tagline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <ApplyButton label="Apply Now" />
                <WhatsAppButton
                  size="lg"
                  label="Talk to an advisor"
                  message={`Hi! 👋 I'm from ${data.name} and I want to study in China. What scholarships am I eligible for?`}
                />
              </div>
            </div>

            {/* Stats panel */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[280px]">
              {[
                { icon: <Users size={20} />, label: "Students in China", value: data.studentsInChina },
                { icon: <GraduationCap size={20} />, label: "Programs Available", value: "8 Types" },
                { icon: <Globe size={20} />, label: "Scholarships", value: "4 Types" },
                { icon: <CheckCircle2 size={20} />, label: "Visa Guidance", value: "99% Success" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-[#FFD700] flex justify-center mb-2">{s.icon}</div>
                  <div className="text-white font-bold text-sm">{s.value}</div>
                  <div className="text-white/50 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-4">
                Why China
              </p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-5">
                Why {data.name} Students Choose Chinese Universities in 2026
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">{data.description}</p>

              <div className="space-y-3 mb-8">
                {data.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#C8102E] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>

              {/* Quick Facts — optimised for featured snippets */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3" style={{ backgroundColor: "#1B3A6B" }}>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">
                    Quick Facts — Study in China from {data.name} 2026
                  </p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "Students from " + data.name + " in China", value: data.studentsInChina },
                      { label: "Top programs", value: data.topPrograms.map(p => p.name).slice(0, 3).join(", ") },
                      { label: "Scholarship types", value: "CSC, University, Provincial, Self-sponsored" },
                      { label: "Tuition range", value: "¥14,000–¥35,000 / year" },
                      { label: "Living costs", value: "¥1,200–¥2,500 / month" },
                      { label: "Visa type", value: "X1 Student Visa" },
                      { label: "Embassy for visa", value: data.embassyCity + " (Chinese Embassy)" },
                      { label: "Visa guidance success", value: "99% (evidence-based, not a guarantee)" },
                      { label: "Language of instruction", value: "English (most programs) or Mandarin" },
                      { label: "Popular cities", value: data.popularCities.join(", ") },
                    ].map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-5 py-2.5 font-semibold text-[#1B3A6B] w-1/2">{row.label}</td>
                        <td className="px-5 py-2.5 text-gray-600">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar: popular cities + visa */}
            <div className="lg:w-72 space-y-5">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-xs font-bold tracking-widest uppercase text-[#1B3A6B] mb-4">
                  Popular Cities
                </p>
                <div className="space-y-2">
                  {data.popularCities.map((city) => (
                    <div key={city} className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="text-[#C8102E] flex-shrink-0" />
                      {city}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FFF8EC] rounded-2xl p-6 border border-[#FFD700]/30">
                <p className="text-xs font-bold tracking-widest uppercase text-[#92610A] mb-1">
                  X1 Visa — {data.name}
                </p>
                <p className="text-sm font-bold text-[#92610A] mb-4">
                  Chinese Embassy, {data.embassyCity}
                </p>
                <ul className="space-y-2">
                  {data.visaNotes.map((note) => (
                    <li key={note} className="text-xs text-[#92610A] leading-relaxed flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#92610A] flex-shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-[#92610A]/70 mt-3 leading-relaxed">
                  Visa decisions are made by the Chinese Embassy in {data.embassyCity}. Globlearn Education provides preparation guidance only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top programs */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
            Programs
          </p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-3">
            Most Popular Programs for Students from {data.name} in 2026
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Click any program to see universities, tuition, requirements, and scholarships.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.topPrograms.map((program, i) => (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-md p-4 transition-all"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                  style={{ backgroundColor: "#1B3A6B" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors leading-snug">
                    {program.name}
                  </p>
                </div>
                <ChevronRight size={15} className="text-gray-300 group-hover:text-[#C8102E] flex-shrink-0 transition-colors" />
              </Link>
            ))}
            {/* View all programs CTA */}
            <Link
              href="/programs"
              className="group flex items-center gap-4 bg-[#1B3A6B] rounded-xl border border-[#1B3A6B] p-4 transition-all hover:bg-[#152d56]"
            >
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={18} className="text-white" />
              </div>
              <p className="font-semibold text-sm text-white flex-1">All 8 Programs →</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
            Funding
          </p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">
            CSC Scholarship 2026 for Students from {data.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "CSC Scholarship",
                sub: "Chinese Government",
                desc: "Full tuition + monthly stipend of ¥2,500–¥3,500. Most competitive but highest value.",
                color: "#1B3A6B",
                bg: "#EEF4FF",
              },
              {
                name: "University Scholarship",
                sub: "Institution-level",
                desc: "50–100% tuition waiver from your target university. Less competitive than CSC.",
                color: "#29ABE2",
                bg: "#E0F2FE",
              },
              {
                name: "Provincial Scholarship",
                sub: "Province Government",
                desc: "Full or partial tuition from Jiangsu, Hubei, Shandong and other provinces.",
                color: "#92610A",
                bg: "#FFFBEB",
              },
              {
                name: "Self-Sponsored",
                sub: "Affordable Tuition",
                desc: "Pay your own tuition — still dramatically cheaper than UK, USA, or private colleges at home.",
                color: "#166534",
                bg: "#F0FDF4",
              },
            ].map((s) => (
              <div
                key={s.name}
                className="rounded-2xl p-5 border"
                style={{ backgroundColor: s.bg, borderColor: `${s.color}30` }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: s.color }}>
                  {s.sub}
                </p>
                <p className="font-bold text-[#1B3A6B] mb-2">{s.name}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Globlearn Education applies to all eligible scholarship types simultaneously — maximising your funding chances.
          </p>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="py-14 px-4" style={{ backgroundColor: "#0A1628" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-3">
            Your Journey
          </p>
          <h2 className="text-2xl font-black text-white mb-10">
            How to Apply to a Chinese University from {data.name} — 5 Steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {JOURNEY_STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white mx-auto mb-4"
                  style={{ backgroundColor: "#C8102E" }}
                >
                  {s.step}
                </div>
                <p className="font-bold text-white text-sm mb-2">{s.title}</p>
                <p className="text-white/50 text-xs leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {data.faqs.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3 text-center">
              FAQ
            </p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-8 text-center">
              Frequently Asked Questions — Study in China from {data.name}
            </h2>
            <div className="space-y-3">
              {data.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white rounded-xl border border-gray-200"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none">
                    <span className="font-semibold text-[#1B3A6B] text-sm pr-4">{faq.q}</span>
                    <BookOpen size={16} className="text-gray-400 flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other countries in same region */}
      {otherCountries.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
              More Countries
            </p>
            <h2 className="text-xl font-black text-[#1B3A6B] mb-6">
              Also from {data.continent}
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherCountries.map((c) => (
                <Link
                  key={c.slug}
                  href={`/study-in-china-from/${c.slug}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#1B3A6B] hover:bg-[#EEF4FF] transition-all"
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="text-sm font-semibold text-[#1B3A6B]">{c.name}</span>
                  <ChevronRight size={13} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ApplyCTA
        title={`Ready to study in China from ${data.name}?`}
        subtitle="Globlearn Education handles your application, scholarship, visa guidance, and arrival — one team, end-to-end. Transparent fees paid only after your admission is confirmed."
      />
    </>
  );
}
