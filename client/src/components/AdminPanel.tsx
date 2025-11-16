import { motion, AnimatePresence } from "framer-motion";
import { useMathGame } from "@/lib/stores/useMathGame";
import { useState, useEffect } from "react";
import { Shield, Crown, RotateCcw, Zap } from "lucide-react";

export function AdminPanel() {
  const { 
    isAdminMode, 
    toggleAdminMode, 
    giveInfiniteArmor,
    resetGame,
    coins,
    gems,
    armorInventory,
    phase
  } = useMathGame();
  
  const [showPanel, setShowPanel] = useState(false);

  // Listen for admin key combination (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdminMode();
        setShowPanel(prev => !prev);
        console.log("[AdminPanel] Toggled");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isAdminMode && !showPanel) return null;

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-br from-purple-900 to-indigo-900 backdrop-blur-lg rounded-2xl p-6 border-4 border-yellow-400"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
        >
          <div className="flex items-center gap-3 mb-4 border-b border-yellow-400 pb-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-black text-yellow-400">ADMIN PANEL</h2>
          </div>

          <div className="space-y-3 mb-4 text-white">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-bold text-green-400">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>Phase:</span>
              <span className="font-bold">{phase}</span>
            </div>
            <div className="flex justify-between">
              <span>Coins:</span>
              <span className="font-bold">{coins}</span>
            </div>
            <div className="flex justify-between">
              <span>Gems:</span>
              <span className="font-bold">{gems}</span>
            </div>
            <div className="flex justify-between">
              <span>Armor:</span>
              <span className="font-bold">{armorInventory.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={giveInfiniteArmor}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg flex items-center gap-2 justify-center"
            >
              <Shield className="w-5 h-5" />
              Give Infinite Armor
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg flex items-center gap-2 justify-center"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Game
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPanel(false)}
              className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg"
            >
              Close Panel
            </motion.button>
          </div>

          <div className="mt-4 text-xs text-white/60 text-center">
            Press Ctrl+Shift+A to toggle
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
