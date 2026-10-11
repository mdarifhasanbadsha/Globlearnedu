export type MockSubject = "mathematics" | "physics" | "chemistry";
export const MOCK_SUBJECTS: { slug: MockSubject; title: string; short: string; description: string; accent: string }[] = [
 {slug:"mathematics",title:"Mathematics",short:"MATH",description:"Timed mathematics practice in a computer-based exam environment.",accent:"#C8102E"},
 {slug:"physics",title:"Physics",short:"PHYS",description:"Practice physics concepts and numerical problems under time limits.",accent:"#1B3A6B"},
 {slug:"chemistry",title:"Chemistry",short:"CHEM",description:"Build speed and confidence through timed chemistry practice.",accent:"#0F766E"}
];
// A test remains locked until GL Education supplies and reviews its question set and settings.
export const RELEASED_MOCKS: Record<MockSubject, number[]> = {mathematics:[1],physics:[],chemistry:[]};
export function isValidMockSubject(v:string): v is MockSubject { return v==="mathematics"||v==="physics"||v==="chemistry"; }
export function mockKey(subject:MockSubject,n:number){return subject+"-"+n;}
