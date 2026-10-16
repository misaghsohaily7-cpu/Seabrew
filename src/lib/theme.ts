/**
 * SEA BREW Theme System
 *
 * Light / Dark mode resolution order:
 *   1. localStorage ('sea-brew-theme') — explicit user choice, persists
 *   2. prefers-color-scheme system preference
 *   3. light (fallback)
 *
 * The resolved theme is applied as `data-theme` on <html>. An inline boot
 * script in index.html applies it before first paint to avoid a flash.
 */

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'sea-brew-theme';
export const THEME_CHANGE_EVENT = 'sea_brew_theme_change';

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeMode(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function resolveInitialTheme(): ThemeMode {
  return getStoredTheme() ?? getSystemTheme();
}

export function getCurrentTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Apply a theme to <html>, persist the choice, and notify subscribers. */
export function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable — theme still applies for this session
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
}

/** Toggle between light and dark; returns the newly applied theme. */
export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
