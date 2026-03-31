import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FOOD_EMOJIS = ["🥑", "🍎", "🥦", "🍗", "🥕", "🍳", "🥗", "🍌", "🥜", "🍇", "🫐", "🥒", "🍕", "🥝", "🍊", "🌽", "🥥", "🍓"];

interface Particle {
  id: number;
  emoji: string;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  rotation: number;
}

export const FloatingParticles = ({ count = 18, opacity = 0.12 }: { count?: number; opacity?: number }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const items: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: FOOD_EMOJIS[i % FOOD_EMOJIS.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 18 + Math.random() * 22,
      duration: 10 + Math.random() * 18,
      delay: Math.random() * 8,
      driftX: -30 + Math.random() * 60,
      rotation: Math.random() * 360,
    }));
    setParticles(items);
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            opacity,
          }}
          animate={{
            y: [0, -40, 0, 30, 0],
            x: [0, p.driftX * 0.5, -p.driftX * 0.3, p.driftX * 0.4, 0],
            rotate: [p.rotation, p.rotation + 60, p.rotation - 30, p.rotation + 45, p.rotation],
            scale: [1, 1.15, 0.95, 1.08, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
};
