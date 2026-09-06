import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';

export const Statement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word3Ref = useRef<HTMLSpanElement>(null);
  const word4Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const words = [word1Ref.current, word2Ref.current, word3Ref.current, word4Ref.current].filter(
      Boolean
    );

    const ctx = gsap.context(() => {
      // Scroll-scrubbed word-by-word reveal from linear mask
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 0.8,
        },
      });

      tl.fromTo(
        words,
        { yPercent: 120, opacity: 0.1 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.25,
          ease: 'tide',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="statement"
      ref={sectionRef}
      className="relative w-full bg-[#FFFADE] py-28 sm:py-36 md:py-48 px-[6vw] flex items-center justify-center select-none"
      aria-label="بیانیه هویت برند SEA BREW"
    >
      <div
        ref={containerRef}
        className="max-w-[1200px] mx-auto text-center font-black text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.3] text-[#161617]"
      >
        <span className="inline-block overflow-hidden pb-3">
          <span ref={word1Ref} className="inline-block px-2 will-change-transform">
            قهوه،
          </span>
        </span>
        <span className="inline-block overflow-hidden pb-3">
          <span ref={word2Ref} className="inline-block px-2 will-change-transform">
            از سمتِ
          </span>
        </span>
        <span className="inline-block overflow-hidden pb-3">
          <span
            ref={word3Ref}
            className="inline-block px-2 text-[#A78040] will-change-transform"
          >
            گرمِ
          </span>
        </span>
        <span className="inline-block overflow-hidden pb-3">
          <span ref={word4Ref} className="inline-flex items-center px-2 will-change-transform">
            <span>دریا</span>
            <span
              className="inline-block ms-4 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#FDB716] shadow-[0_0_12px_rgba(253,183,22,0.7)]"
              aria-hidden="true"
            />
          </span>
        </span>
      </div>
    </section>
  );
};
