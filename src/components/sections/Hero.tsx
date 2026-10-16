import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { SunDot } from '../ui/SunDot';
import { BrandButton } from '../ui/Button';
import { TideLine } from '../ui/TideLine';
import { InkCoffeeBranch } from '../ui/InkPattern';
import { DustParticles } from '../ui/DustParticles';

interface HeroProps {
  introReady?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ introReady = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const draftNoteRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const bottleFloatTweenRef = useRef<gsap.core.Tween | null>(null);
  const heroVisibleRef = useRef(true);
  const wavePathRef = useRef<SVGPathElement>(null);
  const waveStrokeRef = useRef<SVGPathElement>(null);
  const secondaryWaveStrokeRef = useRef<SVGPathElement>(null);

  // Dedicated Magnetic Parallax & 3D Depth Refs
  const textColParallaxRef = useRef<HTMLDivElement>(null);
  const bottleParallaxRef = useRef<HTMLDivElement>(null);
  const archParallaxRef = useRef<HTMLDivElement>(null);
  const sunParallaxRef = useRef<HTMLDivElement>(null);
  const shadowParallaxRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const bgArchOutlineRef = useRef<HTMLDivElement>(null);
  const botanicalRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia(sectionRef);

    // Desktop: rich 3D multi-plane parallax, DrawSVG wave lines, interactive bottle levitation & tilt
    mm.add('(min-width: 768px)', () => {
      // 1. Initial choreographed entrance
      const tl = gsap.timeline({
        paused: !introReady,
        defaults: { ease: 'tide' },
      });

      // Split text masked reveal (yPercent 110 -> 0)
      tl.fromTo(
        [titleLine1Ref.current, titleLine2Ref.current],
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.07 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.6'
        )
        .fromTo(
          sunRef.current,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: 'swell' },
          '-=0.7'
        )
        .fromTo(
          [archRef.current, bottleRef.current],
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.09 },
          '-=0.8'
        )
        .fromTo(
          [ctaContainerRef.current, draftNoteRef.current],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 },
          '-=0.5'
        );

      if (introReady) {
        tl.play();
      }

      // DrawSVG stroke drawing on desktop
      if (waveStrokeRef.current && secondaryWaveStrokeRef.current) {
        gsap.fromTo(
          [waveStrokeRef.current, secondaryWaveStrokeRef.current],
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            duration: 1.4,
            stagger: 0.2,
            ease: 'pour',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 2. Multi-Plane Magnetic Parallax reacting to scroll position
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
        defaults: { ease: 'none' },
      });

      // Layer 0: "WARM SEA" Atmospheric Background Watermark
      if (watermarkRef.current) {
        scrollTl.to(
          watermarkRef.current,
          {
            x: -80,
            y: 90,
            opacity: 0.015,
          },
          0
        );
      }

      // Layer 1: Background Architectural Arch outline
      if (bgArchOutlineRef.current) {
        scrollTl.to(
          bgArchOutlineRef.current,
          {
            y: 80,
            scale: 0.94,
            opacity: 0.15,
          },
          0
        );
      }

      // Layer 2: Sun Sphere (Deep distance sunset sinking with atmospheric fade)
      if (sunParallaxRef.current) {
        scrollTl.to(
          sunParallaxRef.current,
          {
            y: 200,
            scale: 0.78,
            opacity: 0.22,
          },
          0
        );
      }

      // Layer 3: Arch Offset Shadow (Stretches and dynamically shifts light angle)
      if (shadowParallaxRef.current) {
        scrollTl.to(
          shadowParallaxRef.current,
          {
            x: 32,
            y: 120,
            scale: 0.94,
            opacity: 0.15,
          },
          0
        );
      }

      // Layer 4: Southern Arch Frame (Midground depth plane)
      if (archParallaxRef.current) {
        scrollTl.to(
          archParallaxRef.current,
          {
            y: 85,
            rotateZ: -1.5,
            scale: 0.97,
          },
          0
        );
      }

      // Layer 5: Hero Bottle (Foreground anchor - floats upward relative to scroll with 3D roll)
      if (bottleParallaxRef.current) {
        scrollTl.to(
          bottleParallaxRef.current,
          {
            y: -8,
            z: 10,
            rotateX: -1,
            rotateY: 1.2,
            rotateZ: 0.3,
            scale: 1.008,
          },
          0
        );
      }

      // Layer 6: Text column (Soft editorial trailing inertia)
      if (textColParallaxRef.current) {
        scrollTl.to(
          textColParallaxRef.current,
          {
            y: 65,
            opacity: 0.7,
          },
          0
        );
      }

      // Layer 7: Botanical flourish (Floating micro-depth)
      if (botanicalRef.current) {
        scrollTl.to(
          botanicalRef.current,
          {
            y: -40,
            rotate: 32,
            opacity: 0.15,
          },
          0
        );
      }

      // 3. Gentle horizon wave loop (8s)
      if (wavePathRef.current) {
        gsap.to(wavePathRef.current, {
          attr: {
            d: 'M 0 35 C 150 15, 300 50, 450 35 C 600 20, 750 45, 900 35 L 900 60 L 0 60 Z',
          },
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'pour',
          scrollTrigger: {
            trigger: sectionRef.current,
            toggleActions: 'play pause resume pause',
          },
        });
      }

      // 4. Idle levitation floating loop for hero bottle (gentle)
      bottleFloatTweenRef.current = gsap.to(bottleRef.current, {
        y: -6,
        rotate: 0.6,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      if (!heroVisibleRef.current) bottleFloatTweenRef.current.pause();

      // 5. Interactive Magnetic Pointer Parallax (Desktop fine pointer only)
      if (window.matchMedia('(pointer: fine)').matches) {
        const handleMouseMove = (e: MouseEvent) => {
          if (!heroVisibleRef.current) return;
          const { innerWidth, innerHeight } = window;
          const xFactor = (e.clientX / innerWidth - 0.5) * 2;
          const yFactor = (e.clientY / innerHeight - 0.5) * 2;

          gsap.to(sunRef.current, {
            x: xFactor * 8,
            y: yFactor * 6,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(archRef.current, {
            x: xFactor * -9,
            y: yFactor * -7,
            rotateY: xFactor * -2,
            rotateX: yFactor * 1.5,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(bottleRef.current, {
            x: xFactor * 4,
            rotateY: xFactor * 1.2,
            rotateX: -yFactor * 0.8,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          if (botanicalRef.current) {
            gsap.to(botanicalRef.current, {
              x: xFactor * 8,
              y: yFactor * 6,
              duration: 1.4,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }
    });

    // Mobile: distinct lighter choreography with 60fps performance and touch optimization
    mm.add('(max-width: 767px)', () => {
      const mobileTl = gsap.timeline({
        paused: !introReady,
        defaults: { ease: 'tide' },
      });

      mobileTl
        .fromTo(
          [titleLine1Ref.current, titleLine2Ref.current],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }
        )
        .fromTo(subtitleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 }, '-=0.4')
        .fromTo(
          [archRef.current, bottleRef.current],
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.07 },
          '-=0.5'
        )
        .fromTo(ctaContainerRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.3');

      if (introReady) {
        mobileTl.play();
      }

      // DrawSVG stroke drawing on mobile
      if (waveStrokeRef.current) {
        gsap.fromTo(
          waveStrokeRef.current,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            duration: 1.8,
            ease: 'pour',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Gentle vertical parallax on mobile (zero rotation or matrix tilt)
      gsap.to(bottleParallaxRef.current, {
        y: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0,
        },
      });

      // Subtle float
      bottleFloatTweenRef.current = gsap.to(bottleRef.current, {
        y: -6,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      if (!heroVisibleRef.current) bottleFloatTweenRef.current.pause();
    });

    return () => {
      mm.revert();
      bottleFloatTweenRef.current = null;
    };
  }, [introReady]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === 'undefined') {
      section.classList.add('motion-visible');
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = Boolean(entry?.isIntersecting);
      heroVisibleRef.current = isVisible;
      section.classList.toggle('motion-visible', isVisible);
      if (isVisible) {
        bottleFloatTweenRef.current?.resume();
      } else {
        bottleFloatTweenRef.current?.pause();
      }
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[92vh] w-full bg-[var(--color-cream)] overflow-hidden flex flex-col justify-between pt-10 pb-4"
      aria-label="بخش هیرو — معرفی SEA BREW"
    >
      {/* Background Ambience: Architectural Graphic Watermark & Subtle Arch Outline */}
      <div
        ref={bgArchOutlineRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 select-none overflow-hidden will-change-transform"
        aria-hidden="true"
      >
        <div className="w-[600px] h-[850px] rounded-t-[999px] rounded-b-[32px] border border-[var(--color-gold)]/30" />
      </div>

      {/* Natural Tones Watermark Display Typography */}
      <div
        ref={watermarkRef}
        dir="ltr"
        className="absolute top-1/4 -start-16 opacity-[0.035] select-none pointer-events-none tracking-tight font-black text-[clamp(6rem,18vw,16rem)] text-[var(--color-ink)] leading-none will-change-transform whitespace-nowrap"
        aria-hidden="true"
      >
        SEA BREW
      </div>

      {/* Ambient Coastal Dust Particles floating in sunbeams */}
      <DustParticles count={36} color="var(--color-sun)" className="opacity-60" />

      {/* Main Grid: Typography on Right (RTL start), Bottle Visual on Left */}
      <div className="max-w-[1440px] mx-auto px-[6vw] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1 my-auto">
        {/* Text column (RTL Start) */}
        <div ref={textColParallaxRef} className="lg:col-span-7 flex flex-col items-start z-10 will-change-transform">
          {/* Subtitle tag / Origin Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span
              ref={subtitleRef}
              className="text-[var(--color-maroon)] text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 border border-[var(--color-maroon)] rounded-full inline-flex items-center gap-2"
            >
              <InkCoffeeBranch className="w-4 h-4 text-[var(--color-gold)]" />
              <span>{siteContent.hero.subtitle}</span>
            </span>
          </div>

          {/* Primary H1 Headline */}
          <h1 className="font-black text-[clamp(2rem,5.2vw,4.5rem)] leading-[1.3] text-[var(--color-ink)] mb-7 tracking-normal">
            <span className="block overflow-hidden pb-1">
              <span ref={titleLine1Ref} className="block will-change-transform">
                {siteContent.hero.titleLine1}
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span
                ref={titleLine2Ref}
                className="inline-flex items-center gap-2 will-change-transform"
              >
                <span>{siteContent.hero.titleLine2}</span>
                {/* SunDot signature punctuation */}
                <SunDot size="hero" className="translate-y-[-0.1em]" />
              </span>
            </span>
          </h1>

          {/* Draft main text note with client disclaimer */}
          <div
            ref={draftNoteRef}
            className="mb-7 max-w-xl p-3.5 rounded-2xl bg-[var(--color-dust)]/25 border border-[var(--color-gold)]/20 text-sm font-medium text-[var(--color-ink)]/90 leading-relaxed"
          >
            {siteContent.hero.draftText}
          </div>

          {/* Call to action buttons */}
          <div
            ref={ctaContainerRef}
            className="flex flex-wrap items-center gap-4"
          >
            <BrandButton
              variant="primary"
              asAnchor
              href="#drinks"
              data-magnetic="true"
            >
              {siteContent.hero.cta}
            </BrandButton>
          </div>
        </div>

        {/* Visual column: Sun + Southern Arch + Hero RTD Bottle SVG Illustration with 3D Depth */}
        <div
          className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] sm:min-h-[500px] select-none"
          style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
        >
          {/* Ambient Botanical Stroke Accent */}
          <svg
            ref={botanicalRef}
            className="absolute -top-10 -end-8 w-28 h-28 opacity-25 rotate-12 pointer-events-none will-change-transform"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path
              d="M50 10 Q60 40 90 50 Q60 60 50 90 Q40 60 10 50 Q40 40 50 10"
              stroke="var(--color-gold)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          {/* 1. Sun Layer (Rises and scrubs down with scroll) */}
          <div
            ref={sunParallaxRef}
            className="absolute top-12 start-1/2 -translate-x-1/2 will-change-transform pointer-events-none"
          >
            <div
              ref={sunRef}
              className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[var(--color-sun)] pointer-events-none will-change-transform"
              style={{
                boxShadow: '0 0 60px rgba(253, 183, 22, 0.45)',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Natural Tones Offset Arch Shadow */}
          <div
            ref={shadowParallaxRef}
            className="absolute w-64 sm:w-76 md:w-84 h-[440px] sm:h-[500px] rounded-t-[999px] rounded-b-[24px] bg-[var(--color-dust)] opacity-25 transform translate-x-4 translate-y-4 pointer-events-none will-change-transform"
            aria-hidden="true"
          />

          {/* 2. Southern Arch Frame (Dust / Cream warmth with Natural Tones border) */}
          <div
            ref={archParallaxRef}
            className="relative will-change-transform flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              ref={archRef}
              className="relative w-64 sm:w-76 md:w-84 h-[440px] sm:h-[500px] rounded-t-[999px] rounded-b-[24px] bg-[var(--color-dust)] border-[10px] sm:border-[12px] border-white/35 shadow-2xl overflow-hidden backdrop-blur-none flex flex-col justify-end will-change-transform"
            >
              {/* Subtle warm gradient sheen */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[var(--color-maroon)]/30 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Minimal sea water horizon in SVG with DrawSVG stroke lines */}
              <svg
                viewBox="0 0 900 80"
                className="absolute bottom-0 inset-x-0 w-full h-20 pointer-events-none overflow-visible"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                {/* Coastal wave stroke drawn via DrawSVG */}
                <path
                  ref={waveStrokeRef}
                  d="M 0 40 C 150 18, 300 58, 450 38 C 600 18, 750 52, 900 38"
                  stroke="var(--color-gold)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  ref={secondaryWaveStrokeRef}
                  d="M 0 55 C 160 35, 320 68, 480 48 C 640 28, 780 62, 900 50"
                  stroke="var(--color-seaglass)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  ref={wavePathRef}
                  d="M 0 45 C 150 58, 300 32, 450 45 C 600 58, 750 32, 900 45 L 900 80 L 0 80 Z"
                  fill="var(--color-seaglass)"
                  opacity="0.3"
                />
              </svg>
            </div>
          </div>

          {/* 3. Hero RTD Cold Brew Bottle SVG (Hero Product) */}
          <div
            ref={bottleParallaxRef}
            className="absolute z-20 flex items-center justify-center will-change-transform pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              ref={bottleRef}
              className="relative w-52 sm:w-60 md:w-64 h-[340px] sm:h-[400px] flex items-center justify-center drop-shadow-2xl will-change-transform pointer-events-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src="/assets/images/hero-bottle.webp"
                alt="بطری شیشه‌ای SEA BREW پر از نوشیدنی قهوه سرد، با برچسب رسمی برند"
                width={494}
                height={967}
                decoding="async"
                className="h-full w-full object-contain select-none"
              />
              {/* Glass animation: subtle edge glow + diagonal light sweep,
                  both masked to the bottle silhouette so light only shows
                  on the glass, never on the dark area around it. */}
              <div
                className="absolute inset-0 pointer-events-none bottle-edge-glow"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 pointer-events-none bottle-shine"
                aria-hidden="true"
              />
          </div>
        </div>
      </div>
    </div>

      {/* Signature TideLine at the bottom of Hero */}
      <div className="w-full mt-8">
        <TideLine sunPosition={50} color="var(--color-gold)" />
      </div>
    </section>
  );
};
