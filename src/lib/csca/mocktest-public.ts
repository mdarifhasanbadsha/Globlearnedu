export type MockSubject = "mathematics" | "physics" | "chemistry";
export const MOCK_SUBJECTS: { slug: MockSubject; title: string; short: string; description: string; accent: string }[] = [
 {slug:"mathematics",title:"Mathematics",short:"MATH",description:"Timed mathematics practice in a computer-based exam environment.",accent:"#C8102E"},
 {slug:"physics",title:"Physics",short:"PHYS",description:"Practice physics concepts and numerical problems under time limits.",accent:"#1B3A6B"},
 {slug:"chemistry",title:"Chemistry",short:"CHEM",description:"Build speed and confidence through timed chemistry practice.",accent:"#0F766E"}
];

export const MOCK_TEST_NUMBERS = Array.from({ length: 20 }, (_, index) => index + 1);

/**
 * Public availability manifest. When a completed, reviewed exam is uploaded,
 * add its number here alongside the question-bank entry. The subject pages,
 * route metadata, and sitemap all read this same list, so separate SEO edits
 * are not needed. This file contains no questions, answers, or explanations.
 */
export const RELEASED_MOCKS: Record<MockSubject, number[]> = {
 mathematics: [1, 2],
 physics: [],
 chemistry: [],
};

export function isValidMockSubject(v:string): v is MockSubject { return v==="mathematics"||v==="physics"||v==="chemistry"; }
export function mockKey(subject:MockSubject,n:number){return subject+"-"+n;}
