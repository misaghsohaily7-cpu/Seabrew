import React, { useRef, useEffect } from 'react';
import { siteContent } from '../../content';

interface MarqueeProps {
  className?: string;
  bg?: string;
  textColor?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  className = '',
  bg = 'bg-transparent',
  textColor = 'text-[#A78040]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text = `${siteContent.marquee} `;
  const repeated = Array(8).fill(text);

  useEffect(() => {
    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let scrollSpeed = 1;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      scrollSpeed = Math.min(3.5, 1 + deltaY * 0.02);
      lastScrollY = window.scrollY;

      if (containerRef.current) {
        containerRef.current.style.animationDuration = `${30 / scrollSpeed}s`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden py-4 select-none ${bg} ${className}`}
      role="region"
      aria-label="پیام امضای برند"
    >
      <div
        ref={containerRef}
        className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
        aria-hidden="true"
        style={{
          animation: 'marquee-rtl 32s linear infinite',
        }}
      >
        {repeated.map((item, idx) => (
          <span
            key={idx}
            className={`inline-block font-black text-2xl md:text-3xl lg:text-4xl opacity-30 transition-opacity duration-300 hover:opacity-70 px-4 ${textColor}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
