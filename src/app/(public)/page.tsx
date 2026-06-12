import type { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { NoticeBanner } from "@/components/home/NoticeBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { UniversityMarquee } from "@/components/home/UniversityMarquee";
import { FeaturedUniversities } from "@/components/home/FeaturedUniversities";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ScholarshipSection } from "@/components/home/ScholarshipSection";
import { StatsSection } from "@/components/home/StatsSection";
import { CitiesSection } from "@/components/home/CitiesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: { absolute: "Study in China 2026–2027 — Scholarships, Universities & Visa Guidance | Globlearn Education" },
  description:
    "Globlearn Education helps students from 80+ countries study in China. CSC Government Scholarships, 1,500+ universities, MBBS, Engineering, Business and more. Expert visa guidance. Affordable cost. Apply now.",
  keywords: [
    "study in China",
    "study in China with scholarship",
    "CSC scholarship 2026",
    "CSC scholarship 2027",
    "China university admission 2026",
    "MBBS in China",
    "study abroad China",
    "Chinese government scholarship",
    "study in China for international students",
    "Globlearn Education",
    "China scholarship application",
    "study in China from Africa",
    "study in China from Bangladesh",
    "study in China from Nigeria",
    "study in China from Pakistan",
    "university in China English medium",
    "China student visa guidance",
  ],
  openGraph: {
    title: "Study in China 2026–2027 — Scholarships & University Admission | Globlearn Education",
    description:
      "Join 5,000+ students from 80+ countries who chose Globlearn Education for studying in China. CSC scholarships, 1,500+ universities, expert visa guidance. Affordable cost.",
    url: "https://globlearnedu.com",
    siteName: "Globlearn Education",
    type: "website",
    images: [
      {
        url: "https://globlearnedu.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Globlearn Education — Study in China",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Study in China 2026–2027 | Globlearn Education",
    description:
      "Expert guidance for studying in China — CSC scholarships, 1,500+ universities, visa support. 5,000+ students placed from 80+ countries.",
  },
  alternates: {
    canonical: "https://globlearnedu.com",
  },
};

export default async function HomePage() {
  const session = await auth();
  const applyHref = session?.user ? "/dashboard/apply" : "/sign-up";
  return (
    <>
      <NoticeBanner />
      <HeroSection applyHref={applyHref} />
      <UniversityMarquee />
      <FeaturedUniversities />
      <WhyChooseUs />
      <ScholarshipSection />
      <StatsSection />
      <CitiesSection />
      <ProcessSection />
      <TestimonialsSection />
      <BlogPreview />
      <FinalCTA />
    </>
  );
}
