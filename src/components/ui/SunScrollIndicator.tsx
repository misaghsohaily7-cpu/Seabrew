import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';

/**
 * Solar Scroll Progress Button
 *
 * The entire widget — vertical day-progress track (desktop) + the sun dial —
 * is ONE interactive button that returns the visitor to the top of the page.
 * - Hover: sun icon crossfades into an up-chevron ("back to start" affordance)
 *   and a tooltip reveals the current day-phase & scroll percentage
 * - Click: smooth native scroll to top, with reduced-motion awareness
 * - The sliding sun on the track visualizes the day-to-night narrative arc
 */
export const SunScrollIndicator: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const progressTrackRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressSunRef = useRef<HTMLSpanElement>(null);
  const progressRingRef = useRef<SVGCircleElement>(null);
  const sunRotationRef = useRef<HTMLSpanElement>(null);
  const scrollFlagsRef = useRef({ isScrolled: false, isAtBottom: false });
  const trackHeightRef = useRef(0);

  // SVG circle progress is written once per animation frame, without rerendering
  // the whole fixed widget for every native scroll event.
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let frameId = 0;
    const measureTrack = () => {
      trackHeightRef.current = progressTrackRef.current?.clientHeight ?? 0;
    };
    measureTrack();
    const resizeObserver = progressTrackRef.current
      ? new ResizeObserver(measureTrack)
      : null;
    if (progressTrackRef.current) resizeObserver?.observe(progressTrackRef.current);

    const updateProgress = () => {
      frameId = 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0
        ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
        : 0;

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleY(${progress / 100})`;
      }
      if (progressSunRef.current) {
        const y = (progress / 100) * trackHeightRef.current - 8;
        progressSunRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      }
      if (progressRingRef.current) {
        progressRingRef.current.style.strokeDashoffset = String(
          circumference - (progress / 100) * circumference
        );
      }
      if (sunRotationRef.current) {
        sunRotationRef.current.style.transform = `rotate(${progress * 3.6}deg)`;
      }
      const roundedProgress = Math.round(progress);
      const buttonLabel = `نشانگر پیشرفت اسکرول: ${roundedProgress}٪. کلیک برای بازگشت به آغاز صفحه`;
      if (buttonRef.current?.getAttribute('aria-label') !== buttonLabel) {
        buttonRef.current?.setAttribute('aria-label', buttonLabel);
      }

      const nextFlags = {
        isScrolled: window.scrollY > 120,
        isAtBottom: progress >= 96,
      };
      if (nextFlags.isScrolled !== scrollFlagsRef.current.isScrolled) {
        scrollFlagsRef.current.isScrolled = nextFlags.isScrolled;
        setIsScrolled(nextFlags.isScrolled);
      }
      if (nextFlags.isAtBottom !== scrollFlagsRef.current.isAtBottom) {
        scrollFlagsRef.current.isAtBottom = nextFlags.isAtBottom;
        setIsAtBottom(nextFlags.isAtBottom);
      }
    };

    const handleScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [circumference]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  // Fade the dial out near the page bottom — the footer's TideLine takes over
  // the progress display there, so the two never overlap.

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={scrollToTop}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={isAtBottom ? -1 : 0}
      aria-hidden={isAtBottom}
      className={`group fixed z-40 left-4 sm:left-7 bottom-6 flex flex-col items-center gap-3 select-none cursor-pointer rounded-3xl p-1.5 transition-[opacity,transform] duration-200 hover:-translate-y-0.5 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] ${
        isAtBottom
          ? 'opacity-0 translate-y-3 pointer-events-none'
          : isScrolled
          ? 'opacity-100'
          : 'opacity-75'
      }`}
      aria-label="نشانگر پیشرفت اسکرول: ۰٪. کلیک برای بازگشت به آغاز صفحه"
    >
      {/* Desktop Vertical Sun Track Line (visual progress arc) */}
      <span
        className="hidden md:flex flex-col items-center relative pointer-events-none"
        aria-hidden="true"
      >
        {/* Track Line */}
        <span ref={progressTrackRef} className="relative w-[2px] h-32 sm:h-36 bg-[var(--color-gold)]/25 rounded-full overflow-hidden block">
          {/* Filled progress portion */}
          <span
            ref={progressFillRef}
            className="absolute inset-0 w-full origin-top bg-gradient-to-b from-[var(--color-sun)] via-[var(--color-gold)] to-[var(--color-maroon)]"
            style={{ transform: 'scaleY(0)' }}
          />
        </span>

        {/* Sliding Glowing Sun on the Line */}
        <span
          ref={progressSunRef}
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center"
          style={{ top: '-8px', transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Sun Core */}
          <span className="relative w-3 h-3 rounded-full bg-[var(--color-sun)] border border-[var(--color-cream-fixed)] shadow-[0_0_8px_rgba(253,183,22,0.9)]" />
        </span>
      </span>

      {/* Sun Dial & Progress Ring (primary click surface) */}
        <span className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[var(--color-cream)]/95 group-hover:bg-[var(--color-cream)] border border-[var(--color-gold)]/35 group-hover:border-[var(--color-sun)] shadow-md group-hover:shadow-xl group-hover:shadow-[var(--color-sun)]/20 transition-[background-color,border-color,box-shadow] duration-300 flex items-center justify-center">
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
            strokeDasharray={`${circumference}`}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            ref={progressRingRef}
          />
        </svg>

        {/* Central Sun Icon — crossfades to up-chevron on hover */}
        <span
          ref={sunRotationRef}
          className="relative flex items-center justify-center text-[var(--color-maroon)] group-hover:text-[var(--color-sun)] transition-colors duration-300"
          style={{ transform: 'rotate(0deg)' }}
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
      </span>
    </button>
  );
};
