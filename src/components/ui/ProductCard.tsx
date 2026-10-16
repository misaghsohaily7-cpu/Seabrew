import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';

export interface Product {
  id: string;
  accent: string;
  name: string;
  tagline: string;
  image: string;
  ingredients: string[];
}

// Bubbles sit inside the visible lower part of the drink (the frame is calibrated,
// so every bottle occupies the same spot in the image)
const HOVER_BUBBLES = [
  { x: 46, y: 84, s: 6, d: 0.0, dur: 2.7 },
  { x: 53, y: 86, s: 4, d: 0.5, dur: 3.1 },
  { x: 49, y: 81, s: 5, d: 1.1, dur: 2.5 },
  { x: 57, y: 85, s: 3.5, d: 1.6, dur: 3.3 },
  { x: 43, y: 87, s: 4.5, d: 2.0, dur: 2.9 },
  { x: 55, y: 80, s: 3, d: 2.4, dur: 3.0 },
];

interface ProductCardProps {
  product: Product;
  index: number;
}

/**
 * ProductCard — the single, reusable product template.
 * Every SEA BREW product renders through this exact component with the same
 * fixed form (arch panel + name + volume + ingredients), so new products are
 * added purely as data entries in `content.ts` (productList).
 *
 * Motion: scroll-triggered stagger entrance (clip + rise) + CSS-only hover
 * (lift, gold ring, image zoom, ingredient highlight).
 */
export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMotionPlugins();
    if (prefersReducedMotion() || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          opacity: 0,
          y: 48,
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'tide',
          delay: (index % 3) * 0.04,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 99%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col rounded-t-[999px] rounded-b-[28px] bg-[var(--color-ink)] text-[var(--color-cream)] border border-[var(--color-gold)]/25 overflow-hidden shadow-xl transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-[var(--color-gold)]/70 hover:shadow-[0_24px_60px_rgba(167,128,64,0.28)]"
    >
      {/* Label panel — the product's face, arch-topped like the brand language */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={product.image}
          alt={`برچسب رسمی محصول ${product.name} — ${product.persianName}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
        />
        {/* Soft bottom fade into the card body */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--color-ink)] to-transparent pointer-events-none" />

        {/* Hover animation — bubbles rising inside the drink */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        >
          {HOVER_BUBBLES.map((b, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/50 bottle-bubble"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.s}px`,
                height: `${b.s}px`,
                animationDelay: `${b.d}s`,
                animationDuration: `${b.dur}s`,
              }}
            />
          ))}
        </div>

        {/* Fixed 400cc badge — one identical design & position on every product */}
        <span className="absolute bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[var(--color-ink)]/85 backdrop-blur-xs border border-[var(--color-gold)]/45 text-[10px] font-bold tracking-wider text-[var(--color-sun)] whitespace-nowrap leading-none">
          ۴۰۰ سی‌سی
        </span>
      </div>

      {/* Card body — flex column so every order button lands on the same line */}
      <div className="flex flex-1 flex-col items-center text-center px-6 sm:px-7 pb-7 pt-1 -mt-6 relative z-10">
        {/* Sun dot + name */}
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-sun)] shadow-[0_0_10px_rgba(253,183,22,0.7)] mb-3" aria-hidden="true" />
        <h3 className="text-2xl sm:text-3xl font-black tracking-wide leading-none mb-3">
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="text-xs sm:text-[13px] font-medium text-[var(--color-cream)]/70 leading-relaxed mb-5 max-w-[26ch]">
          {product.tagline}
        </p>

        {/* Ingredients */}
        <div className="border-t border-[var(--color-gold)]/25 pt-4 w-full">
          <div className="text-[10px] font-bold text-[var(--color-gold)] mb-2.5 uppercase tracking-widest">
            ترکیبات
          </div>
          <ul className="flex flex-wrap justify-center gap-1.5">
            {product.ingredients.map((ing, i) => (
              <li
                key={i}
                className="px-2.5 py-1 rounded-full bg-[var(--color-maroon)]/25 border border-[var(--color-gold)]/30 text-[11px] font-semibold text-[var(--color-cream)]/90 transition-colors duration-300 group-hover:border-[var(--color-gold)]/55"
              >
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Order link — pinned to the card bottom so all cards align */}
        <div className="mt-auto pt-5">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold leading-none text-[var(--color-sun)] hover:text-[var(--color-cream)] transition-colors duration-300 rounded-full px-4 py-2 border border-[var(--color-gold)]/35 hover:border-[var(--color-sun)]/70 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
            aria-label={`سفارش محصول ${product.name}`}
          >
            <span>سفارش</span>
            <span aria-hidden="true">←</span>
          </a>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
