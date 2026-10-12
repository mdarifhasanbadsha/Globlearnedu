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

export const MOCK_EXAMS: Record<string,MockExam> = { "mathematics-1": mathematics1, "mathematics-2": mathematics2 };
export function getMockExam(key:string):MockExam|undefined { const exam=MOCK_EXAMS[key]; return exam && exam.questions.length>0 ? exam : undefined; }
