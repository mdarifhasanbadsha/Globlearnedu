import { getMockExam } from "./mocktest-bank";

export type MockSubject = "mathematics" | "physics" | "chemistry";
export const MOCK_SUBJECTS: { slug: MockSubject; title: string; short: string; description: string; accent: string }[] = [
 {slug:"mathematics",title:"Mathematics",short:"MATH",description:"Timed mathematics practice in a computer-based exam environment.",accent:"#C8102E"},
 {slug:"physics",title:"Physics",short:"PHYS",description:"Practice physics concepts and numerical problems under time limits.",accent:"#1B3A6B"},
 {slug:"chemistry",title:"Chemistry",short:"CHEM",description:"Build speed and confidence through timed chemistry practice.",accent:"#0F766E"}
];

export const MOCK_TEST_NUMBERS = Array.from({ length: 20 }, (_, index) => index + 1);
export function isValidMockSubject(v:string): v is MockSubject { return v==="mathematics"||v==="physics"||v==="chemistry"; }
export function mockKey(subject:MockSubject,n:number){return subject+"-"+n;}

/**
 * A mock becomes public automatically when its complete exam definition is added to
 * mocktest-bank.ts. Incomplete question sets stay locked and are excluded from SEO.
 */
function hasPublishableQuestionSet(subject: MockSubject, testNumber: number): boolean {
 const exam = getMockExam(mockKey(subject, testNumber));
 return Boolean(
  exam &&
  exam.subject === subject &&
  exam.testNumber === testNumber &&
  exam.questions.length === 48 &&
  exam.durationMinutes === 60 &&
  exam.totalMarks === 100 &&
  exam.questions.every(q =>
   typeof q.prompt === "string" &&
   q.prompt.trim().length > 0 &&
   Array.isArray(q.options) &&
   q.options.length === 4 &&
   q.options.every(option => typeof option === "string" && option.trim().length > 0) &&
   Number.isInteger(q.answerIndex) &&
   q.answerIndex >= 0 &&
   q.answerIndex < q.options.length
  )
 );
}

export const RELEASED_MOCKS: Record<MockSubject, number[]> = Object.fromEntries(
 MOCK_SUBJECTS.map(subject => [
  subject.slug,
  MOCK_TEST_NUMBERS.filter(testNumber => hasPublishableQuestionSet(subject.slug, testNumber))
 ])
) as Record<MockSubject, number[]>;
