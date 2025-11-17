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
 * Load the pre-generated question bank from public assets
 */
async function loadQuestionBank(): Promise<QuestionBank> {
  if (questionBankCache) {
    return questionBankCache;
  }

  try {
    const response = await fetch('/assets/questionBank.json');
    if (!response.ok) {
      throw new Error(`Failed to load question bank: ${response.status}`);
    }
    questionBankCache = await response.json();
    console.log('[QuestionBank] Loaded pre-generated question bank');
    return questionBankCache!;
  } catch (error) {
    console.error('[QuestionBank] Error loading question bank:', error);
    throw error;
  }
}

/**
 * Get questions for a specific grade level
 */
export async function getQuestionsForGrade(
  gradeLevel: number,
  count: number = 100
): Promise<MathQuestion[]> {
  const questionBank = await loadQuestionBank();
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
export async function isQuestionBankAvailable(): Promise<boolean> {
  try {
    await loadQuestionBank();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get average difficulty question
 */
export function getAverageDifficultyQuestion(
  questions: MathQuestion[]
): MathQuestion | null {
  if (questions.length === 0) return null;

  const avgDifficulty = questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length;
  const target = Math.round(avgDifficulty);

  // Find question closest to average difficulty
  const sorted = [...questions].sort((a, b) =>
    Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target)
  );

  return sorted[0] || null;
}
