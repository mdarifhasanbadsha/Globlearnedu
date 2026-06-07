import type { Metadata } from "next";
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
  title: {
    absolute: "Globlearn Education — Study in China with Full Scholarship Support",
  },
  description:
    "Apply to top Chinese universities with CSC, University, Provincial & Self-sponsored scholarships. Globlearn Education guides students from Africa, Middle East & South Asia. Affordable cost, transparent process, 99% visa guidance success.",
};

export default function HomePage() {
  return (
    <>
      <NoticeBanner />
      <HeroSection />
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
