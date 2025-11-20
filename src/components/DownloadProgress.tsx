import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface DownloadProgressProps {
  progress: number; // 0-100
  onComplete?: () => void;
  filename?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export const DownloadProgress = ({ 
  progress, 
  onComplete,
  filename = "audio.mp3" 
}: DownloadProgressProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const [showExplosion, setShowExplosion] = useState(false);
  const animationFrame = useRef<number>();

  // Particle explosion on completion
  useEffect(() => {
    if (progress >= 100 && !showExplosion) {
      setShowExplosion(true);
      
      // Create explosion particles
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const colors = ["#00ffff", "#8b5cf6", "#ec4899", "#a855f7", "#3b82f6"];

      for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 * i) / 100;
        const velocity = Math.random() * 5 + 3;
        particles.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,
        });
      }

      setTimeout(() => {
        onComplete?.();
      }, 1000);
    }
  }, [progress, showExplosion, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw progress ring
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 70;
      const lineWidth = 8;

      // Background ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(139, 92, 246, 0.2)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Progress ring with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#00ffff");
      gradient.addColorStop(0.5, "#8b5cf6");
      gradient.addColorStop(1, "#ec4899");

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        -Math.PI / 2,
        -Math.PI / 2 + (Math.PI * 2 * progress) / 100
      );
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#8b5cf6";
      ctx.stroke();

      // Animated glow
      const time = Date.now() / 1000;
      const glowIntensity = Math.sin(time * 3) * 0.5 + 0.5;
      ctx.shadowBlur = 30 + glowIntensity * 20;

      // Draw particles if exploding
      if (showExplosion) {
        particles.current = particles.current.filter((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.2; // Gravity
          particle.life -= 0.02;

          if (particle.life > 0) {
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.shadowBlur = 15;
            ctx.shadowColor = particle.color;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return true;
          }
          return false;
        });
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [progress, showExplosion]);

  return (
    <div className="relative flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <canvas ref={canvasRef} className="relative z-10" />
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {progress >= 100 ? (
            <CheckCircle2 className="w-16 h-16 text-primary animate-scale-in drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]" />
          ) : (
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {Math.round(progress)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filename */}
      <div className="text-center max-w-xs">
        <p className="text-sm text-muted-foreground truncate">{filename}</p>
        <p className="text-xs text-primary animate-pulse">
          {progress >= 100 ? "Complete!" : "Downloading..."}
        </p>
      </div>
    </div>
  );
};
