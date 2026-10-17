import React from 'react';

interface SeaBrewLogoProps {
  className?: string;
  variant?: 'vertical' | 'horizontal' | 'mark-only';
  theme?: 'dark' | 'light' | 'adaptive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SeaBrewLogo: React.FC<SeaBrewLogoProps> = ({
  className = '',
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
}) => {
  const isDark = theme === 'dark';
  // theme="dark"  → logo sits on a LIGHT surface (navbar) → flips with the theme
  // theme="light" → logo sits on a DARK section (footer/story) → fixed cream
  // theme="adaptive" → logo follows the theme-aware lower-page surface
  const waveColor =
    theme === 'adaptive'
      ? 'var(--color-lower-text)'
      : isDark
      ? 'var(--color-ink)'
      : 'var(--color-cream-fixed)';
  const textColor = waveColor;
  const sunColor = 'var(--color-sun)';

  const scaleMap = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
    xl: 'h-24',
  };

  // SVG representation of the official Reyhaneh Niazmandian logo:
  // Two sweeping organic seagull / wave strokes + Golden sun dot at top right
  const mark = (
    <svg
      viewBox="0 0 160 110"
      className="overflow-visible inline-block h-full w-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="نشان رسمی SEA BREW"
    >
      {/* Sun Circle at top right */}
      <circle
        cx="132"
        cy="24"
        r="19"
        fill={sunColor}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ transformOrigin: '132px 24px' }}
      />

      {/* Upper Flying Seagull / High Wave Stroke */}
      <path
        d="M 12 40 C 26 22, 48 18, 64 34 C 76 46, 88 56, 114 53 C 128 51, 142 63, 148 74 C 132 60, 114 62, 98 68 C 76 76, 56 68, 48 54 C 40 40, 26 36, 12 40 Z"
        fill={waveColor}
      />

      {/* Lower Sweeping Sea Wave Stroke */}
      <path
        d="M 28 62 C 38 82, 60 92, 88 88 C 112 84, 130 96, 138 108 C 124 94, 102 96, 84 99 C 62 103, 44 94, 34 78 C 30 72, 28 66, 28 62 Z"
        fill={waveColor}
      />
    </svg>
  );

  if (variant === 'mark-only') {
    return <div className={`relative ${scaleMap[size]} ${className}`}>{mark}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 select-none ${className}`}>
        <div className={scaleMap[size]}>{mark}</div>
        <div className="flex flex-col items-center">
          <span
            className="font-black text-2xl tracking-widest leading-none font-['Estedad']"
            style={{ color: textColor }}
          >
            SEA BREW
          </span>
          <span
            className="text-[0.65rem] tracking-[0.25em] uppercase font-medium mt-1 opacity-70"
            style={{ color: textColor }}
          >
            sea brew a coffee based drink
          </span>
        </div>
      </div>
    );
  }

  // Default horizontal
  return (
    <div className={`flex items-center gap-3 select-none ${scaleMap[size]} ${className}`}>
      <div className="h-full flex-shrink-0">{mark}</div>
      <div className="flex flex-col justify-center">
        <span
          className="font-black text-xl md:text-2xl tracking-wider leading-none font-['Estedad']"
          style={{ color: textColor }}
        >
          SEA BREW
        </span>
        <span
          className="text-[0.6rem] md:text-[0.65rem] tracking-[0.2em] uppercase font-semibold mt-1 opacity-65"
          style={{ color: textColor }}
        >
          coffee & drinks
        </span>
      </div>
    </div>
  );
};
