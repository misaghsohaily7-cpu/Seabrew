import React, { useEffect, useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import {
  getCurrentTheme,
  toggleTheme,
  THEME_CHANGE_EVENT,
  type ThemeMode,
} from '../../lib/theme';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Sun / Moon pill toggle for light & dark mode.
 * - Thumb slides with transform only (GPU-friendly, RTL-safe via inset-inline)
 * - Crossfading Sun (light) / Moon (dark) icons show the CURRENT theme
 * - Subscribes to THEME_CHANGE_EVENT so multiple toggles (navbar + mobile
 *   overlay) always stay in sync
 * - Persists to localStorage and respects system preference on first visit
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => getCurrentTheme());

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<{ theme: ThemeMode }>).detail;
      if (detail?.theme) setTheme(detail.theme);
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const handleToggle = useCallback(() => {
    setTheme(toggleTheme());
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handleToggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
      title={isDark ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
      data-theme-toggle="true"
      className={`group relative inline-flex items-center w-[58px] h-8 rounded-full border border-[var(--color-gold)]/35 bg-[var(--color-ink)]/8 backdrop-blur-sm cursor-pointer transition-[background-color,border-color] duration-300 hover:border-[var(--color-sun)]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] active:scale-[0.96] ${className}`}
    >
      {/* Sliding thumb */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-sun)] to-[var(--color-gold)] shadow-[0_1px_6px_rgba(253,183,22,0.45)] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] ${
          isDark ? 'start-[26px]' : 'start-[3px]'
        }`}
      >
        {/* Sun icon — visible in light mode */}
        <Sun
          className={`w-3.5 h-3.5 text-[#161617] transition-all duration-300 ${
            isDark ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'
          }`}
          strokeWidth={2.5}
          aria-hidden="true"
        />
        {/* Moon icon — visible in dark mode */}
        <Moon
          className={`absolute w-3.5 h-3.5 text-[#161617] transition-all duration-300 ${
            isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'
          }`}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </span>

      {/* Track icons — faint context hints */}
      <Sun
        className={`absolute end-1.5 w-3 h-3 text-[var(--color-maroon)] transition-opacity duration-300 ${
          isDark ? 'opacity-30' : 'opacity-0'
        }`}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <Moon
        className={`absolute start-1.5 w-3 h-3 text-[var(--color-maroon)] transition-opacity duration-300 ${
          isDark ? 'opacity-0' : 'opacity-30'
        }`}
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </button>
  );
};
