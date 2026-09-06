import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';

export const Statement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sunDotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const heading = headingRef.current;
    if (!heading) return;

    // Use GSAP SplitText for smooth character-level kinetic typography reveal
    const split = new SplitText(heading, {
      type: 'chars,words',
      charsClass: 'statement-char inline-block will-change-transform',
      wordsClass: 'statement-word inline-block overflow-hidden mx-1.5 sm:mx-2.5 pb-2',
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: 0.85,
        },
      });

      // Character-by-character fluid masked rise
      tl.fromTo(
        split.chars,
        {
          yPercent: 125,
          opacity: 0.05,
          rotateZ: 5,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          stagger: 0.035,
          ease: 'tide',
        }
      );

      // Sun dot emergence
      if (sunDotRef.current) {
        tl.fromTo(
          sunDotRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'swell', duration: 0.3 },
          '-=0.2'
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section
      id="statement"
      ref={sectionRef}
      className="relative w-full bg-[#FFFADE] py-28 sm:py-36 md:py-48 px-[6vw] flex items-center justify-center select-none"
      aria-label="بیانیه هویت برند SEA BREW"
    >
      <div className="max-w-[1200px] mx-auto text-center">
        <h2
          ref={headingRef}
          className="font-black text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.35] text-[#161617]"
        >
          قهوه، از سمتِ <span className="text-[#A78040]">گرمِ</span> دریا
        </h2>
        <span
          ref={sunDotRef}
          className="inline-block mt-4 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#FDB716] shadow-[0_0_16px_rgba(253,183,22,0.85)] will-change-transform"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};
