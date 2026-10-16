import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { InkCoffeeBranch, InkBeanStem, InkSeaWave } from '../ui/InkPattern';

export const Story: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const nightOverlayRef = useRef<HTMLDivElement>(null);
  const chaptersContainerRef = useRef<HTMLDivElement>(null);
  const darkTransitionPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia(sectionRef);

    // Desktop: keep the day-to-night transition tied directly to scroll. Numeric
    // scrub smoothing adds a visible catch-up delay on top of ScrollSmoother.
    mm.add('(min-width: 768px)', () => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.06,
            ease: 'tide',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 96%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (chaptersContainerRef.current) {
        gsap.fromTo(
          chaptersContainerRef.current.children,
          { opacity: 0, y: 48, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.05,
            ease: 'tide',
            scrollTrigger: {
              trigger: chaptersContainerRef.current,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (nightOverlayRef.current && sectionRef.current) {
        gsap.fromTo(
          nightOverlayRef.current,
          { opacity: 0 },
          {
            opacity: 0.85,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 30%',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
      }

      if (darkTransitionPanelRef.current) {
        gsap.fromTo(
          darkTransitionPanelRef.current,
          {
            scaleY: 0,
            opacity: 0,
            transformOrigin: '50% 100%',
          },
          {
            scaleY: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: darkTransitionPanelRef.current,
              start: 'top 95%',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
      }
    });

    // Mobile: Lightweight vertical fade-ins without heavy clipPath recalculation
    mm.add('(max-width: 767px)', () => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'tide',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 97%',
            },
          }
        );
      }

      if (chaptersContainerRef.current) {
        gsap.fromTo(
          chaptersContainerRef.current.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'tide',
            scrollTrigger: {
              trigger: chaptersContainerRef.current,
              start: 'top 96%',
            },
          }
        );
      }

      if (darkTransitionPanelRef.current) {
        gsap.fromTo(
          darkTransitionPanelRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: 'tide',
            scrollTrigger: {
              trigger: darkTransitionPanelRef.current,
              start: 'top 97%',
            },
          }
        );
      }
    });

    return () => mm.revert();
  }, []);

  const chapterIcons = [
    <InkCoffeeBranch className="w-12 h-12 text-[#A78040]" color="#A78040" strokeWidth={1.8} />,
    <InkBeanStem className="w-12 h-12 text-[#A78040]" color="#A78040" strokeWidth={1.8} />,
    <InkSeaWave className="w-24 h-8 text-[#A78040]" color="#A78040" strokeWidth={1.8} />,
  ];

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative w-full pt-28 pb-0 overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #FFFADE 0%, #C9B8B6 60%, #161617 100%)',
      }}
      aria-label="روایت سه فصل برند SEA BREW"
    >
      {/* Day to Night Ambient Light Transition Layer */}
      <div
        ref={nightOverlayRef}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#2b241e]/50 to-[#161617] opacity-0 will-change-[opacity]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-[6vw] mb-24">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold text-[#825F27] uppercase tracking-widest block mb-3">
            {siteContent.story.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#161617]">
            {siteContent.story.heading}
          </h2>
        </div>

        {/* 3 Story Chapters Grid */}
        <div
          ref={chaptersContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {siteContent.story.chapters.map((chap, idx) => (
            <div
              key={chap.id}
              className="relative rounded-t-[999px] rounded-b-[24px] bg-[#FFFADE]/90 border border-[#A78040]/30 p-8 pt-16 flex flex-col items-center text-center shadow-sm hover:border-[#A78040] hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              {/* Golden SVG linear motif */}
              <div className="mb-6 flex items-center justify-center h-16">
                {chapterIcons[idx]}
              </div>

              {/* Chapter Title */}
              <h3 className="text-2xl font-black text-[#161617] mb-4">
                {chap.title}
              </h3>

              {/* Chapter Lead */}
              <div className="text-sm font-bold text-[#825F27] mb-3">
                {chap.lead}
              </div>

              {/* Chapter Body */}
              <p className="text-sm font-medium text-[#161617]/85 leading-loose">
                {chap.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative Transition to Darkness: transform-only arch reveal */}
      <div
        ref={darkTransitionPanelRef}
        className="w-full h-36 md:h-48 rounded-t-[50%] bg-[#161617]"
        aria-hidden="true"
      />
    </section>
  );
};
