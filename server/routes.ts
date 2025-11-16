import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMathQuestions, getAverageDifficultyQuestion } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Math question generation endpoint
  app.post("/api/questions/generate", async (req, res) => {
    try {
      const { gradeLevel, count } = req.body;
      
      if (!gradeLevel || gradeLevel < 4 || gradeLevel > 8) {
        return res.status(400).json({ 
          error: "Grade level must be between 4 and 8" 
        });
      }
      
      const questions = await generateMathQuestions(
        gradeLevel, 
        count || 100
      );
      
      res.json({ questions });
    } catch (error: any) {
      console.error("[API] Error generating questions:", error);
      res.status(500).json({ 
        error: error.message || "Failed to generate questions" 
      });
    }
  });
  
  // Get average difficulty question for initial quiz
  app.post("/api/questions/average", async (req, res) => {
    try {
      const { questions } = req.body;
      
      if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({ 
          error: "Questions array is required" 
        });
      }
      
      const question = await getAverageDifficultyQuestion(questions);
      
      res.json({ question });
    } catch (error: any) {
      console.error("[API] Error getting average question:", error);
      res.status(500).json({ 
        error: error.message || "Failed to get average question" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
