import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  DollarSign,
  Globe,
  Award,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Users,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import ApplyCTA from "~/components/shared/ApplyCTA";
import WhatsAppButton from "~/components/shared/WhatsAppButton";
import WhatsAppNudge from "~/components/shared/WhatsAppNudge";
import { programsData, programsList } from "~/lib/data/programs";

export async function generateStaticParams() {
  return Object.keys(programsData).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = programsData[slug];
  if (!program) return { title: "Program Not Found" };
  return {
    title: `${program.name} in China`,
    description: program.tagline,
  };
}

const highlightIconMap: Record<string, React.ReactNode> = {
  Clock: <Clock size={20} />,
  DollarSign: <DollarSign size={20} />,
  Globe: <Globe size={20} />,
  Award: <Award size={20} />,
};

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = programsData[slug];
  if (!program) notFound();

  const related = programsList
    .filter((p) => program.relatedSlugs.includes(p.slug))
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/programs" className="hover:text-white transition-colors">Programs</Link>
            <ChevronRight size={14} />
            <span className="text-white">{program.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">
                {program.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {program.name}
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-xl">{program.tagline}</p>

              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: <Clock size={15} />, label: program.duration },
                  { icon: <DollarSign size={15} />, label: program.tuitionRange },
                  { icon: <Globe size={15} />, label: program.language },
                  { icon: <GraduationCap size={15} />, label: `Intake: ${program.intakeMonths}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm">
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/universities"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
                >
                  Apply Now — Affordable Cost
                </Link>
                <WhatsAppButton
                  size="lg"
                  label="Ask us on WhatsApp"
                  message={`Hi! 👋 I want to study ${program.name} in China. What universities do you recommend for me?`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[280px]">
              {program.highlights.map((h) => (
                <div key={h.title} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-[#FFD700] flex justify-center mb-2">
                    {highlightIconMap[h.icon] ?? <Award size={20} />}
                  </div>
                  <div className="text-white font-bold text-sm leading-snug">{h.value}</div>
                  <div className="text-white/50 text-xs mt-1">{h.title}</div>
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
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-4">Overview</p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-5">
                Why study {program.name} in China?
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">{program.overview}</p>

              <WhatsAppNudge
                message={`Hi! 👋 I want to check if I qualify for the ${program.name} scholarship in China. Can you help?`}
                label="Check your scholarship eligibility in 5 minutes →"
              />
            </div>

            <div className="lg:w-72">
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1B3A6B" }}>
                <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">Funding Options</p>
                <h3 className="text-white font-bold text-lg mb-4">4 Scholarship Types</h3>
                <ul className="space-y-3">
                  {program.scholarships.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle2 size={15} className="text-[#FFD700] mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/scholarships"
                  className="mt-5 block text-center px-4 py-2.5 rounded-lg bg-[#FFD700] text-[#1B3A6B] text-sm font-bold hover:bg-[#f0c800] transition-colors"
                >
                  View Scholarships
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner universities table */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Partner Universities</p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">
            Top Universities for {program.name}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1B3A6B] text-white">
                  <th className="text-left px-5 py-4 font-semibold">University</th>
                  <th className="text-left px-5 py-4 font-semibold">City</th>
                  <th className="text-left px-5 py-4 font-semibold">Tuition / Year</th>
                  <th className="text-left px-5 py-4 font-semibold">Scholarship</th>
                  {program.universities.some((u) => u.ranking) && (
                    <th className="text-left px-5 py-4 font-semibold">Ranking</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {program.universities.map((uni, i) => (
                  <tr key={uni.name} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-5 py-4 font-semibold text-[#1B3A6B]">{uni.name}</td>
                    <td className="px-5 py-4 text-gray-500">{uni.city}</td>
                    <td className="px-5 py-4 text-gray-700">{uni.tuitionRMB}</td>
                    <td className="px-5 py-4">
                      {uni.scholarshipAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          <CheckCircle2 size={12} /> Available
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Self-sponsored</span>
                      )}
                    </td>
                    {program.universities.some((u) => u.ranking) && (
                      <td className="px-5 py-4 text-gray-500 text-xs">{uni.ranking ?? "—"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Tuition listed in Chinese Yuan (RMB). Exchange rates vary. Globlearn Education provides full cost breakdown on application.
          </p>
          <WhatsAppNudge
            message={`Hi! 👋 Can you help me choose the best university for ${program.name} in China?`}
            label="Need help choosing the right university? →"
          />
        </div>
      </section>

      {/* Requirements + Career */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Admission Requirements</p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-6">Do I qualify?</h2>
            <ul className="space-y-3">
              {program.requirements.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#C8102E] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
            <WhatsAppNudge
              message={`Hi! I checked the requirements for ${program.name} and I'm not 100% sure I qualify. Can you check my profile?`}
              label="Not sure if you qualify? Ask us directly →"
            />
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Career Prospects</p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-6">Where will this take you?</h2>
            <ul className="space-y-3">
              {program.careerProspects.map((career) => (
                <li key={career} className="flex items-start gap-3">
                  <TrendingUp size={18} className="text-[#1B3A6B] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm leading-relaxed">{career}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3 text-center">FAQ</p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {program.faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 group">
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

      {/* Related programs */}
      {related.length > 0 && (
        <section className="py-14 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Related Programs</p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">Explore Other Programs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/programs/${rel.slug}`}
                  className="group bg-gray-50 hover:bg-[#1B3A6B] rounded-2xl p-6 border border-gray-200 hover:border-[#1B3A6B] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: rel.color }}
                    >
                      <Users size={18} />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white/50">{rel.category}</span>
                  </div>
                  <h3 className="font-bold text-[#1B3A6B] group-hover:text-white mb-1">{rel.name}</h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/60">{rel.duration}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ApplyCTA
        title={`Apply for ${program.name} — 2026–2027`}
        subtitle="Globlearn Education handles your application, scholarship, visa guidance, and arrival support. One service, end-to-end."
        program={program.slug}
      />

      {/* Mobile sticky WhatsApp bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden">
        <a
          href={`https://wa.me/8615655031556?text=${encodeURIComponent(`Hi! 👋 I want to study ${program.name} in China. What universities do you recommend for me?`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3 shadow-lg"
        >
          <MessageCircle size={18} />
          💬 Questions about {program.name}? WhatsApp us — reply in 5 min
        </a>
      </div>
    </>
  );
}
