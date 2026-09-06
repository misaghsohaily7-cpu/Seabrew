import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { toPersianDigits } from '../ui/Preloader';
import { SunDot } from '../ui/SunDot';

export const Interlude: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const archLayerRef = useRef<SVGGElement>(null);
  const seaLayerRef = useRef<SVGGElement>(null);
  const sunLayerRef = useRef<SVGCircleElement>(null);
  const [degreeN, setDegreeN] = useState(0);
  const [degreeE, setDegreeE] = useState(0);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) {
      setDegreeN(28);
      setDegreeE(50);
      return;
    }

    const ctx = gsap.context(() => {
      // 0. Staggered reveal for header and caption
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'tide',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (captionRef.current) {
        gsap.fromTo(
          captionRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'tide',
            scrollTrigger: {
              trigger: captionRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 1. Coordinates animated counter on scroll entry
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          gsap.to(
            { n: 0, e: 0 },
            {
              n: 28,
              e: 50,
              duration: 1.8,
              ease: 'pour',
              onUpdate: function () {
                const target = this.targets()[0] as { n: number; e: number };
                setDegreeN(Math.round(target.n));
                setDegreeE(Math.round(target.e));
              },
            }
          );
        },
      });

      // 2. Deep 3-layer parallax on scroll
      gsap.to(sunLayerRef.current, {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(archLayerRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to(seaLayerRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="interlude"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 sm:py-32 select-none"
      style={{
        background:
          'linear-gradient(180deg, #FFFADE 0%, rgba(201, 184, 182, 0.45) 50%, #C9B8B6 100%)',
      }}
      aria-label="بخش میان‌پرده — مناظر خطی ساحل جنوب"
    >
      <div className="max-w-[1440px] mx-auto px-[6vw] flex flex-col items-center">
        {/* Caption & Animated Coordinates */}
        <div ref={headerRef} className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-sm font-semibold text-[#825F27]">
          <div className="flex items-center gap-2">
            <SunDot size="sm" animate={false} />
            <span>{siteContent.interlude.tag}</span>
            <span className="text-[#161617]/50">•</span>
            <span dir="ltr" className="font-mono text-base tracking-wider text-[#161617]">
              {toPersianDigits(degreeN)}°۵۸'N {toPersianDigits(degreeE)}°۵۰'E
            </span>
          </div>
          <div className="text-xs text-[#825F27]/80">
            {siteContent.interlude.coordinatesFallback}
          </div>
        </div>

        {/* Full-width Minimalist SVG Scene */}
        <div className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] rounded-t-[999px] rounded-b-[24px] border border-[#A78040]/30 overflow-hidden bg-[#FFFADE]/60 shadow-inner">
          <svg
            viewBox="0 0 1200 600"
            className="w-full h-full"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Layer 1: Southern Arch Architectural Silhouette */}
            <g ref={archLayerRef} opacity="0.85">
              {/* Outer Arch */}
              <path
                d="M 350 600 L 350 250 C 350 110, 460 20, 600 20 C 740 20, 850 110, 850 250 L 850 600"
                stroke="#A78040"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              {/* Inner Arch */}
              <path
                d="M 430 600 L 430 270 C 430 170, 510 90, 600 90 C 690 90, 770 170, 770 270 L 770 600"
                stroke="#A78040"
                strokeWidth="1"
              />
            </g>

            {/* Layer 2: Sun on Horizon */}
            <circle
              ref={sunLayerRef}
              cx="600"
              cy="280"
              r="64"
              fill="#FDB716"
              opacity="0.9"
            />

            {/* Layer 3: Sea Horizon & Tide Waves (Sea Glass #7FA096 accent) */}
            <g ref={seaLayerRef}>
              {/* Horizon TideLine */}
              <line
                x1="100"
                y1="360"
                x2="1100"
                y2="360"
                stroke="#A78040"
                strokeWidth="2"
              />

              {/* Water wash subtle background */}
              <path
                d="M 100 360 L 1100 360 L 1100 600 L 100 600 Z"
                fill="#7FA096"
                fillOpacity="0.12"
              />

              {/* Wave line 1 */}
              <path
                d="M 150 410 Q 350 380, 600 410 T 1050 410"
                stroke="#161617"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* Wave line 2 */}
              <path
                d="M 220 460 Q 420 430, 600 460 T 980 460"
                stroke="#A78040"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Wave line 3 */}
              <path
                d="M 290 510 Q 490 480, 600 510 T 910 510"
                stroke="#161617"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Caption text overlaid at bottom */}
          <div ref={captionRef} className="absolute bottom-6 inset-x-0 px-6 text-center">
            <p className="text-sm md:text-base font-semibold text-[#161617]/90 max-w-lg mx-auto leading-relaxed">
              {siteContent.interlude.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
