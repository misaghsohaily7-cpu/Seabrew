import React from 'react';

interface BotanicalBorderProps {
  className?: string;
  color?: string;
}

export const BotanicalBorder: React.FC<BotanicalBorderProps> = ({
  className = '',
  color = '#A78040',
}) => {
  return (
    <svg
      viewBox="0 0 45 220"
      className={`overflow-hidden h-full w-auto select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
    >
      {/* Repeating organic coffee bean & vine pattern */}
      <g stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        {/* Top vine & leaf */}
        <path d="M 12 10 Q 30 25, 20 45 T 15 80" />
        <path d="M 22 25 Q 36 15, 38 32 Q 26 35, 22 25" />
        
        {/* Coffee Bean 1 */}
        <ellipse cx="28" cy="60" rx="8" ry="12" transform="rotate(25 28 60)" />
        <path d="M 25 50 Q 31 60, 29 70" />

        {/* Stem & Leaves */}
        <path d="M 16 75 Q 6 90, 24 110 T 20 150" />
        <path d="M 12 85 Q 2 95, 10 102 Q 18 95, 12 85" />
        <path d="M 22 105 Q 36 112, 32 124 Q 20 120, 22 105" />

        {/* Coffee Bean 2 */}
        <ellipse cx="16" cy="140" rx="8" ry="12" transform="rotate(-30 16 140)" />
        <path d="M 19 130 Q 13 140, 15 150" />

        {/* Lower Vine & Leaves */}
        <path d="M 22 145 Q 34 165, 18 185 T 26 215" />
        <path d="M 26 160 Q 38 168, 32 180 Q 22 175, 26 160" />
        <path d="M 16 188 Q 4 195, 12 205 Q 20 198, 16 188" />

        {/* Tiny Berry Cluster */}
        <circle cx="28" cy="95" r="2.5" fill={color} fillOpacity="0.4" />
        <circle cx="34" cy="98" r="2" fill={color} fillOpacity="0.4" />
        <circle cx="30" cy="103" r="2" fill={color} fillOpacity="0.4" />
      </g>
    </svg>
  );
};
