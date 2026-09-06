import React from 'react';

interface SunDotProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  animate?: boolean;
}

export const SunDot: React.FC<SunDotProps> = ({
  size = 'md',
  className = '',
  animate = true,
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    hero: 'w-5 h-5 sm:w-6 sm:h-6',
  };

  return (
    <span
      className={`inline-block rounded-full bg-[#FDB716] align-middle ${sizeClasses[size]} ${
        animate ? 'sun-dot-pulse' : ''
      } ${className}`}
      style={{
        boxShadow: '0 0 12px rgba(253, 183, 22, 0.45)',
      }}
      aria-hidden="true"
    />
  );
};
