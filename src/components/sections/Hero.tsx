import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { SunDot } from '../ui/SunDot';
import { BrandButton } from '../ui/Button';
import { TideLine } from '../ui/TideLine';
import { InkCoffeeBranch, InkLeaf } from '../ui/InkPattern';
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
  const wavePathRef = useRef<SVGPathElement>(null);

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

    const ctx = gsap.context(() => {
      // 1. Initial choreographed entrance
      const tl = gsap.timeline({
        paused: !introReady,
        defaults: { ease: 'tide' },
      });

      // Split text masked reveal (yPercent 110 -> 0)
      tl.fromTo(
        [titleLine1Ref.current, titleLine2Ref.current],
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.15 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          sunRef.current,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.0, ease: 'swell' },
          '-=0.7'
        )
        .fromTo(
          [archRef.current, bottleRef.current],
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, stagger: 0.2 },
          '-=0.8'
        )
        .fromTo(
          [ctaContainerRef.current, draftNoteRef.current],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          '-=0.5'
        );

      if (introReady) {
        tl.play();
      }

      // 2. Multi-Plane Magnetic Parallax reacting to scroll position
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4, // Smooth elastic damping for a subtle magnetic inertia
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
            y: -65,
            z: 85,
            rotateX: -7,
            rotateY: 9,
            rotateZ: 2,
            scale: 1.05,
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

      // 4. Idle levitation floating loop for hero bottle
      gsap.to(bottleRef.current, {
        y: -12,
        rotate: 1.2,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 5. Interactive Magnetic Pointer Parallax (Desktop fine pointer only)
      if (window.matchMedia('(pointer: fine)').matches) {
        const handleMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          const xFactor = (e.clientX / innerWidth - 0.5) * 2;
          const yFactor = (e.clientY / innerHeight - 0.5) * 2;

          gsap.to(sunRef.current, {
            x: xFactor * 14,
            y: yFactor * 10,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(archRef.current, {
            x: xFactor * -16,
            y: yFactor * -12,
            rotateY: xFactor * -4,
            rotateX: yFactor * 3,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(bottleRef.current, {
            x: xFactor * 26,
            rotateY: xFactor * 10,
            rotateX: -yFactor * 8,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          if (botanicalRef.current) {
            gsap.to(botanicalRef.current, {
              x: xFactor * 16,
              y: yFactor * 12,
              duration: 1.4,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [introReady]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[92vh] w-full bg-[#FFFADE] overflow-hidden flex flex-col justify-between pt-10 pb-4"
      aria-label="بخش هیرو — معرفی SEA BREW"
    >
      {/* Background Ambience: Architectural Graphic Watermark & Subtle Arch Outline */}
      <div
        ref={bgArchOutlineRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 select-none overflow-hidden will-change-transform"
        aria-hidden="true"
      >
        <div className="w-[600px] h-[850px] rounded-t-[999px] rounded-b-[32px] border border-[#A78040]/30" />
      </div>

      {/* Natural Tones Watermark Display Typography */}
      <div
        ref={watermarkRef}
        className="absolute top-1/4 -start-16 opacity-[0.035] select-none pointer-events-none tracking-tight font-black text-[clamp(6rem,18vw,16rem)] text-[#161617] leading-none will-change-transform"
        aria-hidden="true"
      >
        WARM SEA
      </div>

      {/* Ambient Coastal Dust Particles floating in sunbeams */}
      <DustParticles count={36} color="#FDB716" className="opacity-60" />

      {/* Main Grid: Typography on Right (RTL start), Bottle Visual on Left */}
      <div className="max-w-[1440px] mx-auto px-[6vw] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1 my-auto">
        {/* Text column (RTL Start) */}
        <div ref={textColParallaxRef} className="lg:col-span-7 flex flex-col items-start z-10 will-change-transform">
          {/* Subtitle tag / Origin Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span
              ref={subtitleRef}
              className="text-[#825F27] text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 border border-[#825F27] rounded-full inline-flex items-center gap-2"
            >
              <InkCoffeeBranch className="w-4 h-4 text-[#A78040]" />
              <span>{siteContent.hero.subtitle}</span>
            </span>
          </div>

          {/* Primary H1 Headline: clamp(3rem, 9vw, 8rem), Black weight */}
          <h1 className="font-black text-[clamp(2.75rem,8vw,7.5rem)] leading-[1.1] text-[#161617] mb-6 tracking-normal">
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
            className="mb-6 max-w-xl p-3.5 rounded-2xl bg-[#C9B8B6]/25 border border-[#A78040]/20 text-sm font-medium text-[#161617]/90 leading-relaxed"
          >
            {siteContent.hero.draftText}
          </div>

          {/* Natural Tones Craftsmanship Indicators */}
          <div className="mb-8 flex items-center gap-8 sm:gap-12 select-none">
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold text-[#A78040] tabular-nums leading-none">۰۱</span>
              <span className="text-xs text-[#161617]/60 font-semibold mt-1">دم‌آوری سرد</span>
            </div>
            <div className="w-px h-10 bg-[#161617]/15" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold text-[#A78040] tabular-nums leading-none">۰۲</span>
              <span className="text-xs text-[#161617]/60 font-semibold mt-1">صد در صد عربیکا</span>
            </div>
          </div>

          {/* Call to action buttons */}
          <div
            ref={ctaContainerRef}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <BrandButton
              variant="primary"
              asAnchor
              href="#drinks"
              data-magnetic="true"
            >
              {siteContent.hero.cta}
            </BrandButton>

            <a
              href="#statement"
              className="px-6 py-3 text-sm font-bold text-[#825F27] hover:text-[#161617] transition-colors rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#161617]"
              data-magnetic="true"
            >
              {siteContent.hero.scrollPrompt} ↓
            </a>
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
              stroke="#A78040"
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
              className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[#FDB716] pointer-events-none will-change-transform"
              style={{
                boxShadow: '0 0 60px rgba(253, 183, 22, 0.45)',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Natural Tones Offset Arch Shadow */}
          <div
            ref={shadowParallaxRef}
            className="absolute w-64 sm:w-76 md:w-84 h-[440px] sm:h-[500px] rounded-t-[999px] rounded-b-[24px] bg-[#C9B8B6] opacity-25 transform translate-x-4 translate-y-4 pointer-events-none will-change-transform"
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
              className="relative w-64 sm:w-76 md:w-84 h-[440px] sm:h-[500px] rounded-t-[999px] rounded-b-[24px] bg-[#C9B8B6] border-[10px] sm:border-[12px] border-white/35 shadow-2xl overflow-hidden backdrop-blur-none flex flex-col justify-end will-change-transform"
            >
              {/* Subtle warm gradient sheen */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#825F27]/30 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Minimal sea water horizon in SVG */}
              <svg
                viewBox="0 0 900 60"
                className="absolute bottom-0 inset-x-0 w-full h-16 pointer-events-none"
                preserveAspectRatio="none"
                fill="#7FA096"
                opacity="0.35"
                aria-hidden="true"
              >
                <path
                  ref={wavePathRef}
                  d="M 0 30 C 150 45, 300 15, 450 30 C 600 45, 750 15, 900 30 L 900 60 L 0 60 Z"
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
              className="w-44 sm:w-52 h-[380px] sm:h-[440px] flex items-center justify-center drop-shadow-2xl will-change-transform pointer-events-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <svg
              viewBox="0 0 160 380"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="بطری نوشیدنی شیشه‌ای قهوه آماده مصرف SEA BREW با انعکاس‌های نوری سه‌بعدی"
            >
              <defs>
                {/* Cold brew amber liquid gradient with deep 3D cylindrical lighting */}
                <linearGradient id="coldBrewLiquid" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#140d08" />
                  <stop offset="22%" stopColor="#2e1709" />
                  <stop offset="48%" stopColor="#633b14" />
                  <stop offset="72%" stopColor="#966122" />
                  <stop offset="92%" stopColor="#2c160a" />
                  <stop offset="100%" stopColor="#120b06" />
                </linearGradient>

                {/* Primary Animated Specular Beam Gradient */}
                <linearGradient id="specularBeam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFADE" stopOpacity="0" />
                  <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#FFFADE" stopOpacity="0.75" />
                  <stop offset="65%" stopColor="#FDB716" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FFFADE" stopOpacity="0" />
                </linearGradient>

                {/* Secondary Softer Refraction Gradient */}
                <linearGradient id="secondaryBeam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>

                {/* Glass Curvature Highlights */}
                <linearGradient id="glassEdgeFresnel" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity="0.2" />
                  <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.03" />
                  <stop offset="85%" stopColor="#FDB716" stopOpacity="0.05" />
                  <stop offset="96%" stopColor="#FDB716" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
                </linearGradient>

                {/* Glass Punt Base Thickness Gradient */}
                <linearGradient id="puntBaseGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                  <stop offset="40%" stopColor="#A78040" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#161617" stopOpacity="0" />
                </linearGradient>

                {/* Exact Silhouette Clip for Glass Body & Neck */}
                <clipPath id="heroBottleGlassClip">
                  <path d="M 64 34 L 64 90 Q 64 125, 26 145 L 26 340 A 18 18 0 0 0 44 358 L 116 358 A 18 18 0 0 0 134 340 L 134 145 Q 96 125, 96 90 L 96 34 Z" />
                </clipPath>
              </defs>

              {/* Bottle Cap (Golden brass ribbed cap with specular bevel) */}
              <rect x="62" y="12" width="36" height="22" rx="4" fill="#A78040" />
              <rect x="63" y="13" width="34" height="3" rx="1.5" fill="#FFFADE" opacity="0.4" />
              <line x1="68" y1="16" x2="68" y2="34" stroke="#825F27" strokeWidth="1" />
              <line x1="74" y1="16" x2="74" y2="34" stroke="#825F27" strokeWidth="1" />
              <line x1="80" y1="16" x2="80" y2="34" stroke="#825F27" strokeWidth="1" />
              <line x1="86" y1="16" x2="86" y2="34" stroke="#825F27" strokeWidth="1" />
              <line x1="92" y1="16" x2="92" y2="34" stroke="#825F27" strokeWidth="1" />

              {/* 1. Base Liquid Body with Outline */}
              <path
                d="M 64 34 L 64 90 Q 64 125, 26 145 L 26 340 A 18 18 0 0 0 44 358 L 116 358 A 18 18 0 0 0 134 340 L 134 145 Q 96 125, 96 90 L 96 34 Z"
                fill="url(#coldBrewLiquid)"
                stroke="#161617"
                strokeWidth="2.5"
              />

              {/* 2. Glass Internal Layers & Animated Specular Reflections (Clipped to Bottle) */}
              <g clipPath="url(#heroBottleGlassClip)">
                {/* Cylindrical Edge Fresnel Layer */}
                <rect x="24" y="34" width="112" height="326" fill="url(#glassEdgeFresnel)" />

                {/* Cold brew liquid meniscus at neck base */}
                <ellipse cx="80" cy="112" rx="16" ry="3" fill="#A78040" opacity="0.4" />

                {/* Primary Diagonal Animated Specular Shine Beam */}
                <g className="mix-blend-screen pointer-events-none">
                  <polygon
                    points="-80,-40 -20,-40 60,420 0,420"
                    fill="url(#specularBeam)"
                    opacity="0.85"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="-90,-60; 160,110; 260,190; 260,190"
                      keyTimes="0; 0.55; 0.75; 1"
                      dur="5.2s"
                      repeatCount="indefinite"
                    />
                  </polygon>

                  {/* Secondary Thin Trailing Optical Glint */}
                  <polygon
                    points="-110,-40 -85,-40 -5,420 -30,420"
                    fill="url(#secondaryBeam)"
                    opacity="0.6"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="-90,-60; 160,110; 260,190; 260,190"
                      keyTimes="0; 0.55; 0.75; 1"
                      dur="5.2s"
                      repeatCount="indefinite"
                    />
                  </polygon>
                </g>

                {/* Heavy Glass Bottom Punt / Base Bevel Meniscus */}
                <path
                  d="M 30 344 Q 80 338, 130 344 L 132 356 Q 80 360, 28 356 Z"
                  fill="url(#puntBaseGrad)"
                />

                {/* Refined Glass Edge Contour Highlighting (Left Rim Specular Line) */}
                <path
                  d="M 29 150 L 29 336"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />

                {/* Right Edge Golden Rim Backlight */}
                <path
                  d="M 131 150 L 131 336"
                  stroke="#FDB716"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                {/* Shoulder Curved Reflection Crescent */}
                <path
                  d="M 32 144 Q 58 126, 63 92"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <path
                  d="M 128 144 Q 102 126, 97 92"
                  stroke="#FDB716"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </g>

              {/* 3. Minimalist Label Band (Cream canvas, Ink typography, Gold borders with drop shadow) */}
              <g transform="translate(30, 175)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))">
                <rect
                  x="0"
                  y="0"
                  width="100"
                  height="115"
                  rx="6"
                  fill="#FFFADE"
                  stroke="#A78040"
                  strokeWidth="1.2"
                />
                {/* Official SeaBrew Logo Mark on Bottle Label */}
                <circle cx="68" cy="22" r="5" fill="#FDB716" />
                <path
                  d="M 36 28 C 42 21, 50 20, 56 25 C 60 29, 64 30, 72 29"
                  stroke="#161617"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 42 36 C 46 42, 53 43, 62 42"
                  stroke="#825F27"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Brand Wordmark & Subtitle */}
                <text
                  x="50"
                  y="62"
                  textAnchor="middle"
                  fontFamily="'Estedad', sans-serif"
                  fontWeight="900"
                  fontSize="11.5"
                  fill="#161617"
                  letterSpacing="1"
                >
                  SEA BREW
                </text>
                <text
                  x="50"
                  y="74"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                  fontWeight="700"
                  fontSize="4.8"
                  fill="#825F27"
                  letterSpacing="0.5"
                >
                  COFFEE & DRINKS
                </text>

                {/* Bushehr origin label */}
                <text
                  x="50"
                  y="96"
                  textAnchor="middle"
                  fontFamily="'Estedad', sans-serif"
                  fontWeight="600"
                  fontSize="7"
                  fill="#825F27"
                >
                  بوشهر • خلیج فارس
                </text>
              </g>

              {/* 4. Twinkling Sun Glint Micro-Stars on Glass */}
              {/* Shoulder sparkle */}
              <g transform="translate(42, 134)" opacity="0.8">
                <path
                  d="M 0,-5 Q 0,0 5,0 Q 0,0 0,5 Q 0,0 -5,0 Q 0,0 0,-5 Z"
                  fill="#FFFFFF"
                >
                  <animate
                    attributeName="opacity"
                    values="0.2; 1; 0.2"
                    dur="3.8s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="0.7; 1.25; 0.7"
                    dur="3.8s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              {/* Lower flank sparkle */}
              <g transform="translate(126, 318)" opacity="0.75">
                <path
                  d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z"
                  fill="#FDB716"
                >
                  <animate
                    attributeName="opacity"
                    values="0.1; 0.95; 0.1"
                    dur="4.4s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="scale"
                    values="0.6; 1.3; 0.6"
                    dur="4.4s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>

      {/* Signature TideLine at the bottom of Hero */}
      <div className="w-full mt-8">
        <TideLine sunPosition={35} color="#A78040" />
      </div>
    </section>
  );
};
