import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface MathQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[];
  difficulty: number;
  gradeLevel: number;
  topic: string;
}

type QuestionBank = Record<number, MathQuestion[]>;

let questionBankCache: QuestionBank | null = null;

/**
 * Load the pre-generated question bank from JSON file
 */
export function loadQuestionBank(): QuestionBank {
  if (questionBankCache) {
    return questionBankCache;
  }

  try {
    const questionBankPath = join(__dirname, "assets", "questionBank.json");
    const data = readFileSync(questionBankPath, "utf-8");
    questionBankCache = JSON.parse(data);
    console.log("[QuestionBank] Loaded pre-generated question bank");
    return questionBankCache!;
  } catch (error) {
    console.warn("[QuestionBank] Could not load question bank file:", error);
    return {};
  }
}

/**
 * Get questions from the local question bank for a specific grade level
 */
export function getQuestionsFromBank(
  gradeLevel: number,
  count: number = 100
): MathQuestion[] {
  const questionBank = loadQuestionBank();
  const gradeQuestions = questionBank[gradeLevel];

  if (!gradeQuestions || gradeQuestions.length === 0) {
    throw new Error(`No questions available for grade ${gradeLevel}`);
  }

  // Shuffle and return requested number of questions
  const shuffled = [...gradeQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  console.log(
    `[QuestionBank] Retrieved ${selected.length} questions for grade ${gradeLevel}`
  );

  return selected;
}

/**
 * Check if question bank is available
 */
export function isQuestionBankAvailable(): boolean {
  try {
    const questionBank = loadQuestionBank();
    return Object.keys(questionBank).length > 0;
  } catch {
    return false;
  }
}

/**
 * Get statistics about the question bank
 */
export function getQuestionBankStats(): Record<number, { count: number; avgDifficulty: number }> {
  const questionBank = loadQuestionBank();
  const stats: Record<number, { count: number; avgDifficulty: number }> = {};

  for (const [grade, questions] of Object.entries(questionBank)) {
    const gradeNum = parseInt(grade);
    const avgDifficulty =
      questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length;
    stats[gradeNum] = {
      count: questions.length,
      avgDifficulty: Math.round(avgDifficulty * 10) / 10,
    };
  }

  return stats;
}
