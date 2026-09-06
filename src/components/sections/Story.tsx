import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { InkCoffeeBranch, InkBeanStem, InkSeaWave } from '../ui/InkPattern';

export const Story: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const chapter1Ref = useRef<HTMLDivElement>(null);
  const chapter2Ref = useRef<HTMLDivElement>(null);
  const chapter3Ref = useRef<HTMLDivElement>(null);
  const darkTransitionPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 0. Section header staggered reveal (tag, heading)
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

      // 1. Chapters line-by-line reveal + golden SVG DrawSVG
      const chapters = [chapter1Ref.current, chapter2Ref.current, chapter3Ref.current].filter(
        Boolean
      );

      gsap.fromTo(
        chapters,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.2,
          ease: 'tide',
          scrollTrigger: {
            trigger: chapters[0],
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Full-width ink panel with arch clip-path rising from bottom
      if (darkTransitionPanelRef.current) {
        gsap.fromTo(
          darkTransitionPanelRef.current,
          {
            clipPath: 'ellipse(120% 0% at 50% 100%)',
            opacity: 0,
          },
          {
            clipPath: 'ellipse(120% 100% at 50% 100%)',
            opacity: 1,
            ease: 'pour',
            scrollTrigger: {
              trigger: darkTransitionPanelRef.current,
              start: 'top 90%',
              end: 'bottom bottom',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
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
        background: 'linear-gradient(180deg, #FFFADE 0%, #C9B8B6 70%, #161617 100%)',
      }}
      aria-label="روایت سه فصل برند SEA BREW"
    >
      <div className="max-w-[1440px] mx-auto px-[6vw] mb-24">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {siteContent.story.chapters.map((chap, idx) => {
            const chapRefs = [chapter1Ref, chapter2Ref, chapter3Ref];
            return (
              <div
                key={chap.id}
                ref={chapRefs[idx]}
                className="relative rounded-t-[999px] rounded-b-[24px] bg-[#FFFADE]/80 border border-[#A78040]/30 p-8 pt-16 flex flex-col items-center text-center shadow-sm hover:border-[#A78040] transition-colors duration-300"
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
                <p className="text-sm font-medium text-[#161617]/80 leading-loose">
                  {chap.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrative Transition to Darkness: Full-width Ink Panel with Arch Clip-Path */}
      <div
        ref={darkTransitionPanelRef}
        className="w-full h-36 md:h-48 bg-[#161617] will-change-transform"
        aria-hidden="true"
      />
    </section>
  );
};
