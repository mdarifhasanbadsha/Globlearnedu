import type { MockSubject } from "./mocktest-public";
export type MockQuestion = { prompt:string; options:string[]; answerIndex:number; explanation?:string; marks?:number };
export type MockExam = { subject:MockSubject; testNumber:number; title:string; durationMinutes:number; totalMarks:number; instructions:string[]; questions:MockQuestion[] };
// Supplied by GL Education and staged as Mathematics Mock 1. answerIndex -1 marks an item that cannot yet be scored fairly because the supplied wording/options need correction.
// All mock tests remain unreleased in mocktest-public.ts until the owner approves corrections and validates the answer key.
const mathematics1: MockExam = {
  "subject": "mathematics",
  "testNumber": 1,
  "title": "Mathematics — Original Mock Examination 1",
  "durationMinutes": 60,
  "totalMarks": 100,
  "instructions": [
    "Each question has four options, of which only one option is correct.",
    "Answer every question. There is no penalty for an incorrect answer.",
    "The paper contains 48 questions and must be completed in 60 minutes (about 75 seconds per question).",
    "A calculator is not required. Numerical answers are exact or given to a sensible precision.",
    "Take g = 9.8 m s⁻² for gravitational calculations in Physics unless stated otherwise."
  ],
  "questions": [
    {
      "prompt": "Given sin θ = 5/13 and θ is acute, the value of sin 2θ is:",
      "options": [
        "120/169",
        "25/169",
        "10/13",
        "144/169"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Express (7 + i)/(2 − 3i) in the form a + bi.",
      "options": [
        "7/2 − (1/3)i",
        "17/13 + (23/13)i",
        "11/13 + (23/13)i",
        "11/13 − (23/13)i"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The solution set of (x − 4)/(x − (−1)) ≤ 0 is:",
      "options": [
        "{x ∈ ℝ | −1 < x ≤ 4}",
        "{x ∈ ℝ | −1 ≤ x ≤ 4}",
        "{x ∈ ℝ | x ≤ −1 or x ≥ 4}",
        "{x ∈ ℝ | x < −1 or x ≥ 4}"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The lines x + ky − 4 = 0 and 4x + 8y + 1 = 0 are parallel. Find k.",
      "options": [
        "1/2",
        "32",
        "2",
        "−2"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The domain of f(x) = √(5 − x) + 1/(x − 2) is:",
      "options": [
        "x ≤ 5",
        "x ≤ 5 and x ≠ 2",
        "x ≥ 2 and x ≤ 5",
        "x < 5 and x ≠ 2"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Find the eccentricity of the hyperbola x²/9 − y²/16 = 1.",
      "options": [
        "5/4",
        "3/5",
        "5/3",
        "4/3"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The solution set of (x + 2)(x − 5) ≤ 0 is:",
      "options": [
        "−2 < x < 5",
        "−2 ≤ x ≤ 5",
        "x ≥ −2",
        "x ≤ −2 or x ≥ 5"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The derivative of f(x) = 4x² − 6x + 2 is:",
      "options": [
        "8x − 6",
        "8x − 6 + 2",
        "4x − 6",
        "8x² − 6x"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Determine the parity of the function f(x) = 7.",
      "options": [
        "Odd",
        "Neither even nor odd",
        "Even",
        "Odd only at x = 0"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "A drawer contains socks of 2 different colours. What is the smallest number of socks that must be taken out (without looking) to be certain of having 7 socks of the same colour?",
      "options": [
        "14",
        "13",
        "12",
        "9"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Does the point (3, −1) lie on the circle (x + 4)² + (y + 1)² = 49?",
      "options": [
        "No — the distance from the centre is 49.",
        "No — the point lies inside the circle.",
        "Yes — every point with integer coordinates lies on the circle.",
        "Yes — (3, −1) is on the circle because (3 + 4)² + (−1 + 1)² = 49."
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "A sequence is defined by u₁ = 5, u₂ = 2 and uₙ₊₂ = uₙ₊₁ − uₙ. The value of u₅ is:",
      "options": [
        "−2",
        "−4",
        "−3",
        "−5"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "A right prism has a triangular cross-section with base 9 cm and perpendicular height 2 cm. The prism is 15 cm long. Its volume is:",
      "options": [
        "270 cm³",
        "45 cm³",
        "9 cm³",
        "135 cm³"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Which of the following membership statements is true?",
      "options": [
        "π ∈ ℤ",
        "π ∈ ℚ",
        "π ∈ ℕ",
        "π ∈ ℝ"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The domain of f(x) = 1/(x² − 49) is:",
      "options": [
        "−7 < x < 7",
        "x ≠ −7 and x ≠ 7",
        "x ≠ 7",
        "x < −7 or x > 7"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Find the limit of the sequence uₙ = (9n + 4)/(3n + 7) as n → ∞.",
      "options": [
        "4/7",
        "0",
        "1/3",
        "3"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The domain of f(x) = ln(x² − 49) is:",
      "options": [
        "x > 7",
        "x < −7 or x > 7",
        "x ≠ ±7",
        "−7 < x < 7"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "P(B) = 0.6 and P(A ∩ B) = 0.24. Find P(A | B).",
      "options": [
        "0.36",
        "0.144",
        "0.4",
        "1.5"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Express the line y = (1/4)x + 5 in the general form ax + by + d = 0 with integer coefficients.",
      "options": [
        "x + 4y + 20 = 0",
        "x − 4y + 20 = 0",
        "x − 4y + 5 = 0",
        "4x − y + 5 = 0"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Find the surface area of a sphere of radius 2 cm, in terms of π.",
      "options": [
        "16π",
        "4π",
        "(32/3)π",
        "17π"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The circle (x − 6)² + (y − 1)² = 1 is described by which statement?",
      "options": [
        "The circle does not meet either axis.",
        "The circle passes through the origin.",
        "The circle touches the y-axis.",
        "The circle touches the x-axis."
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Solve the equation log₂ x = 8.",
      "options": [
        "x = 16",
        "x = 64",
        "x = 8/2",
        "x = 256"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The inverse function of f(x) = (4x + 1)/(x − 1), x ≠ 1, is:",
      "options": [
        "(4x + 1)/(x + 1)",
        "(x − 1)/(x + 4)",
        "(x + 1)/(x − 4)",
        "(x − 4)/(x + 1)"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The function f(x) = 4x³ is ODD, where n is a positive integer. The SMALLEST possible value of n is:",
      "options": [
        "3",
        "2",
        "1",
        "4"
      ],
      "answerIndex": -1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "A set A has exactly 3 elements. The number of PROPER subsets of A is:",
      "options": [
        "9",
        "8",
        "15",
        "7"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "A survey of 10 students recorded the number of books read. The relative frequency of the class with value 0 is:",
      "options": [
        "1/6",
        "10",
        "1",
        "1/10"
      ],
      "answerIndex": -1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Find the distance between the points A(0, 0) and B(6, 8).",
      "options": [
        "10",
        "14",
        "100",
        "2√73"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Which interval represents the set of all real x with x ≥ −8?",
      "options": [
        "[−8, −8]",
        "[−8, +∞)",
        "(−∞, −8]",
        "(−8, +∞)"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "An urn contains 6 red and 4 blue balls. One ball is drawn at random. The probability that it is red is:",
      "options": [
        "2/5",
        "3/2",
        "3/5",
        "1/2"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Find the x-intercept and the y-intercept of the line 5x + 2y = 10.",
      "options": [
        "(10, 0) and (0, 10)",
        "(5, 0) and (0, 2)",
        "(2, 0) and (0, 5)",
        "(0, 2) and (5, 0)"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The value of log₂₅ 125 is:",
      "options": [
        "7/5",
        "8/5",
        "5/7",
        "7/6"
      ],
      "answerIndex": -1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Identify the conic described by the equation x² = 8y.",
      "options": [
        "A parabola with focus (8, 0) and directrix x = −8",
        "A parabola opening to the right with focus (2, 0)",
        "A circle of radius 2",
        "A parabola with focus (0, 2) and directrix y = −2"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The minimum positive period of the function y = 4 sin(3x) is:",
      "options": [
        "4π/3",
        "π/3",
        "2π",
        "2π/3"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The lines 2x + ky − 1 = 0 and 4x + 6y + 3 = 0 are parallel. The value of k is:",
      "options": [
        "3",
        "6",
        "−6",
        "8"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The function f(x) = 2x² + 8x is increasing on the interval:",
      "options": [
        "x ≥ −2",
        "All real x",
        "x ≥ 2",
        "x ≤ −2"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The solution set of the system x > −5, x ≥ −2, x < 2, x ≤ 1 is:",
      "options": [
        "−2 > x < 1",
        "−2 ≥ x ≤ 1",
        "x ≤ 1",
        "−5 < x < 1"
      ],
      "answerIndex": -1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Find the distance between the points A(2, 5, −4) and B(6, 2, 4) in space.",
      "options": [
        "15",
        "5",
        "89",
        "√89"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "In three dimensions, the distance between (0, 0, 0) and (2, 3, 6) is:",
      "options": [
        "7",
        "√11",
        "√13",
        "49"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The point (1, −2) lies on the graph of y = f(x). The corresponding point on the graph of y = f⁻¹(x) is:",
      "options": [
        "(2, −1)",
        "(−2, 1)",
        "(−1, 2)",
        "(1, 2)"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Every value in a data set is increased by 10. Which quantity is unchanged?",
      "options": [
        "The standard deviation",
        "The maximum",
        "The range",
        "The mean"
      ],
      "answerIndex": -1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The variance of the data set 3, 5, 7, 9 is:",
      "options": [
        "2.5",
        "6",
        "20",
        "5"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The intersection point of the lines x + y = 5 and 2x − y = 1 is:",
      "options": [
        "(3, 3)",
        "(−2, −3)",
        "(3, 2)",
        "(2, 3)"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Two independent events A and B have P(A) = 0.6 and P(B) = 0.5. The value of P(A ∩ B) is:",
      "options": [
        "1.1",
        "0.15",
        "0.3",
        "0.1"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The mean of the data set 10, 20, 30, 40, 50 is:",
      "options": [
        "150",
        "31",
        "30",
        "29"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The function f is defined by f(x) = 5 for x < 0 and f(x) = x + 5 for x ≥ 0. Its range is:",
      "options": [
        "y = 5 only",
        "All real y",
        "y = 5 or y ≥ 5",
        "y ≥ 5"
      ],
      "answerIndex": -1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Given u = (1, −2) and v = (3, 5), find the vector 3u + v.",
      "options": [
        "(12, 9)",
        "(4, 3)",
        "(6, −1)",
        "(0, −11)"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "The domain of the function f(x) = log₁₀(x + 2) is:",
      "options": [
        "x > 2",
        "x > −2",
        "x ≠ −2",
        "x ≥ −2"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    },
    {
      "prompt": "Find the RANGE of the data set 7, 7, 7, 7.",
      "options": [
        "7",
        "0",
        "1",
        "14"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335
    }
  ]
};
export const MOCK_EXAMS: Record<string,MockExam> = { "mathematics-1": mathematics1 };
export function getMockExam(key:string):MockExam|undefined { const exam=MOCK_EXAMS[key]; return exam && exam.questions.length>0 ? exam : undefined; }
