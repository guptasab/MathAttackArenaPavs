import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMathQuestions, getAverageDifficultyQuestion } from "./openai";
import { createRepository, getUncachableGitHubClient } from "./github-helper";

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

  // GitHub repository creation endpoint
  app.post("/api/github/create-repo", async (req, res) => {
    try {
      const { name, description, isPrivate } = req.body;
      
      const repo = await createRepository(
        name || "math-attack-game",
        description || "A Roblox-inspired 3D math battle arena game with AI-generated questions",
        isPrivate || false
      );
      
      res.json({ 
        success: true,
        repo: {
          name: repo.name,
          url: repo.html_url,
          clone_url: repo.clone_url
        }
      });
    } catch (error: any) {
      console.error("[API] Error creating GitHub repo:", error);
      res.status(500).json({ 
        error: error.message || "Failed to create GitHub repository" 
      });
    }
  });

  // Get GitHub user info
  app.get("/api/github/user", async (req, res) => {
    try {
      const octokit = await getUncachableGitHubClient();
      const user = await octokit.users.getAuthenticated();
      
      res.json({ 
        username: user.data.login,
        name: user.data.name,
        avatar: user.data.avatar_url
      });
    } catch (error: any) {
      console.error("[API] Error getting GitHub user:", error);
      res.status(500).json({ 
        error: error.message || "Failed to get GitHub user info" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
