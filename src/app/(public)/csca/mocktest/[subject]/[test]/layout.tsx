import type { Metadata } from "next";
import {
  MOCK_SUBJECTS,
  RELEASED_MOCKS,
  isValidMockSubject,
  mockKey,
} from "@/lib/csca/mocktest-public";
import { getMockExam } from "@/lib/csca/mocktest-bank";

type Props = {
  children: React.ReactNode;
  params: Promise<{ subject: string; test: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: rawSubject, test: rawTest } = await params;
  const testNumber = Number(rawTest);
  const validSubject = isValidMockSubject(rawSubject);
  const validTest =
    Number.isInteger(testNumber) && testNumber >= 1 && testNumber <= 20;
  const subjectSlug = validSubject ? rawSubject : null;
  const subjectInfo = MOCK_SUBJECTS.find(
    (item) => item.slug === subjectSlug,
  );
  const exam =
    subjectSlug && validTest
      ? getMockExam(mockKey(subjectSlug, testNumber))
      : undefined;
  const released = Boolean(
    subjectSlug &&
      validTest &&
      exam &&
      RELEASED_MOCKS[subjectSlug].includes(testNumber),
  );

  if (!subjectSlug || !subjectInfo || !validTest) {
    return {
      title: "CSCA Mock Test | Free Online Practice",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/csca/mocktest/${subjectSlug}/${testNumber}`;
  const title = released
    ? `CSCA ${subjectInfo.title} Mock Test ${testNumber} Online | Free Practice`
    : `CSCA ${subjectInfo.title} Mock Test ${String(testNumber).padStart(2, "0")} | Coming Soon`;
  const description = released && exam
    ? `Take GL Education's independent CSCA-style ${subjectInfo.title} Mock Test ${testNumber}: ${exam.questions.length} questions, ${exam.durationMinutes} minutes, scoring and answer review. Not an official CSCA examination.`
    : `This page is reserved for CSCA ${subjectInfo.title} Mock Test ${testNumber} in GL Education's 20-test series. The test will be published after its complete question set and answer key are added and validated.`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: released, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Globlearn Education",
    },
  };
}

export default function MockExamLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
