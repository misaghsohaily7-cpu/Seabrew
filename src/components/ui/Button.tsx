import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { InkCoffeeBranch, InkLeaf, InkBeanStem } from './InkPattern';

export interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'inverse';
  children: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
  className?: string;
  id?: string;
  magnetic?: boolean;
}

export const BrandButton: React.FC<BrandButtonProps> = ({
  variant = 'primary',
  children,
  asAnchor = false,
  href,
  onClick,
  className = '',
  id,
  disabled,
  magnetic = true,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPrimary = variant === 'primary';

  const elementRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const xQuickTo = useRef<((value: number) => void) | null>(null);
  const yQuickTo = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (!magnetic || !elementRef.current || prefersReducedMotion()) return;

    // Initialize high-performance quickTo setters for buttery 60fps tracking
    xQuickTo.current = gsap.quickTo(elementRef.current, 'x', {
      duration: 0.32,
      ease: 'tide',
    });
    yQuickTo.current = gsap.quickTo(elementRef.current, 'y', {
      duration: 0.32,
      ease: 'tide',
    });

    return () => {
      xQuickTo.current = null;
      yQuickTo.current = null;
    };
  }, [magnetic]);

  // Base styling adhering to section 6
  // padding 15px block / 45px inline using logical properties (py-[15px] px-[45px])
  // pill (rounded-full), font Estedad 600, 1rem, overflow: visible
  // warm shadow: drop-shadow(2px 2px 6px rgba(130,95,39,0.2))
  const containerClasses = `
    group relative inline-flex items-center justify-center
    rounded-full font-semibold text-[1rem] leading-none select-none
    py-[15px] px-[45px] cursor-pointer will-change-transform
    transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.025] active:scale-[0.96]
    ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
    ${
      isPrimary
        ? 'bg-[var(--color-ink)] text-[var(--color-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]'
        : 'bg-[var(--color-cream)] text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-cream)]'
    }
    ${className}
  `;

  const inlineStyles: React.CSSProperties = {
    filter: 'drop-shadow(2px 2px 6px rgba(130, 95, 39, 0.2))',
    overflow: 'visible',
  };

  const content = (
    <>
      {/* 1. Coastal Plant Branches protruding above button top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-full h-8 overflow-visible"
        aria-hidden="true"
      >
        {/* Branch 1: Start corner (Coffee branch) */}
        <div
          className={`absolute start-4 bottom-0 origin-bottom transition-transform ${
            isHovered && !disabled ? 'animate-sway-1' : ''
          }`}
          style={{
            transformOrigin: 'bottom center',
            transitionDuration: '500ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            transform: isHovered && !disabled ? undefined : 'rotate(0deg)',
          }}
        >
          <InkCoffeeBranch
            className="w-7 h-7 text-[var(--color-gold)] transform -translate-y-1"
            color="var(--color-gold)"
            strokeWidth={1.5}
          />
        </div>

        {/* Branch 2: Middle (Leaf) */}
        <div
          className={`absolute start-1/2 -translate-x-1/2 bottom-0 origin-bottom transition-transform ${
            isHovered && !disabled ? 'animate-sway-2' : ''
          }`}
          style={{
            transformOrigin: 'bottom center',
            transitionDuration: '500ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            transform: isHovered && !disabled ? undefined : 'rotate(0deg)',
          }}
        >
          <InkLeaf
            className="w-6 h-6 text-[var(--color-gold)] transform -translate-y-1"
            color="var(--color-gold)"
            strokeWidth={1.5}
          />
        </div>

        {/* Branch 3: Near end corner (Bean stem) */}
        <div
          className={`absolute end-5 bottom-0 origin-bottom transition-transform ${
            isHovered && !disabled ? 'animate-sway-3' : ''
          }`}
          style={{
            transformOrigin: 'bottom center',
            transitionDuration: '500ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            transform: isHovered && !disabled ? undefined : 'rotate(0deg)',
          }}
        >
          <InkBeanStem
            className="w-6 h-6 text-[var(--color-gold)] transform -translate-y-1"
            color="var(--color-gold)"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* 2. Shimmer Background pseudo-layer moving via transform */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        aria-hidden="true"
      >
        <div
          className={`absolute inset-0 w-[200%] h-full transition-opacity duration-300 ${
            isHovered && !disabled ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: isPrimary
              ? 'linear-gradient(90deg, var(--color-ink) 0%, var(--color-maroon) 50%, var(--color-ink) 100%)'
              : 'linear-gradient(90deg, var(--color-cream) 0%, #F5E9C0 50%, var(--color-cream) 100%)',
            transform: isHovered && !disabled ? 'translateX(-50%)' : 'translateX(0%)',
            transitionProperty: 'transform, opacity',
            transitionDuration: isHovered ? '2.5s' : '0.5s',
            transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        />
      </div>

      {/* 3. Text label & SunDot indicator */}
      <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
        <span>{children}</span>
        {isPrimary && (
          <span
            className="w-2.5 h-2.5 rounded-full bg-[var(--color-sun)] inline-block shadow-[0_0_8px_rgba(253,183,22,0.8)]"
            aria-hidden="true"
          />
        )}
      </span>
    </>
  );

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!magnetic || !elementRef.current || prefersReducedMotion()) return;
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Strict boundary & pull constraints:
    // Capped between -22px and +22px, gentle 0.25 tracking ratio
    const MAX_DISPLACEMENT = 22;
    const PULL_FACTOR = 0.25;

    const deltaX = (e.clientX - centerX) * PULL_FACTOR;
    const deltaY = (e.clientY - centerY) * PULL_FACTOR;

    const clampedX = Math.max(-MAX_DISPLACEMENT, Math.min(MAX_DISPLACEMENT, deltaX));
    const clampedY = Math.max(-MAX_DISPLACEMENT, Math.min(MAX_DISPLACEMENT, deltaY));

    xQuickTo.current?.(clampedX);
    yQuickTo.current?.(clampedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!magnetic || !elementRef.current || prefersReducedMotion()) return;

    // Smooth return to resting position using custom brand ease 'tide'
    gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'tide',
      overwrite: 'auto',
    });
  };

  const handleFocus = () => setIsHovered(true);
  const handleBlur = () => {
    setIsHovered(false);
    if (elementRef.current && !prefersReducedMotion()) {
      gsap.to(elementRef.current, { x: 0, y: 0, duration: 0.4, ease: 'tide', overwrite: 'auto' });
    }
  };

  if (asAnchor && href) {
    return (
      <a
        ref={elementRef as unknown as React.RefObject<HTMLAnchorElement>}
        id={id}
        href={href}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-magnetic={magnetic ? 'true' : undefined}
        className={containerClasses}
        style={inlineStyles}
        role="button"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={elementRef as unknown as React.RefObject<HTMLButtonElement>}
      id={id}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-magnetic={magnetic ? 'true' : undefined}
      className={containerClasses}
      style={inlineStyles}
      {...rest}
    >
      {content}
    </button>
  );
};
