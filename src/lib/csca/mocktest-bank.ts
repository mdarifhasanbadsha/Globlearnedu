import type { MockSubject } from "./mocktest-public";
export type MockQuestion = { prompt:string; options:string[]; answerIndex:number; explanation?:string; marks?:number };
export type MockExam = { subject:MockSubject; testNumber:number; title:string; durationMinutes:number; totalMarks:number; instructions:string[]; questions:MockQuestion[] };
// Corrected Mathematics Mock 1: source questions reviewed, corrected, and scored server-side.
// Explanations and the answer key are kept out of the public exam payload.
const mathematics1: MockExam = {
  "subject": "mathematics",
  "testNumber": 1,
  "title": "Mathematics — Original Mock Examination 1",
  "durationMinutes": 60,
  "totalMarks": 100,
  "instructions": [
    "This is an original practice paper written for this collection. It is not a past CSCA paper and is not endorsed by the China Scholarship Council.",
    "Each question has four options, of which only one option is correct.",
    "Answer every question. There is no penalty for an incorrect answer.",
    "The paper contains 48 questions and must be completed in 60 minutes (about 75 seconds per question).",
    "A calculator is not required. Numerical answers are exact or rounded sensibly where necessary.",
    "All questions carry equal weight; your result is reported out of 100."
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
      "marks": 2.0833333333333335,
      "explanation": "Use sin 2θ = 2 sin θ cos θ. Since θ is acute, cos θ = 12/13, so sin 2θ = 120/169."
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
      "marks": 2.0833333333333335,
      "explanation": "Multiply numerator and denominator by 2 + 3i: (7 + i)(2 + 3i)/13 = (11 + 23i)/13."
    },
    {
      "prompt": "The solution set of (x − 4)/(x + 1) ≤ 0 is:",
      "options": [
        "{x ∈ ℝ | −1 < x ≤ 4}",
        "{x ∈ ℝ | −1 ≤ x ≤ 4}",
        "{x ∈ ℝ | x ≤ −1 or x ≥ 4}",
        "{x ∈ ℝ | x < −1 or x ≥ 4}"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The denominator is zero at x = −1, which is excluded; the quotient is non-positive between just above −1 and the zero at x = 4."
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
      "marks": 2.0833333333333335,
      "explanation": "The slopes are −1/k and −1/2. Equating them gives k = 2."
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
      "marks": 2.0833333333333335,
      "explanation": "The square root requires x ≤ 5, and the denominator requires x ≠ 2."
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
      "marks": 2.0833333333333335,
      "explanation": "For the hyperbola, c² = a² + b² = 9 + 16 = 25; therefore e = c/a = 5/3."
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
      "marks": 2.0833333333333335,
      "explanation": "The product of the two linear factors is non-positive between the roots, including both roots: [−2, 5]."
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
      "marks": 2.0833333333333335,
      "explanation": "Differentiate term by term: d(4x² − 6x + 2)/dx = 8x − 6."
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
      "marks": 2.0833333333333335,
      "explanation": "A constant function satisfies f(−x) = f(x), so it is even."
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
      "marks": 2.0833333333333335,
      "explanation": "In the worst case, 6 socks of each colour are drawn first. The next sock guarantees 7 of one colour: 13."
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
      "marks": 2.0833333333333335,
      "explanation": "Substituting (3, −1) gives (3 + 4)² + (−1 + 1)² = 49, so the point is on the circle."
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
      "marks": 2.0833333333333335,
      "explanation": "u₃ = −3, u₄ = −5, and u₅ = u₄ − u₃ = −5 − (−3) = −2."
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
      "marks": 2.0833333333333335,
      "explanation": "Triangle area = ½ × 9 × 2 = 9 cm². Volume = 9 × 15 = 135 cm³."
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
      "marks": 2.0833333333333335,
      "explanation": "π is a real number; it is not an integer, rational number, or natural number."
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
      "marks": 2.0833333333333335,
      "explanation": "The denominator is zero when x² = 49, so exclude x = −7 and x = 7."
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
      "marks": 2.0833333333333335,
      "explanation": "As n → ∞, the ratio tends to the ratio of leading coefficients: 9/3 = 3."
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
      "marks": 2.0833333333333335,
      "explanation": "The logarithm's argument must be positive: x² − 49 > 0, hence x < −7 or x > 7."
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
      "marks": 2.0833333333333335,
      "explanation": "P(A | B) = P(A ∩ B)/P(B) = 0.24/0.6 = 0.4."
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
      "marks": 2.0833333333333335,
      "explanation": "Rearrange y = x/4 + 5 to x − 4y + 20 = 0."
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
      "marks": 2.0833333333333335,
      "explanation": "Sphere surface area = 4πr² = 4π(2²) = 16π cm²."
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
      "marks": 2.0833333333333335,
      "explanation": "The centre is (6, 1) with radius 1, so the circle touches the x-axis at (6, 0)."
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
      "marks": 2.0833333333333335,
      "explanation": "log₂ x = 8 means x = 2⁸ = 256."
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
      "marks": 2.0833333333333335,
      "explanation": "Solving y = (4x + 1)/(x − 1) for x gives x = (y + 1)/(y − 4), so f⁻¹(x) = (x + 1)/(x − 4)."
    },
    {
      "prompt": "For f(x) = 4xⁿ, where n is a positive integer, f is an odd function. What is the smallest possible value of n?",
      "options": [
        "3",
        "2",
        "1",
        "4"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "The function xⁿ is odd when n is odd. The smallest positive odd integer is n = 1."
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
      "marks": 2.0833333333333335,
      "explanation": "A 3-element set has 2³ = 8 subsets. Excluding the set itself leaves 7 proper subsets."
    },
    {
      "prompt": "In a survey of 10 students, exactly 1 student reported reading 0 books. What is the relative frequency of the class with value 0?",
      "options": [
        "1/6",
        "10",
        "1",
        "1/10"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335,
      "explanation": "Relative frequency = frequency ÷ total = 1 ÷ 10 = 1/10."
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
      "marks": 2.0833333333333335,
      "explanation": "Distance = √((6 − 0)² + (8 − 0)²) = √100 = 10."
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
      "marks": 2.0833333333333335,
      "explanation": "The interval for x ≥ −8 includes −8 and all larger real numbers: [−8, ∞)."
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
      "marks": 2.0833333333333335,
      "explanation": "Probability of red = 6/(6 + 4) = 6/10 = 3/5."
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
      "marks": 2.0833333333333335,
      "explanation": "For the x-intercept set y = 0 to get x = 2; for the y-intercept set x = 0 to get y = 5."
    },
    {
      "prompt": "The value of log₂₅ 125 is:",
      "options": [
        "3/2",
        "8/5",
        "5/7",
        "7/6"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "Since 25 = 5² and 125 = 5³, log₂₅ 125 = 3/2."
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
      "marks": 2.0833333333333335,
      "explanation": "x² = 8y matches x² = 4py with p = 2; the focus is (0, 2) and directrix is y = −2."
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
      "marks": 2.0833333333333335,
      "explanation": "The period of sin(bx) is 2π/|b|. Here it is 2π/3."
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
      "marks": 2.0833333333333335,
      "explanation": "The slopes are −2/k and −4/6 = −2/3. Equating them gives k = 3."
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
      "marks": 2.0833333333333335,
      "explanation": "f′(x) = 4x + 8, which is non-negative for x ≥ −2, so the function is increasing there."
    },
    {
      "prompt": "The solution set of the system x > −5, x ≥ −2, x < 2, x ≤ 1 is:",
      "options": [
        "−2 > x and x < 1",
        "−2 ≤ x ≤ 1",
        "x ≤ 1",
        "−5 < x < 1"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "Intersecting the inequalities gives the lower bound x ≥ −2 and upper bound x ≤ 1, hence [−2, 1]."
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
      "marks": 2.0833333333333335,
      "explanation": "Distance = √((6 − 2)² + (2 − 5)² + (4 − (−4))²) = √89."
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
      "marks": 2.0833333333333335,
      "explanation": "Distance = √(2² + 3² + 6²) = √49 = 7."
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
      "marks": 2.0833333333333335,
      "explanation": "The graph of an inverse swaps coordinates, so (1, −2) becomes (−2, 1)."
    },
    {
      "prompt": "Every value in a data set is increased by 10. Which quantity is unchanged?",
      "options": [
        "The standard deviation",
        "The maximum",
        "The mean",
        "The sum of all values"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "Adding the same constant to every value shifts the data but does not change its spread. The maximum, mean, and sum all increase."
    },
    {
      "prompt": "The population variance of the data set 3, 5, 7, 9 is:",
      "options": [
        "2.5",
        "6",
        "20",
        "5"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335,
      "explanation": "The mean is 6. The squared deviations sum to 9 + 1 + 1 + 9 = 20. Population variance = 20/4 = 5."
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
      "marks": 2.0833333333333335,
      "explanation": "Adding the equations gives 3x = 6, so x = 2 and y = 3."
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
      "marks": 2.0833333333333335,
      "explanation": "For independent events, P(A ∩ B) = P(A)P(B) = 0.6 × 0.5 = 0.3."
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
      "marks": 2.0833333333333335,
      "explanation": "The mean is (10 + 20 + 30 + 40 + 50)/5 = 150/5 = 30."
    },
    {
      "prompt": "The function f is defined by f(x) = 5 for x < 0 and f(x) = x + 5 for x ≥ 0. Its range is:",
      "options": [
        "y = 5 only",
        "All real y",
        "y > 5",
        "y ≥ 5"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335,
      "explanation": "For x < 0, f(x) = 5; for x ≥ 0, f(x) = x + 5 ≥ 5. Thus the range is y ≥ 5."
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
      "marks": 2.0833333333333335,
      "explanation": "3u = (3, −6), so 3u + v = (3, −6) + (3, 5) = (6, −1)."
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
      "marks": 2.0833333333333335,
      "explanation": "A logarithm's argument must be positive: x + 2 > 0, hence x > −2."
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
      "marks": 2.0833333333333335,
      "explanation": "Range = maximum − minimum = 7 − 7 = 0."
    }
  ]
};
export const MOCK_EXAMS: Record<string,MockExam> = { "mathematics-1": mathematics1 };
export function getMockExam(key:string):MockExam|undefined { const exam=MOCK_EXAMS[key]; return exam && exam.questions.length>0 ? exam : undefined; }
