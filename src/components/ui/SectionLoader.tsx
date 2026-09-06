import React from 'react';
import { SunDot } from './SunDot';

interface SectionLoaderProps {
  title?: string;
  theme?: 'light' | 'warm' | 'dark';
  minHeight?: string;
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({
  title,
  theme = 'warm',
  minHeight = 'min-h-[60vh]',
}) => {
  const bgClass =
    theme === 'dark'
      ? 'bg-[#161617] text-[#FFFADE]'
      : theme === 'light'
      ? 'bg-[#FFFADE] text-[#161617]'
      : 'bg-[#C9B8B6]/20 text-[#825F27]';

  const borderClass =
    theme === 'dark'
      ? 'border-[#A78040]/30'
      : 'border-[#A78040]/25';

  return (
    <div
      className={`w-full ${minHeight} ${bgClass} flex flex-col items-center justify-center py-20 px-6 transition-opacity duration-500 select-none`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#FDB716]/60 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute">
            <SunDot size="sm" pulse={true} glow={true} color="#FDB716" />
          </div>
        </div>

        {title && (
          <p className="text-sm tracking-widest font-medium opacity-75">
            {title}
          </p>
        )}

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A78040] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FDB716] animate-pulse" style={{ animationDelay: '200ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#A78040] animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
};
