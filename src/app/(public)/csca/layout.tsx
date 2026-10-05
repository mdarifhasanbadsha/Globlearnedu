import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSCA Exam 2026–2027: Dates, Registration, Syllabus & Free Courses | GL Education",
  description: "CSCA 2026–2027 guide for international students: latest exam dates, registration period, subjects, fees, preparation guidance and free GL Education CSCA courses.",
  keywords: [
    "CSCA exam 2026","CSCA exam 2027","CSCA registration","CSCA exam dates",
    "CSCA syllabus","CSCA mathematics","CSCA physics","CSCA chemistry",
    "CSCA preparation course","CSCA Bangladesh","study in China","CSCA free course"
  ],
  alternates: { canonical: "/csca" },
  openGraph: {
    title: "CSCA Exam 2026–2027: Dates, Registration & Free Courses | GL Education",
    description: "Latest CSCA schedule, registration guidance, subject structure and free GL Education preparation courses.",
    type: "website",
    url: "/csca",
    siteName: "GL Education"
  },
  twitter: {
    card: "summary_large_image",
    title: "CSCA Exam 2026–2027 | GL Education",
    description: "Latest CSCA registration, exam dates, subjects and free preparation courses."
  },
  robots: { index: true, follow: true }
};

export default function CscaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
