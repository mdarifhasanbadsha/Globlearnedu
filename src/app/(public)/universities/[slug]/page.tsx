import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin, ChevronRight, CheckCircle2, Calendar, Users,
  Building2, GraduationCap, TrendingUp, BookOpen, DollarSign, MessageCircle,
} from "lucide-react";
import { db } from "@/lib/db";
import { universities, programs } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import ApplyCTA from "~/components/shared/ApplyCTA";
import WhatsAppButton from "~/components/shared/WhatsAppButton";
import WhatsAppNudge from "~/components/shared/WhatsAppNudge";
import { cleanDescription } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [uni] = await db
    .select({ nameEn: universities.nameEn, nameCn: universities.nameCn, city: universities.city, province: universities.province, description: universities.description, metaTitle: universities.metaTitle, metaDescription: universities.metaDescription })
    .from(universities)
    .where(eq(universities.slug, slug))
    .limit(1);
  if (!uni) return { title: "University Not Found" };
  const cleanedDesc = cleanDescription(uni.description, { nameEn: uni.nameEn, nameCn: uni.nameCn, city: uni.city, province: uni.province });
  const pageTitle = uni.metaTitle ?? `${uni.nameEn} | Study in China | Globlearn Education`;
  return {
    title: { absolute: pageTitle },
    description: uni.metaDescription ?? cleanedDesc.substring(0, 160),
    openGraph: {
      title: pageTitle,
      description: uni.metaDescription ?? cleanedDesc.substring(0, 160),
    },
    twitter: {
      title: pageTitle,
      description: uni.metaDescription ?? cleanedDesc.substring(0, 160),
    },
  };
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [university] = await db
    .select()
    .from(universities)
    .where(eq(universities.slug, slug))
    .limit(1);

  if (!university) notFound();

  const [universityPrograms, related] = await Promise.all([
    db.select().from(programs).where(eq(programs.universityId, university.id)),
    db
      .select({
        id: universities.id,
        slug: universities.slug,
        nameEn: universities.nameEn,
        nameCn: universities.nameCn,
        city: universities.city,
        province: universities.province,
        tier985: universities.tier985,
        tier211: universities.tier211,
      })
      .from(universities)
      .where(
        and(
          ne(universities.id, university.id),
          eq(universities.isActive, true),
          university.province
            ? eq(universities.province, university.province)
            : eq(universities.country, "China"),
        )
      )
      .limit(3),
  ]);

  // Clean description — strips scraped Chinese text blocks
  const tierLabel = university.tier985 ? "985" : university.tier211 ? "211" : "Regular";
  const descriptionClean = cleanDescription(university.description, {
    nameEn: university.nameEn,
    nameCn: university.nameCn,
    city: university.city,
    province: university.province,
    tier: tierLabel,
  });
  const accentColor = university.tier985 ? "#C8102E" : university.tier211 ? "#1B3A6B" : "#475569";
  const accentBg = university.tier985 ? "#FEF2F2" : university.tier211 ? "#EFF6FF" : "#F8FAFC";

  const firstProg = universityPrograms[0];
  const tuitionDisplay = firstProg?.tuitionFee
    ? `¥${Number(firstProg.tuitionFee).toLocaleString()}/year`
    : "Contact for fees";
  const intakeDisplay =
    Array.isArray(firstProg?.intakeMonths) && (firstProg.intakeMonths as string[]).length
      ? (firstProg.intakeMonths as string[]).join(" / ")
      : "Sept / Feb";
  const deadlineDisplay = firstProg?.applicationDeadline ?? "Contact us";

  const highlights: string[] = [
    university.tier985 ? "One of China's prestigious 985 universities" : null,
    university.tier211 && !university.tier985 ? "Recognized among China's top 211 universities" : null,
    university.qsRanking && university.qsRanking <= 500 ? `Ranked #${university.qsRanking} in QS World University Rankings` : null,
    university.internationalStudents
      ? `Home to ${university.internationalStudents.toLocaleString()}+ international students`
      : null,
    university.founded
      ? `Established in ${university.founded} — over ${new Date().getFullYear() - university.founded} years of excellence`
      : null,
    universityPrograms.length > 0
      ? `${universityPrograms.length} programs available for international students`
      : null,
  ].filter(Boolean) as string[];

  const scholarships = [
    ...(university.tier985 ? ["CSC Government Scholarship (Full Funding)", "University Scholarship"] : []),
    ...(university.tier211 && !university.tier985 ? ["CSC Government Scholarship", "University Scholarship"] : []),
    ...(!university.tier985 && !university.tier211 ? ["University Scholarship"] : []),
    "Provincial Government Scholarship",
    "Self-sponsored (Flexible intake)",
  ];

  const requirements = [
    "Valid passport (minimum 6 months remaining validity)",
    "High school diploma or equivalent for undergraduate programs",
    "Bachelor's degree or above for postgraduate programs",
    universityPrograms.some((p) => p.teachingLanguage === "Chinese")
      ? "HSK 4 or above for Chinese-medium programs"
      : "English proficiency (IELTS 5.5+ or equivalent)",
    "Personal statement / study plan (500–800 words)",
    "Bank statement showing sufficient funds (last 6 months)",
    "Police clearance certificate (apostilled)",
    "Medical examination certificate (CIEMS standard)",
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/universities" className="hover:text-white transition-colors">Universities</Link>
            <ChevronRight size={14} />
            <span className="text-white">{university.nameEn}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: accentColor, color: "#fff" }}
                >
                  {tierLabel} University
                </span>
                {university.qsRanking && university.qsRanking <= 500 && (
                  <span className="text-xs font-semibold text-[#FFD700]">
                    QS Top {university.qsRanking}
                  </span>
                )}
                {university.qsRanking && university.qsRanking > 500 && university.qsRanking <= 1500 && (
                  <span className="text-xs font-semibold text-[#FFD700]">
                    QS Ranked
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
                {university.nameEn}
              </h1>
              {university.nameCn && (
                <p className="text-white/50 text-lg mb-3">{university.nameCn}</p>
              )}
              <p className="flex items-center gap-2 text-white/70 text-sm mb-6">
                <MapPin size={15} />
                {[university.city, university.province].filter(Boolean).join(", ")} · China
              </p>
              <p className="text-white/70 text-base mb-8 max-w-xl leading-relaxed">
                {descriptionClean.substring(0, 220)}{descriptionClean.length > 220 ? "…" : ""}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/universities/${university.slug}/apply`}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
                >
                  Apply to {university.nameEn.split(" ").slice(0, 2).join(" ")}
                </Link>
                <WhatsAppButton
                  size="lg"
                  label="Ask us on WhatsApp"
                  message={`Hi! I'm interested in studying at ${university.nameEn}. Can Globlearn Education help me apply?`}
                />
              </div>
            </div>

            {/* Stats grid — only show stats with real data */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[260px]">
              {([
                university.founded
                  ? { icon: <Calendar size={18} />, label: "Established", value: String(university.founded) }
                  : null,
                university.totalStudents
                  ? { icon: <Users size={18} />, label: "Students", value: university.totalStudents.toLocaleString() }
                  : null,
                university.internationalStudents
                  ? { icon: <GraduationCap size={18} />, label: "Intl. Students", value: university.internationalStudents.toLocaleString() }
                  : null,
                { icon: <Building2 size={18} />, label: "Programs", value: universityPrograms.length > 0 ? `${universityPrograms.length} offered` : "View All" },
              ] as const).filter(Boolean).map((s) => (
                <div key={s!.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-[#FFD700] flex justify-center mb-2">{s!.icon}</div>
                  <div className="text-white font-bold text-sm leading-snug">{s!.value}</div>
                  <div className="text-white/50 text-xs mt-1">{s!.label}</div>
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
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-4">About</p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-5">
                Why {university.nameEn.split(" ").slice(0, 3).join(" ")}?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">{descriptionClean}</p>
              {highlights.length > 0 && (
                <div className="space-y-2">
                  {highlights.map((h) => (
                    <div key={h} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                      <span className="text-sm text-gray-600">{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Apply sidebar */}
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
                      <p className="text-sm font-semibold text-[#1B3A6B]">{intakeDisplay}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Application Deadline</p>
                      <p className="text-sm font-semibold text-[#1B3A6B]">{deadlineDisplay}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Tuition / year</p>
                      <p className="text-sm font-semibold text-[#1B3A6B]">{tuitionDisplay}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Living Cost / month</p>
                      <p className="text-sm font-semibold text-[#1B3A6B]">¥3,000–6,000</p>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/universities/${university.slug}/apply`}
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

      {/* Programs */}
      {universityPrograms.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Programs</p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">
              Programs at {university.nameEn.split(" ").slice(0, 2).join(" ")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {universityPrograms.map((program) => (
                <div
                  key={program.id}
                  className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 hover:border-[#1B3A6B] hover:shadow-md p-4 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: accentBg }}
                  >
                    <GraduationCap size={18} style={{ color: accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1B3A6B] leading-snug">{program.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{program.level} · {program.teachingLanguage ?? "English"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Scholarships + Requirements */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Funding</p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-6">Scholarships Available</h2>
              <ul className="space-y-3">
                {scholarships.map((s) => (
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
              <WhatsAppNudge
                message={`Hi! I want to know which scholarships I qualify for to study at ${university.nameEn} in China.`}
                label="Check your scholarship eligibility in 5 minutes →"
              />
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Admission</p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-6">Requirements</h2>
              <ul className="space-y-3">
                {requirements.map((req) => (
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

      {/* Related */}
      {related.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Similar Universities</p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">Also Consider</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => {
                const relTier = rel.tier985 ? "985" : rel.tier211 ? "211" : "Regular";
                return (
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
                        {relTier}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1B3A6B] group-hover:text-white mb-1 text-sm leading-snug">
                      {rel.nameEn}
                    </h3>
                    <p className="text-xs text-gray-500 group-hover:text-white/60 flex items-center gap-1">
                      <MapPin size={11} />
                      {rel.city}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <ApplyCTA
        title={`Apply to ${university.nameEn.split(" ").slice(0, 3).join(" ")} — 2026–2027`}
        subtitle="Globlearn Education manages your full application — admission, scholarship, visa guidance, and arrival. One service, end-to-end."
      />

      {/* Mobile sticky WhatsApp */}
      <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden">
        <a
          href={`https://wa.me/8615655031556?text=${encodeURIComponent(`Hi! I'm interested in studying at ${university.nameEn}. Can Globlearn Education help me apply?`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3 shadow-lg"
        >
          <MessageCircle size={18} />
          Questions about {university.nameEn.split(" ")[0]}? WhatsApp us — reply in 5 min
        </a>
      </div>
    </>
  );
}
