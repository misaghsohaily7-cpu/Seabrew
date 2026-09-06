/**
 * SEA BREW Motion Design System
 * GSAP 3 + ScrollTrigger + CustomEase configuration
 * 
 * Rules:
 * - tide: cubic-bezier(0.22, 1, 0.36, 1) -> Default for all reveals and returns
 * - pour: cubic-bezier(0.65, 0, 0.35, 1) -> Liquid, line drawing, symmetrical infinite loops
 * - swell: cubic-bezier(0.34, 1.3, 0.64, 1) -> Button hover only
 * - Durations: hover 250–300ms · reveal 800–1200ms · no movement under 200ms
 * - GSAP default eases (power1/2/3...) are strictly forbidden.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

let isRegistered = false;

export function registerMotionPlugins() {
  if (typeof window === 'undefined' || isRegistered) return;
  
  gsap.registerPlugin(
    ScrollTrigger,
    CustomEase,
    ScrollSmoother,
    DrawSVGPlugin,
    SplitText,
    Flip
  );

  // Register CustomEase bezier curves
  CustomEase.create('tide', '0.22, 1, 0.36, 1');
  CustomEase.create('pour', '0.65, 0, 0.35, 1');
  CustomEase.create('swell', '0.34, 1.3, 0.64, 1');

  isRegistered = true;
}

export const MOTION = {
  ease: {
    tide: 'tide',
    pour: 'pour',
    swell: 'swell',
  },
  cssEase: {
    tide: 'cubic-bezier(0.22, 1, 0.36, 1)',
    pour: 'cubic-bezier(0.65, 0, 0.35, 1)',
    swell: 'cubic-bezier(0.34, 1.3, 0.64, 1)',
  },
  duration: {
    hoverFast: 0.25,
    hover: 0.3,
    revealFast: 0.8,
    reveal: 1.0,
    revealSlow: 1.2,
    loop: 3.0,
    loopWave: 8.0,
  },
} as const;

/**
 * Checks if user prefers reduced motion (checks manual toggle in localStorage first, then OS)
 */
let cachedReducedMotion: boolean | null = null;

export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;
  
  if (cachedReducedMotion !== null) {
    return cachedReducedMotion;
  }

  try {
    const stored = localStorage.getItem('sea_brew_reduced_motion');
    if (stored !== null) {
      cachedReducedMotion = stored === 'true';
      return cachedReducedMotion;
    }
  } catch {
    // localStorage might be unavailable
  }

  const systemPref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cachedReducedMotion = systemPref;
  return systemPref;
}

export function setReducedMotionPreference(enabled: boolean): void {
  cachedReducedMotion = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sea_brew_reduced_motion', String(enabled));
    } catch {
      // safe fallback
    }

    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    window.dispatchEvent(
      new CustomEvent('sea_brew_motion_toggle', { detail: { reduced: enabled } })
    );
  }
}

export function toggleReducedMotionPreference(): boolean {
  const next = !getReducedMotionPreference();
  setReducedMotionPreference(next);
  return next;
}

export function prefersReducedMotion(): boolean {
  return getReducedMotionPreference();
}

