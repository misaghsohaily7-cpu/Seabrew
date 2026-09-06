import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { SunDot } from '../ui/SunDot';

export const FindUs: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Staggered reveal for section header
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.16,
            ease: 'tide',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      const items = itemsContainerRef.current?.children;
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'tide',
            scrollTrigger: {
              trigger: itemsContainerRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="find-us"
      ref={sectionRef}
      className="relative w-full bg-[#161617] text-[#FFFADE] py-28 px-[6vw] overflow-hidden"
      aria-label="بخش نقاط عرضه و کافه‌های ارائه‌دهنده"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col items-start max-w-2xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A78040] mb-3 flex items-center gap-2">
            <SunDot size="sm" animate={false} />
            <span>{siteContent.findUs.sectionTag}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFADE] mb-4">
            {siteContent.findUs.heading}
          </h2>
          <p className="text-base font-medium text-[#C9B8B6] leading-relaxed">
            {siteContent.findUs.subheading}
          </p>
        </div>

        {/* Location cards list */}
        <div ref={itemsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteContent.findUs.locations.map((loc, idx) => (
            <div
              key={idx}
              className="group relative rounded-t-[999px] rounded-b-[24px] border border-[#A78040]/30 bg-[#161617] p-8 pt-16 flex flex-col justify-between transition-all duration-300 hover:border-[#A78040]"
            >
              {/* Subtle Arch Gold Panel Opening on Hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-t-[999px] rounded-b-[24px] bg-[#A78040]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#825F27]/30 text-[#A78040] border border-[#A78040]/40">
                    {loc.city}
                  </span>
                  <span className="text-xs text-[#C9B8B6]">{loc.type}</span>
                </div>

                <h3 className="text-xl font-black text-[#FFFADE] mb-3">
                  {loc.name}
                </h3>

                <p className="text-sm font-medium text-[#C9B8B6] leading-relaxed mb-6">
                  {loc.address}
                </p>
              </div>

              {/* Map Link */}
              <div className="relative z-10 pt-4 border-t border-[#A78040]/20 flex items-center justify-between">
                <span className="text-xs font-bold text-[#A78040] group-hover:text-[#FFFADE] transition-colors">
                  {siteContent.findUs.mapPrompt}
                </span>
                <span className="text-sm text-[#A78040] group-hover:translate-x-[-4px] transition-transform">
                  ←
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
