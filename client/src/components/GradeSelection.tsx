import { motion } from "framer-motion";
import { useMathGame } from "@/lib/stores/useMathGame";
import { useAudio } from "@/lib/stores/useAudio";
import { getQuestionsForGrade } from "@/lib/questionService";
import { useState } from "react";
import { Sparkles, Trophy, Star } from "lucide-react";

export function GradeSelection() {
  const { setGradeLevel, setPhase, setQuestions } = useMathGame();
  const { playSuccess } = useAudio();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGrade, setLoadingGrade] = useState<number | null>(null);

  const grades = [4, 5, 6, 7, 8];
  
  const gradeColors = {
    4: { bg: "#FF6B9D", shadow: "#FF1744", glow: "#FFB3D9" },
    5: { bg: "#4ECDC4", shadow: "#00BFA5", glow: "#A7FFEB" },
    6: { bg: "#FFD93D", shadow: "#FFB300", glow: "#FFF9C4" },
    7: { bg: "#6C5CE7", shadow: "#5B4CDB", glow: "#B19CD9" },
    8: { bg: "#FF6348", shadow: "#E84118", glow: "#FFA894" },
  };

  const handleGradeSelect = async (grade: number) => {
    setIsLoading(true);
    setLoadingGrade(grade);
    playSuccess();

    try {
      console.log(`[GradeSelection] Loading questions for grade ${grade}...`);

      const questions = await getQuestionsForGrade(grade, 100);

      if (questions && questions.length > 0) {
        console.log(`[GradeSelection] Loaded ${questions.length} questions`);
        setQuestions(questions);
        setGradeLevel(grade);

        setTimeout(() => {
          setPhase("initial_quiz");
        }, 500);
      } else {
        console.error("[GradeSelection] No questions received");
        alert("Failed to load questions. Please try again.");
        setIsLoading(false);
        setLoadingGrade(null);
      }
    } catch (error) {
      console.error("[GradeSelection] Error loading questions:", error);
      alert("Failed to load questions. Please refresh the page and try again.");
      setIsLoading(false);
      setLoadingGrade(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4">
        {/* Title */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-8xl font-black text-white mb-4"
            style={{
              textShadow: "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(138,43,226,0.8)",
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            MATH ATTACK
          </motion.h1>
          
          <motion.div
            className="flex items-center justify-center gap-3 text-2xl text-yellow-300 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="w-8 h-8" />
            <span>Choose Your Grade Level</span>
            <Sparkles className="w-8 h-8" />
          </motion.div>
        </motion.div>

        {/* Grade Selection Cards */}
        <div className="grid grid-cols-5 gap-6">
          {grades.map((grade, index) => {
            const colors = gradeColors[grade as keyof typeof gradeColors];
            const isLoadingThis = loadingGrade === grade;
            
            return (
              <motion.button
                key={grade}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !isLoading && handleGradeSelect(grade)}
                disabled={isLoading}
                className="relative group"
                style={{
                  filter: isLoading && !isLoadingThis ? 'grayscale(100%) opacity(50%)' : 'none'
                }}
              >
                <div
                  className="relative h-64 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: colors.bg,
                    boxShadow: `0 10px 40px ${colors.shadow}, 0 0 80px ${colors.glow}`,
                  }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6">
                    <motion.div
                      animate={isLoadingThis ? {
                        rotate: 360,
                      } : {}}
                      transition={{
                        duration: 1,
                        repeat: isLoadingThis ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      {isLoadingThis ? (
                        <Sparkles className="w-20 h-20 text-white mb-4" />
                      ) : (
                        <Trophy className="w-20 h-20 text-white mb-4" />
                      )}
                    </motion.div>
                    
                    <div className="text-7xl font-black text-white mb-2"
                         style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}>
                      {grade}
                    </div>
                    
                    <div className="text-xl font-bold text-white/90"
                         style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                      {isLoadingThis ? 'Loading...' : 'Grade'}
                    </div>
                    
                    {/* Stars decoration */}
                    <div className="absolute top-4 right-4">
                      <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                    </div>
                  </div>
                  
                  {/* Hover glow border */}
                  <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/50 rounded-3xl transition-all duration-300" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-white/80 text-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Generating awesome math questions...</span>
            </div>
          ) : (
            "Select a grade to begin your math adventure!"
          )}
        </motion.div>
      </div>
    </div>
  );
}
