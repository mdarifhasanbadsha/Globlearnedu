import type { Metadata } from "next";
import {
  MOCK_SUBJECTS,
  RELEASED_MOCKS,
  isValidMockSubject,
} from "@/lib/csca/mocktest-public";

type Props = {
  children: React.ReactNode;
  params: Promise<{ subject: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;

  if (!isValidMockSubject(subject)) {
    return {
      title: "CSCA Mock Tests | Free Online Practice",
      robots: { index: false, follow: false },
    };
  }

  const info = MOCK_SUBJECTS.find((item) => item.slug === subject)!;
  const releasedCount = RELEASED_MOCKS[subject].length;
  const title = `CSCA ${info.title} Mock Tests 1–20 | Free Online Practice`;
  const description =
    `Explore the 20-test CSCA ${info.title} practice series. ${releasedCount} of 20 mock tests are currently released; released papers provide timed practice and results, and new sets appear after complete question sets are added and validated.`;
  const canonical = `/csca/mocktest/${subject}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: releasedCount > 0, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Globlearn Education",
    },
  };
}

export default function MockSubjectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
