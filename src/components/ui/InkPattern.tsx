import React from 'react';

interface PatternProps {
  className?: string;
  strokeWidth?: number;
  color?: string;
  ariaHidden?: boolean;
}

/**
 * شاخه قهوه — Coffee branch with subtle leaf nodes
 */
export const InkCoffeeBranch: React.FC<PatternProps> = ({
  className = 'w-10 h-10',
  strokeWidth = 1.5,
  color = '#A78040',
  ariaHidden = true,
}) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path
      d="M20 38 C 20 28, 18 16, 20 4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M20 30 C 26 26, 32 24, 34 18 C 30 18, 24 22, 20 25"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 22 C 14 18, 8 16, 6 11 C 10 11, 16 15, 20 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 14 C 24 10, 30 8, 31 3 C 28 4, 23 8, 20 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * برگ ساحلی — Coastal leaf motif
 */
export const InkLeaf: React.FC<PatternProps> = ({
  className = 'w-8 h-8',
  strokeWidth = 1.5,
  color = '#A78040',
  ariaHidden = true,
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path
      d="M16 30 C 16 22, 14 12, 16 2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M16 2 C 26 10, 26 22, 16 30 C 6 22, 6 10, 16 2 Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 10 C 20 12, 22 15, 24 18"
      stroke={color}
      strokeWidth={strokeWidth * 0.8}
      strokeLinecap="round"
    />
    <path
      d="M16 16 C 12 18, 10 21, 8 24"
      stroke={color}
      strokeWidth={strokeWidth * 0.8}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * ساقه دانه قهوه — Stem with coffee berries
 */
export const InkBeanStem: React.FC<PatternProps> = ({
  className = 'w-9 h-9',
  strokeWidth = 1.5,
  color = '#A78040',
  ariaHidden = true,
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path
      d="M18 34 C 18 24, 20 14, 17 2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Bean 1 */}
    <ellipse
      cx="24"
      cy="20"
      rx="4.5"
      ry="3.5"
      transform="rotate(-25 24 20)"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 18 C 24 20, 25 21, 26 23"
      stroke={color}
      strokeWidth={strokeWidth * 0.8}
      strokeLinecap="round"
    />
    {/* Bean 2 */}
    <ellipse
      cx="11"
      cy="13"
      rx="4.5"
      ry="3.5"
      transform="rotate(30 11 13)"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path
      d="M10 11 C 11 13, 12 14, 13 16"
      stroke={color}
      strokeWidth={strokeWidth * 0.8}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * موج دریا — Linear minimalist warm tide wave
 */
export const InkSeaWave: React.FC<PatternProps> = ({
  className = 'w-full h-8',
  strokeWidth = 1.5,
  color = '#A78040',
  ariaHidden = true,
}) => (
  <svg
    viewBox="0 0 240 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path
      d="M0 12 C 40 4, 80 20, 120 12 C 160 4, 200 20, 240 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * طاق خطی — Arch linear motif
 */
export const InkArchOutline: React.FC<PatternProps> = ({
  className = 'w-16 h-24',
  strokeWidth = 1.5,
  color = '#A78040',
  ariaHidden = true,
}) => (
  <svg
    viewBox="0 0 64 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path
      d="M2 94 L2 32 C2 14, 16 2, 32 2 C48 2, 62 14, 62 32 L62 94"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);
