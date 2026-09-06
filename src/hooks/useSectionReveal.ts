import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../lib/motion';

export interface SectionRevealOptions {
  /** ScrollTrigger start position (defaults to 'top 82%') */
  start?: string;
  /** Initial vertical displacement in px (defaults to 36) */
  yOffset?: number;
  /** Animation duration per item in seconds (defaults to 0.95) */
  duration?: number;
  /** Stagger time between items in seconds (defaults to 0.16) */
  stagger?: number;
  /** Custom element selector query within the container */
  selector?: string;
}

/**
 * Custom hook that animates section headings and narrative elements
 * with a staggered GSAP fade-in and upward slide as they enter the viewport.
 */
export function useSectionReveal(
  containerRef: RefObject<HTMLElement | HTMLDivElement | null>,
  options: SectionRevealOptions = {}
) {
  const {
    start = 'top 82%',
    yOffset = 36,
    duration = 0.95,
    stagger = 0.16,
    selector = '[data-reveal], .reveal-item, .reveal-tag, .reveal-heading, .reveal-narrative',
  } = options;

  useEffect(() => {
    registerMotionPlugins();
    const container = containerRef.current;
    if (!container) return;

    if (prefersReducedMotion()) {
      const items = container.querySelectorAll(selector);
      items.forEach((item) => {
        gsap.set(item, { opacity: 1, y: 0, clearProps: 'all' });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll(selector);
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'tide',
          scrollTrigger: {
            trigger: container,
            start,
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [containerRef, start, yOffset, duration, stagger, selector]);
}
