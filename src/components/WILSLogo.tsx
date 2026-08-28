import React from 'react';

interface WILSLogoProps {
  variant?: 'full' | 'shield' | 'compact' | 'header';
  className?: string;
  size?: number; // Size for shield
  textColor?: string;
}

/**
 * High-fidelity vector SVG crest for Westview International Language School (WILS Cairo).
 * Features the signature split shield with gold horizontal bars on the left,
 * royal purple field with gold monogram on the right, and collegiate typography.
 */
export const WILSCrest: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = ''
}) => {
  // Base viewBox: 0 0 100 120
  return (
    <svg
      viewBox="0 0 100 120"
      width={size}
      height={(size * 120) / 100}
      className={`shrink-0 drop-shadow-md select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="wils-shield-clip">
          <path d="M 6 4 L 94 4 L 94 66 C 94 92 50 114 50 114 C 50 114 6 92 6 66 Z" />
        </clipPath>
        <linearGradient id="wils-gold-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBD34D" />
          <stop offset="50%" stopColor="#F5B716" />
          <stop offset="100%" stopColor="#D99B06" />
        </linearGradient>
        <linearGradient id="wils-purple-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A207E" />
          <stop offset="100%" stopColor="#301157" />
        </linearGradient>
      </defs>

      {/* Shield Background Fill */}
      <path
        d="M 6 4 L 94 4 L 94 66 C 94 92 50 114 50 114 C 50 114 6 92 6 66 Z"
        fill="url(#wils-purple-grad)"
      />

      {/* Clipped Interior: Left Half Horizontal Gold Stripes */}
      <g clipPath="url(#wils-shield-clip)">
        {/* Left background deep purple */}
        <rect x="0" y="0" width="50" height="120" fill="#290e4e" />

        {/* 9 Horizontal Gold Stripes on Left */}
        {[8, 19, 30, 41, 52, 63, 74, 85, 96].map((y, idx) => (
          <rect
            key={idx}
            x="4"
            y={y}
            width="46"
            height="5.5"
            fill="url(#wils-gold-grad)"
            rx="1"
          />
        ))}

        {/* Center Vertical Divider Line */}
        <line x1="50" y1="4" x2="50" y2="114" stroke="#F5B716" strokeWidth="2.5" />

        {/* Right side monogram letters: W I L S stacked */}
        <g id="wils-monogram" fill="url(#wils-gold-grad)">
          {/* Letter W */}
          <text
            x="72"
            y="30"
            fontFamily="'Cinzel', 'Times New Roman', serif"
            fontSize="23"
            fontWeight="900"
            textAnchor="middle"
            letterSpacing="-0.5"
          >
            W
          </text>

          {/* Letter I */}
          <text
            x="72"
            y="52"
            fontFamily="'Cinzel', 'Times New Roman', serif"
            fontSize="21"
            fontWeight="900"
            textAnchor="middle"
          >
            I
          </text>

          {/* Letter L */}
          <text
            x="72"
            y="74"
            fontFamily="'Cinzel', 'Times New Roman', serif"
            fontSize="21"
            fontWeight="900"
            textAnchor="middle"
          >
            L
          </text>

          {/* Letter S */}
          <text
            x="72"
            y="96"
            fontFamily="'Cinzel', 'Times New Roman', serif"
            fontSize="21"
            fontWeight="900"
            textAnchor="middle"
          >
            S
          </text>
        </g>
      </g>

      {/* Gold Shield Outer Border */}
      <path
        d="M 6 4 L 94 4 L 94 66 C 94 92 50 114 50 114 C 50 114 6 92 6 66 Z"
        fill="none"
        stroke="url(#wils-gold-grad)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const WILSLogo: React.FC<WILSLogoProps> = ({
  variant = 'full',
  className = '',
  size = 46,
  textColor = 'text-white'
}) => {
  if (variant === 'shield') {
    return <WILSCrest size={size} className={className} />;
  }

  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <WILSCrest size={size} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-serif font-black tracking-wider text-base sm:text-lg text-white uppercase font-display">
              WESTVIEW
            </span>
          </div>
          <span className="font-serif font-bold tracking-widest text-[10px] sm:text-xs text-amber-400 uppercase">
            INTERNATIONAL LANGUAGE SCHOOL
          </span>
        </div>
      </div>
    );
  }

  // Full Brand Lockup matching the uploaded image exactly
  return (
    <div className={`flex items-center gap-3.5 sm:gap-4 select-none ${className}`}>
      <WILSCrest size={size} />
      <div className="flex flex-col justify-center leading-tight">
        <span className="font-serif font-black tracking-[0.14em] text-white text-base sm:text-xl uppercase drop-shadow">
          WESTVIEW
        </span>
        <span className="font-serif font-black tracking-[0.12em] text-white text-xs sm:text-sm uppercase drop-shadow">
          INTERNATIONAL
        </span>
        <span className="font-serif font-black tracking-[0.12em] text-amber-400 text-xs sm:text-sm uppercase drop-shadow">
          LANGUAGE SCHOOL
        </span>
      </div>
    </div>
  );
};
