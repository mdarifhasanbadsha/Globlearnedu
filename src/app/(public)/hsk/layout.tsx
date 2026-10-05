import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HSK 3.0 Exam Guide, Materials & Free Practice Tests | GL Education",
  description: "Complete HSK 3.0 study hub: HSK 1–9 exam information, official syllabus, materials, vocabulary practice, mock tests and free Chinese proficiency practice.",
  keywords: ["HSK 3.0","HSK exam","HSK syllabus","HSK vocabulary","HSK practice test","HSK mock test","Chinese proficiency test","HSK 1","HSK 2","HSK 3","HSK 4","HSK 5","HSK 6","HSK 7 8 9"],
  alternates: { canonical: "/hsk" },
  openGraph: { title: "HSK 3.0 Exam Guide, Materials & Free Practice | GL Education", description: "HSK 3.0 levels 1–9, official resources, vocabulary practice and realistic mock tests.", type: "website", url: "/hsk", siteName: "GL Education" },
  twitter: { card: "summary_large_image", title: "HSK 3.0 Exam Guide & Free Practice", description: "HSK 3.0 levels 1–9, materials, vocabulary and practice tests." },
  robots: { index: true, follow: true }
};

export default function HskLayout({children}:{children:React.ReactNode}) { return children; }
