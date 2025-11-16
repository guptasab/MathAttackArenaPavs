import { motion } from "framer-motion";
import { useMathGame } from "@/lib/stores/useMathGame";
import { useAudio } from "@/lib/stores/useAudio";
import { useState, useEffect } from "react";
import { Brain, CheckCircle, XCircle } from "lucide-react";

export function InitialQuiz() {
  const { questions, setPhase, addCoins, gradeLevel } = useMathGame();
  const { playSuccess, playHit } = useAudio();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Get average difficulty question
  const avgDifficulty = questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length;
  const targetDifficulty = Math.round(avgDifficulty);
  const question = questions
    .sort((a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty))[0];

  useEffect(() => {
    console.log("[InitialQuiz] Question loaded:", question?.question);
  }, [question]);

  const handleAnswer = (option: string) => {
    if (showResult) return;
    
    setSelectedAnswer(option);
    const correct = option === question.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playSuccess();
      console.log("[InitialQuiz] Correct answer!");
      
      setTimeout(() => {
        addCoins(1);
        setPhase("armor_selection");
      }, 2000);
    } else {
      playHit();
      console.log("[InitialQuiz] Wrong answer, try again");
      
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowResult(false);
      }, 1500);
    }
  };

  if (!question) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl px-8">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-16 h-16 text-yellow-300" />
            <h1 className="text-6xl font-black text-white"
                style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}>
              PROVE YOUR WORTH
            </h1>
            <Brain className="w-16 h-16 text-yellow-300" />
          </div>
          
          <p className="text-2xl text-white/90">
            Answer correctly to unlock your first armor!
          </p>
          
          <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="text-white font-bold text-lg">
              Grade {gradeLevel} • Difficulty: {question.difficulty}/10
            </span>
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-12 mb-8 border-4 border-white/30"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 100px rgba(138,43,226,0.4)"
          }}
        >
          <h2 className="text-4xl font-bold text-white text-center mb-8"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
            {question.question}
          </h2>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isThisCorrect = option === question.answer;
              
              let bgColor = "bg-white/20 hover:bg-white/30";
              let borderColor = "border-white/40";
              let textColor = "text-white";
              
              if (showResult && isSelected) {
                if (isCorrect) {
                  bgColor = "bg-green-500";
                  borderColor = "border-green-300";
                } else {
                  bgColor = "bg-red-500";
                  borderColor = "border-red-300";
                }
              } else if (showResult && isThisCorrect && !isCorrect) {
                bgColor = "bg-green-500/50";
                borderColor = "border-green-300";
              }

              return (
                <motion.button
                  key={index}
                  initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: showResult ? 1 : 1.05 }}
                  whileTap={{ scale: showResult ? 1 : 0.95 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`${bgColor} ${textColor} backdrop-blur-sm border-4 ${borderColor} rounded-2xl p-8 text-2xl font-bold transition-all duration-300 relative overflow-hidden`}
                  style={{
                    boxShadow: isSelected ? "0 0 30px rgba(255,255,255,0.6)" : "0 10px 30px rgba(0,0,0,0.2)"
                  }}
                >
                  {/* Shine effect */}
                  {!showResult && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  )}
                  
                  <div className="relative flex items-center justify-center gap-3">
                    {showResult && isSelected && (
                      isCorrect ? 
                        <CheckCircle className="w-8 h-8" /> : 
                        <XCircle className="w-8 h-8" />
                    )}
                    {option}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Result Message */}
        {showResult && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            {isCorrect ? (
              <div className="text-4xl font-black text-green-300"
                   style={{ textShadow: "0 0 20px rgba(74,222,128,0.8)" }}>
                ✨ CORRECT! Unlocking armor... ✨
              </div>
            ) : (
              <div className="text-4xl font-black text-red-300"
                   style={{ textShadow: "0 0 20px rgba(248,113,113,0.8)" }}>
                Try again!
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
