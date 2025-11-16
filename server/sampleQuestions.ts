import type { MathQuestion } from "./openai";

// Sample math questions for each grade level as fallback
export const sampleQuestions: Record<number, MathQuestion[]> = {
  4: [
    { id: "g4_1", question: "What is 15 + 27?", answer: "42", options: ["40", "42", "45", "38"], difficulty: 2, gradeLevel: 4, topic: "Addition" },
    { id: "g4_2", question: "What is 63 - 28?", answer: "35", options: ["35", "32", "38", "45"], difficulty: 3, gradeLevel: 4, topic: "Subtraction" },
    { id: "g4_3", question: "What is 8 × 7?", answer: "56", options: ["54", "56", "63", "48"], difficulty: 3, gradeLevel: 4, topic: "Multiplication" },
    { id: "g4_4", question: "What is 72 ÷ 9?", answer: "8", options: ["7", "8", "9", "6"], difficulty: 4, gradeLevel: 4, topic: "Division" },
    { id: "g4_5", question: "What is 1/2 + 1/4?", answer: "3/4", options: ["2/4", "3/4", "1/2", "2/6"], difficulty: 5, gradeLevel: 4, topic: "Fractions" },
    { id: "g4_6", question: "What is the perimeter of a rectangle with length 6 and width 4?", answer: "20", options: ["18", "20", "24", "22"], difficulty: 5, gradeLevel: 4, topic: "Geometry" },
    { id: "g4_7", question: "If a book costs $12 and you buy 3 books, how much do you spend?", answer: "$36", options: ["$32", "$34", "$36", "$38"], difficulty: 4, gradeLevel: 4, topic: "Word Problems" },
    { id: "g4_8", question: "What is 100 - 47?", answer: "53", options: ["53", "57", "43", "47"], difficulty: 3, gradeLevel: 4, topic: "Subtraction" },
    { id: "g4_9", question: "What is 6 × 9?", answer: "54", options: ["48", "52", "54", "56"], difficulty: 3, gradeLevel: 4, topic: "Multiplication" },
    { id: "g4_10", question: "What is 2/3 of 12?", answer: "8", options: ["6", "8", "9", "10"], difficulty: 6, gradeLevel: 4, topic: "Fractions" },
  ],
  5: [
    { id: "g5_1", question: "What is 234 + 567?", answer: "801", options: ["791", "801", "811", "781"], difficulty: 3, gradeLevel: 5, topic: "Addition" },
    { id: "g5_2", question: "What is 3.5 + 2.75?", answer: "6.25", options: ["6.15", "6.25", "6.35", "6.50"], difficulty: 5, gradeLevel: 5, topic: "Decimals" },
    { id: "g5_3", question: "What is 15 × 12?", answer: "180", options: ["160", "170", "180", "190"], difficulty: 4, gradeLevel: 5, topic: "Multiplication" },
    { id: "g5_4", question: "What is 144 ÷ 12?", answer: "12", options: ["10", "11", "12", "14"], difficulty: 4, gradeLevel: 5, topic: "Division" },
    { id: "g5_5", question: "What is 3/4 + 2/3?", answer: "17/12", options: ["5/7", "17/12", "11/12", "5/12"], difficulty: 7, gradeLevel: 5, topic: "Fractions" },
    { id: "g5_6", question: "What is the area of a triangle with base 8 and height 5?", answer: "20", options: ["18", "20", "24", "40"], difficulty: 6, gradeLevel: 5, topic: "Geometry" },
    { id: "g5_7", question: "If x + 15 = 32, what is x?", answer: "17", options: ["15", "17", "19", "47"], difficulty: 5, gradeLevel: 5, topic: "Algebra" },
    { id: "g5_8", question: "What is 25% of 80?", answer: "20", options: ["15", "20", "25", "30"], difficulty: 6, gradeLevel: 5, topic: "Percentages" },
    { id: "g5_9", question: "What is 450 - 187?", answer: "263", options: ["253", "263", "273", "283"], difficulty: 4, gradeLevel: 5, topic: "Subtraction" },
    { id: "g5_10", question: "What is 0.5 × 0.4?", answer: "0.2", options: ["0.1", "0.2", "0.25", "0.3"], difficulty: 7, gradeLevel: 5, topic: "Decimals" },
  ],
  6: [
    { id: "g6_1", question: "What is -5 + 12?", answer: "7", options: ["5", "7", "17", "-7"], difficulty: 5, gradeLevel: 6, topic: "Integers" },
    { id: "g6_2", question: "What is 2³?", answer: "8", options: ["6", "8", "9", "12"], difficulty: 4, gradeLevel: 6, topic: "Exponents" },
    { id: "g6_3", question: "Solve: 2x + 5 = 13", answer: "x = 4", options: ["x = 3", "x = 4", "x = 5", "x = 6"], difficulty: 6, gradeLevel: 6, topic: "Algebra" },
    { id: "g6_4", question: "What is 3/5 ÷ 2/3?", answer: "9/10", options: ["6/15", "9/10", "2/5", "5/6"], difficulty: 8, gradeLevel: 6, topic: "Fractions" },
    { id: "g6_5", question: "What is the circumference of a circle with radius 5? (Use π = 3.14)", answer: "31.4", options: ["28.4", "31.4", "34.4", "15.7"], difficulty: 7, gradeLevel: 6, topic: "Geometry" },
    { id: "g6_6", question: "What is 15% of 240?", answer: "36", options: ["30", "32", "36", "40"], difficulty: 6, gradeLevel: 6, topic: "Percentages" },
    { id: "g6_7", question: "What is the ratio 12:18 simplified?", answer: "2:3", options: ["2:3", "3:4", "4:6", "1:2"], difficulty: 5, gradeLevel: 6, topic: "Ratios" },
    { id: "g6_8", question: "What is |-8|?", answer: "8", options: ["-8", "8", "0", "16"], difficulty: 4, gradeLevel: 6, topic: "Absolute Value" },
    { id: "g6_9", question: "If y = 3x and x = 5, what is y?", answer: "15", options: ["8", "12", "15", "18"], difficulty: 5, gradeLevel: 6, topic: "Algebra" },
    { id: "g6_10", question: "What is the volume of a cube with side length 4?", answer: "64", options: ["48", "56", "64", "72"], difficulty: 7, gradeLevel: 6, topic: "Geometry" },
  ],
  7: [
    { id: "g7_1", question: "Solve: 3(x - 2) = 12", answer: "x = 6", options: ["x = 4", "x = 5", "x = 6", "x = 8"], difficulty: 7, gradeLevel: 7, topic: "Algebra" },
    { id: "g7_2", question: "What is (-3)²?", answer: "9", options: ["-9", "-6", "6", "9"], difficulty: 5, gradeLevel: 7, topic: "Exponents" },
    { id: "g7_3", question: "What is 2.5 ÷ 0.5?", answer: "5", options: ["2", "3", "5", "6"], difficulty: 6, gradeLevel: 7, topic: "Decimals" },
    { id: "g7_4", question: "What is the slope of the line passing through (2, 3) and (6, 11)?", answer: "2", options: ["1", "2", "3", "4"], difficulty: 8, gradeLevel: 7, topic: "Algebra" },
    { id: "g7_5", question: "What is 35% of 200?", answer: "70", options: ["60", "65", "70", "75"], difficulty: 6, gradeLevel: 7, topic: "Percentages" },
    { id: "g7_6", question: "If the probability of rain is 0.3, what is the probability it won't rain?", answer: "0.7", options: ["0.3", "0.5", "0.7", "1.0"], difficulty: 7, gradeLevel: 7, topic: "Probability" },
    { id: "g7_7", question: "What is √49?", answer: "7", options: ["6", "7", "8", "9"], difficulty: 5, gradeLevel: 7, topic: "Square Roots" },
    { id: "g7_8", question: "Solve: 2x - 3 = x + 5", answer: "x = 8", options: ["x = 2", "x = 5", "x = 8", "x = 10"], difficulty: 7, gradeLevel: 7, topic: "Algebra" },
    { id: "g7_9", question: "What is the area of a circle with radius 6? (Use π = 3.14)", answer: "113.04", options: ["108.04", "113.04", "118.04", "37.68"], difficulty: 8, gradeLevel: 7, topic: "Geometry" },
    { id: "g7_10", question: "What is 5⁰?", answer: "1", options: ["0", "1", "5", "undefined"], difficulty: 6, gradeLevel: 7, topic: "Exponents" },
  ],
  8: [
    { id: "g8_1", question: "Solve: x² - 5x + 6 = 0 (smaller solution)", answer: "x = 2", options: ["x = 1", "x = 2", "x = 3", "x = 6"], difficulty: 9, gradeLevel: 8, topic: "Quadratic Equations" },
    { id: "g8_2", question: "What is the slope-intercept form of 2x + 3y = 12?", answer: "y = -2/3x + 4", options: ["y = 2/3x + 4", "y = -2/3x + 4", "y = 3/2x + 6", "y = -3/2x + 6"], difficulty: 8, gradeLevel: 8, topic: "Algebra" },
    { id: "g8_3", question: "What is √144?", answer: "12", options: ["10", "11", "12", "14"], difficulty: 5, gradeLevel: 8, topic: "Square Roots" },
    { id: "g8_4", question: "If f(x) = 2x + 3, what is f(5)?", answer: "13", options: ["11", "12", "13", "15"], difficulty: 7, gradeLevel: 8, topic: "Functions" },
    { id: "g8_5", question: "What is the volume of a cylinder with radius 3 and height 10? (Use π = 3.14)", answer: "282.6", options: ["94.2", "188.4", "282.6", "376.8"], difficulty: 9, gradeLevel: 8, topic: "Geometry" },
    { id: "g8_6", question: "Simplify: (x³)²", answer: "x⁶", options: ["x⁵", "x⁶", "x⁹", "x¹²"], difficulty: 7, gradeLevel: 8, topic: "Exponents" },
    { id: "g8_7", question: "What is the Pythagorean theorem for sides 3, 4, and c?", answer: "c = 5", options: ["c = 4", "c = 5", "c = 6", "c = 7"], difficulty: 8, gradeLevel: 8, topic: "Geometry" },
    { id: "g8_8", question: "Solve: |x - 3| = 7", answer: "x = 10 or x = -4", options: ["x = 4", "x = 10", "x = 10 or x = -4", "x = 7"], difficulty: 9, gradeLevel: 8, topic: "Absolute Value" },
    { id: "g8_9", question: "What is 4⁻²?", answer: "1/16", options: ["1/8", "1/16", "-8", "-16"], difficulty: 8, gradeLevel: 8, topic: "Exponents" },
    { id: "g8_10", question: "What is the distance between points (1, 2) and (4, 6)?", answer: "5", options: ["3", "4", "5", "7"], difficulty: 9, gradeLevel: 8, topic: "Coordinate Geometry" },
  ]
};

// Generate more questions by duplicating and slightly modifying
export function generateFallbackQuestions(gradeLevel: number): MathQuestion[] {
  const base = sampleQuestions[gradeLevel] || sampleQuestions[4];
  const questions: MathQuestion[] = [...base];
  
  // Duplicate and modify to reach 100 questions
  for (let i = 0; i < 9; i++) {
    base.forEach((q, idx) => {
      questions.push({
        ...q,
        id: `${q.id}_${i}_${idx}`,
      });
    });
  }
  
  return questions.slice(0, 100);
}
