import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

// Configure Azure OpenAI
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
});

interface MathQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[];
  difficulty: number;
  gradeLevel: number;
  topic: string;
}

async function generateQuestionsForGrade(gradeLevel: number, count: number = 1000): Promise<MathQuestion[]> {
  console.log(`\n[Generator] Generating ${count} questions for grade ${gradeLevel}...`);
  const allQuestions: MathQuestion[] = [];
  const batchSize = 100; // Generate 100 questions at a time
  const batches = Math.ceil(count / batchSize);

  for (let batch = 0; batch < batches; batch++) {
    const questionsInBatch = Math.min(batchSize, count - allQuestions.length);
    console.log(`[Generator] Batch ${batch + 1}/${batches} - Generating ${questionsInBatch} questions...`);

    try {
      const prompt = `Generate ${questionsInBatch} math questions appropriate for grade ${gradeLevel} students.

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

Distribute the difficulty levels evenly across the questions.

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
- Ensure difficulty is appropriate for grade ${gradeLevel}
- Make questions unique and creative`;

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
      const parsed = JSON.parse(content!);

      // Handle different response formats
      const questionsArray = parsed.questions || parsed.data || parsed;

      if (!Array.isArray(questionsArray)) {
        throw new Error("Invalid response format from AI");
      }

      // Add IDs and grade level to questions
      const questions: MathQuestion[] = questionsArray.map((q: any, index: number) => ({
        id: `q_${gradeLevel}_${Date.now()}_${batch}_${index}`,
        question: q.question,
        answer: q.answer,
        options: q.options,
        difficulty: q.difficulty || 5,
        gradeLevel: gradeLevel,
        topic: q.topic || "Math"
      }));

      allQuestions.push(...questions);
      console.log(`[Generator] Generated ${questions.length} questions. Total: ${allQuestions.length}/${count}`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      console.error(`[Generator] Error in batch ${batch + 1}:`, error.message);
      console.log(`[Generator] Retrying batch ${batch + 1}...`);
      batch--; // Retry this batch
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return allQuestions;
}

async function generateFullQuestionBank() {
  console.log("=".repeat(60));
  console.log("MATH ATTACK ARENA - QUESTION BANK GENERATOR");
  console.log("=".repeat(60));
  console.log("\nThis will generate 1000 questions for each grade level (4-8)");
  console.log("Total: 5000 questions");
  console.log("Estimated time: 10-15 minutes\n");

  const questionBank: Record<number, MathQuestion[]> = {};

  // Generate questions for grades 4-8
  for (let grade = 4; grade <= 8; grade++) {
    const questions = await generateQuestionsForGrade(grade, 1000);
    questionBank[grade] = questions;
    console.log(`✓ Grade ${grade}: ${questions.length} questions generated`);
  }

  // Create assets directory if it doesn't exist
  const assetsDir = join(process.cwd(), "server", "assets");
  try {
    mkdirSync(assetsDir, { recursive: true });
  } catch (err) {
    // Directory might already exist
  }

  // Save to JSON file
  const outputPath = join(assetsDir, "questionBank.json");
  writeFileSync(outputPath, JSON.stringify(questionBank, null, 2));

  console.log("\n" + "=".repeat(60));
  console.log("✓ QUESTION BANK GENERATION COMPLETE!");
  console.log("=".repeat(60));
  console.log(`\nTotal questions generated: ${Object.values(questionBank).reduce((sum, q) => sum + q.length, 0)}`);
  console.log(`Saved to: ${outputPath}`);
  console.log(`File size: ${(JSON.stringify(questionBank).length / 1024 / 1024).toFixed(2)} MB`);

  // Statistics
  console.log("\n📊 Statistics by Grade:");
  for (let grade = 4; grade <= 8; grade++) {
    const questions = questionBank[grade];
    const avgDifficulty = questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length;
    const topics = [...new Set(questions.map(q => q.topic))];
    console.log(`  Grade ${grade}: ${questions.length} questions, Avg Difficulty: ${avgDifficulty.toFixed(1)}, ${topics.length} topics`);
  }

  console.log("\n✓ You can now run the game without Azure OpenAI!\n");
}

// Run the generator
generateFullQuestionBank().catch(error => {
  console.error("\n❌ Error generating question bank:", error);
  process.exit(1);
});
