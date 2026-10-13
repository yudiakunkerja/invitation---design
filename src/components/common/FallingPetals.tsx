import React, { useMemo } from 'react';

interface Petal {
  id: number;
  left: number; // percentage
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  opacity: number;
}

interface FallingPetalsProps {
  color?: string;
  count?: number;
  enabled?: boolean;
}

export const FallingPetals: React.FC<FallingPetalsProps> = ({
  color = '#e4c4b7',
  count = 14,
  enabled = true,
}) => {
  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 14,
      duration: 10 + Math.random() * 12,
      delay: Math.random() * 10,
      rotate: Math.random() * 360,
      opacity: 0.25 + Math.random() * 0.45,
    }));
  }, [count]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute block rounded-[50%_0_50%_0]"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            backgroundColor: color,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
            animation: `fallingPetal ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fallingPetal {
          0% {
            transform: translateY(-20px) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(50vh) translateX(25px) rotate(180deg) scale(1);
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(105vh) translateX(-25px) rotate(360deg) scale(0.7);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
