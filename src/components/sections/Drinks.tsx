import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { ProductCard } from '../ui/ProductCard';
import { InkBeanStem } from '../ui/InkPattern';

/**
 * Products section — renders the full product lineup through the single
 * ProductCard template. Adding a product = adding one entry to
 * `siteContent.productList` in content.ts; the form stays fixed.
 */
export const Drinks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion()) return;

    // Header reveal: quick staggered rise of tag / heading / subheading
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'tide',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 97%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  return (
    <section
      id="drinks"
      ref={sectionRef}
      className="relative w-full bg-[var(--color-dust)] py-24 sm:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--color-dust) 0%, var(--color-dust-light) 50%, var(--color-dust) 100%)',
      }}
      aria-label="بخش محصولات SEA BREW"
    >
      {/* Section header */}
      <div className="max-w-[1440px] mx-auto px-[6vw] mb-14 sm:mb-20">
        <div ref={headerRef} className="flex flex-col items-start max-w-2xl">
          <span className="text-xs sm:text-sm font-bold text-[var(--color-maroon)] mb-3 flex items-center gap-2">
            <InkBeanStem className="w-4 h-4 text-[var(--color-gold)]" />
            <span>{siteContent.products.sectionTag}</span>
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[var(--color-ink)] mb-4 leading-tight">
            {siteContent.products.heading}
          </h2>
          <p className="text-base sm:text-lg font-medium text-[var(--color-ink)]/80 leading-relaxed">
            {siteContent.products.subheading}
          </p>
        </div>
      </div>

      {/* Product grid — one template, all products */}
      <div className="max-w-[1440px] mx-auto px-[6vw]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {siteContent.productList.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
