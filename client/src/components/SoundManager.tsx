import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";

export function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, isMuted } = useAudio();

  useEffect(() => {
    // Load background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    // Load sound effects
    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.5;
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.5;
    setSuccessSound(success);

    console.log("[SoundManager] Sounds loaded");

    // Auto-play background music when unmuted
    if (!isMuted) {
      bgMusic.play().catch(err => {
        console.log("[SoundManager] Autoplay prevented:", err);
      });
    }

    return () => {
      bgMusic.pause();
    };
  }, []);

  useEffect(() => {
    // Handle mute/unmute for background music
    const bgMusic = document.querySelector('audio[loop]') as HTMLAudioElement;
    if (bgMusic) {
      if (isMuted) {
        bgMusic.pause();
      } else {
        bgMusic.play().catch(err => {
          console.log("[SoundManager] Play prevented:", err);
        });
      }
    }
  }, [isMuted]);

  return null;
}
