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
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

let isRegistered = false;

export function registerMotionPlugins() {
  if (typeof window === 'undefined' || isRegistered) return;

  gsap.registerPlugin(
    ScrollTrigger,
    CustomEase,
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

/**
 * Checks if user prefers reduced motion (system preference only —
 * the site fully respects the OS-level accessibility setting).
 */
let cachedReducedMotion: boolean | null = null;

export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;

  if (cachedReducedMotion !== null) {
    return cachedReducedMotion;
  }

  const systemPref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cachedReducedMotion = systemPref;
  return systemPref;
}

export function prefersReducedMotion(): boolean {
  return getReducedMotionPreference();
}
