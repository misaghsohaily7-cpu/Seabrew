import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

export const SunScrollIndicator: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 100
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const rawProgress = (window.scrollY / docHeight) * 100;
      const clamped = Math.min(100, Math.max(0, rawProgress));
      setScrollProgress(clamped);
      setIsScrolled(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  // Phase labels throughout the day narrative
  const getPhaseName = (p: number) => {
    if (p < 15) return 'طلوع بامداد';
    if (p < 40) return 'نیمروز ساحلی';
    if (p < 70) return 'عصر زرین';
    if (p < 90) return 'غروب خلیج';
    return 'شب بوشهر';
  };

  // Calculate SVG circle progress
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed z-40 transition-all duration-500 pointer-events-auto ${
        isScrolled ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'
      } left-4 sm:left-7 bottom-6 flex flex-col items-center select-none`}
      role="region"
      aria-label="نشانگر پیشرفت اسکرول از طلوع تا غروب"
    >
      {/* Desktop Vertical Sun Track Line */}
      <div className="hidden md:flex flex-col items-center mb-3 relative group">
        {/* Track Line */}
        <div className="relative w-[2px] h-32 sm:h-36 bg-[#A78040]/25 rounded-full overflow-hidden">
          {/* Filled progress portion */}
          <div
            className="w-full bg-gradient-to-b from-[#FDB716] via-[#A78040] to-[#825F27] transition-all duration-150 ease-out"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        {/* Sliding Glowing Sun on the Line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 transition-all duration-150 ease-out flex items-center justify-center pointer-events-none"
          style={{
            top: `calc(${scrollProgress}% - 8px)`,
          }}
        >
          {/* Sun glowing halo */}
          <div className="absolute inset-0 rounded-full bg-[#FDB716] blur-[4px] opacity-70 animate-pulse" />
          {/* Sun Core */}
          <div className="relative w-3 h-3 rounded-full bg-[#FDB716] border border-[#FFFADE] shadow-[0_0_8px_rgba(253,183,22,0.9)]" />
        </div>

        {/* Floating tooltip indicating current day phase and percentage on hover */}
        <div
          className={`absolute -top-9 start-6 whitespace-nowrap px-2.5 py-1 rounded-full bg-[#161617]/90 text-[#FFFADE] text-[11px] font-medium backdrop-blur-md shadow-lg border border-[#A78040]/30 transition-all duration-300 pointer-events-none ${
            showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}
        >
          <span>{getPhaseName(scrollProgress)}</span>
          <span className="mx-1 text-[#FDB716]">•</span>
          <span className="font-mono text-[10px]">{Math.round(scrollProgress)}٪</span>
        </div>
      </div>

      {/* Interactive Sun Dial & Progress Ring (Click to scroll to top) */}
      <button
        type="button"
        onClick={scrollToTop}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative group w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#FFFADE]/90 hover:bg-[#FFFADE] active:scale-95 border border-[#A78040]/35 hover:border-[#FDB716] shadow-md hover:shadow-xl hover:shadow-[#FDB716]/20 transition-all duration-300 flex items-center justify-center backdrop-blur-md cursor-pointer focus-visible:outline-2 focus-visible:outline-[#161617]"
        title={`پیشرفت روز: ${Math.round(scrollProgress)}٪ (${getPhaseName(scrollProgress)}) - بازگشت به آغاز`}
        aria-label={`پیشرفت اسکرول ${Math.round(scrollProgress)} درصد، کلیک برای بازگشت به آغاز`}
      >
        {/* SVG Circular Progress Track & Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 transform"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          {/* Background circle track */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="#A78040"
            strokeWidth="2.5"
            strokeOpacity="0.18"
          />
          {/* Animated golden sun progress stroke */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="url(#sunProgressGrad)"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
          />
          <defs>
            <linearGradient id="sunProgressGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDB716" />
              <stop offset="50%" stopColor="#A78040" />
              <stop offset="100%" stopColor="#825F27" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Sun Icon with Rotating Rays */}
        <div
          className="relative flex items-center justify-center text-[#825F27] group-hover:text-[#FDB716] transition-colors duration-300"
          style={{
            transform: `rotate(${scrollProgress * 3.6}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <svg
            className="w-5 h-5 sm:w-5.5 sm:h-5.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" fill="#FDB716" stroke="#825F27" strokeWidth="1.5" />
            <line x1="12" y1="2" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
            <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
          </svg>
        </div>

        {/* Subtle percentage badge on hover or near bottom */}
        {scrollProgress > 95 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FDB716] ring-2 ring-[#FFFADE] animate-ping" />
        )}
      </button>
    </div>
  );
};
