import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    // Only desktop pointer:fine and not reduced-motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReduced) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if target or parent is clickable
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('a, button, [role="button"], input, textarea, label')
        );
        setIsHoveringClickable(isClickable);

        // Magnetic effect check (max 8px towards cursor)
        const magneticEl = target.closest<HTMLElement>('[data-magnetic="true"]');
        if (magneticEl) {
          const rect = magneticEl.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) * 0.2;
          const deltaY = (e.clientY - centerY) * 0.2;
          const clampedX = Math.max(-8, Math.min(8, deltaX));
          const clampedY = Math.max(-8, Math.min(8, deltaY));
          magneticEl.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
          magneticEl.style.transition = 'transform 100ms cubic-bezier(0.22, 1, 0.36, 1)';
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      // Direct positioning for instant dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Smooth lag for ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    animationFrameId = requestAnimationFrame(render);

    // Reset magnetic elements on mouseleave
    const resetMagnetics = () => {
      document.querySelectorAll<HTMLElement>('[data-magnetic="true"]').forEach((el) => {
        el.style.transform = 'translate(0px, 0px)';
        el.style.transition = 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)';
      });
    };
    window.addEventListener('mouseout', resetMagnetics, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseout', resetMagnetics);
      cancelAnimationFrame(animationFrameId);
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
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FDB716] pointer-events-none"
        style={{
          boxShadow: '0 0 6px rgba(253, 183, 22, 0.8)',
          willChange: 'transform',
        }}
      />

      {/* Difference Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-[#A78040] pointer-events-none transition-[width,height,border-color,background-color] duration-300 ${
          isHoveringClickable
            ? 'w-10 h-10 border-[#FDB716] bg-[#FDB716]/10'
            : 'w-7 h-7 border-[#A78040]/50'
        }`}
        style={{
          mixBlendMode: 'difference',
          willChange: 'transform',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
};
