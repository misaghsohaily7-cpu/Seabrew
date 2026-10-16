import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { prefersReducedMotion } from '../../lib/motion';

/**
 * Solar Scroll Progress Button
 *
 * The entire widget — vertical day-progress track (desktop) + the sun dial —
 * is ONE interactive button that returns the visitor to the top of the page.
 * - Hover: sun icon crossfades into an up-chevron ("back to start" affordance)
 *   and a tooltip reveals the current day-phase & scroll percentage
 * - Click: smooth scroll to top (ScrollSmoother-aware, reduced-motion aware)
 * - The sliding sun on the track visualizes the day-to-night narrative arc
 */
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
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, true);
    } else {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  };

  // Calculate SVG circle progress
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  // Fade the dial out near the page bottom — the footer's TideLine takes over
  // the progress display there, so the two never overlap.
  const isAtBottom = scrollProgress >= 96;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={isAtBottom ? -1 : 0}
      aria-hidden={isAtBottom}
      className={`group fixed z-40 left-4 sm:left-7 bottom-6 flex flex-col items-center gap-3 select-none cursor-pointer rounded-3xl p-1.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] ${
        isAtBottom
          ? 'opacity-0 translate-y-3 pointer-events-none'
          : isScrolled
          ? 'opacity-100'
          : 'opacity-75'
      }`}
      aria-label={`نشانگر پیشرفت اسکرول: ${Math.round(scrollProgress)}٪. کلیک برای بازگشت به آغاز صفحه`}
    >
      {/* Desktop Vertical Sun Track Line (visual progress arc) */}
      <span
        className="hidden md:flex flex-col items-center relative pointer-events-none"
        aria-hidden="true"
      >
        {/* Track Line */}
        <span className="relative w-[2px] h-32 sm:h-36 bg-[var(--color-gold)]/25 rounded-full overflow-hidden block">
          {/* Filled progress portion */}
          <span
            className="w-full bg-gradient-to-b from-[var(--color-sun)] via-[var(--color-gold)] to-[var(--color-maroon)] transition-all duration-150 ease-out block"
            style={{ height: `${scrollProgress}%` }}
          />
        </span>

        {/* Sliding Glowing Sun on the Line */}
        <span
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 transition-all duration-150 ease-out flex items-center justify-center"
          style={{
            top: `calc(${scrollProgress}% - 8px)`,
          }}
        >
          {/* Sun glowing halo */}
          <span className="absolute inset-0 rounded-full bg-[var(--color-sun)] blur-[4px] opacity-70 animate-pulse" />
          {/* Sun Core */}
          <span className="relative w-3 h-3 rounded-full bg-[var(--color-sun)] border border-[var(--color-cream-fixed)] shadow-[0_0_8px_rgba(253,183,22,0.9)]" />
        </span>
      </span>

      {/* Sun Dial & Progress Ring (primary click surface) */}
      <span className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[var(--color-cream)]/90 group-hover:bg-[var(--color-cream)] border border-[var(--color-gold)]/35 group-hover:border-[var(--color-sun)] shadow-md group-hover:shadow-xl group-hover:shadow-[var(--color-sun)]/20 transition-all duration-300 flex items-center justify-center backdrop-blur-md">
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
            stroke="var(--color-gold)"
            strokeWidth="2.5"
            strokeOpacity="0.18"
          />
          {/* Animated golden sun progress stroke */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="var(--color-sun)"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
          />
        </svg>

        {/* Central Sun Icon — crossfades to up-chevron on hover */}
        <span
          className="relative flex items-center justify-center text-[var(--color-maroon)] group-hover:text-[var(--color-sun)] transition-colors duration-300"
          style={{
            transform: `rotate(${scrollProgress * 3.6}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          aria-hidden="true"
        >
          <svg
            className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-opacity duration-300 ${
              showTooltip ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" fill="var(--color-sun)" stroke="var(--color-maroon)" strokeWidth="1.5" />
            <line x1="12" y1="2" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
            <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
          </svg>
          <ChevronUp
            className={`absolute w-5 h-5 sm:w-5.5 sm:h-5.5 transition-all duration-300 ${
              showTooltip ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            strokeWidth={2.5}
          />
        </span>

        {/* Subtle ping badge near the bottom of the day */}
        {scrollProgress > 95 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--color-sun)] ring-2 ring-[var(--color-cream)] animate-ping" />
        )}
      </span>
    </button>
  );
};
