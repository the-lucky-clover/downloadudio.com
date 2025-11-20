import { useCallback, useRef, useEffect, useState } from "react";

type SoundType = "click" | "success" | "error" | "scan" | "download" | "hover";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: { frequency: 800, duration: 0.05, type: "sine", volume: 0.3 },
  hover: { frequency: 600, duration: 0.03, type: "sine", volume: 0.15 },
  success: { frequency: 1200, duration: 0.2, type: "sine", volume: 0.4 },
  error: { frequency: 300, duration: 0.3, type: "square", volume: 0.4 },
  scan: { frequency: 400, duration: 0.15, type: "triangle", volume: 0.3 },
  download: { frequency: 1000, duration: 0.25, type: "sine", volume: 0.35 },
};

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("soundVolume");
    return saved ? parseFloat(saved) : 0.7;
  });
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("soundVolume", volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("soundEnabled", enabled.toString());
  }, [enabled]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!enabled) return;

      try {
        const ctx = getAudioContext();
        const config = soundConfigs[type];
        
        // Create oscillator
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = config.type;
        oscillator.frequency.value = config.frequency;
        
        // Apply volume
        const finalVolume = (config.volume || 0.5) * volume;
        gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + config.duration);
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    },
    [enabled, volume, getAudioContext]
  );

  // Multi-tone success sound
  const playSuccessSound = useCallback(() => {
    if (!enabled) return;

    try {
      const ctx = getAudioContext();
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)
      
      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = "sine";
        oscillator.frequency.value = freq;
        
        const delay = index * 0.05;
        const finalVolume = 0.25 * volume;
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(finalVolume, ctx.currentTime + delay + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.3);
        
        oscillator.start(ctx.currentTime + delay);
        oscillator.stop(ctx.currentTime + delay + 0.3);
      });
    } catch (error) {
      console.error("Error playing success sound:", error);
    }
  }, [enabled, volume, getAudioContext]);

  const toggleSound = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  const setVolumeLevel = useCallback((level: number) => {
    setVolume(Math.max(0, Math.min(1, level)));
  }, []);

  return {
    playSound,
    playSuccessSound,
    volume,
    setVolume: setVolumeLevel,
    enabled,
    toggleSound,
  };
};
