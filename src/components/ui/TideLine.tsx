import React, { useEffect, useState, useRef } from 'react';

interface TideLineProps {
  className?: string;
  sunPosition?: number; // 0 to 100 percentage
  trackScrollProgress?: boolean;
  color?: string;
  sunColor?: string;
}

export const TideLine: React.FC<TideLineProps> = ({
  className = '',
  sunPosition,
  trackScrollProgress = false,
  color = '#A78040',
  sunColor = '#FDB716',
}) => {
  const [scrollProgress, setScrollProgress] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackScrollProgress) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const currentProgress = Math.min(
        100,
        Math.max(0, (window.scrollY / scrollHeight) * 100)
      );
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollProgress]);

  const activeProgress = trackScrollProgress ? scrollProgress : (sunPosition ?? 50);

  return (
    <div
      ref={containerRef}
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
          insetInlineStart: `${activeProgress}%`,
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
