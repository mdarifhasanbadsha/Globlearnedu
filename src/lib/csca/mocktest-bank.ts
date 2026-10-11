import type { MockSubject } from "./mocktest-public";
export type MockQuestion = { prompt:string; options:string[]; answerIndex:number; explanation?:string; marks?:number };
export type MockExam = { subject:MockSubject; testNumber:number; title:string; durationMinutes:number; totalMarks:number; instructions:string[]; questions:MockQuestion[] };
// Only insert questions supplied by GL Education. Correct answers stay on the server and are used to score submissions.
export const MOCK_EXAMS: Record<string,MockExam> = {};
export function getMockExam(key:string):MockExam|undefined { const exam=MOCK_EXAMS[key]; return exam && exam.questions.length>0 ? exam : undefined; }
