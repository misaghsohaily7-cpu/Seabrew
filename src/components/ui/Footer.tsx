import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  registerMotionPlugins,
  prefersReducedMotion,
  getReducedMotionPreference,
  setReducedMotionPreference,
} from '../../lib/motion';
import { siteContent } from '../../content';
import { TideLine } from './TideLine';
import { SeaBrewLogo } from './SeaBrewLogo';
import { ZapOff, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => getReducedMotionPreference());

  const letters = ['S', 'E', 'A', ' ', 'B', 'R', 'E', 'W'];

  useEffect(() => {
    registerMotionPlugins();

    const handleMotionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ reduced: boolean }>;
      if (customEvent.detail) {
        setReducedMotion(customEvent.detail.reduced);
      } else {
        setReducedMotion(getReducedMotionPreference());
      }
    };

    window.addEventListener('sea_brew_motion_toggle', handleMotionChange);

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Big wordmark rising letter by letter from masked container
      const validLetters = lettersRef.current.filter(Boolean);
      gsap.fromTo(
        validLetters,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'tide',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, footerRef);

    return () => {
      window.removeEventListener('sea_brew_motion_toggle', handleMotionChange);
      ctx.revert();
    };
  }, []);

  const handleToggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    setReducedMotionPreference(next);
  };


  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#161617] text-[#FFFADE] pt-16 pb-12 overflow-hidden border-t border-[#A78040]/30 select-none"
      aria-label="فوتر پایانی وبسایت"
    >
      <div className="max-w-[1440px] mx-auto px-[6vw] flex flex-col items-center">
        {/* Scroll Progress TideLine completing at Footer */}
        <div className="w-full mb-12">
          <TideLine trackScrollProgress={true} color="#A78040" sunColor="#FDB716" />
        </div>

        {/* Large Wordmark Rising Letter-by-Letter with Logo Mark */}
        <div
          className="w-full flex flex-col items-center justify-center overflow-hidden py-4 my-4"
          aria-label="SEA BREW"
        >
          <SeaBrewLogo variant="mark-only" theme="light" size="lg" className="mb-4 opacity-90 hover:scale-105 transition-transform duration-300" />
          <div className="font-black text-[clamp(3.5rem,14vw,11rem)] tracking-wider text-[#FFFADE] leading-none flex">
            {letters.map((char, idx) => (
              <span key={idx} className="inline-block overflow-hidden">
                <span
                  ref={(el) => {
                    lettersRef.current[idx] = el;
                  }}
                  className="inline-block will-change-transform"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Accessibility & Reduce Motion Control Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 my-6 pb-2">
          <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full border border-[#A78040]/30 bg-[#1e1e20]/90 shadow-inner transition-all hover:border-[#A78040]/60">
            <span className="flex items-center gap-2 text-xs text-[#FFFADE]/90 font-medium select-none">
              {reducedMotion ? (
                <ZapOff className="w-4 h-4 text-[#FDB716]" aria-hidden="true" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#A78040]" aria-hidden="true" />
              )}
              <span>کاهش انیمیشن‌ها (Reduce Motion)</span>
            </span>

            <button
              id="footer-reduce-motion-toggle"
              type="button"
              role="switch"
              aria-checked={reducedMotion}
              aria-label="تغییر وضعیت کاهش انیمیشن‌ها برای آسودگی و دسترس‌پذیری"
              onClick={handleToggleReducedMotion}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FDB716] ${
                reducedMotion ? 'bg-[#FDB716]' : 'bg-[#333230]'
              }`}
            >
              <span className="sr-only">تغییر وضعیت کاهش انیمیشن‌ها</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#161617] shadow-sm transition-transform duration-300 ease-in-out ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>

            <span className="text-[11px] font-mono tracking-wider text-[#A78040]">
              {reducedMotion ? 'آرام (حداقل حرکت)' : 'پویا (سینمایی)'}
            </span>
          </div>
        </div>

        {/* Legal & Origin Notice */}
        <div className="w-full pt-8 border-t border-[#A78040]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold tracking-widest uppercase text-[#C9B8B6] opacity-60">
          <p>{siteContent.footer.legalNotice}</p>
          <div className="flex flex-wrap items-center gap-6">
            <span dir="ltr" className="font-mono text-[11px]">۲۸.۹۲۳۴° N, ۵۰.۸۲۶۴° E</span>
            <span>{siteContent.brand.origin}</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#A78040] hover:text-[#FFFADE] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFFADE] rounded-full px-2 py-1"
            >
              بازگشت به بالا ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
