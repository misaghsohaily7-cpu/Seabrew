import React, { useState } from 'react';
import { InkCoffeeBranch, InkLeaf, InkBeanStem } from './InkPattern';

export interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'inverse';
  children: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
  className?: string;
  id?: string;
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
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPrimary = variant === 'primary';

  // Base styling adhering to section 6
  // padding 15px block / 45px inline using logical properties (py-[15px] px-[45px])
  // pill (rounded-full), font Estedad 600, 1rem, overflow: visible
  // warm shadow: drop-shadow(2px 2px 6px rgba(130,95,39,0.2))
  const containerClasses = `
    group relative inline-flex items-center justify-center
    rounded-full font-semibold text-[1rem] leading-none select-none
    py-[15px] px-[45px] cursor-pointer
    transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.025] active:scale-[0.96]
    ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
    ${
      isPrimary
        ? 'bg-[#161617] text-[#FFFADE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#161617]'
        : 'bg-[#FFFADE] text-[#161617] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFFADE]'
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
            className="w-7 h-7 text-[#A78040] transform -translate-y-1"
            color="#A78040"
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
            className="w-6 h-6 text-[#A78040] transform -translate-y-1"
            color="#A78040"
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
            className="w-6 h-6 text-[#A78040] transform -translate-y-1"
            color="#A78040"
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
              ? 'linear-gradient(90deg, #161617 0%, #825F27 50%, #161617 100%)'
              : 'linear-gradient(90deg, #FFFADE 0%, #F5E9C0 50%, #FFFADE 100%)',
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
            className="w-2.5 h-2.5 rounded-full bg-[#FDB716] inline-block shadow-[0_0_8px_rgba(253,183,22,0.8)]"
            aria-hidden="true"
          />
        )}
      </span>
    </>
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsHovered(true);
  const handleBlur = () => setIsHovered(false);

  if (asAnchor && href) {
    return (
      <a
        id={id}
        href={href}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
      id={id}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={containerClasses}
      style={inlineStyles}
      {...rest}
    >
      {content}
    </button>
  );
};
