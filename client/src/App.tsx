import { useEffect } from "react";
import { useMathGame } from "./lib/stores/useMathGame";
import "@fontsource/inter";

// Import game components
import { GradeSelection } from "./components/GradeSelection";
import { InitialQuiz } from "./components/InitialQuiz";
import { ArmorSelection } from "./components/ArmorSelection";
import { ArenaBattle } from "./components/ArenaBattle";
import { BossBattle } from "./components/BossBattle";
import { AdminPanel } from "./components/AdminPanel";
import { SoundManager } from "./components/SoundManager";

function App() {
  const { phase } = useMathGame();

  useEffect(() => {
    console.log("[App] Current phase:", phase);
  }, [phase]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {phase === "grade_selection" && <GradeSelection />}
      {phase === "initial_quiz" && <InitialQuiz />}
      {phase === "armor_selection" && <ArmorSelection />}
      {phase === "arena_battle" && <ArenaBattle />}
      {phase === "boss_battle" && <BossBattle />}
      
      <AdminPanel />
      <SoundManager />
    </div>
  );
}

export default App;
