import type { Metadata } from "next";

const title = "CSCA Exam 2026–2027: Dates, Subjects & Free Preparation | GL Education";
const description = "CSCA 2026–2027 guide for international students: understand the China Scholastic Competency Assessment, check official exam dates and subject requirements, and explore free CSCA practice questions and realistic mock tests.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "CSCA exam", "China Scholastic Competency Assessment", "CSCA exam 2026",
    "CSCA exam 2027", "CSCA registration", "CSCA exam dates", "CSCA syllabus",
    "CSCA exam preparation", "CSCA Mathematics", "CSCA Physics", "CSCA Chemistry",
    "free CSCA mock test", "CSCA practice questions", "study in China"
  ],
  alternates: { canonical: "https://globlearnedu.com/csca" },
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://globlearnedu.com/csca",
    siteName: "Globlearn Education",
    locale: "en_US",
    images: [{ url: "/seo/csca-exam-guide.svg", width: 1200, height: 630, alt: "CSCA Exam Guide 2026–2027 by GL Education" }]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/seo/csca-exam-guide.svg"]
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
};

export default function CscaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
