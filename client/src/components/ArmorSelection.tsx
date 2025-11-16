import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles as DreiSparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMathGame, type Armor } from "@/lib/stores/useMathGame";
import { useAudio } from "@/lib/stores/useAudio";
import { useState } from "react";
import { Shield, Crown, Shirt } from "lucide-react";
import * as THREE from "three";

// 3D Armor Component
function ArmorModel({ armor, isSelected }: { armor: Armor; isSelected: boolean }) {
  let geometry: THREE.BufferGeometry;
  
  if (armor.type === "helmet") {
    geometry = new THREE.CylinderGeometry(0.5, 0.7, 0.6, 8);
  } else if (armor.type === "chestplate") {
    geometry = new THREE.BoxGeometry(1, 1.2, 0.5);
  } else {
    geometry = new THREE.CircleGeometry(0.8, 6);
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh geometry={geometry}>
        <meshStandardMaterial 
          color={armor.color} 
          metalness={0.8} 
          roughness={0.2}
          emissive={armor.color}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
        />
      </mesh>
      
      {isSelected && (
        <>
          <DreiSparkles count={50} scale={2} size={3} speed={0.5} color={armor.color} />
          <pointLight intensity={2} distance={3} color={armor.color} />
        </>
      )}
    </Float>
  );
}

export function ArmorSelection() {
  const { coins, addArmor, setPhase, isAdminMode } = useMathGame();
  const { playSuccess } = useAudio();
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);
  const [hoveredArmor, setHoveredArmor] = useState<Armor | null>(null);

  const availableArmor: Armor[] = [
    { id: "helm1", name: "Wisdom Helmet", type: "helmet", difficultyReduction: 1, color: "#4169E1" },
    { id: "chest1", name: "Knowledge Chestplate", type: "chestplate", difficultyReduction: 1, color: "#32CD32" },
    { id: "shield1", name: "Logic Shield", type: "shield", difficultyReduction: 1, color: "#FFD700" },
  ];

  const handleSelectArmor = (armor: Armor) => {
    if (coins < 1 && !isAdminMode) return;
    
    setSelectedArmor(armor);
    playSuccess();
  };

  const handleConfirm = () => {
    if (!selectedArmor) return;
    
    addArmor(selectedArmor);
    playSuccess();
    
    setTimeout(() => {
      setPhase("arena_battle");
    }, 500);
  };

  const getIcon = (type: Armor["type"]) => {
    switch (type) {
      case "helmet": return Crown;
      case "chestplate": return Shirt;
      case "shield": return Shield;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-7xl font-black text-white mb-4"
              style={{ textShadow: "0 0 30px rgba(255,255,255,0.5)" }}>
            CHOOSE YOUR ARMOR
          </h1>
          <p className="text-2xl text-yellow-300 font-bold">
            This armor will help you in battle!
          </p>
          <div className="mt-4 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full inline-block">
            <span className="text-white font-bold text-xl">
              Coins: {coins} {isAdminMode && "• ADMIN MODE"}
            </span>
          </div>
        </motion.div>

        {/* Armor Selection */}
        <div className="grid grid-cols-3 gap-12 mb-8">
          {availableArmor.map((armor, index) => {
            const Icon = getIcon(armor.type);
            const isSelected = selectedArmor?.id === armor.id;
            const isHovered = hoveredArmor?.id === armor.id;
            const canAfford = coins >= 1 || isAdminMode;

            return (
              <motion.div
                key={armor.id}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: canAfford ? 1.05 : 1 }}
                  whileTap={{ scale: canAfford ? 0.95 : 1 }}
                  onClick={() => handleSelectArmor(armor)}
                  onMouseEnter={() => setHoveredArmor(armor)}
                  onMouseLeave={() => setHoveredArmor(null)}
                  disabled={!canAfford}
                  className={`relative w-80 h-96 rounded-3xl overflow-hidden transition-all duration-300 ${
                    !canAfford ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{
                    backgroundColor: `${armor.color}20`,
                    border: `4px solid ${isSelected ? armor.color : 'rgba(255,255,255,0.3)'}`,
                    boxShadow: isSelected 
                      ? `0 0 60px ${armor.color}, 0 20px 40px rgba(0,0,0,0.5)`
                      : `0 20px 40px rgba(0,0,0,0.3)`,
                  }}
                >
                  {/* 3D Canvas */}
                  <div className="absolute inset-0">
                    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                      <ambientLight intensity={0.5} />
                      <directionalLight position={[5, 5, 5]} intensity={1} />
                      <OrbitControls enableZoom={false} enablePan={false} />
                      <ArmorModel armor={armor} isSelected={isSelected || isHovered} />
                    </Canvas>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-8 h-8 text-white" />
                      <h3 className="text-2xl font-bold text-white">
                        {armor.name}
                      </h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      Reduces difficulty by {armor.difficultyReduction}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                      style={{ boxShadow: "0 0 20px rgba(34,197,94,0.8)" }}
                    >
                      <span className="text-white text-2xl">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Confirm Button */}
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: selectedArmor ? 1.1 : 1 }}
          whileTap={{ scale: selectedArmor ? 0.9 : 1 }}
          onClick={handleConfirm}
          disabled={!selectedArmor}
          className={`px-16 py-6 rounded-full text-3xl font-black transition-all duration-300 ${
            selectedArmor
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          style={{
            boxShadow: selectedArmor ? "0 10px 40px rgba(34,197,94,0.6)" : "none",
          }}
        >
          {selectedArmor ? '⚔️ ENTER THE ARENA ⚔️' : 'SELECT AN ARMOR'}
        </motion.button>
      </div>
    </div>
  );
}
