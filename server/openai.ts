import OpenAI from "openai";
import { generateFallbackQuestions } from "./sampleQuestions";

// Configure Azure OpenAI with default profile
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
});

export interface MathQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[];
  difficulty: number;
  gradeLevel: number;
  topic: string;
}

export async function generateMathQuestions(
  gradeLevel: number,
  count: number = 100
): Promise<MathQuestion[]> {
  try {
    const prompt = `Generate ${count} math questions appropriate for grade ${gradeLevel} students. 
    
Include a variety of topics such as:
- Arithmetic (addition, subtraction, multiplication, division)
- Fractions and decimals
- Geometry (area, perimeter, volume)
- Algebra (basic equations, variables)
- Word problems
- Patterns and sequences

For each question, assign a difficulty level from 1-10 where:
- 1-3: Easy (basic concepts)
- 4-6: Medium (multi-step problems)
- 7-10: Hard (complex reasoning)

Respond with a JSON array where each question has this exact format:
{
  "question": "What is 15 + 27?",
  "answer": "42",
  "options": ["40", "42", "45", "38"],
  "difficulty": 3,
  "topic": "Addition"
}

IMPORTANT: 
- Make sure the correct answer is included in the options array
- Shuffle the options so the correct answer isn't always in the same position
- Make questions engaging and varied
- Ensure difficulty is appropriate for grade ${gradeLevel}`;

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert math teacher who creates engaging, age-appropriate math questions. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    // Handle different response formats
    const questionsArray = parsed.questions || parsed.data || parsed;
    
    if (!Array.isArray(questionsArray)) {
      throw new Error("Invalid response format from AI");
    }

    // Add IDs and grade level to questions
    const questions: MathQuestion[] = questionsArray.map((q: any, index: number) => ({
      id: `q_${gradeLevel}_${Date.now()}_${index}`,
      question: q.question,
      answer: q.answer,
      options: q.options,
      difficulty: q.difficulty || 5,
      gradeLevel: gradeLevel,
      topic: q.topic || "Math"
    }));

    console.log(`[OpenAI] Generated ${questions.length} questions for grade ${gradeLevel}`);
    return questions;
  } catch (error: any) {
    console.error("[OpenAI] Error generating questions:", error);
    console.log("[OpenAI] Falling back to sample questions");
    return generateFallbackQuestions(gradeLevel);
  }
}

export async function getAverageDifficultyQuestion(
  questions: MathQuestion[]
): Promise<MathQuestion | null> {
  const avgDifficulty = questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length;
  const target = Math.round(avgDifficulty);
  
  // Find question closest to average difficulty
  const sorted = [...questions].sort((a, b) => 
    Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target)
  );
  
  return sorted[0] || null;
}
