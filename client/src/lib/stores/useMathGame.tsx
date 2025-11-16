import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = 
  | "grade_selection" 
  | "initial_quiz" 
  | "armor_selection" 
  | "arena_battle" 
  | "boss_battle" 
  | "game_over";

export interface MathQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[];
  difficulty: number;
  gradeLevel: number;
  topic: string;
}

export interface Armor {
  id: string;
  name: string;
  type: "helmet" | "chestplate" | "shield";
  difficultyReduction: number;
  color: string;
}

export interface Bot {
  id: string;
  name: string;
  color: string;
  questionsAnswered: number;
  isAnswering: boolean;
}

interface MathGameState {
  phase: GamePhase;
  gradeLevel: number;
  coins: number;
  gems: number;
  armorInventory: Armor[];
  currentArmor: Armor | null;
  questions: MathQuestion[];
  currentQuestionIndex: number;
  playerScore: number;
  botScore: number;
  bot: Bot | null;
  isAdminMode: boolean;
  questionRefreshCount: number;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setGradeLevel: (level: number) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  addArmor: (armor: Armor) => void;
  equipArmor: (armor: Armor | null) => void;
  setQuestions: (questions: MathQuestion[]) => void;
  nextQuestion: () => void;
  incrementPlayerScore: () => void;
  incrementBotScore: () => void;
  resetBattle: () => void;
  setBot: (bot: Bot) => void;
  updateBot: (updates: Partial<Bot>) => void;
  toggleAdminMode: () => void;
  giveInfiniteArmor: () => void;
  incrementRefreshCount: () => void;
  resetGame: () => void;
}

const defaultArmors: Armor[] = [
  { id: "helm1", name: "Wisdom Helmet", type: "helmet", difficultyReduction: 1, color: "#4169E1" },
  { id: "chest1", name: "Knowledge Chestplate", type: "chestplate", difficultyReduction: 1, color: "#32CD32" },
  { id: "shield1", name: "Logic Shield", type: "shield", difficultyReduction: 1, color: "#FFD700" },
];

export const useMathGame = create<MathGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "grade_selection",
    gradeLevel: 4,
    coins: 0,
    gems: 0,
    armorInventory: [],
    currentArmor: null,
    questions: [],
    currentQuestionIndex: 0,
    playerScore: 0,
    botScore: 0,
    bot: null,
    isAdminMode: false,
    questionRefreshCount: 0,
    
    setPhase: (phase) => {
      console.log(`[MathGame] Phase transition: ${get().phase} -> ${phase}`);
      set({ phase });
    },
    
    setGradeLevel: (level) => {
      console.log(`[MathGame] Grade level set to: ${level}`);
      set({ gradeLevel: level });
    },
    
    addCoins: (amount) => {
      set((state) => ({ coins: state.coins + amount }));
      console.log(`[MathGame] Coins: ${get().coins}`);
    },
    
    addGems: (amount) => {
      set((state) => ({ gems: state.gems + amount }));
      console.log(`[MathGame] Gems: ${get().gems}`);
    },
    
    addArmor: (armor) => {
      set((state) => ({
        armorInventory: [...state.armorInventory, armor]
      }));
      console.log(`[MathGame] Armor added: ${armor.name}`);
    },
    
    equipArmor: (armor) => {
      set({ currentArmor: armor });
      console.log(`[MathGame] Armor equipped: ${armor?.name || "None"}`);
    },
    
    setQuestions: (questions) => {
      set({ questions, currentQuestionIndex: 0 });
      console.log(`[MathGame] Questions loaded: ${questions.length}`);
    },
    
    nextQuestion: () => {
      set((state) => ({
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          state.questions.length - 1
        )
      }));
    },
    
    incrementPlayerScore: () => {
      set((state) => ({ playerScore: state.playerScore + 1 }));
    },
    
    incrementBotScore: () => {
      set((state) => ({ botScore: state.botScore + 1 }));
    },
    
    resetBattle: () => {
      set({
        playerScore: 0,
        botScore: 0,
        currentQuestionIndex: 0,
        currentArmor: null
      });
      console.log("[MathGame] Battle reset");
    },
    
    setBot: (bot) => {
      set({ bot });
    },
    
    updateBot: (updates) => {
      set((state) => ({
        bot: state.bot ? { ...state.bot, ...updates } : null
      }));
    },
    
    toggleAdminMode: () => {
      set((state) => ({ isAdminMode: !state.isAdminMode }));
      console.log(`[MathGame] Admin mode: ${!get().isAdminMode}`);
    },
    
    giveInfiniteArmor: () => {
      const infiniteArmor = [...defaultArmors, ...defaultArmors, ...defaultArmors];
      set({ armorInventory: infiniteArmor });
      console.log("[MathGame] Infinite armor granted!");
    },
    
    incrementRefreshCount: () => {
      set((state) => ({ questionRefreshCount: state.questionRefreshCount + 1 }));
    },
    
    resetGame: () => {
      set({
        phase: "grade_selection",
        gradeLevel: 4,
        coins: 0,
        gems: 0,
        armorInventory: [],
        currentArmor: null,
        questions: [],
        currentQuestionIndex: 0,
        playerScore: 0,
        botScore: 0,
        bot: null,
        questionRefreshCount: 0
      });
      console.log("[MathGame] Game reset");
    }
  }))
);
