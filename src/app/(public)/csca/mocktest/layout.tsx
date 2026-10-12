import type { Metadata } from "next";

const title = "Free CSCA Mock Test Online | Realistic Exam Practice";
const description = "Take free CSCA-style practice online. Choose Mathematics Mock Test 1 or 2, each with 48 questions and a 60-minute timer. Get instant scores, then review your submitted answers and worked explanations. Independent practice, not an official CSCA paper.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "free CSCA mock test", "CSCA mock test online", "CSCA practice questions",
    "CSCA real mock test", "CSCA Mathematics mock test", "CSCA Math questions",
    "CSCA exam practice", "CSCA exam preparation", "free CSCA exam test",
    "China Scholastic Competency Assessment practice", "CSCA Physics mock test",
    "CSCA Chemistry mock test", "CSCA exam 2026", "CSCA exam 2027"
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
    images: [{ url: "/seo/csca-free-mock-test.svg", width: 1200, height: 630, alt: "Free CSCA Mock Test Online — realistic practice by GL Education" }]
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
