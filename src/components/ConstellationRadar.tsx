import React, { useState } from 'react';
import { TraitScores, TraitKey } from '../types';
import { SCALE_ORDER, SCALES } from '../data/constellationData';

interface ConstellationRadarProps {
  scores: TraitScores;
  compareScores?: TraitScores;
  compareLabel?: string;
  size?: number;
  showLabels?: boolean;
  interactive?: boolean;
  className?: string;
}

const CAT_COLORS: Record<'H' | 'M' | 'L', { fill: string; stroke: string; glow: string; text: string }> = {
  H: { fill: '#fbbf24', stroke: '#f59e0b', glow: 'rgba(251, 191, 36, 0.4)', text: 'High' },
  M: { fill: '#2dd4bf', stroke: '#14b8a6', glow: 'rgba(45, 212, 191, 0.4)', text: 'Moderate' },
  L: { fill: '#f87171', stroke: '#ef4444', glow: 'rgba(248, 113, 113, 0.4)', text: 'Focus Area' }
};

export const ConstellationRadar: React.FC<ConstellationRadarProps> = ({
  scores,
  compareScores,
  compareLabel = 'Class Average',
  size = 360,
  showLabels = true,
  interactive = true,
  className = ''
}) => {
  const [hoveredTrait, setHoveredTrait] = useState<TraitKey | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const n = SCALE_ORDER.length;

  // Calculate coordinates for primary polygon
  const primaryPoints = SCALE_ORDER.map((key, i) => {
    const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
    const mean = Math.max(1, Math.min(5, scores[key]?.mean ?? 3));
    // Scale 1..5 mapped smoothly to 20%..100% of max radius
    const r = maxR * 0.2 + maxR * 0.8 * (mean / 5);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, key, angle, mean, cat: scores[key]?.cat ?? 'M' };
  });

  const polygonPath = primaryPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Calculate coordinates for compare polygon if provided
  let comparePath = '';
  let comparePoints: { x: number; y: number }[] = [];
  if (compareScores) {
    comparePoints = SCALE_ORDER.map((key, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
      const mean = Math.max(1, Math.min(5, compareScores[key]?.mean ?? 3));
      const r = maxR * 0.2 + maxR * 0.8 * (mean / 5);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return { x, y };
    });
    comparePath = comparePoints.map((p) => `${p.x},${p.y}`).join(' ');
  }

  // Concentric orbital rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="overflow-visible select-none drop-shadow-2xl"
      >
        <defs>
          {/* Radial cosmic gradient for filled polygon */}
          <radialGradient id={`constellationFill-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ed9c0" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#818cf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
          </radialGradient>

          {/* Glowing linear gradient for perimeter contour line */}
          <linearGradient id={`starLineGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ed9c0" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Compare polygon stroke gradient */}
          <linearGradient id={`compareLineGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
          </linearGradient>

          {/* Star glow filter */}
          <filter id={`starGlow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle glow disk */}
        <circle cx={cx} cy={cy} r={maxR * 1.08} fill="rgba(78, 217, 192, 0.03)" />

        {/* Concentric Guide Circles & Labels */}
        {rings.map((ringPct, idx) => (
          <g key={idx}>
            <circle
              cx={cx}
              cy={cy}
              r={maxR * (0.2 + ringPct * 0.8)}
              fill="none"
              stroke="rgba(245, 243, 238, 0.08)"
              strokeWidth={idx === rings.length - 1 ? 1.5 : 0.75}
              strokeDasharray={idx === rings.length - 1 ? 'none' : '3 4'}
            />
            {showLabels && (
              <text
                x={cx + 4}
                y={cy - maxR * (0.2 + ringPct * 0.8) + 9}
                fill="rgba(169, 173, 209, 0.35)"
                fontSize="8"
                fontFamily="var(--font-mono)"
              >
                {(ringPct * 5).toFixed(0)}
              </text>
            )}
          </g>
        ))}

        {/* Radial Axis Rays */}
        {SCALE_ORDER.map((key, i) => {
          const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
          const x2 = cx + maxR * Math.cos(angle);
          const y2 = cy + maxR * Math.sin(angle);
          const isHovered = hoveredTrait === key;

          return (
            <line
              key={key}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={isHovered ? SCALES[key].color : 'rgba(245, 243, 238, 0.12)'}
              strokeWidth={isHovered ? 1.5 : 1}
              strokeDasharray={isHovered ? 'none' : '2 3'}
              className="transition-colors duration-200"
            />
          );
        })}

        {/* Secondary Comparison Silhouette (if provided) */}
        {comparePath && (
          <polygon
            points={comparePath}
            fill="rgba(148, 163, 184, 0.08)"
            stroke="url(#compareLineGrad-)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}

        {/* Primary Constellation Polygon Shape */}
        <polygon
          points={polygonPath}
          fill={`url(#constellationFill-${size})`}
          stroke={`url(#starLineGrad-${size})`}
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Star Connective Lines (Starlight Crosshairs) */}
        {primaryPoints.map((p, idx) => {
          const next = primaryPoints[(idx + 1) % primaryPoints.length];
          return (
            <line
              key={`segment-${idx}`}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* Star Nodes */}
        {primaryPoints.map((p) => {
          const isHovered = hoveredTrait === p.key;
          const style = CAT_COLORS[p.cat];
          const nodeRadius = isHovered ? 6 : 4.5;

          return (
            <g
              key={p.key}
              className={interactive ? 'cursor-pointer transition-transform duration-200' : ''}
              onMouseEnter={() => interactive && setHoveredTrait(p.key)}
              onMouseLeave={() => interactive && setHoveredTrait(null)}
            >
              {/* Outer Pulsing Star Aura */}
              <circle
                cx={p.x}
                cy={p.y}
                r={nodeRadius * 2.8}
                fill={style.glow}
                className={isHovered ? 'animate-ping opacity-75' : 'opacity-40'}
              />

              {/* Core Star */}
              <circle
                cx={p.x}
                cy={p.y}
                r={nodeRadius}
                fill={style.fill}
                stroke="#0c0d1f"
                strokeWidth="1.5"
                filter={`url(#starGlow-${size})`}
              />

              {/* Little sparkle cross on high stars */}
              {p.mean >= 4.0 && (
                <g stroke={style.fill} strokeWidth="1" opacity="0.8">
                  <line x1={p.x - 7} y1={p.y} x2={p.x + 7} y2={p.y} />
                  <line x1={p.x} y1={p.y - 7} x2={p.x} y2={p.y + 7} />
                </g>
              )}
            </g>
          );
        })}

        {/* Scale Axis Labels */}
        {showLabels &&
          SCALE_ORDER.map((key, i) => {
            const angle = -Math.PI / 2 + i * ((2 * Math.PI) / n);
            const labelRadius = maxR * 1.26;
            const x = cx + labelRadius * Math.cos(angle);
            const y = cy + labelRadius * Math.sin(angle);
            const isHovered = hoveredTrait === key;
            const scoreVal = scores[key]?.mean?.toFixed(1) ?? '3.0';

            let textAnchor = 'middle';
            if (Math.cos(angle) > 0.3) textAnchor = 'start';
            else if (Math.cos(angle) < -0.3) textAnchor = 'end';

            return (
              <g
                key={`label-${key}`}
                className={interactive ? 'cursor-pointer select-none' : 'select-none'}
                onMouseEnter={() => interactive && setHoveredTrait(key)}
                onMouseLeave={() => interactive && setHoveredTrait(null)}
              >
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill={isHovered ? SCALES[key].color : '#c7cbef'}
                  fontSize={size < 300 ? '10' : '11.5'}
                  fontWeight={isHovered ? '700' : '600'}
                  fontFamily="var(--font-display)"
                  className="transition-colors duration-150"
                >
                  {SCALES[key].shortLabel}
                </text>
                <text
                  x={x}
                  y={y + 12}
                  textAnchor={textAnchor}
                  fill={CAT_COLORS[scores[key]?.cat ?? 'M'].fill}
                  fontSize="9.5"
                  fontFamily="var(--font-mono)"
                  fontWeight="600"
                >
                  {scoreVal} / 5.0
                </text>
              </g>
            );
          })}
      </svg>

      {/* Floating Tooltip info on hover */}
      {interactive && hoveredTrait && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#1b1e42]/95 backdrop-blur-md border border-cyan-400/30 text-xs px-3 py-1.5 rounded-full shadow-xl flex items-center gap-2 pointer-events-none z-20 whitespace-nowrap">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: SCALES[hoveredTrait].color }}
          />
          <span className="font-semibold text-white">{SCALES[hoveredTrait].label}:</span>
          <span className="font-mono text-amber-300 font-bold">
            {scores[hoveredTrait]?.mean?.toFixed(2)}
          </span>
          <span className="text-slate-300">({CAT_COLORS[scores[hoveredTrait]?.cat ?? 'M'].text})</span>
        </div>
      )}

      {/* Optional Compare Legend */}
      {compareScores && (
        <div className="mt-3 flex items-center justify-center gap-6 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-teal-400 to-amber-400" />
            <span>Student Constellation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-b border-dashed border-slate-300" />
            <span className="text-slate-400">{compareLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
};
