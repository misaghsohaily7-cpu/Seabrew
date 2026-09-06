import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverState, setHoverState] = useState<'idle' | 'clickable' | 'magnetic'>('idle');

  useEffect(() => {
    registerMotionPlugins();

    // Only desktop pointer:fine and not reduced-motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial offscreen coordinates
    gsap.set([dot, ring], { x: -100, y: -100, xPercent: -50, yPercent: -50 });

    // High performance quickTo setters (zero layout recalculations, GPU transform)
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'tide' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'tide' });

    let currentHoverState: 'idle' | 'clickable' | 'magnetic' = 'idle';

    const onMouseMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Lightweight target identification
      const target = e.target as HTMLElement | null;
      if (target) {
        const isMagnetic = Boolean(target.closest('[data-magnetic="true"]'));
        const isClickable = isMagnetic || Boolean(target.closest('a, button, [role="button"], input, textarea, label'));

        const nextState = isMagnetic ? 'magnetic' : isClickable ? 'clickable' : 'idle';
        if (nextState !== currentHoverState) {
          currentHoverState = nextState;
          setHoverState(nextState);
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      currentHoverState = 'idle';
      setHoverState('idle');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Sun Dot Cursor Center */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FDB716] pointer-events-none will-change-transform"
        style={{
          boxShadow: '0 0 8px rgba(253, 183, 22, 0.9)',
        }}
      />

      {/* Difference Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none will-change-transform transition-[width,height,border-color,background-color,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hoverState === 'magnetic'
            ? 'w-12 h-12 border-[#FDB716] bg-[#FDB716]/18 shadow-[0_0_15px_rgba(253,183,22,0.3)]'
            : hoverState === 'clickable'
            ? 'w-10 h-10 border-[#FDB716]/80 bg-[#FDB716]/10'
            : 'w-7 h-7 border-[#A78040]/50 bg-transparent'
        }`}
        style={{
          mixBlendMode: 'difference',
        }}
      />
    </div>
  );
};
