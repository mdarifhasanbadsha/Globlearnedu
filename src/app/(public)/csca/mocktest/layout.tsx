import type { Metadata } from "next";

const title = "Free CSCA Mock Tests Online | 20 Tests per Subject";
const description =
  "Explore GL Education's planned 20-test CSCA practice series for Mathematics, Physics and Chemistry. Start released timed mock exams, review results and answers, and check live availability as complete question sets are published.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "CSCA mock test",
    "free CSCA mock test online",
    "CSCA practice questions",
    "CSCA mock exams",
    "20 CSCA mock tests",
    "CSCA Mathematics mock test",
    "CSCA Math practice test",
    "CSCA Physics mock test",
    "CSCA Chemistry mock test",
    "CSCA mock test with answers",
    "CSCA exam practice 2026",
    "CSCA exam practice 2027",
    "China Scholastic Competency Assessment practice"
  ],
  alternates: { canonical: "https://globlearnedu.com/csca/mocktest" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    url: "https://globlearnedu.com/csca/mocktest",
    title,
    description,
    siteName: "Globlearn Education",
    locale: "en_US",
    images: [{ url: "/seo/csca-free-mock-test.svg", width: 1200, height: 630, alt: "Free CSCA Mock Tests Online — independent practice by GL Education" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/seo/csca-free-mock-test.svg"]
  }
};

export default function CscaMockTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
