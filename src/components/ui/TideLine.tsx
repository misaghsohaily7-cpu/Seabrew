import React from 'react';

interface TideLineProps {
  className?: string;
  sunPosition?: number; // 0 to 100 percentage
  color?: string;
  sunColor?: string;
}

/**
 * Horizontal horizon rule with a sun dot riding it.
 *
 * Purely presentational: page-level scroll progress is owned by
 * SunScrollIndicator, so this component keeps no state and registers no
 * scroll listener. Position the sun with `sunPosition`.
 */
export const TideLine: React.FC<TideLineProps> = ({
  className = '',
  sunPosition = 50,
  color = 'var(--color-gold)',
  sunColor = 'var(--color-sun)',
}) => {
  return (
    <div
      className={`relative w-full h-[12px] flex items-center overflow-visible ${className}`}
      aria-hidden="true"
    >
      {/* 1px horizontal horizon line with natural gradient */}
      <div
        className="w-full h-[1px] opacity-40 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to left, transparent, ${color}, transparent)`,
        }}
      />

      {/* SunDot riding the TideLine horizon */}
      <div
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out pointer-events-none"
        style={{
          // In RTL, start to end
          insetInlineStart: `${sunPosition}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="w-[9px] h-[9px] rounded-full"
          style={{
            backgroundColor: sunColor,
            boxShadow: '0 0 8px rgba(253, 183, 22, 0.75)',
          }}
        />
      </div>
    </div>
  );
};
