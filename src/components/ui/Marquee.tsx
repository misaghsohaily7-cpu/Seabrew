import React, { useEffect, useRef } from 'react';
import { siteContent } from '../../content';

interface MarqueeProps {
  className?: string;
  bg?: string;
  textColor?: string;
}

/**
 * Brand signature ticker — runs at a constant, calm speed.
 * (No scroll-velocity coupling: the strip simply keeps rotating on its own.)
 */
export const Marquee: React.FC<MarqueeProps> = ({
  className = '',
  bg = 'bg-transparent',
  textColor = 'text-[var(--color-gold)]',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const text = `${siteContent.marquee} `;
  const repeated = Array(8).fill(text);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === 'undefined') {
      section.classList.add('motion-visible');
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      section.classList.toggle('motion-visible', Boolean(entry?.isIntersecting));
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`marquee-section relative w-full overflow-hidden py-4 select-none ${bg} ${className}`}
      role="region"
      aria-label="پیام امضای برند"
    >
      <div
        ref={trackRef}
        className="marquee-track flex whitespace-nowrap"
        aria-hidden="true"
        style={{
          animation: 'marquee-rtl 36s linear infinite',
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
