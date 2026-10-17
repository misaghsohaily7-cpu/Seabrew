import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { InkCoffeeBranch, InkBeanStem, InkSeaWave } from '../ui/InkPattern';

const chapterIcons = [
  <InkCoffeeBranch className="w-12 h-12 text-[var(--color-lower-gold)]" color="var(--color-lower-gold)" strokeWidth={1.8} />,
  <InkBeanStem className="w-12 h-12 text-[var(--color-lower-gold)]" color="var(--color-lower-gold)" strokeWidth={1.8} />,
  <InkSeaWave className="w-16 h-8 text-[var(--color-lower-gold)]" color="var(--color-lower-gold)" strokeWidth={1.8} />,
];

const chapterNumbers = ['۰۱', '۰۲', '۰۳'];

export const Story: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const chaptersContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = chaptersContainerRef.current
        ? Array.from(chaptersContainerRef.current.children)
        : [];
      const revealTargets = [headerRef.current, ...cards].filter(
        (element): element is HTMLElement => element instanceof HTMLElement
      );

      gsap.fromTo(
        revealTargets,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="w-full bg-[var(--color-lower-surface)] px-[6vw] py-24 sm:py-28 text-[var(--color-lower-text)]"
      aria-label="روایت سه فصل برند SEA BREW"
    >
      <div className="max-w-[1200px] mx-auto">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold text-[var(--color-lower-accent)] block mb-4">
            {siteContent.story.sectionTag}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-lower-text)]">
            {siteContent.story.heading}
          </h2>
          <span
            className="block w-12 h-px bg-[var(--color-lower-gold)]/70 mx-auto mt-6"
            aria-hidden="true"
          />
        </div>

        <div
          ref={chaptersContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {siteContent.story.chapters.map((chapter, index) => (
            <article
              key={chapter.id}
              className="h-full rounded-2xl border border-[var(--color-lower-gold)]/20 bg-[var(--color-lower-card)] p-6 sm:p-8 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-lower-gold)]/55"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-sm text-[var(--color-lower-accent)]">
                  {chapterNumbers[index]}
                </span>
                <span className="w-14 h-14 rounded-full bg-[var(--color-lower-gold)]/10 flex items-center justify-center">
                  {chapterIcons[index]}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[var(--color-lower-text)] mb-3">
                {chapter.title}
              </h3>
              <p className="text-sm font-bold text-[var(--color-lower-lead)] leading-relaxed mb-3">
                {chapter.lead}
              </p>
              <p className="text-sm font-medium text-[var(--color-lower-muted)] leading-8">
                {chapter.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
