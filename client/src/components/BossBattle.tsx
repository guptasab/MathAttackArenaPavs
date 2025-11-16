import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles as DreiSparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useMathGame, type MathQuestion } from "@/lib/stores/useMathGame";
import { useAudio } from "@/lib/stores/useAudio";
import { useState, useEffect, useRef } from "react";
import { Crown, Skull, Trophy } from "lucide-react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Boss Character (Large menacing cube)
function BossCharacter() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={[3, 1, 0]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#8B0000" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#8B0000"
          emissiveIntensity={0.5}
        />
      </mesh>
      <DreiSparkles count={100} scale={3} size={5} speed={0.8} color="#FF0000" />
      <pointLight intensity={3} distance={10} color="#FF0000" />
    </group>
  );
}

function PlayerCharacter() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh position={[-3, 0.5, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color="#4ECDC4" metalness={0.3} roughness={0.4} />
      </mesh>
    </Float>
  );
}

function BossArena() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial 
          color="#1a0000" 
          emissive="#8B0000"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Lava-like borders */}
      {[...Array(4)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            i === 0 || i === 2 ? 0 : (i === 1 ? 12 : -12),
            0.5,
            i === 1 || i === 3 ? 0 : (i === 0 ? -12 : 12)
          ]}
          rotation={i % 2 === 0 ? [0, 0, 0] : [0, Math.PI / 2, 0]}
        >
          <boxGeometry args={[25, 1, 0.5]} />
          <meshStandardMaterial 
            color="#FF4500" 
            emissive="#FF4500" 
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </>
  );
}

export function BossBattle() {
  const {
    questions,
    gradeLevel,
    setPhase,
    addGems,
    gems,
    incrementRefreshCount,
    getUnusedQuestions,
    markQuestionAsUsed
  } = useMathGame();
  
  const { playSuccess, playHit } = useAudio();
  const [playerScore, setPlayerScore] = useState(0);
  const [bossHealth, setBossHealth] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);

  // Get unused next grade level questions (harder)
  const unusedQuestions = getUnusedQuestions();
  const nextGradeQuestions = unusedQuestions
    .filter(q => q.difficulty >= 7)
    .slice(0, 10);

  const currentQuestion = nextGradeQuestions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    if (showFeedback || !currentQuestion) return;

    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Mark question as used when answered
    markQuestionAsUsed(currentQuestion.id);

    if (correct) {
      playSuccess();
      setPlayerScore(prev => prev + 1);
      setBossHealth(prev => prev - 1);
      console.log(`[BossBattle] Hit! Boss health: ${bossHealth - 1}/5`);
    } else {
      playHit();
      console.log("[BossBattle] Missed!");
    }

    setTimeout(() => {
      setShowFeedback(false);
      setIsCorrect(null);

      if (bossHealth - (correct ? 1 : 0) <= 0) {
        setBattleResult('win');
        handleBossDefeated();
      } else if (currentQuestionIndex >= nextGradeQuestions.length - 1) {
        setBattleResult('lose');
        handleBossWon();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 1500);
  };

  const handleBossDefeated = () => {
    console.log("[BossBattle] Boss defeated!");
    addGems(10);
    playSuccess();
    
    // Trigger question refresh for next grade
    incrementRefreshCount();
    
    setTimeout(() => {
      setPhase("grade_selection");
    }, 3000);
  };

  const handleBossWon = () => {
    console.log("[BossBattle] Boss won!");
    playHit();
    
    setTimeout(() => {
      setPhase("arena_battle");
    }, 3000);
  };

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading boss battle...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 6, 15], fov: 50 }} shadows>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 10, 5]} intensity={1} color="#FF0000" />
        <pointLight position={[-5, 5, -5]} intensity={2} color="#8B0000" />
        
        <BossArena />
        <PlayerCharacter />
        <BossCharacter />
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Boss Health Bar */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 pointer-events-auto"
        >
          <div className="bg-black/80 backdrop-blur-sm px-8 py-4 rounded-2xl border-4 border-red-500">
            <div className="flex items-center gap-4 mb-2">
              <Skull className="w-12 h-12 text-red-500" />
              <h2 className="text-3xl font-black text-red-500">BOSS</h2>
            </div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-16 h-6 rounded ${
                    i < bossHealth ? 'bg-red-500' : 'bg-gray-700'
                  }`}
                  style={{
                    boxShadow: i < bossHealth ? '0 0 10px #FF0000' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Player Score */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute top-32 left-8 pointer-events-auto"
        >
          <div className="bg-cyan-500 px-6 py-3 rounded-xl">
            <div className="text-white font-black text-2xl">
              HITS: {playerScore}
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-8 pointer-events-auto">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-red-900/95 to-black/95 backdrop-blur-lg rounded-3xl p-8 border-4 border-red-500"
            style={{ boxShadow: "0 20px 60px rgba(139,0,0,0.8)" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Crown className="w-10 h-10 text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-400">
                BOSS CHALLENGE - Grade {gradeLevel + 1} Level
              </h3>
            </div>

            <h3 className="text-3xl font-bold text-white mb-6 text-center">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className="bg-red-900/50 hover:bg-red-800/70 border-3 border-red-500 rounded-xl p-6 text-xl font-bold text-white transition-all duration-200"
                  style={{ boxShadow: "0 5px 15px rgba(139,0,0,0.5)" }}
                >
                  {option}
                </motion.button>
              ))}
            </div>

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
                  {isCorrect ? '⚔️ CRITICAL HIT!' : '🛡️ BLOCKED!'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Battle Result */}
      <AnimatePresence>
        {battleResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="text-center"
            >
              {battleResult === 'win' ? (
                <>
                  <Trophy className="w-40 h-40 text-yellow-400 mx-auto mb-6" />
                  <h1 className="text-9xl font-black text-yellow-400 mb-4"
                      style={{ textShadow: "0 0 50px rgba(250,204,21,1)" }}>
                    BOSS DEFEATED!
                  </h1>
                  <p className="text-4xl text-white font-bold mb-2">+10 Gems!</p>
                  <p className="text-3xl text-white/70">Total Gems: {gems + 10}</p>
                  <p className="text-2xl text-green-400 mt-6">
                    🎉 Ready for the next grade level! 🎉
                  </p>
                </>
              ) : (
                <>
                  <Skull className="w-40 h-40 text-red-500 mx-auto mb-6" />
                  <h1 className="text-9xl font-black text-red-500 mb-4"
                      style={{ textShadow: "0 0 50px rgba(139,0,0,1)" }}>
                    DEFEATED
                  </h1>
                  <p className="text-3xl text-white">Gather more gems and try again!</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
