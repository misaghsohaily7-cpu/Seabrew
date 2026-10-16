import React from 'react';
import { SunDot } from './SunDot';

export interface ArchDividerProps {
  /** Visual tone matching surrounding sections */
  variant?: 'cream-to-warm' | 'warm' | 'warm-to-gold' | 'gold-to-dark' | 'dark';
  /** Optional narrative chapter or milestone label */
  label?: string;
  /** Optional orientation: standard (arch top) or inverted (arch bottom) */
  inverted?: boolean;
  /** Additional styling classes */
  className?: string;
}

export const ArchDivider: React.FC<ArchDividerProps> = ({
  variant = 'cream-to-warm',
  label,
  inverted = false,
  className = '',
}) => {
  // Theme color definitions for borders, backgrounds, and text
  const getThemeClasses = () => {
    switch (variant) {
      case 'warm':
        return {
          wrapperBg: 'bg-[var(--color-dust)]',
          lineGrad: 'from-transparent via-[var(--color-maroon)]/30 to-[var(--color-maroon)]/50',
          archBg: 'bg-[var(--color-dust-light)]/70 backdrop-blur-xs',
          archBorder: 'border-[var(--color-maroon)]/30',
          textColor: 'text-[var(--color-maroon)]',
          dotColor: 'bg-[var(--color-sun)]',
        };
      case 'warm-to-gold':
        return {
          wrapperBg: 'bg-gradient-to-b from-[var(--color-dust)] to-[var(--color-cream)]',
          lineGrad: 'from-transparent via-[var(--color-gold)]/30 to-[var(--color-gold)]/50',
          archBg: 'bg-[var(--color-cream)]/80 backdrop-blur-xs',
          archBorder: 'border-[var(--color-gold)]/40',
          textColor: 'text-[var(--color-maroon)]',
          dotColor: 'bg-[var(--color-sun)]',
        };
      case 'gold-to-dark':
        return {
          wrapperBg: 'bg-gradient-to-b from-[var(--color-parchment)] to-[var(--color-cream)]',
          lineGrad: 'from-transparent via-[var(--color-gold)]/40 to-[var(--color-gold)]/60',
          archBg: 'bg-[var(--color-cream)]/90 backdrop-blur-xs',
          archBorder: 'border-[var(--color-gold)]/50',
          textColor: 'text-[var(--color-ink)]',
          dotColor: 'bg-[var(--color-sun)]',
        };
      case 'dark':
        // Solid surface for the story/contact/footer section transition.
        return {
          wrapperBg: 'bg-[#161617]',
          lineGrad: '',
          archBg: 'bg-[#1e1e20]',
          archBorder: 'border-[#A78040]/40',
          textColor: 'text-[#FFFADE]/80',
          dotColor: 'bg-[#FDB716]',
        };
      case 'cream-to-warm':
      default:
        return {
          wrapperBg: 'bg-gradient-to-b from-[var(--color-cream)] to-[var(--color-cream)]',
          lineGrad: 'from-transparent via-[var(--color-gold)]/30 to-[var(--color-gold)]/50',
          archBg: 'bg-[var(--color-cream)]/95 backdrop-blur-xs',
          archBorder: 'border-[var(--color-gold)]/35',
          textColor: 'text-[var(--color-maroon)]',
          dotColor: 'bg-[var(--color-sun)]',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`relative w-full py-8 sm:py-12 overflow-hidden select-none flex items-center justify-center ${theme.wrapperBg} ${className}`}
    >
      <div className="relative flex items-center justify-center w-full max-w-5xl px-6 sm:px-10">
        {/* Left tapering dividing rule */}
        <div
          className={`flex-1 h-[1px] ${variant === 'dark' ? 'bg-[#A78040]/30' : `bg-gradient-to-r ${theme.lineGrad}`} opacity-70`}
        />

        {/* Center architectural arch motif using .arch-frame */}
        <div
          className={`relative mx-4 sm:mx-8 flex items-center justify-center transition-transform duration-300 ${
            inverted ? 'rotate-180' : ''
          }`}
        >
          {/* Outer Arch Frame */}
          <div
            className={`arch-frame relative px-5 py-2.5 sm:px-7 sm:py-3 ${theme.archBg} ${theme.archBorder} border shadow-xs flex items-center gap-3`}
          >
            {/* Inner nested miniature arch detail */}
            <div
              className={`arch-frame w-4 h-5 sm:w-5 sm:h-6 border ${theme.archBorder} opacity-60 flex items-end justify-center pb-1`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor} opacity-90`} />
            </div>

            {/* Optional Narrative Label */}
            {label ? (
              <span
                className={`text-[11px] sm:text-xs font-bold tracking-wider ${theme.textColor} whitespace-nowrap`}
              >
                {label}
              </span>
            ) : (
              /* Abstract Persian Gulf wave lines when no label */
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                <span className={`w-8 sm:w-12 h-[1px] ${theme.archBorder} border-t`} />
                <SunDot size="sm" className="w-2.5 h-2.5" />
                <span className={`w-8 sm:w-12 h-[1px] ${theme.archBorder} border-t`} />
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
              </div>
            )}

            {/* Inner nested miniature arch mirror */}
            <div
              className={`arch-frame w-4 h-5 sm:w-5 sm:h-6 border ${theme.archBorder} opacity-60 flex items-end justify-center pb-1`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor} opacity-90`} />
            </div>
          </div>
        </div>

        {/* Right tapering dividing rule */}
        <div
          className={`flex-1 h-[1px] ${variant === 'dark' ? 'bg-[#A78040]/30' : `bg-gradient-to-l ${theme.lineGrad}`} opacity-70`}
        />
      </div>
    </div>
  );
};
