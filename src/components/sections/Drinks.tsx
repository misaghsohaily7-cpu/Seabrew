import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { BrandButton } from '../ui/Button';
import { InkBeanStem } from '../ui/InkPattern';
import { BotanicalBorder } from '../ui/BotanicalBorders';

export const Drinks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const bottle1Ref = useRef<HTMLDivElement>(null);
  const bottle2Ref = useRef<HTMLDivElement>(null);

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // Smooth layout expansion and reordering via GSAP Flip Plugin
  const handleSelectCard = (index: number) => {
    if (activeCardIndex === index) return;
    if (prefersReducedMotion()) {
      setActiveCardIndex(index);
      return;
    }

    const cards = [card1Ref.current, card2Ref.current].filter(Boolean);
    const state = Flip.getState(cards, {
      props: 'transform,boxShadow',
    });

    setActiveCardIndex(index);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.65,
        ease: 'tide',
        scale: true,
        nested: true,
      });
    });
  };

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia(sectionRef);

    // Desktop: Pinned scrub + velocity skew + subtle bottle levitation
    mm.add('(min-width: 1024px)', () => {
      if (trackRef.current && sectionRef.current) {
        gsap.to(trackRef.current, {
          xPercent: -32,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=1200',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const velocity = self.getVelocity();
              const skew = Math.max(-2, Math.min(2, velocity / 500));
              gsap.to([card1Ref.current, card2Ref.current], {
                skewX: skew,
                duration: 0.2,
                ease: 'tide',
                overwrite: 'auto',
              });
            },
          },
        });

        // Bottle parallax floating
        gsap.to(bottle1Ref.current, {
          y: -40,
          rotate: 1.8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=1200',
            scrub: 1,
          },
        });

        gsap.to(bottle2Ref.current, {
          y: -50,
          rotate: -1.8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=1200',
            scrub: 1.2,
          },
        });
      }
    });

    // Mobile & Tablet: Native vertical scroll (zero pinning or horizontal lock)
    mm.add('(max-width: 1023px)', () => {
      gsap.fromTo(
        [card1Ref.current, card2Ref.current],
        { y: 40, opacity: 0.2 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.2,
          ease: 'tide',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    // Common: Entrance reveal
    gsap.fromTo(
      [card1Ref.current, card2Ref.current],
      {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        opacity: 0.5,
      },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        opacity: 1,
        duration: 1.2,
        stagger: 0.25,
        ease: 'tide',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );

    // Staggered reveal for section header
    if (headerRef.current) {
      const headerElements = headerRef.current.children;
      gsap.fromTo(
        headerElements,
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

    return () => mm.revert();
  }, []);

  return (
    <section
      id="drinks"
      ref={sectionRef}
      className="relative w-full bg-[#C9B8B6] py-24 sm:py-32 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #C9B8B6 0%, #D4C7C5 50%, #C9B8B6 100%)',
      }}
      aria-label="بخش معرفی نوشیدنی‌های SEA BREW"
    >
      <div className="max-w-[1440px] mx-auto px-[6vw] mb-12 sm:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div ref={headerRef} className="flex flex-col items-start max-w-2xl">
            <span className="text-xs sm:text-sm font-bold text-[#825F27] mb-3 flex items-center gap-2">
              <InkBeanStem className="w-4 h-4 text-[#A78040]" />
              <span>{siteContent.drinks.sectionTag}</span>
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#161617] mb-4">
              {siteContent.drinks.heading}
            </h2>
            <p className="text-base sm:text-lg font-medium text-[#161617]/80 leading-relaxed">
              {siteContent.drinks.subheading}
            </p>
          </div>

          {/* Interactive Flip Tab Switcher */}
          <div
            className="flex items-center gap-2 p-1.5 rounded-full bg-[#161617]/10 border border-[#825F27]/30 backdrop-blur-sm self-start sm:self-end"
            role="tablist"
            aria-label="انتخاب لاین نوشیدنی"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCardIndex === 0}
              onClick={() => handleSelectCard(0)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeCardIndex === 0
                  ? 'bg-[#161617] text-[#FFFADE] shadow-lg ring-1 ring-[#A78040]'
                  : 'text-[#161617]/75 hover:text-[#161617]'
              }`}
            >
              {siteContent.drinks.lines[0].lineTitle}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeCardIndex === 1}
              onClick={() => handleSelectCard(1)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeCardIndex === 1
                  ? 'bg-[#FFFADE] text-[#161617] shadow-lg border border-[#825F27]/30 ring-1 ring-[#FDB716]'
                  : 'text-[#161617]/75 hover:text-[#161617]'
              }`}
            >
              {siteContent.drinks.lines[1].lineTitle}
            </button>
          </div>
        </div>
      </div>

      {/* Cards Container: Responsive - horizontal scrub on desktop, vertical stack on mobile */}
      <div className="w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-[6vw] max-w-[1440px] mx-auto items-stretch will-change-transform"
        >
          {/* Card 1: خط دم‌آوری تخصصی (Apothecary Green Bottle / Dark Arch Card) */}
          <div
            ref={card1Ref}
            onClick={() => handleSelectCard(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectCard(0);
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={activeCardIndex === 0}
            aria-label={`لاین نوشیدنی: ${siteContent.drinks.lines[0].title}`}
            className={`group relative min-w-[320px] lg:min-w-[460px] rounded-t-[999px] rounded-b-[28px] bg-[#161617] text-[#FFFADE] border p-8 sm:p-12 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 will-change-transform cursor-pointer ${
              activeCardIndex === 0
                ? 'lg:flex-[1.25] border-[#A78040] ring-2 ring-[#A78040]/50 shadow-[0_20px_50px_rgba(167,128,64,0.2)]'
                : 'lg:flex-[0.88] border-[#A78040]/25 opacity-90 hover:opacity-100'
            }`}
            style={{ minHeight: '660px' }}
          >
            {/* Ambient Background Warm Halo */}
            <div className="absolute top-1/3 start-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#825F27]/20 blur-3xl pointer-events-none" />

            {/* Top Arch Motif & Line Header */}
            <div className="flex flex-col items-center text-center z-10 pt-6">
              <span className="px-4 py-1 rounded-full border border-[#A78040] text-xs font-bold text-[#A78040] mb-3 uppercase tracking-wider">
                {siteContent.drinks.lines[0].lineTitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#FFFADE] mb-1">
                {siteContent.drinks.lines[0].title}
              </h3>
              <p className="text-xs font-medium text-[#A78040] max-w-xs mt-1">
                {siteContent.drinks.lines[0].tagline}
              </p>
            </div>

            {/* Realistic Olive Green Glass Apothecary Bottle SVG (Authentic presentation model) */}
            <div
              ref={bottle1Ref}
              className="relative my-6 w-44 sm:w-52 h-72 sm:h-80 mx-auto flex items-center justify-center will-change-transform group-hover:scale-105 transition-transform duration-500"
            >
              <svg viewBox="0 0 160 300" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none">
                <defs>
                  {/* Green glass gradient */}
                  <linearGradient id="greenGlassGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1E2B1B" />
                    <stop offset="35%" stopColor="#2E4429" />
                    <stop offset="65%" stopColor="#3C5734" />
                    <stop offset="100%" stopColor="#1A2518" />
                  </linearGradient>
                  {/* Silver Cap gradient */}
                  <linearGradient id="silverCapGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8A9599" />
                    <stop offset="50%" stopColor="#E6ECED" />
                    <stop offset="100%" stopColor="#7E898D" />
                  </linearGradient>
                </defs>

                {/* Bottle Cap (Ribbed Silver Cap) */}
                <rect x="62" y="10" width="36" height="24" rx="3" fill="url(#silverCapGrad)" stroke="#5B6568" strokeWidth="1" />
                <line x1="68" y1="10" x2="68" y2="34" stroke="#485356" strokeWidth="1" />
                <line x1="74" y1="10" x2="74" y2="34" stroke="#485356" strokeWidth="1" />
                <line x1="80" y1="10" x2="80" y2="34" stroke="#485356" strokeWidth="1" />
                <line x1="86" y1="10" x2="86" y2="34" stroke="#485356" strokeWidth="1" />
                <line x1="92" y1="10" x2="92" y2="34" stroke="#485356" strokeWidth="1" />

                {/* Bottle Neck & Rounded Heavy Shoulders */}
                <path
                  d="M 64 34 L 64 68 Q 64 88, 30 106 Q 16 116, 16 138 L 16 264 A 18 18 0 0 0 34 282 L 126 282 A 18 18 0 0 0 144 264 L 144 138 Q 144 116, 130 106 Q 96 88, 96 68 L 96 34 Z"
                  fill="url(#greenGlassGrad)"
                  stroke="#161617"
                  strokeWidth="2"
                />

                {/* Glass reflections */}
                <path d="M 24 135 L 24 265" stroke="#FFF" strokeWidth="3.5" strokeOpacity="0.3" strokeLinecap="round" />
                <path d="M 32 145 L 32 255" stroke="#FFF" strokeWidth="1" strokeOpacity="0.2" strokeLinecap="round" />

                {/* THE AUTHENTIC LABEL (Black with botanical border and center gold arch) */}
                <g>
                  {/* Label background plate */}
                  <rect x="22" y="130" width="116" height="124" rx="6" fill="#161617" stroke="#A78040" strokeWidth="1.2" />

                  {/* Left Botanical Border */}
                  <g transform="translate(25, 134) scale(0.48, 0.52)">
                    <BotanicalBorder color="#A78040" />
                  </g>

                  {/* Right Botanical Border (mirrored) */}
                  <g transform="translate(133, 134) scale(-0.48, 0.52)">
                    <BotanicalBorder color="#A78040" />
                  </g>

                  {/* Center Golden Arch Window */}
                  <path
                    d="M 46 142 Q 80 132, 114 142 L 114 242 Q 80 248, 46 242 Z"
                    fill="#825F27"
                    opacity="0.9"
                  />

                  {/* Mini SeaBrew Logo Mark */}
                  <circle cx="95" cy="154" r="5" fill="#FDB716" />
                  <path d="M 65 158 C 70 152, 78 152, 85 157 C 91 161, 95 163, 102 161" stroke="#161617" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M 70 166 C 75 172, 82 174, 90 172" stroke="#161617" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                  {/* Label Text from Presentation */}
                  <text x="80" y="182" textAnchor="middle" fill="#161617" fontSize="8.5" fontWeight="900" fontFamily="'Estedad'">
                    SEA BREW
                  </text>
                  <text x="80" y="196" textAnchor="middle" fill="#FFFADE" fontSize="6" fontWeight="700" letterSpacing="0.5">
                    ingredients:
                  </text>
                  <text x="80" y="208" textAnchor="middle" fill="#FFFADE" fontSize="5" opacity="0.9">
                    Pour.overcoffee
                  </text>
                  <text x="80" y="217" textAnchor="middle" fill="#FFFADE" fontSize="5" opacity="0.9">
                    red ginseng
                  </text>
                  <text x="80" y="226" textAnchor="middle" fill="#FFFADE" fontSize="5" opacity="0.9">
                    maca root
                  </text>
                  <text x="80" y="235" textAnchor="middle" fill="#FFFADE" fontSize="5" opacity="0.9">
                    honey
                  </text>
                </g>
              </svg>
            </div>

            {/* Flavor list & CTA */}
            <div className="z-10 mt-auto border-t border-[#A78040]/30 pt-5">
              <div className="text-xs font-bold text-[#A78040] mb-2.5">ترکیبات اصیل:</div>
              <ul className="flex flex-wrap gap-1.5 mb-5">
                {siteContent.drinks.lines[0].flavors.map((flavor, idx) => (
                  <li
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-[#825F27]/30 border border-[#A78040]/40 text-[11px] font-semibold text-[#FFFADE]"
                  >
                    {flavor}
                  </li>
                ))}
              </ul>
              <BrandButton
                variant="inverse"
                className="w-full"
                asAnchor
                href="#contact"
              >
                {siteContent.drinks.lines[0].ctaText}
              </BrandButton>
            </div>
          </div>

          {/* Card 2: خط تازه ساحلی (Clear Glass Bottle / Cream Arch Card) */}
          <div
            ref={card2Ref}
            onClick={() => handleSelectCard(1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectCard(1);
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={activeCardIndex === 1}
            aria-label={`لاین نوشیدنی: ${siteContent.drinks.lines[1].title}`}
            className={`group relative min-w-[320px] lg:min-w-[460px] rounded-t-[999px] rounded-b-[28px] bg-[#FFFADE] text-[#161617] border p-8 sm:p-12 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 will-change-transform cursor-pointer ${
              activeCardIndex === 1
                ? 'lg:flex-[1.25] border-[#825F27] ring-2 ring-[#FDB716]/60 shadow-[0_20px_50px_rgba(253,183,22,0.2)]'
                : 'lg:flex-[0.88] border-[#A78040]/30 opacity-90 hover:opacity-100'
            }`}
            style={{ minHeight: '660px' }}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 start-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#FDB716]/15 blur-3xl pointer-events-none" />

            {/* Top Arch Motif & Line Header */}
            <div className="flex flex-col items-center text-center z-10 pt-6">
              <span className="px-4 py-1 rounded-full border border-[#825F27] text-xs font-bold text-[#825F27] mb-3 uppercase tracking-wider">
                {siteContent.drinks.lines[1].lineTitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#161617] mb-1">
                {siteContent.drinks.lines[1].title}
              </h3>
              <p className="text-xs font-medium text-[#825F27] max-w-xs mt-1">
                {siteContent.drinks.lines[1].tagline}
              </p>
            </div>

            {/* Realistic Clear Glass Fresh Brew Bottle SVG with illustrated label and neck seal */}
            <div
              ref={bottle2Ref}
              className="relative my-6 w-44 sm:w-52 h-72 sm:h-80 mx-auto flex items-center justify-center will-change-transform group-hover:scale-105 transition-transform duration-500"
            >
              <svg viewBox="0 0 160 300" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none">
                <defs>
                  {/* Peach / Fresh Nectar Liquid Gradient */}
                  <linearGradient id="peachNectarGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C95F24" />
                    <stop offset="40%" stopColor="#E88746" />
                    <stop offset="75%" stopColor="#F5A362" />
                    <stop offset="100%" stopColor="#BD541B" />
                  </linearGradient>

                  {/* Clear Glass Sheen */}
                  <linearGradient id="clearGlassSheen" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFF" stopOpacity="0.6" />
                    <stop offset="25%" stopColor="#FFF" stopOpacity="0.1" />
                    <stop offset="85%" stopColor="#FFF" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#FFF" stopOpacity="0.5" />
                  </linearGradient>
                </defs>

                {/* Neck Seal: "Enjoy this Moment" in soft rose-peach */}
                <rect x="58" y="24" width="44" height="42" rx="2" fill="#E89F8B" stroke="#161617" strokeWidth="1" />
                <text x="80" y="44" textAnchor="middle" fill="#FFFADE" fontSize="5.5" fontWeight="800" fontFamily="sans-serif">
                  Enjoy this
                </text>
                <text x="80" y="54" textAnchor="middle" fill="#FFFADE" fontSize="5.5" fontWeight="800" fontFamily="sans-serif">
                  Moment
                </text>

                {/* Black Screw Cap */}
                <rect x="60" y="10" width="40" height="18" rx="2" fill="#161617" stroke="#333" strokeWidth="1" />
                <line x1="66" y1="10" x2="66" y2="28" stroke="#555" strokeWidth="1" />
                <line x1="73" y1="10" x2="73" y2="28" stroke="#555" strokeWidth="1" />
                <line x1="80" y1="10" x2="80" y2="28" stroke="#555" strokeWidth="1" />
                <line x1="87" y1="10" x2="87" y2="28" stroke="#555" strokeWidth="1" />
                <line x1="94" y1="10" x2="94" y2="28" stroke="#555" strokeWidth="1" />

                {/* Sleek Clear Glass Bottle Body filled with glowing nectar */}
                <path
                  d="M 62 66 L 62 82 Q 62 104, 26 122 Q 18 128, 18 146 L 18 266 A 16 16 0 0 0 34 282 L 126 282 A 16 16 0 0 0 142 266 L 142 146 Q 142 128, 134 122 Q 98 104, 98 82 L 98 66 Z"
                  fill="url(#peachNectarGrad)"
                  stroke="#161617"
                  strokeWidth="2.2"
                />

                {/* Glass reflection sheen highlights */}
                <path d="M 24 140 L 24 268" stroke="#FFF" strokeWidth="4" strokeOpacity="0.45" strokeLinecap="round" />
                <path d="M 32 148 L 32 258" stroke="#FFF" strokeWidth="1.2" strokeOpacity="0.25" strokeLinecap="round" />

                {/* THE AUTHENTIC CREAM LABEL WITH ILLUSTRATED TUMBLER & STRAWBERRY */}
                <g>
                  {/* Label body */}
                  <rect x="24" y="142" width="112" height="118" rx="8" fill="#FFFADE" stroke="#161617" strokeWidth="1.4" />

                  {/* SeaBrew Logo Mark */}
                  <circle cx="94" cy="154" r="4.5" fill="#FDB716" />
                  <path d="M 68 158 C 73 153, 79 153, 85 157 C 90 161, 94 162, 100 160" stroke="#161617" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path d="M 72 165 C 76 170, 82 171, 88 170" stroke="#161617" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <text x="80" y="176" textAnchor="middle" fill="#161617" fontSize="7" fontWeight="900">
                    SEA BREW
                  </text>

                  {/* Illustrated Tumbler Glass with Strawberry & Leaves (Page 9 art) */}
                  <g transform="translate(80, 198) scale(0.38)">
                    {/* Botanical leaves behind glass */}
                    <path d="M -50 0 Q -70 -20, -60 -40 Q -40 -30, -30 0" fill="#7FA096" stroke="#161617" strokeWidth="2" />
                    <path d="M 30 0 Q 60 -20, 50 -40 Q 30 -30, 20 0" fill="#7FA096" stroke="#161617" strokeWidth="2" />

                    {/* Tumbler Outline */}
                    <path d="M -35 -40 L -25 40 L 25 40 L 35 -40 Z" fill="#FFFADE" stroke="#161617" strokeWidth="3" />
                    {/* Ice cubes inside */}
                    <polygon points="-15,10 0,5 5,25 -10,28" fill="#FFF" stroke="#161617" strokeWidth="2" />
                    {/* Strawberry inside */}
                    <path d="M 5 -10 C 15 -10, 20 5, 5 18 C -10 5, -5 -10, 5 -10 Z" fill="#E74C3C" stroke="#161617" strokeWidth="2" />
                  </g>

                  {/* Golden Pill: "Sea Brew drink" */}
                  <rect x="42" y="218" width="76" height="12" rx="6" fill="#FDB716" />
                  <text x="80" y="226.5" textAnchor="middle" fill="#161617" fontSize="5.5" fontWeight="800">
                    Sea Brew drink
                  </text>

                  {/* Ingredients caption */}
                  <text x="80" y="238" textAnchor="middle" fill="#825F27" fontSize="4.5" fontWeight="700">
                    ingredient:
                  </text>
                  <text x="80" y="246" textAnchor="middle" fill="#161617" fontSize="4.2" opacity="0.8">
                    jambolan friut , matcha , strawberry , honey
                  </text>
                </g>
              </svg>
            </div>

            {/* Flavor list & CTA */}
            <div className="z-10 mt-auto border-t border-[#A78040]/30 pt-5">
              <div className="text-xs font-bold text-[#825F27] mb-2.5">ترکیبات اصیل:</div>
              <ul className="flex flex-wrap gap-1.5 mb-5">
                {siteContent.drinks.lines[1].flavors.map((flavor, idx) => (
                  <li
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-[#C9B8B6]/40 border border-[#A78040]/40 text-[11px] font-semibold text-[#161617]"
                  >
                    {flavor}
                  </li>
                ))}
              </ul>
              <BrandButton
                variant="primary"
                className="w-full"
                asAnchor
                href="#contact"
              >
                {siteContent.drinks.lines[1].ctaText}
              </BrandButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
