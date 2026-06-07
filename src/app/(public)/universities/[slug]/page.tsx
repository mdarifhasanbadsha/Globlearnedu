import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Users,
  Building2,
  GraduationCap,
  TrendingUp,
  BookOpen,
  DollarSign,
} from "lucide-react";
import ApplyCTA from "~/components/shared/ApplyCTA";
import WhatsAppButton from "~/components/shared/WhatsAppButton";
import { universitiesData, universitiesList, tierColors, tierBg } from "~/lib/data/universities";

export async function generateStaticParams() {
  return Object.keys(universitiesData).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uni = universitiesData[slug];
  if (!uni) return { title: "University Not Found" };
  return {
    title: `${uni.name} | Study in China`,
    description: uni.tagline,
  };
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uni = universitiesData[slug];
  if (!uni) notFound();

  const related = universitiesList
    .filter((u) => u.slug !== uni.slug && u.tier === uni.tier)
    .slice(0, 3);

  const accentColor = tierColors[uni.tier] ?? "#1B3A6B";
  const accentBg = tierBg[uni.tier] ?? "#EEF4FF";

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/universities" className="hover:text-white transition-colors">
              Universities
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">{uni.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left: name + meta */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: accentColor, color: "#fff" }}
                >
                  {uni.tier} University
                </span>
                {uni.ranking && (
                  <span className="text-xs font-semibold text-[#FFD700]">
                    {uni.ranking}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
                {uni.name}
              </h1>
              <p className="text-white/50 text-lg mb-3">{uni.chineseName}</p>
              <p className="flex items-center gap-2 text-white/70 text-sm mb-6">
                <MapPin size={15} />
                {uni.city}, {uni.province} · {uni.region} China
              </p>
              <p className="text-white/70 text-base mb-8 max-w-xl leading-relaxed">
                {uni.tagline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/universities/${uni.slug}/apply`}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
                >
                  Apply to {uni.name.split(" ").slice(0, 2).join(" ")}
                </Link>
                <WhatsAppButton
                  size="lg"
                  label="Ask us on WhatsApp"
                  message={`Hi, I'm interested in studying at ${uni.name} with Globlearn Education.`}
                />
              </div>
            </div>

            {/* Right: stats */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[260px]">
              {[
                { icon: <Calendar size={18} />, label: "Established", value: String(uni.established) },
                { icon: <Users size={18} />, label: "Students", value: uni.students },
                { icon: <GraduationCap size={18} />, label: "Intl. Students", value: uni.internationalStudents },
                { icon: <Building2 size={18} />, label: "Campus", value: uni.campusArea },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-[#FFD700] flex justify-center mb-2">{s.icon}</div>
                  <div className="text-white font-bold text-sm leading-snug">{s.value}</div>
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
            {/* Description + highlights */}
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-4">
                About
              </p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-5">
                Why {uni.name.split(" ").slice(0, 3).join(" ")}?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">{uni.description}</p>
              <div className="space-y-2">
                {uni.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                    <span className="text-sm text-gray-600">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Intake + apply sidebar */}
            <div className="lg:w-72">
              <div className="rounded-2xl border-2 p-6" style={{ borderColor: accentColor }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: accentColor }}>
                  Apply Now
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Intake</p>
                      <p className="text-sm font-semibold text-[#1B3A6B]">{uni.intakeMonths}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Application Deadline</p>
                      <p className="text-sm font-semibold text-[#1B3A6B]">{uni.applicationDeadline}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Tuition / year</p>
                      <p className="text-sm font-semibold text-[#1B3A6B]">{uni.tuitionRMB}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Living Cost / month</p>
                      <p className="text-sm font-semibold text-[#1B3A6B]">{uni.livingCostRMB}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/universities/${uni.slug}/apply`}
                  className="block text-center px-4 py-3 rounded-lg text-white text-sm font-bold transition-colors hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  Start Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs offered */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
            Programs
          </p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">
            Programs Available at {uni.name.split(" ").slice(0, 2).join(" ")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uni.programs.map((program) => (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-md p-4 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: accentBg }}
                >
                  <GraduationCap size={18} style={{ color: accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1B3A6B] group-hover:text-[#C8102E] transition-colors">
                    {program.name}
                  </p>
                </div>
                <ChevronRight size={15} className="text-gray-300 group-hover:text-[#C8102E] flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Scholarships */}
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
                Funding
              </p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-6">
                Scholarships Available
              </h2>
              <ul className="space-y-3">
                {uni.scholarships.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#C8102E] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/scholarships"
                className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-[#1B3A6B] hover:text-[#C8102E] transition-colors"
              >
                View all scholarships <ChevronRight size={15} />
              </Link>
            </div>

            {/* Requirements */}
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
                Admission
              </p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-6">
                Requirements
              </h2>
              <ul className="space-y-3">
                {uni.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <TrendingUp size={18} className="text-[#1B3A6B] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {uni.faqs.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3 text-center">
              FAQ
            </p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-8 text-center">
              Common Questions
            </h2>
            <div className="space-y-3">
              {uni.faqs.map((faq, i) => (
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

      {/* Related universities */}
      {related.length > 0 && (
        <section className="py-14 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">
              Similar Universities
            </p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">
              Also Consider
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/universities/${rel.slug}`}
                  className="group bg-gray-50 hover:bg-[#1B3A6B] rounded-2xl p-6 border border-gray-200 hover:border-[#1B3A6B] transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: accentBg, color: accentColor }}
                    >
                      {rel.tier}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1B3A6B] group-hover:text-white mb-1 text-sm leading-snug">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/60 flex items-center gap-1">
                    <MapPin size={11} />
                    {rel.city}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ApplyCTA
        title={`Apply to ${uni.name.split(" ").slice(0, 3).join(" ")} — 2026–2027`}
        subtitle="Globlearn Education manages your full application — admission, scholarship, visa guidance, and arrival. One service, end-to-end."
      />
    </>
  );
}
