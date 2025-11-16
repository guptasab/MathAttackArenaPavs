import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Sparkles as DreiSparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useMathGame, type MathQuestion, type Bot } from "@/lib/stores/useMathGame";
import { useAudio } from "@/lib/stores/useAudio";
import { useState, useEffect, useRef } from "react";
import { Swords, Zap, Trophy, Heart } from "lucide-react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Player Character (3D Box)
function PlayerCharacter({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color="#4ECDC4" metalness={0.3} roughness={0.4} />
      </mesh>
      <DreiSparkles count={20} scale={1.5} size={2} speed={0.3} color="#4ECDC4" position={position} />
    </Float>
  );
}

// Bot Character (3D Box)
function BotCharacter({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <DreiSparkles count={20} scale={1.5} size={2} speed={0.3} color={color} position={position} />
    </Float>
  );
}

// Arena Ground
function Arena() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d3748" metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Glowing borders */}
      <mesh position={[0, 0, -10]}>
        <boxGeometry args={[20, 0.2, 0.2]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0, 10]}>
        <boxGeometry args={[20, 0.2, 0.2]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-10, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 20]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} />
      </mesh>
      <mesh position={[10, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 20]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} />
      </mesh>
    </>
  );
}

// Battle Scene 3D
function BattleScene({ botColor }: { botColor: string }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#FF6B9D" />
      <pointLight position={[5, 5, -5]} intensity={1} color="#4ECDC4" />
      
      <Arena />
      <PlayerCharacter position={[-3, 0.5, 0]} />
      <BotCharacter position={[3, 0.5, 0]} color={botColor} />
      
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

// Question UI Overlay
interface QuestionOverlayProps {
  question: MathQuestion;
  onAnswer: (answer: string) => void;
  playerScore: number;
  botScore: number;
  botName: string;
  timeLeft: number;
  showFeedback: boolean;
  isCorrect: boolean | null;
}

function QuestionOverlay({ 
  question, 
  onAnswer, 
  playerScore, 
  botScore, 
  botName, 
  timeLeft,
  showFeedback,
  isCorrect
}: QuestionOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Score Display */}
      <div className="absolute top-8 left-0 right-0 flex justify-between px-16">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 rounded-2xl pointer-events-auto"
          style={{ boxShadow: "0 10px 30px rgba(78,205,196,0.4)" }}
        >
          <div className="text-white font-black text-3xl">YOU: {playerScore}/5</div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-4 rounded-2xl pointer-events-auto"
          style={{ boxShadow: "0 10px 30px rgba(255,107,157,0.4)" }}
        >
          <div className="text-white font-black text-3xl">{botName}: {botScore}/5</div>
        </motion.div>
      </div>

      {/* Timer */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-32 left-1/2 transform -translate-x-1/2 pointer-events-auto"
      >
        <div className="bg-yellow-500 px-8 py-4 rounded-full"
             style={{ boxShadow: "0 10px 30px rgba(255,217,61,0.6)" }}>
          <div className="text-white font-black text-4xl flex items-center gap-3">
            <Zap className="w-8 h-8" />
            {timeLeft}s
          </div>
        </div>
      </motion.div>

      {/* Question Card */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-8 pointer-events-auto">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-lg rounded-3xl p-8 border-4 border-white/30"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        >
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            {question.question}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswer(option)}
                disabled={showFeedback}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-3 border-white/40 rounded-xl p-6 text-xl font-bold text-white transition-all duration-200"
                style={{
                  boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
                }}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`mt-6 text-center text-3xl font-black ${
                  isCorrect ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {isCorrect ? '✓ CORRECT!' : '✗ WRONG!'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export function ArenaBattle() {
  const { 
    questions, 
    playerScore, 
    botScore, 
    bot,
    currentQuestionIndex,
    nextQuestion,
    incrementPlayerScore,
    incrementBotScore,
    setPhase,
    addGems,
    gems,
    resetBattle,
    setBot,
    gradeLevel,
    currentArmor,
    equipArmor
  } = useMathGame();
  
  const { playSuccess, playHit } = useAudio();
  const [timeLeft, setTimeLeft] = useState(30);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Initialize bot
  useEffect(() => {
    const newBot: Bot = {
      id: "bot1",
      name: "MathBot",
      color: "#FF6B9D",
      questionsAnswered: 0,
      isAnswering: false
    };
    setBot(newBot);
    resetBattle();
    console.log("[ArenaBattle] Battle started!");
  }, []);

  // Get questions with difficulty adjustment from armor
  const difficultyReduction = currentArmor?.difficultyReduction || 0;
  const battleQuestions = questions
    .filter(q => q.difficulty <= 8 - difficultyReduction)
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, 10);

  const currentQuestion = battleQuestions[currentQuestionIndex] || battleQuestions[0];

  // Timer
  useEffect(() => {
    if (playerScore >= 5 || botScore >= 5) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleBotAnswer();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, playerScore, botScore]);

  // Bot AI - random answer after some time
  const handleBotAnswer = () => {
    const botAnswerTime = 5 + Math.random() * 10;
    
    setTimeout(() => {
      if (playerScore >= 5 || botScore >= 5) return;
      
      const isCorrect = Math.random() > 0.4;
      
      if (isCorrect) {
        incrementBotScore();
        console.log("[Bot] Answered correctly!");
      }
      
      if (botScore + 1 < 5 && playerScore < 5) {
        nextQuestion();
        setTimeLeft(30);
      }
    }, botAnswerTime * 1000);
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      playSuccess();
      incrementPlayerScore();
      console.log(`[Player] Correct! Score: ${playerScore + 1}/5`);
    } else {
      playHit();
      console.log("[Player] Wrong answer!");
    }

    setTimeout(() => {
      setShowFeedback(false);
      setIsCorrect(null);
      
      if (playerScore + (correct ? 1 : 0) >= 5) {
        handleBattleWin();
      } else if (botScore >= 5) {
        handleBattleLose();
      } else {
        nextQuestion();
        setTimeLeft(30);
      }
    }, 1500);
  };

  const handleBattleWin = () => {
    console.log("[ArenaBattle] Player won!");
    addGems(5);
    equipArmor(null);
    
    setTimeout(() => {
      if (gems + 5 >= 10) {
        setPhase("boss_battle");
      } else {
        setPhase("armor_selection");
      }
    }, 2000);
  };

  const handleBattleLose = () => {
    console.log("[ArenaBattle] Bot won!");
    equipArmor(null);
    
    setTimeout(() => {
      setPhase("armor_selection");
    }, 2000);
  };

  // Check win condition
  useEffect(() => {
    if (playerScore >= 5) {
      handleBattleWin();
    } else if (botScore >= 5) {
      handleBattleLose();
    }
  }, [playerScore, botScore]);

  if (!currentQuestion || !bot) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading battle...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 5, 12], fov: 50 }}
        shadows
      >
        <BattleScene botColor={bot.color} />
      </Canvas>

      {/* UI Overlay */}
      <QuestionOverlay
        question={currentQuestion}
        onAnswer={handleAnswer}
        playerScore={playerScore}
        botScore={botScore}
        botName={bot.name}
        timeLeft={timeLeft}
        showFeedback={showFeedback}
        isCorrect={isCorrect}
      />

      {/* Victory/Defeat Screen */}
      <AnimatePresence>
        {(playerScore >= 5 || botScore >= 5) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              {playerScore >= 5 ? (
                <>
                  <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-4" />
                  <h1 className="text-8xl font-black text-yellow-400 mb-4"
                      style={{ textShadow: "0 0 40px rgba(250,204,21,0.8)" }}>
                    VICTORY!
                  </h1>
                  <p className="text-3xl text-white">+5 Gems Earned!</p>
                  <p className="text-2xl text-white/70 mt-2">Total Gems: {gems + 5}</p>
                </>
              ) : (
                <>
                  <Heart className="w-32 h-32 text-red-400 mx-auto mb-4" />
                  <h1 className="text-8xl font-black text-red-400 mb-4"
                      style={{ textShadow: "0 0 40px rgba(248,113,113,0.8)" }}>
                    DEFEATED
                  </h1>
                  <p className="text-3xl text-white">Try again!</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
