import { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  depth: number;
}

const PARTICLE_COUNT = 45;

const ParticlesBackground = () => {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const depth = Math.random();
        return {
          id: i,
          x: Math.random() * 100, // percentage position
          y: Math.random() * 100,
          size: Math.random() * 6 + 4, // 4px to 10px
          duration: 12 + depth * 18,
          delay: Math.random() * 10,
          drift: Math.random() * 60 - 30, // smaller drift to prevent overflow
          depth,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => {
        const blur =
          p.depth > 0.7 ? "blur-sm" : p.depth > 0.4 ? "blur-[1px]" : "";
        const opacity = 0.2 + p.depth * 0.6; // slight lower opacity for depth

        return (
          <motion.div
            key={p.id}
            className={`absolute rounded-full ${blur}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, rgba(255,0,0,${opacity}) 0%, rgba(255,0,0,${
                opacity * 0.5
              }) 50%, transparent 100%)`,
              boxShadow: `0 0 ${p.size * 2}px rgba(255,0,0,${opacity})`,
            }}
            animate={{
              y: [0, -p.size * 20, -p.size * 40, -p.size * 60], // move proportionally to size
              x: [0, p.drift, -p.drift, 0],
              opacity: [0, opacity, opacity, 0],
              scale: [0.5, 1, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticlesBackground;
