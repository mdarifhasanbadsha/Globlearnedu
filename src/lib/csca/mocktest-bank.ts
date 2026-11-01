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
// Mathematics Mock 2: answers and worked explanations are kept server-side until a student opens the review tool.
const mathematics2: MockExam = {
  "subject": "mathematics",
  "testNumber": 2,
  "title": "Mathematics — Original Mock Examination 2 of 20",
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
      "prompt": "Find the equation of the tangent to the curve y = x² − 4x at the point where x = 3.",
      "options": [
        "y = 2x + 9",
        "y = 6x − 3",
        "y = 2x − 9",
        "y = 2x − 3"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "Differentiate: dy/dx = 2x − 4, so the gradient at x = 3 is 2. The point is (3, −3). Using point-slope form gives y + 3 = 2(x − 3), hence y = 2x − 9."
    },
    {
      "prompt": "The circle (x − 3)² + (y − 4)² = 9 is described by which statement?",
      "options": [
        "The circle touches the x-axis.",
        "The circle touches the y-axis.",
        "The circle passes through the origin.",
        "The circle does not meet either axis."
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The centre is (3, 4) and the radius is 3. The distance from the centre to the y-axis is 3, equal to the radius, so the circle touches the y-axis."
    },
    {
      "prompt": "The domain of the function f(x) = √(x + 4) is:",
      "options": [
        "x > −4",
        "x ≥ −4",
        "x ≥ 4",
        "x ≤ −4"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The expression under a square root must be non-negative: x + 4 ≥ 0, so x ≥ −4."
    },
    {
      "prompt": "The point (5, −6) lies on the graph of y = f(x). The corresponding point on the graph of y = f⁻¹(x) is:",
      "options": [
        "(5, 6)",
        "(6, −5)",
        "(−6, 5)",
        "(−5, 6)"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "An inverse function swaps the x- and y-coordinates. Therefore (5, −6) becomes (−6, 5)."
    },
    {
      "prompt": "The lines 4x + ky − 4 = 0 and 12x + 9y + 1 = 0 are parallel. Find k.",
      "options": [
        "−3",
        "16/3",
        "3",
        "432"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "For parallel lines, their gradients are equal. The gradients are −4/k and −12/9 = −4/3. Equating them gives k = 3."
    },
    {
      "prompt": "The set A ∩ B consists of:",
      "options": [
        "All elements that belong to both A and B",
        "All elements that belong to A or to B",
        "All elements of the universal set",
        "All elements that belong to exactly one of A and B"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The intersection A ∩ B contains precisely the elements common to both sets A and B."
    },
    {
      "prompt": "Given cos θ = 4/5, the value of cos 2θ is:",
      "options": [
        "−7/25",
        "7/25",
        "8/5",
        "16/25"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "Use cos 2θ = 2 cos²θ − 1 = 2(16/25) − 1 = 7/25."
    },
    {
      "prompt": "Using the definition of the derivative, find f′(2) for f(x) = x⁴.",
      "options": [
        "16",
        "8",
        "64",
        "32"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335,
      "explanation": "The derivative of x⁴ is 4x³. At x = 2, f′(2) = 4(2³) = 32."
    },
    {
      "prompt": "The ellipse x²/676 + y²/100 = 1 has its major axis along the x-axis. Its foci are:",
      "options": [
        "(±24, 0)",
        "(±10, 0)",
        "(±26, 0)",
        "(0, ±24)"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "Here a² = 676 and b² = 100. For an ellipse, c² = a² − b² = 576, so c = 24 and the foci are (±24, 0)."
    },
    {
      "prompt": "How many different arrangements can be formed from the 5 distinct letters of the word PLANT?",
      "options": [
        "120",
        "5",
        "25",
        "125"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The five letters are distinct, so the number of arrangements is 5! = 5 × 4 × 3 × 2 × 1 = 120."
    },
    {
      "prompt": "The line ℓ₁ has gradient 5 and the line ℓ₂ has gradient −1/5. The two lines are:",
      "options": [
        "neither parallel nor perpendicular",
        "parallel (their gradients are equal)",
        "perpendicular (their gradients multiply to −1)",
        "the same line"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "Two non-vertical lines are perpendicular when the product of their gradients is −1. Here 5 × (−1/5) = −1."
    },
    {
      "prompt": "The domain of f(x) = √(3 − x) + 1/(x + 1) is:",
      "options": [
        "x ≤ 3",
        "x ≤ 3 and x ≠ −1",
        "x < 3 and x ≠ −1",
        "x ≥ −1 and x ≤ 3"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The square root requires 3 − x ≥ 0, so x ≤ 3. The denominator also requires x ≠ −1. Combine these conditions."
    },
    {
      "prompt": "Solve the equation 7ˣ = 343.",
      "options": [
        "x = 49",
        "x = 2",
        "x = 3",
        "x = 4"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "Since 343 = 7³, the equation 7ˣ = 7³ gives x = 3."
    },
    {
      "prompt": "Two fair dice are thrown. The probability that the sum of the two scores is 11 is:",
      "options": [
        "1/12",
        "1/18",
        "19/18",
        "1/6"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "There are 36 equally likely ordered outcomes. A sum of 11 occurs for (5, 6) and (6, 5), so the probability is 2/36 = 1/18."
    },
    {
      "prompt": "Given f(x) = 3x⁴ + 5x², find f′(2).",
      "options": [
        "116",
        "36",
        "68",
        "232"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "Differentiate to get f′(x) = 12x³ + 10x. Thus f′(2) = 12(8) + 20 = 116."
    },
    {
      "prompt": "The line through the origin perpendicular to y = (2/3)x + 1 is:",
      "options": [
        "y = (−3/2)x",
        "y = (−2/3)x",
        "y = (3/2)x",
        "y = (2/3)x"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The original line has gradient 2/3. A perpendicular line has gradient −3/2. Passing through the origin gives y = −(3/2)x."
    },
    {
      "prompt": "A single card is drawn at random from a standard pack of 52. Find the probability that it is a red card.",
      "options": [
        "1/26",
        "1/2",
        "26/51",
        "1/4"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "There are 26 red cards among 52 cards, so the probability is 26/52 = 1/2."
    },
    {
      "prompt": "In three dimensions, the distance between (1, 1, 1) and (3, 3, 2) is:",
      "options": [
        "3",
        "9",
        "√8",
        "√5"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The distance is √((3−1)² + (3−1)² + (2−1)²) = √(4 + 4 + 1) = 3."
    },
    {
      "prompt": "Given |z| = 5, the maximum value of |z + 12i| is:",
      "options": [
        "7",
        "5",
        "17",
        "18"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "By the triangle inequality, |z + 12i| ≤ |z| + |12i| = 5 + 12 = 17. This maximum is attained when z points in the same direction as 12i."
    },
    {
      "prompt": "Express (3 + 4i)/(2 + 2i) in the form a + bi.",
      "options": [
        "−1/4 + 1/4i",
        "3/2 + 2i",
        "7/4 + 1/4i",
        "7/4 − 1/4i"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "Multiply numerator and denominator by 2 − 2i. The numerator becomes 14 + 2i and the denominator is 8, giving 7/4 + (1/4)i."
    },
    {
      "prompt": "X is normally distributed with mean 60 and standard deviation 12. About what percentage of values is less than 48?",
      "options": [
        "about 84%",
        "about 32%",
        "about 16%",
        "about 68%"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "The standard score is z = (48 − 60)/12 = −1. About 16% of a normal distribution lies below one standard deviation below the mean."
    },
    {
      "prompt": "The domain of f(x) = ln(x − 2) + 1/(x − 8) is:",
      "options": [
        "(2, 8) ∪ (8, +∞)",
        "(2, 8]",
        "(2, +∞)",
        "[2, 8) ∪ (8, +∞)"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The logarithm requires x − 2 > 0, so x > 2. The denominator requires x ≠ 8. Thus the domain is (2, 8) ∪ (8, +∞)."
    },
    {
      "prompt": "A box contains 3 white and 3 black balls. 2 balls are drawn at random WITHOUT replacement. The probability that all 2 are white is:",
      "options": [
        "1/2",
        "1/5",
        "1/12",
        "1/4"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The probability is (3/6) × (2/5) = 6/30 = 1/5."
    },
    {
      "prompt": "An ellipse centred at the origin has major axis 20 and minor axis 10, with the major axis along the x-axis. Its equation is:",
      "options": [
        "x²/100 + y²/25 = 1",
        "x²/25 + y²/100 = 1",
        "x²/400 + y²/100 = 1",
        "x²/10 + y²/5 = 1"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The semi-major axis is 10 and the semi-minor axis is 5. With the major axis on x, the equation is x²/10² + y²/5² = 1."
    },
    {
      "prompt": "For the arithmetic sequence with first term 6 and common difference 3, the sum of the first 18 terms is:",
      "options": [
        "561",
        "108",
        "567",
        "570"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "S₁₈ = 18/2 × [2(6) + 17(3)] = 9 × 63 = 567."
    },
    {
      "prompt": "Given a = (1, 3) and b = (2, −1), the vector 3a − b is:",
      "options": [
        "(3, 9)",
        "(−1, −10)",
        "(1, 10)",
        "(5, 8)"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "3a = (3, 9). Subtracting b = (2, −1) gives (3−2, 9−(−1)) = (1, 10)."
    },
    {
      "prompt": "Two independent events A and B have P(A) = 0.25 and P(B) = 0.8. The value of P(A ∩ B) is:",
      "options": [
        "0.55",
        "1.05",
        "0.2",
        "0.1"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "For independent events, P(A ∩ B) = P(A)P(B) = 0.25 × 0.8 = 0.2."
    },
    {
      "prompt": "Every value in a data set is increased by 7. The MEDIAN of the new set is:",
      "options": [
        "increased by 14",
        "unchanged",
        "increased by 7",
        "multiplied by 7"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "Adding 7 to every data value shifts the median upward by 7."
    },
    {
      "prompt": "Find the dot product of the vectors u = (1, −2) and v = (3, 4).",
      "options": [
        "−24",
        "−2",
        "−5",
        "11"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "The dot product is 1(3) + (−2)(4) = 3 − 8 = −5."
    },
    {
      "prompt": "The solution set of the inequality 2 − 7x > 16 is:",
      "options": [
        "x < −2",
        "x > −2",
        "x < 2",
        "x > 2"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "Subtract 2 to obtain −7x > 14. Dividing by −7 reverses the inequality, giving x < −2."
    },
    {
      "prompt": "The lines x + ky − 1 = 0 and 5x + 10y + 3 = 0 are parallel. The value of k is:",
      "options": [
        "10",
        "5",
        "11",
        "2"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335,
      "explanation": "The gradients are −1/k and −5/10 = −1/2. For parallel lines, set −1/k = −1/2, giving k = 2."
    },
    {
      "prompt": "Find the equation of the circle whose diameter has endpoints A(0, 0) and B(6, 8).",
      "options": [
        "(x − 3)² + (y − 4)² = 50",
        "(x − 3)² + (y − 4)² = 25",
        "(x − 3)² + (y − 4)² = 100",
        "(x + 3)² + (y + 4)² = 25"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The centre is the midpoint (3, 4), and the radius is half the diameter length √(6² + 8²)/2 = 10/2 = 5. Hence the radius squared is 25."
    },
    {
      "prompt": "The universal set is U = {1, 2, 3, 4, 5, 6, 7, 8} and A = {1, 3, 5, 7}. The complement of A in U is:",
      "options": [
        "{2, 4, 6, 8}",
        "{1, 2, 3, 4}",
        "{1, 3, 5, 7}",
        "{2, 4, 6}"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The complement contains the elements of U that are not in A: {2, 4, 6, 8}."
    },
    {
      "prompt": "cos α > 0 and tan α < 0. Which statement follows?",
      "options": [
        "first quadrant",
        "second quadrant",
        "third quadrant",
        "fourth quadrant"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335,
      "explanation": "Cosine is positive in quadrants I and IV, while tangent is negative in quadrants II and IV. Therefore α is in quadrant IV."
    },
    {
      "prompt": "The domain of f(x) = √(3x − 9) is:",
      "options": [
        "x ≥ −3",
        "x ≥ 3",
        "x > 3",
        "x ≤ 3"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The radicand must be non-negative: 3x − 9 ≥ 0, so x ≥ 3."
    },
    {
      "prompt": "Given f(x) = x + 9 and g(x) = 2x, the value of g(f(1)) is:",
      "options": [
        "2",
        "10",
        "11",
        "20"
      ],
      "answerIndex": 3,
      "marks": 2.0833333333333335,
      "explanation": "First f(1) = 1 + 9 = 10. Then g(10) = 2(10) = 20."
    },
    {
      "prompt": "Find the x-intercept and the y-intercept of the line 4x + 5y = 20.",
      "options": [
        "(5, 0) and (0, 4)",
        "(20, 0) and (0, 20)",
        "(4, 0) and (0, 5)",
        "(0, 5) and (4, 0)"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "Set y = 0 to get x = 5; set x = 0 to get y = 4. The intercepts are (5, 0) and (0, 4)."
    },
    {
      "prompt": "The set A has 6 elements. The number of elements of the power set P(A) is:",
      "options": [
        "7",
        "6",
        "64",
        "63"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "A set with n elements has 2ⁿ subsets. Thus |P(A)| = 2⁶ = 64."
    },
    {
      "prompt": "Which of the following functions is even?",
      "options": [
        "f(x) = 3x³ + x",
        "f(x) = 3x² + cos x",
        "f(x) = x + sin x",
        "f(x) = 3ˣ"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "Both x² and cos x are even, and a sum of even functions is even. The other listed functions are not even."
    },
    {
      "prompt": "Find the MEAN of the data set 4, 7, 9, 12, 18.",
      "options": [
        "9",
        "10",
        "4",
        "11"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The mean is (4 + 7 + 9 + 12 + 18)/5 = 50/5 = 10."
    },
    {
      "prompt": "A cube has edge length 5 cm. Its volume is:",
      "options": [
        "150 cm³",
        "15 cm³",
        "125 cm³",
        "25 cm³"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "The volume of a cube is a³. Here 5³ = 125 cm³."
    },
    {
      "prompt": "A theatre has 36 seats in the first row; each row after that has 2 more seats than the one before. The total number of seats in the first 14 rows is:",
      "options": [
        "686",
        "868",
        "62",
        "1372"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The rows form an arithmetic sequence with a₁ = 36, d = 2, n = 14. S₁₄ = 14/2 × [2(36) + 13(2)] = 7 × 98 = 686."
    },
    {
      "prompt": "Find the modulus of the complex number z = 7 + 24i.",
      "options": [
        "31",
        "625",
        "25",
        "√527"
      ],
      "answerIndex": 2,
      "marks": 2.0833333333333335,
      "explanation": "The modulus is √(7² + 24²) = √625 = 25."
    },
    {
      "prompt": "The solution set of |2x − 7| ≤ 1 is:",
      "options": [
        "x ≥ 3",
        "3 ≤ x ≤ 4",
        "3 < x < 4",
        "x ≤ 4"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "Solve −1 ≤ 2x − 7 ≤ 1. Adding 7 and dividing by 2 gives 3 ≤ x ≤ 4."
    },
    {
      "prompt": "Which interval represents the set of all real x with x > 2?",
      "options": [
        "[2, 2]",
        "(2, +∞)",
        "(−∞, 2)",
        "[2, +∞)"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The value 2 is excluded and all greater real numbers are included, so the interval is (2, +∞)."
    },
    {
      "prompt": "A geometric sequence has first term 2 and common ratio 1/2. Its 5th term is:",
      "options": [
        "1/8",
        "9/8",
        "1/4",
        "1/16"
      ],
      "answerIndex": 0,
      "marks": 2.0833333333333335,
      "explanation": "The nth term is aₙ = arⁿ⁻¹. Thus a₅ = 2(1/2)⁴ = 1/8."
    },
    {
      "prompt": "Let A = {1, 3, 5, 7} and B = {5, 7, 9, 11}. Which statement is correct?",
      "options": [
        "A ∪ B = {5, 7}",
        "A ∩ B = {5, 7}",
        "A ∩ B = {1, 3}",
        "A ∪ B = {1, 3, 5, 7}"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "The intersection consists of elements in both sets, namely {5, 7}."
    },
    {
      "prompt": "In a geometric sequence, a₃ = 9 and a₆ = 243. The value of a₈ is:",
      "options": [
        "3",
        "2187",
        "2186",
        "2188"
      ],
      "answerIndex": 1,
      "marks": 2.0833333333333335,
      "explanation": "Since a₆/a₃ = r³ = 243/9 = 27, the real common ratio is r = 3. Then a₈ = a₆r² = 243 × 9 = 2187."
    }
  ]
};


const mathematics3: MockExam = {
  subject: "mathematics", testNumber: 3, title: "Mathematics — Original Mock Examination 3",
  durationMinutes: 60, totalMarks: 100,
  instructions: [
    "This is an original practice paper written for this collection. It is not a past CSCA paper and is not endorsed by the China Scholarship Council.",
    "Each question has four options, of which only one option is correct.",
    "Answer every question. There is no penalty for an incorrect answer.",
    "The paper contains 48 questions and must be completed in 60 minutes (about 75 seconds per question).",
    "A calculator is not required. Numerical answers are exact or given to a sensible precision."
  ],
  questions: [
  {
    "prompt": "The POPULATION variance of the data set 10, 12, 14, 16 is:",
    "options": [
      "5",
      "6",
      "20",
      "2.5"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The mean is 13. The squared deviations are 9, 1, 1 and 9, with sum 20. Divide by the population size 4: variance = 20/4 = 5."
  },
  {
    "prompt": "Two spheres have radii in the ratio 1 : 5. The ratio of their volumes is:",
    "options": [
      "1 : 125",
      "1 : 5",
      "3 : 15",
      "1 : 25"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Sphere volume is proportional to the cube of the radius. The volume ratio is 1³ : 5³ = 1 : 125."
  },
  {
    "prompt": "Two items are drawn without replacement from 4 items, of which 2 are of a particular type. The probability that both drawn items are of that type is:",
    "options": [
      "0",
      "2/6",
      "1/2",
      "1/6"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "There is one favourable pair among the six possible pairs: C(2,2)/C(4,2) = 1/6."
  },
  {
    "prompt": "Find the sum of the first 3 terms of the geometric series with first term 16 and common ratio 1/4.",
    "options": [
      "64/3",
      "1/4",
      "−21",
      "21"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The first three terms are 16, 4 and 1. Their sum is 16 + 4 + 1 = 21."
  },
  {
    "prompt": "A frequency distribution is: value 3 occurs 3 times, value 4 occurs once, value 5 occurs once, and value 6 occurs 5 times. Find the mean.",
    "options": [
      "12",
      "10",
      "9/2",
      "24/5"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The total is 3(3) + 4(1) + 5(1) + 6(5) = 48. There are 10 observations, so the mean is 48/10 = 24/5."
  },
  {
    "prompt": "The intersection point of the lines x + 2y = 7 and 3x − y = 7 is:",
    "options": [
      "(3, 2)",
      "(2, 3)",
      "(4, 1)",
      "(−3, −2)"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "From 3x − y = 7, y = 3x − 7. Substituting into x + 2y = 7 gives 7x = 21, so x = 3 and y = 2."
  },
  {
    "prompt": "The set [−4, 3] ∩ [−1, 7] is:",
    "options": [
      "(−1, 3)",
      "[3, −1]",
      "[−4, 7]",
      "[−1, 3]"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The intersection contains values common to both intervals, from −1 to 3 inclusive: [−1, 3]."
  },
  {
    "prompt": "A sequence is defined by u₁ = 2, u₂ = 5 and uₙ₊₂ = 2uₙ₊₁ − uₙ. The value of u₅ is:",
    "options": [
      "11",
      "14",
      "8",
      "28"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The recurrence gives u₃ = 2(5) − 2 = 8, u₄ = 2(8) − 5 = 11 and u₅ = 2(11) − 8 = 14."
  },
  {
    "prompt": "X is normally distributed with mean 50 and standard deviation 5. About what percentage of values lies between 35 and 65?",
    "options": [
      "about 100%",
      "about 68%",
      "about 99.7%",
      "about 95%"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The interval is 50 ± 15, which is three standard deviations from the mean. By the empirical 68–95–99.7 rule, about 99.7% lies within three standard deviations."
  },
  {
    "prompt": "Express the line y = (5/2)x + 6 in the general form ax + by + d = 0 with integer coefficients.",
    "options": [
      "5x − 2y + 6 = 0",
      "5x + 2y + 12 = 0",
      "5x − 2y + 12 = 0",
      "2x − 5y + 6 = 0"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Multiply by 2: 2y = 5x + 12. Rearranging gives 5x − 2y + 12 = 0."
  },
  {
    "prompt": "Find the centre and radius of the circle x² + y² − 12x − 6y + 11 = 0.",
    "options": [
      "(6, 3) and radius 34",
      "(−6, −3) and radius √34",
      "(6, 3) and radius √34",
      "(12, 6) and radius √34"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Complete the squares: (x − 6)² + (y − 3)² = 36 + 9 − 11 = 34. The centre is (6, 3) and the radius is √34."
  },
  {
    "prompt": "The solution set of −7 < −1 − 4x < 3 is:",
    "options": [
      "−1 < x < 3/2",
      "−1 ≤ x ≤ 3/2",
      "3/2 < x < −1",
      "−3/2 < x < 1"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Add 1 to obtain −6 < −4x < 4. Dividing by −4 reverses both inequalities: 3/2 > x > −1, or −1 < x < 3/2."
  },
  {
    "prompt": "How many subsets, including the empty set and the set itself, does a set with 10 elements have?",
    "options": [
      "1024",
      "20",
      "100",
      "1023"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "A set with n elements has 2ⁿ subsets. Here 2¹⁰ = 1024."
  },
  {
    "prompt": "The domain of f(x) = ln(x − 4) + 1/(x − 9) is:",
    "options": [
      "[4, 9) ∪ (9, +∞)",
      "(4, 9]",
      "(4, 9) ∪ (9, +∞)",
      "(4, +∞)"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The logarithm requires x − 4 > 0, so x > 4. The denominator also requires x ≠ 9. The domain is (4, 9) ∪ (9, +∞)."
  },
  {
    "prompt": "The directrix of the parabola x² = 8y is:",
    "options": [
      "y = −2",
      "y = −8",
      "y = 2",
      "x = −2"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Compare x² = 4ay with x² = 8y, giving a = 2. The directrix is y = −a = −2."
  },
  {
    "prompt": "The domain of f(x) = √(5x − 3) is:",
    "options": [
      "x > 3/5",
      "x ≤ 3/5",
      "x ≥ 3/5",
      "x ≥ −3/5"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The radicand must be non-negative: 5x − 3 ≥ 0, so x ≥ 3/5."
  },
  {
    "prompt": "A = {1, 2, 3, 4} and B = {3, 4, 5, 6}. The symmetric difference A △ B = (A − B) ∪ (B − A) is:",
    "options": [
      "{1, 2, 5, 6}",
      "{1, 2}",
      "{1, 2, 3, 4, 5, 6}",
      "{3, 4}"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The elements in exactly one of the sets are 1, 2, 5 and 6. Thus A △ B = {1, 2, 5, 6}."
  },
  {
    "prompt": "Which interval represents the set of all real x with x < 5?",
    "options": [
      "(5, +∞)",
      "[5, 5]",
      "(−∞, 5)",
      "(−∞, 5]"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "All real numbers less than 5 are included, but 5 is excluded. The interval is (−∞, 5)."
  },
  {
    "prompt": "A cylinder has radius 3 cm and height 10 cm. Its volume, in terms of π, is:",
    "options": [
      "90π cm³",
      "60π cm³",
      "91π cm³",
      "30π cm³"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The volume is πr²h = π(3²)(10) = 90π cm³."
  },
  {
    "prompt": "A fair 12-sided die numbered 1 to 12 is rolled. The probability of obtaining a prime number is:",
    "options": [
      "1/12",
      "4/12",
      "6/12",
      "5/12"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The primes from 1 to 12 are 2, 3, 5, 7 and 11. There are 5 favourable outcomes out of 12, so the probability is 5/12."
  },
  {
    "prompt": "Find the dot product of the vectors u = (8, −2) and v = (3, 5).",
    "options": [
      "34",
      "−240",
      "15",
      "14"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The dot product is 8(3) + (−2)(5) = 24 − 10 = 14."
  },
  {
    "prompt": "The vectors u = (k, 2) and v = (3, −3) are perpendicular. The value of k is:",
    "options": [
      "−2",
      "−6",
      "6",
      "2"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Perpendicular vectors have zero dot product: 3k + 2(−3) = 0. Hence 3k − 6 = 0 and k = 2."
  },
  {
    "prompt": "Find the points of intersection of the line x = 7 with the circle x² + y² = 625.",
    "options": [
      "(7, 24) only",
      "(7, 25) and (7, −25)",
      "(7, 24) and (7, −24)",
      "(24, 7) and (−24, 7)"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Substitute x = 7: 49 + y² = 625, so y² = 576 and y = ±24. The points are (7, 24) and (7, −24)."
  },
  {
    "prompt": "Find the angle between the vectors u = (10, 0) and v = (6, 6).",
    "options": [
      "90°",
      "45°",
      "60°",
      "30°"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The dot product is 60 and the magnitudes are 10 and 6√2. Thus cos θ = 60/(60√2) = 1/√2, so θ = 45°."
  },
  {
    "prompt": "A survey of 10 students found that 2 students read exactly 20 books. What is the relative frequency of students who read 20 books?",
    "options": [
      "5",
      "2",
      "1/55",
      "1/5"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Relative frequency = frequency ÷ total observations = 2/10 = 1/5."
  },
  {
    "prompt": "Find the minimum value of f(x) = 3x² − 6x + 1.",
    "options": [
      "1",
      "−2",
      "−1",
      "2"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Complete the square: f(x) = 3(x − 1)² − 2. Since the squared term is non-negative, the minimum value is −2."
  },
  {
    "prompt": "Every value in a data set is multiplied by 5. The median of the new set is:",
    "options": [
      "increased by 5",
      "multiplied by 5",
      "multiplied by 25",
      "unchanged"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Multiplying every observation by a positive constant multiplies the median by the same constant. The new median is 5 times the original median."
  },
  {
    "prompt": "Express (1 + 6i) − (3 + 2i) in the form a + bi.",
    "options": [
      "−2 + 4i",
      "−2 − 4i",
      "−2 + 8i",
      "4 + 4i"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Subtract real and imaginary parts separately: (1 − 3) + (6 − 2)i = −2 + 4i."
  },
  {
    "prompt": "Given a = log₃ 2, b = log₃ 5 and c = log₃ 9, which ordering is correct?",
    "options": [
      "c < b < a",
      "a < b < c",
      "a < c < b",
      "b < a < c"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Because the logarithm with base 3 is increasing, compare 2, 5 and 9: 2 < 5 < 9. Therefore a < b < c."
  },
  {
    "prompt": "Find the distance between A(−1, 2, 0) and B(2, 6, 4) in three-dimensional space.",
    "options": [
      "√41",
      "5",
      "41",
      "11"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The distance is √[(2 + 1)² + (6 − 2)² + (4 − 0)²] = √(9 + 16 + 16) = √41."
  },
  {
    "prompt": "In a geometric sequence, a₁ = 5 and a₄ = 40. The value of a₆ is:",
    "options": [
      "5/2",
      "160",
      "161",
      "159"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Since a₄ = a₁r³, 40 = 5r³ and r³ = 8, so r = 2. Then a₆ = 5(2⁵) = 160."
  },
  {
    "prompt": "How many different ways can 3 students from a group of 6 be arranged in a line, if order matters?",
    "options": [
      "720",
      "120",
      "216",
      "20"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The number of ordered arrangements is ⁶P₃ = 6 × 5 × 4 = 120."
  },
  {
    "prompt": "The value of sin(θ + 3π) is:",
    "options": [
      "−sin θ",
      "cos θ",
      "−cos θ",
      "sin θ"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Using the period 2π, sin(θ + 3π) = sin(θ + π) = −sin θ."
  },
  {
    "prompt": "Solve the equation 2ˣ = 1024.",
    "options": [
      "x = 9",
      "x = 512",
      "x = 11",
      "x = 10"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Since 1024 = 2¹⁰, the equation gives x = 10."
  },
  {
    "prompt": "The function f is defined by f(x) = 2 for x < 0 and f(x) = x + 2 for x ≥ 0. Its range is:",
    "options": [
      "y = 2 only",
      "all real y",
      "y > 2",
      "y ≥ 2"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "For x < 0, the value is 2. For x ≥ 0, x + 2 takes every value from 2 upwards. The range is y ≥ 2."
  },
  {
    "prompt": "Find the value of i⁵, where i² = −1.",
    "options": [
      "1",
      "−1",
      "i",
      "−i"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Powers of i repeat every four powers. i⁵ = i⁴i = 1·i = i."
  },
  {
    "prompt": "Using the definition of the derivative, find f′(3) for f(x) = x⁴.",
    "options": [
      "324",
      "108",
      "81",
      "27"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Differentiating x⁴ gives f′(x) = 4x³. Hence f′(3) = 4(27) = 108."
  },
  {
    "prompt": "The domain of f(x) = ln(x − 4) + √(9 − x) is:",
    "options": [
      "{x | x > 4}",
      "{x | x ≤ 9}",
      "{x | 4 ≤ x ≤ 9}",
      "{x | 4 < x ≤ 9}"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The logarithm requires x > 4, while the square root requires x ≤ 9. Their intersection is 4 < x ≤ 9."
  },
  {
    "prompt": "Five arithmetic means are inserted between 10 and 40. The arithmetic mean closest to 10 is:",
    "options": [
      "35",
      "25",
      "40",
      "15"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "There are 7 terms from 10 to 40, so the common difference is (40 − 10)/6 = 5. The first inserted mean is 10 + 5 = 15."
  },
  {
    "prompt": "In set notation, what does the symbol ∈ mean?",
    "options": [
      "Is a subset of",
      "Is not an element of",
      "Is an element of",
      "Is equal to"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The symbol ∈ means “is an element of” or “belongs to” a set."
  },
  {
    "prompt": "If f(x) = √x and g(x) = x − 7, the domain of the composite function f(g(x)) is:",
    "options": [
      "x ≥ 0",
      "x ≥ 7",
      "x ≤ 7",
      "all real x"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The composite is √(x − 7). Its radicand must be non-negative, so x − 7 ≥ 0 and x ≥ 7."
  },
  {
    "prompt": "The value of (2 − 2i)(1 + 3i) is:",
    "options": [
      "8 − 4i",
      "8 + 4",
      "8 + 4i",
      "−4 + 4i"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Expand: 2 + 6i − 2i − 6i². Since i² = −1, the result is 8 + 4i."
  },
  {
    "prompt": "Which number is the largest of 3/4, 5/7, 2/3 and 7/10?",
    "options": [
      "2/3",
      "3/4",
      "5/7",
      "7/10"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Compare the values: 3/4 = 0.75, 5/7 ≈ 0.714, 2/3 ≈ 0.667 and 7/10 = 0.7. The largest is 3/4."
  },
  {
    "prompt": "In three dimensions, the distance between (1, 2, 2) and (4, 6, 14) is:",
    "options": [
      "√25",
      "169",
      "13",
      "√19"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The distance is √[(4 − 1)² + (6 − 2)² + (14 − 2)²] = √(9 + 16 + 144) = √169 = 13."
  },
  {
    "prompt": "A solid is enlarged so that every length is multiplied by 9. Its surface area is multiplied by:",
    "options": [
      "81",
      "729",
      "18",
      "9"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Surface area scales with the square of the linear scale factor. The multiplier is 9² = 81."
  },
  {
    "prompt": "For the function y = 4 sin(4x), the amplitude and minimum positive period respectively are:",
    "options": [
      "4 and π/2",
      "5 and 2π/3",
      "4 and 2π",
      "3 and π/4"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The amplitude is |4| = 4. The period is 2π/4 = π/2."
  },
  {
    "prompt": "Without a calculator, find the exact value of cos 210°.",
    "options": [
      "√3/2",
      "−√3/2",
      "1/2",
      "−1/2"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "210° = 180° + 30°. Cosine is negative in the third quadrant, so cos 210° = −cos 30° = −√3/2."
  },
  {
    "prompt": "The inverse function of f(x) = 3ˣ is:",
    "options": [
      "f⁻¹(x) = x³",
      "f⁻¹(x) = 1/3ˣ",
      "f⁻¹(x) = logₓ 3",
      "f⁻¹(x) = log₃ x, x > 0"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Set y = 3ˣ, interchange x and y, then solve x = 3ʸ. Thus y = log₃ x, with x > 0."
  }
]
};


const mathematics4: MockExam = {
  subject: "mathematics", testNumber: 4, title: "Mathematics — Original Mock Examination 4",
  durationMinutes: 60, totalMarks: 100,
  instructions: [
    "This is an original practice paper written for this collection. It is not a past CSCA paper and is not endorsed by the China Scholarship Council.",
    "Each question has four options, of which only one option is correct.",
    "Answer every question. There is no penalty for an incorrect answer.",
    "The paper contains 48 questions and must be completed in 60 minutes (about 75 seconds per question).",
    "A calculator is not required. Numerical answers are exact or given to a sensible precision."
  ],
  questions: [
  {
    "prompt": "Find the x-intercept and the y-intercept of the line 2x + 3y = 6.",
    "options": [
      "(0, 3) and (2, 0)",
      "(2, 0) and (0, 3)",
      "(3, 0) and (0, 2)",
      "(6, 0) and (0, 6)"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Set y = 0 to obtain x = 3. Set x = 0 to obtain y = 2. The x-intercept is (3, 0) and the y-intercept is (0, 2)."
  },
  {
    "prompt": "Find the eccentricity of the hyperbola x²/81 − y²/144 = 1.",
    "options": [
      "5/4",
      "5/3",
      "4/3",
      "3/5"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "For this hyperbola, a² = 81 and b² = 144. Thus c² = a² + b² = 225, so c = 15 and the eccentricity is c/a = 15/9 = 5/3."
  },
  {
    "prompt": "The domain of f(x) = √(2x − 5) is:",
    "options": [
      "x > 5/2",
      "x ≥ −5/2",
      "x ≤ 5/2",
      "x ≥ 5/2"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The radicand must be non-negative: 2x − 5 ≥ 0, so x ≥ 5/2."
  },
  {
    "prompt": "The equation of the circle with centre (0, −3) and radius 6 is:",
    "options": [
      "x² + (y + 3)² = 36",
      "(x − 1)² + (y + 3)² = 36",
      "x² + (y + 3)² = 6",
      "x² + (y + 3)² = 12"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "A circle with centre (h, k) and radius r has equation (x − h)² + (y − k)² = r². Substituting (0, −3) and r = 6 gives x² + (y + 3)² = 36."
  },
  {
    "prompt": "Express the line y = (3/7)x + 1 in the general form ax + by + d = 0 with integer coefficients.",
    "options": [
      "3x − 7y + 1 = 0",
      "7x − 3y + 1 = 0",
      "3x − 7y + 7 = 0",
      "3x + 7y + 7 = 0"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Multiply by 7: 7y = 3x + 7. Rearranging gives 3x − 7y + 7 = 0."
  },
  {
    "prompt": "The value of log₁₆ 8 is:",
    "options": [
      "1",
      "3/5",
      "4/3",
      "3/4"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Write 16 = 2⁴ and 8 = 2³. Then log₁₆ 8 = log₂⁴(2³) = 3/4."
  },
  {
    "prompt": "A fair six-sided die is rolled once. Find the probability of obtaining a number at most 2.",
    "options": [
      "2/3",
      "1/3",
      "1/2",
      "1/6"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The favourable outcomes are 1 and 2, so the probability is 2/6 = 1/3."
  },
  {
    "prompt": "The function f(x) = 9xⁿ is even, where n is a positive integer. The smallest possible value of n is:",
    "options": [
      "4",
      "1",
      "3",
      "2"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "For f(x) = 9xⁿ to be even, f(−x) must equal f(x), which requires n to be even. The smallest positive even integer is 2."
  },
  {
    "prompt": "Find the equation of the line through (2, 0) perpendicular to the line y = 5x + 7.",
    "options": [
      "y = −5x + 10",
      "y = 5x − 10",
      "y = −(1/5)x + 2/5",
      "y = −(1/5)x − 2/5"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The given slope is 5, so a perpendicular line has slope −1/5. Through (2, 0): y = −(1/5)(x − 2) = −x/5 + 2/5."
  },
  {
    "prompt": "Solve the equation log₁₀ x = 3.",
    "options": [
      "x = 3/10",
      "x = 59049",
      "x = 1000",
      "x = 30"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "By the definition of logarithms, log₁₀ x = 3 means x = 10³ = 1000."
  },
  {
    "prompt": "In an arithmetic sequence, a₂ = 7 and a₅ = 19. The value of a₁₅ is:",
    "options": [
      "59",
      "60",
      "63",
      "3"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "From a₅ − a₂ = 3d = 19 − 7 = 12, the common difference is d = 4. Then a₁₅ = a₂ + 13d = 7 + 52 = 59."
  },
  {
    "prompt": "The solution set of x² − 11x + 24 > 0 is:",
    "options": [
      "x > 8",
      "x < 3",
      "x < 3 or x > 8",
      "3 < x < 8"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Factor: (x − 3)(x − 8) > 0. The product is positive outside the roots, so x < 3 or x > 8."
  },
  {
    "prompt": "Find the surface area of a sphere of radius 9 cm, in terms of π.",
    "options": [
      "81π cm²",
      "18π cm²",
      "972π cm²",
      "324π cm²"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The surface area is 4πr² = 4π(9²) = 324π cm²."
  },
  {
    "prompt": "Find the distance between the points A(1, 2) and B(4, 6).",
    "options": [
      "5",
      "25",
      "√73",
      "7"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The distance is √[(4 − 1)² + (6 − 2)²] = √(9 + 16) = 5."
  },
  {
    "prompt": "Find the lengths of the major and minor axes of the ellipse x²/100 + y²/36 = 1, where a > b.",
    "options": [
      "100 and 36",
      "20 and 12",
      "10 and 6",
      "12 and 20"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The semi-major and semi-minor axes are a = √100 = 10 and b = √36 = 6. Their full lengths are 2a = 20 and 2b = 12."
  },
  {
    "prompt": "Every value in a data set is increased by 4. The range of the new set is:",
    "options": [
      "increased by 4",
      "multiplied by 4",
      "reduced by 4",
      "unchanged"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Adding the same constant to every observation shifts the minimum and maximum equally. Their difference, the range, is unchanged."
  },
  {
    "prompt": "A normally distributed variable has mean 90 and standard deviation 15. Find the z-score of x = 100.",
    "options": [
      "20/3",
      "−2/3",
      "2/3",
      "2/45"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The z-score is (x − μ)/σ = (100 − 90)/15 = 10/15 = 2/3."
  },
  {
    "prompt": "Let A = {2, 4, 6, 8} and B = {4, 8, 12}. Which statement is correct?",
    "options": [
      "A ∩ B = {4, 8}",
      "A ∪ B = {2, 4, 6, 8}",
      "A ∩ B = {2, 6}",
      "A ∪ B = {4, 8}"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The intersection contains elements present in both sets. These are 4 and 8, so A ∩ B = {4, 8}."
  },
  {
    "prompt": "A box contains 2 white and 6 black balls. Two balls are drawn at random without replacement. The probability that both are white is:",
    "options": [
      "1/28",
      "1/16",
      "1/64",
      "1/4"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The probability is (2/8)(1/7) = 2/56 = 1/28."
  },
  {
    "prompt": "Find the dot product of the vectors u = (2, 3) and v = (4, 5).",
    "options": [
      "120",
      "23",
      "22",
      "−7"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The dot product is 2(4) + 3(5) = 8 + 15 = 23."
  },
  {
    "prompt": "The minimum positive period of the function y = sin(4x) is:",
    "options": [
      "π",
      "2π",
      "π/2",
      "π/4"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "For sin(kx), the period is 2π/|k|. With k = 4, the minimum positive period is 2π/4 = π/2."
  },
  {
    "prompt": "The value of log₄ 8 is:",
    "options": [
      "3/2",
      "3",
      "2/3",
      "2"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Let 4ˣ = 8. Since (2²)ˣ = 2³, 2x = 3 and x = 3/2."
  },
  {
    "prompt": "A function is defined by f(x) = 2x − 3 for x < 1 and f(x) = x² − 6 for x ≥ 1. The value of f(4) is:",
    "options": [
      "10",
      "22",
      "11",
      "5"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Since 4 ≥ 1, use the second rule: f(4) = 4² − 6 = 10."
  },
  {
    "prompt": "Which of the following functions is even?",
    "options": [
      "f(x) = x + sin x",
      "f(x) = 2x² + cos x",
      "f(x) = 2ˣ",
      "f(x) = 2x³ + x"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The functions x² and cos x are both even, so their sum 2x² + cos x is even."
  },
  {
    "prompt": "The function f(x) = √(x − 1) + 2 has domain x ≥ 1. The domain of its inverse f⁻¹ is:",
    "options": [
      "x > 2",
      "x ≥ 1",
      "x ≥ 0",
      "x ≥ 2"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The domain of the inverse equals the range of the original function. Since √(x − 1) ≥ 0, the range of f is y ≥ 2."
  },
  {
    "prompt": "The value of sin(θ + 5π) is:",
    "options": [
      "−sin θ",
      "sin θ",
      "cos θ",
      "−cos θ"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Since 5π is an odd multiple of π, sin(θ + 5π) = −sin θ."
  },
  {
    "prompt": "For positive real numbers a and b with ab = 400, the minimum possible value of a + b is:",
    "options": [
      "41",
      "40",
      "20",
      "400"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "By AM–GM, a + b ≥ 2√(ab) = 2√400 = 40. Equality occurs when a = b = 20."
  },
  {
    "prompt": "The solution set of |x + 1| > 4 is:",
    "options": [
      "x < −5 or x > 3",
      "x < 3",
      "x > −5",
      "−5 < x < 3"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "For |x + 1| > 4, either x + 1 > 4 or x + 1 < −4. Thus x > 3 or x < −5."
  },
  {
    "prompt": "A fair coin is tossed 5 times. The probability of obtaining exactly 3 heads is:",
    "options": [
      "5/16",
      "3/5",
      "2/5",
      "1/32"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "There are C(5,3) = 10 sequences with exactly 3 heads out of 2⁵ = 32 equally likely sequences. The probability is 10/32 = 5/16."
  },
  {
    "prompt": "The domain of f(x) = ln(x − 3) + √(8 − x) is:",
    "options": [
      "{x | 3 < x ≤ 8}",
      "{x | x > 3}",
      "{x | 3 ≤ x ≤ 8}",
      "{x | x ≤ 8}"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The logarithm requires x > 3 and the square root requires x ≤ 8. Their intersection is 3 < x ≤ 8."
  },
  {
    "prompt": "The solution set of (x + 2)/(x + 4) ≥ 0 is:",
    "options": [
      "x ≤ −4 or x > −2",
      "−4 ≤ x < −2",
      "x ≥ −2",
      "x < −4 or x ≥ −2"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The critical values are −4 (excluded) and −2 (included). A sign analysis gives positive values on x < −4 and x ≥ −2."
  },
  {
    "prompt": "For an arithmetic sequence with first term 7 and common difference 5, the sum of the first 10 terms is:",
    "options": [
      "300",
      "295",
      "288",
      "70"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "S₁₀ = 10/2[2(7) + 9(5)] = 5(14 + 45) = 295."
  },
  {
    "prompt": "Find the range of the data set 5, 5, 6, 6, 30.",
    "options": [
      "25",
      "5",
      "30",
      "35"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The range is the maximum minus the minimum: 30 − 5 = 25."
  },
  {
    "prompt": "Does the point (7, 3) lie on the circle (x − 2)² + (y − 3)² = 25?",
    "options": [
      "No — the point lies inside the circle.",
      "No — the distance from the centre is 25.",
      "Yes — (7, 3) is on the circle because (7 − 2)² + (3 − 3)² = 25.",
      "Yes — every point with integer coordinates lies on the circle."
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Substitution gives (7 − 2)² + (3 − 3)² = 25 + 0 = 25. Therefore the point lies on the circle."
  },
  {
    "prompt": "The lines 3x + ky − 4 = 0 and 6x + 5y + 1 = 0 are parallel. Find k.",
    "options": [
      "5/2",
      "−5/2",
      "90",
      "18/5"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Their slopes are −3/k and −6/5. Equating slopes gives −3/k = −6/5, so 15 = 6k and k = 5/2."
  },
  {
    "prompt": "The solution set of the inequality 6 − 4x > 7 is:",
    "options": [
      "x > 1/4",
      "x < −1/4",
      "x > −1/4",
      "x < 1/4"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Subtract 6 to obtain −4x > 1. Dividing by −4 reverses the inequality, giving x < −1/4."
  },
  {
    "prompt": "Solve the equation 5ˣ = 125.",
    "options": [
      "x = 25",
      "x = 2",
      "x = 3",
      "x = 4"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Since 125 = 5³, the equation 5ˣ = 5³ gives x = 3."
  },
  {
    "prompt": "In a group of 40 people, 20 have property A and 18 have property B; 12 have both. A person is chosen at random from those who have property B. Find the probability that this person also has property A.",
    "options": [
      "3/10",
      "1/2",
      "3/5",
      "2/3"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "This is a conditional probability: P(A | B) = number with both A and B divided by number with B = 12/18 = 2/3."
  },
  {
    "prompt": "Given cos θ = 1/3, the value of cos 2θ is:",
    "options": [
      "−7/9",
      "1/9",
      "7/9",
      "2/3"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Use cos 2θ = 2cos²θ − 1 = 2(1/9) − 1 = −7/9."
  },
  {
    "prompt": "The inverse of the function y = 4x − 1 is:",
    "options": [
      "y = (x + 1)/4",
      "y = 4x + 1",
      "y = (x − 1)/4",
      "y = 1/(4x − 1)"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Interchange x and y: x = 4y − 1. Solving for y gives y = (x + 1)/4."
  },
  {
    "prompt": "Find the limit of the sequence uₙ = √(n + 8) − √n as n → ∞.",
    "options": [
      "8",
      "+∞",
      "0",
      "√8"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Rationalising gives 8/[√(n + 8) + √n]. The denominator tends to infinity, so the limit is 0."
  },
  {
    "prompt": "The mean of the data set 3, 6, 9, 12 is:",
    "options": [
      "9",
      "8",
      "7",
      "7.5"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The mean is (3 + 6 + 9 + 12)/4 = 30/4 = 7.5."
  },
  {
    "prompt": "Find the magnitude of the vector v = (8, 15).",
    "options": [
      "23",
      "289",
      "√161",
      "17"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The magnitude is √(8² + 15²) = √(64 + 225) = √289 = 17."
  },
  {
    "prompt": "Find the centre and radius of the circle x² + y² − 8x − 8y − 9 = 0.",
    "options": [
      "(8, 8) and radius √41",
      "(4, 4) and radius √41",
      "(4, 4) and radius 41",
      "(−4, −4) and radius √41"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Complete the squares: (x − 4)² + (y − 4)² = 16 + 16 + 9 = 41. The centre is (4, 4) and the radius is √41."
  },
  {
    "prompt": "An ellipse centred at the origin has major axis length 12 and minor axis length 8, with the major axis along the x-axis. Its equation is:",
    "options": [
      "x²/36 + y²/16 = 1",
      "x²/16 + y²/36 = 1",
      "x²/6 + y²/4 = 1",
      "x²/144 + y²/64 = 1"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The semi-major and semi-minor axes are a = 6 and b = 4. With the major axis along x, the equation is x²/36 + y²/16 = 1."
  },
  {
    "prompt": "The solution set of |5x| < 10 is:",
    "options": [
      "{x | x > −2}",
      "{x | −2 ≤ x ≤ 2}",
      "{x | −2 < x < 2}",
      "{x | x < 2}"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Divide by 5: |x| < 2. Therefore −2 < x < 2."
  },
  {
    "prompt": "Given a = (2, −1) and b = (−1, 3), the vector 2a − b is:",
    "options": [
      "(5, −5)",
      "(−5, 5)",
      "(4, −2)",
      "(3, 1)"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "2a = (4, −2). Subtracting b gives (4 − (−1), −2 − 3) = (5, −5)."
  },
  {
    "prompt": "The ellipse x²/169 + y²/25 = 1 has its major axis along the x-axis. Its foci are:",
    "options": [
      "(0, ±12)",
      "(±13, 0)",
      "(±12, 0)",
      "(±5, 0)"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Here a² = 169 and b² = 25. Thus c² = a² − b² = 144, so c = 12 and the foci are (±12, 0)."
  }
]
};


const mathematics5: MockExam = {
  subject: "mathematics", testNumber: 5, title: "Mathematics — Original Mock Examination 5",
  durationMinutes: 60, totalMarks: 100,
  instructions: [
    "This is an original practice paper written for this collection. It is not a past CSCA paper and is not endorsed by the China Scholarship Council.",
    "Each question has four options, of which only one option is correct.",
    "Answer every question. There is no penalty for an incorrect answer.",
    "The paper contains 48 questions and must be completed in 60 minutes (about 75 seconds per question).",
    "A calculator is not required. Numerical answers are exact or given to a sensible precision."
  ],
  questions: [
  {
    "prompt": "The slope of the line through A(0, 4) and B(5, −6) is:",
    "options": [
      "1/2",
      "−1/2",
      "−2",
      "2"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The slope is (−6 − 4)/(5 − 0) = −10/5 = −2."
  },
  {
    "prompt": "The range of the function f(x) = √(x − 5) + 1 is:",
    "options": [
      "y ≥ 0",
      "y > 1",
      "y ≥ 6",
      "y ≥ 1"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Since √(x − 5) ≥ 0 for x ≥ 5, the smallest output is 1. The range is y ≥ 1."
  },
  {
    "prompt": "The range of the function f(x) = 6/(x + 2) is:",
    "options": [
      "All real y except y = 0",
      "All real y except y = −2",
      "All real y",
      "All real y except y = 6"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The numerator is non-zero, so 6/(x + 2) can never equal 0. Every other real output is possible. Thus the range is ℝ \\ {0}."
  },
  {
    "prompt": "The POPULATION variance of the data set 1, 3, 5, 7 is:",
    "options": [
      "6",
      "5",
      "20",
      "2.5"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The mean is 4. The squared deviations sum to 9 + 1 + 1 + 9 = 20. Population variance = 20/4 = 5."
  },
  {
    "prompt": "The set [2, 9] ∪ [5, 12] is:",
    "options": [
      "[2, 12]",
      "(2, 12)",
      "[2, 9]",
      "[5, 9]"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The intervals overlap from 5 to 9, so their union covers every value from 2 to 12, including both endpoints: [2, 12]."
  },
  {
    "prompt": "The circle (x − 8)² + (y − 2)² = 4 is described by which statement?",
    "options": [
      "The circle touches the y-axis.",
      "The circle does not meet either axis.",
      "The circle touches the x-axis.",
      "The circle passes through the origin."
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The centre is (8, 2) and the radius is 2. Its distance from the x-axis is 2, equal to the radius, so it touches the x-axis."
  },
  {
    "prompt": "Find the coordinates of the midpoint of the segment joining P(1, 2, 3) and Q(5, 6, 9).",
    "options": [
      "(2, 2, 3)",
      "(3, 4, 6)",
      "(4, 5, 7)",
      "(6, 8, 12)"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Average each coordinate: ((1 + 5)/2, (2 + 6)/2, (3 + 9)/2) = (3, 4, 6)."
  },
  {
    "prompt": "A fair six-sided die is rolled once. Find the probability of obtaining an even number.",
    "options": [
      "2/3",
      "1/2",
      "1/6",
      "1/3"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The even outcomes are 2, 4 and 6. The probability is 3/6 = 1/2."
  },
  {
    "prompt": "In an arithmetic sequence, a₁ = 3 and a₆ = 23. The value of a₂₀ is:",
    "options": [
      "79",
      "3",
      "80",
      "83"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Since a₆ − a₁ = 5d = 20, d = 4. Therefore a₂₀ = 3 + 19(4) = 79."
  },
  {
    "prompt": "The set {x : x² = −4, x ∈ ℝ} is:",
    "options": [
      "The set of all real numbers",
      "{2, −2}",
      "The empty set, since no real number squares to a negative number",
      "{4, −4}"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "For every real x, x² ≥ 0. Thus x² = −4 has no real solution, and the set is empty."
  },
  {
    "prompt": "Find the equation of the tangent to the curve y = x² + 7x at the point where x = 1.",
    "options": [
      "y = 9x + 8",
      "y = 9x − 1",
      "y = 2x + 8",
      "y = 9x + 1"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "At x = 1, y = 8. The derivative is 2x + 7, so the tangent slope is 9. Using point-slope form: y − 8 = 9(x − 1), giving y = 9x − 1."
  },
  {
    "prompt": "The gradient of the tangent to y = 4x³ at the point where x = 1 is:",
    "options": [
      "5",
      "3",
      "12",
      "4"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Differentiate: dy/dx = 12x². At x = 1, the gradient is 12."
  },
  {
    "prompt": "A bag contains 4 red and 1 blue ball. A ball is drawn, its colour is noted, and it is replaced. This is done twice. The probability that a red ball is drawn every time is:",
    "options": [
      "1/25",
      "4/5",
      "16/25",
      "3/5"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "With replacement, each draw has probability 4/5 of red and the draws are independent. The probability is (4/5)² = 16/25."
  },
  {
    "prompt": "Evaluate log₁₆ 2.",
    "options": [
      "1/4",
      "4",
      "5/4",
      "−3"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Since 16 = 2⁴, log₁₆ 2 = 1/4."
  },
  {
    "prompt": "A normally distributed variable has mean 70 and standard deviation 5. Find the z-score of x = 80.",
    "options": [
      "−2",
      "16",
      "2",
      "2/5"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The z-score is (80 − 70)/5 = 10/5 = 2."
  },
  {
    "prompt": "The solution set of the system x > −2, x ≥ 1, x < 6, x ≤ 8 is:",
    "options": [
      "x < 6",
      "1 ≤ x < 6",
      "1 > x < 6",
      "−2 < x < 8"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The intersection of all four conditions is x ≥ 1 and x < 6. Thus the solution is 1 ≤ x < 6."
  },
  {
    "prompt": "Which of the following membership statements is true?",
    "options": [
      "−√9 ∉ ℚ",
      "−√9 ∉ ℝ",
      "−√9 ∈ ℤ",
      "−√9 ∈ ℕ"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "−√9 = −3, which is an integer. It is also rational and real, but it is not a natural number."
  },
  {
    "prompt": "In a geometric sequence, a₁ = 2 and a₄ = 54. The value of a₅ is:",
    "options": [
      "163",
      "2/3",
      "161",
      "162"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Since a₄ = a₁r³, 54 = 2r³, so r³ = 27 and r = 3. Then a₅ = 54(3) = 162."
  },
  {
    "prompt": "Find the POPULATION standard deviation of the data set 1, 2, 3, 4, 5.",
    "options": [
      "2√2",
      "√2",
      "3",
      "2"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The mean is 3. The squared deviations sum to 4 + 1 + 0 + 1 + 4 = 10. Population variance = 10/5 = 2, so the population standard deviation is √2."
  },
  {
    "prompt": "Which of these functions decreases on the interval (0, +∞)?",
    "options": [
      "y = 3x",
      "y = x²",
      "y = x³",
      "y = log₀.₅ x"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "A logarithmic function with base between 0 and 1 is strictly decreasing on its positive domain. Since 0 < 0.5 < 1, log₀.₅ x decreases."
  },
  {
    "prompt": "Find the equation of the line through the points (2, −1) and (4, 3).",
    "options": [
      "y = 2x + 5",
      "y = −2x − 5",
      "y = 2x − 5",
      "y = 2x − 1"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The slope is (3 − (−1))/(4 − 2) = 2. Using (2, −1): y + 1 = 2(x − 2), so y = 2x − 5."
  },
  {
    "prompt": "The focus of the parabola y² = 4x is:",
    "options": [
      "(4, 0)",
      "(1, 0)",
      "(0, 1)",
      "(2, 1)"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Compare y² = 4ax with y² = 4x, giving a = 1. The focus is (a, 0) = (1, 0)."
  },
  {
    "prompt": "Find the limit of the sequence uₙ = √(n + 7) − √n as n → ∞.",
    "options": [
      "+∞",
      "7",
      "0",
      "√7"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Rationalising gives 7/[√(n + 7) + √n], which tends to 0 as n tends to infinity."
  },
  {
    "prompt": "The range of the function f(x) = 6(x + 1)² − 9 is:",
    "options": [
      "y ≥ −3",
      "All real y",
      "y ≥ −9",
      "y ≤ −9"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Since (x + 1)² ≥ 0, the minimum value is −9 at x = −1. The range is y ≥ −9."
  },
  {
    "prompt": "Given z = 5 + 12i, find the value of z · z̄, where z̄ is the complex conjugate of z.",
    "options": [
      "120",
      "−119",
      "169i",
      "169"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "z z̄ = (5 + 12i)(5 − 12i) = 5² + 12² = 25 + 144 = 169."
  },
  {
    "prompt": "Given f(x) = 4x² + 3x³, find f′(2).",
    "options": [
      "16",
      "52",
      "40",
      "104"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "Differentiate: f′(x) = 8x + 9x². Therefore f′(2) = 16 + 36 = 52."
  },
  {
    "prompt": "The solution set of −2 < 2 − 3x < 8 is:",
    "options": [
      "−2 < x < 4/3",
      "4/3 < x < −2",
      "−2 ≤ x ≤ 4/3",
      "−4/3 < x < 2"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "From −2 < 2 − 3x, we get x < 4/3. From 2 − 3x < 8, we get x > −2. Together: −2 < x < 4/3."
  },
  {
    "prompt": "Two independent events A and B have P(A) = 0.3 and P(B) = 0.5. The value of P(A ∩ B) is:",
    "options": [
      "0.2",
      "0.075",
      "0.15",
      "0.8"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "For independent events, P(A ∩ B) = P(A)P(B) = 0.3 × 0.5 = 0.15."
  },
  {
    "prompt": "Find the modulus of the complex number z = 20 + 21i.",
    "options": [
      "29",
      "√41",
      "841",
      "41"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The modulus is √(20² + 21²) = √(400 + 441) = √841 = 29."
  },
  {
    "prompt": "Given |z| = 2, the maximum value of |z + 3i| is:",
    "options": [
      "5",
      "6",
      "1",
      "2"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "By the triangle inequality, |z + 3i| ≤ |z| + |3i| = 2 + 3 = 5. Equality is possible when z points in the positive imaginary direction, so the maximum is 5."
  },
  {
    "prompt": "The asymptotes of the hyperbola x²/100 − y²/25 = 1 are:",
    "options": [
      "y = ±5x",
      "y = ±(25/100)x",
      "y = ±(5/10)x",
      "y = ±(10/5)x"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "For x²/a² − y²/b² = 1, the asymptotes are y = ±(b/a)x. Here a = 10 and b = 5, so y = ±(1/2)x."
  },
  {
    "prompt": "A cylinder has radius 6 cm and height 3 cm. Its volume, in terms of π, is:",
    "options": [
      "36π cm³",
      "108π cm³",
      "109π cm³",
      "18π cm³"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The volume is πr²h = π(6²)(3) = 108π cm³."
  },
  {
    "prompt": "The domain of f(x) = √(9 − x) + 1/(x − 4) is:",
    "options": [
      "x ≤ 9",
      "x ≤ 9 and x ≠ 4",
      "x < 9 and x ≠ 4",
      "x ≥ 4 and x ≤ 9"
    ],
    "answerIndex": 1,
    "marks": 2.0833333333333335,
    "explanation": "The square root requires x ≤ 9, and the denominator requires x ≠ 4. The domain is all x ≤ 9 except x = 4."
  },
  {
    "prompt": "Find the POPULATION variance of the data set 1, 3, 5, 7.",
    "options": [
      "5",
      "20",
      "6",
      "20/3"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The mean is 4. The squared deviations sum to 9 + 1 + 1 + 9 = 20. Population variance = 20/4 = 5."
  },
  {
    "prompt": "The inverse function of f(x) = (3x − 1)/(x − 1), where x ≠ 1, is:",
    "options": [
      "(x − 1)/(x − 3), x ≠ 3",
      "(x + 1)/(x + 3)",
      "(x − 3)/(x − 1)",
      "(3x − 1)/(x + 1)"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Set y = (3x − 1)/(x − 1). Then yx − y = 3x − 1, so x(y − 3) = y − 1 and x = (y − 1)/(y − 3). Hence f⁻¹(x) = (x − 1)/(x − 3), with x ≠ 3."
  },
  {
    "prompt": "Find the value of i¹⁵, where i² = −1.",
    "options": [
      "−1",
      "i",
      "−i",
      "1"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Powers of i repeat every four. Since 15 leaves remainder 3 when divided by 4, i¹⁵ = i³ = −i."
  },
  {
    "prompt": "Express the line y = (3/2)x + 1 in the general form ax + by + d = 0 with integer coefficients.",
    "options": [
      "3x − 2y + 1 = 0",
      "2x − 3y + 1 = 0",
      "3x − 2y + 2 = 0",
      "3x + 2y + 2 = 0"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Multiply by 2: 2y = 3x + 2. Rearranging gives 3x − 2y + 2 = 0."
  },
  {
    "prompt": "Two spheres have radii in the ratio 3 : 8. The ratio of their volumes is:",
    "options": [
      "9 : 64",
      "3 : 8",
      "9 : 24",
      "27 : 512"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Sphere volumes scale with the cube of the radius. The volume ratio is 3³ : 8³ = 27 : 512."
  },
  {
    "prompt": "The solution set of (x − 4)/(x + 2) ≥ 0 is:",
    "options": [
      "x < −2 or x ≥ 4",
      "x ≥ 4",
      "−2 ≤ x < 4",
      "x ≤ −2 or x > 4"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The critical values are −2 (excluded) and 4 (included). A sign analysis gives positive values for x < −2 and x ≥ 4."
  },
  {
    "prompt": "How many different arrangements can be formed from the 3 distinct letters of the word CAT?",
    "options": [
      "6",
      "27",
      "3",
      "9"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The three distinct letters can be arranged in 3! = 3 × 2 × 1 = 6 ways."
  },
  {
    "prompt": "The universal set is U = {1, 2, 3, 4, 5, 6, 7, 8, 9} and A = {2, 4, 6, 8}. The complement of A in U is:",
    "options": [
      "{1, 3, 5, 7, 9}",
      "{1, 2, 3, 4}",
      "{1, 3, 5, 7}",
      "{2, 4, 6, 8}"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "The complement consists of elements in U that are not in A: {1, 3, 5, 7, 9}."
  },
  {
    "prompt": "Identify the conic described by the equation y² = 12x.",
    "options": [
      "A parabola with focus (3, 0) and directrix x = −3",
      "A parabola with focus (12, 0) and directrix x = −12",
      "A parabola opening upward with focus (0, 3)",
      "A circle of radius 3"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "Compare y² = 4ax with y² = 12x, giving a = 3. The focus is (3, 0) and the directrix is x = −3."
  },
  {
    "prompt": "The domain of the function f(x) = x³ − 2x is:",
    "options": [
      "All real numbers",
      "x ≥ 0",
      "x ≠ 0",
      "x ∈ ℤ"
    ],
    "answerIndex": 0,
    "marks": 2.0833333333333335,
    "explanation": "A polynomial is defined for every real input, so the domain is ℝ."
  },
  {
    "prompt": "Find the points of intersection of the line x = 0 with the circle x² + y² = 16.",
    "options": [
      "(1, 5) and (0, −5)",
      "(0, 4) only",
      "(4, 0) and (−4, 0)",
      "(0, 4) and (0, −4)"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "Substitute x = 0 into x² + y² = 16: y² = 16, so y = ±4. The points are (0, 4) and (0, −4)."
  },
  {
    "prompt": "The distance between P(−2, −1) and Q(1, 3) is:",
    "options": [
      "√9",
      "25",
      "√7",
      "5"
    ],
    "answerIndex": 3,
    "marks": 2.0833333333333335,
    "explanation": "The distance is √[(1 + 2)² + (3 + 1)²] = √(9 + 16) = 5."
  },
  {
    "prompt": "Given f(x) = 3x − 1 and g(x) = x², the formula for f(g(x)) is:",
    "options": [
      "9x² − 6x + 1",
      "3x² − 3",
      "3x² − 1",
      "x² − 1"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Substitute g(x) = x² into f: f(g(x)) = 3(x²) − 1 = 3x² − 1."
  },
  {
    "prompt": "Find the limit of the sequence uₙ = (4n + 7)/(2n + 1) as n → ∞.",
    "options": [
      "7",
      "1/2",
      "2",
      "0"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "Divide numerator and denominator by n. The limit is 4/2 = 2."
  },
  {
    "prompt": "The domain of f(x) = ln(x² − 81) is:",
    "options": [
      "−9 < x < 9",
      "x > 9",
      "x < −9 or x > 9",
      "x ≠ ±9"
    ],
    "answerIndex": 2,
    "marks": 2.0833333333333335,
    "explanation": "The logarithm requires x² − 81 > 0. Thus (x − 9)(x + 9) > 0, giving x < −9 or x > 9."
  }
]
};

export const MOCK_EXAMS: Record<string,MockExam> = { "mathematics-1": mathematics1, "mathematics-2": mathematics2, "mathematics-3": mathematics3, "mathematics-4": mathematics4, "mathematics-5": mathematics5 };
export function getMockExam(key:string):MockExam|undefined { const exam=MOCK_EXAMS[key]; return exam && exam.questions.length>0 ? exam : undefined; }
