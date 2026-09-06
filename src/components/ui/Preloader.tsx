import React, { useEffect, useState, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

interface PreloaderProps {
  onComplete: () => void;
}

// Persian numerals converter
export const toPersianDigits = (num: number | string): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If user prefers reduced motion, skip preloader immediately
    if (prefersReducedMotion()) {
      onComplete();
      setIsRemoved(true);
      return;
    }

    const duration = 1800; // 1.8s
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Pour easing for count
      const easedProgress = Math.pow(progress, 1.2);
      setPercent(Math.floor(easedProgress * 100));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setPercent(100);
        // Curtain transition starts
        setTimeout(() => {
          dismiss();
        }, 150);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, []);

  const dismiss = () => {
    if (isDismissed) return;
    setIsDismissed(true);
    onComplete();
    setTimeout(() => {
      setIsRemoved(true);
    }, 700);
  };

  if (isRemoved) return null;

  // Wave dashoffset calculation
  const waveDashoffset = 300 - (percent / 100) * 300;
  // Sun translateY from below horizon (+40px to -30px)
  const sunTranslateY = 40 - (percent / 100) * 70;

  return (
    <div
      ref={containerRef}
      onClick={dismiss}
      role="dialog"
      aria-label="بارگذاری و طلوع خورشید برند SEA BREW"
      aria-live="polite"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FFFADE] select-none cursor-pointer transition-all duration-700 ${
        isDismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        clipPath: isDismissed
          ? 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
          : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Official Brand Logo Mark Sunrise Scene */}
        <div className="relative w-48 h-36 flex items-end justify-center overflow-hidden mb-6">
          {/* Sun Dot rising */}
          <div
            className="absolute w-11 h-11 rounded-full bg-[#FDB716] transition-transform duration-100 ease-out"
            style={{
              boxShadow: '0 0 24px rgba(253, 183, 22, 0.75)',
              transform: `translateY(${sunTranslateY}px)`,
            }}
          />

          {/* Horizon Line */}
          <div className="absolute bottom-10 inset-x-0 h-[1.5px] bg-[#A78040] opacity-60" />

          {/* Official Seagull / Sea Waves Stroke */}
          <svg
            viewBox="0 0 160 110"
            className="absolute bottom-2 inset-x-0 w-full h-24 overflow-visible"
            fill="none"
          >
            {/* Wave 1 */}
            <path
              d="M 12 40 C 26 22, 48 18, 64 34 C 76 46, 88 56, 114 53 C 128 51, 142 63, 148 74 C 132 60, 114 62, 98 68 C 76 76, 56 68, 48 54 C 40 40, 26 36, 12 40 Z"
              fill="#161617"
              strokeDasharray="300"
              strokeDashoffset={waveDashoffset}
              className="transition-[stroke-dashoffset] duration-100 ease-out"
            />
            {/* Wave 2 */}
            <path
              d="M 28 62 C 38 82, 60 92, 88 88 C 112 84, 130 96, 138 108 C 124 94, 102 96, 84 99 C 62 103, 44 94, 34 78 C 30 72, 28 66, 28 62 Z"
              fill="#825F27"
              strokeDasharray="300"
              strokeDashoffset={waveDashoffset}
              className="transition-[stroke-dashoffset] duration-100 ease-out"
            />
          </svg>
        </div>

        {/* Wordmark & Subtitle */}
        <div className="text-2xl font-black tracking-widest text-[#161617] mb-1">
          SEA BREW
        </div>
        <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#825F27] mb-3">
          sea brew a coffee based drink
        </div>

        {/* Persian Counter ۰ -> ۱۰۰ */}
        <div className="font-bold text-3xl text-[#161617] mb-4 tabular-nums">
          <span>{toPersianDigits(percent)}</span>
          <span className="text-sm ms-1 text-[#825F27]">٪</span>
        </div>

        {/* Skip prompt */}
        <span className="text-xs text-[#825F27] font-medium opacity-60">
          برای رد شدن کلیک کنید
        </span>
      </div>
    </div>
  );
};
