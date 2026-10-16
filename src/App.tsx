import { useState, useEffect, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Preloader } from './components/ui/Preloader';
import { CustomCursor } from './components/ui/Cursor';
import { NavBar } from './components/ui/NavBar';
import { Hero } from './components/sections/Hero';
import { Marquee } from './components/ui/Marquee';
import { Footer } from './components/ui/Footer';
import { SunScrollIndicator } from './components/ui/SunScrollIndicator';
import { SectionLoader } from './components/ui/SectionLoader';
import { ArchDivider } from './components/ui/ArchDivider';
import { registerMotionPlugins, prefersReducedMotion } from './lib/motion';

// Lazy-loaded visual and narrative sections for performance & rapid initial hydration
const Drinks = lazy(() =>
  import('./components/sections/Drinks').then((m) => ({ default: m.Drinks }))
);
const ProductMoment = lazy(() =>
  import('./components/sections/ProductMoment').then((m) => ({ default: m.ProductMoment }))
);
const Story = lazy(() =>
  import('./components/sections/Story').then((m) => ({ default: m.Story }))
);
const Contact = lazy(() =>
  import('./components/sections/Contact').then((m) => ({ default: m.Contact }))
);

export default function App() {
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    registerMotionPlugins();

    if (prefersReducedMotion()) return;

    // Keep native touch scrolling on phones; use a lighter smoother on desktop.
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px) and (hover: hover) and (pointer: fine)', () => {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        // Keep desktop wheel scrolling responsive; the longer easing made
        // the final sections feel like they were catching up with the wheel.
        smooth: 0.5,
        ignoreMobileResize: true,
      });

      return () => smoother.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-cream)] text-[var(--color-ink)] font-['Estedad'] antialiased selection:bg-[var(--color-gold)] selection:text-[var(--color-cream)]">
      {/* 1. Sunrise Preloader (≤2.5s, skippable on click, bypassed on reduced-motion) */}
      <Preloader onComplete={() => setIntroReady(true)} />

      {/* 2. Custom Desktop Cursor (Fine pointer only, sun dot + difference ring, magnetic) */}
      <CustomCursor />

      {/* 3. Sticky Navigation Bar (Cream canvas, no blur, anchor links, circular mobile overlay) */}
      <NavBar />

      {/* 4. Smooth Scrolling Container */}
      <div id="smooth-wrapper" className="w-full overflow-hidden">
        <div id="smooth-content" className="w-full">
          {/* Main Page Structure — Chronological Narrative: Hero -> Products -> Anatomy -> Story */}
          <main id="main-content" role="main">
            {/* Section 1: Hero (Morning light, cream) */}
            <Hero introReady={introReady} />

            {/* Marquee Ticker: brand signature */}
            <Marquee bg="bg-[var(--color-dust)]/30" textColor="text-[var(--color-maroon)]" />

            {/* Arch Divider: Hero -> Products */}
            <ArchDivider variant="warm" label="محصولات SEA BREW" />

            {/* Section 2: Products (Warm phase, unified product template grid) */}
            <Suspense
              fallback={
                <SectionLoader
                  title="بارگذاری محصولات SEA BREW..."
                  theme="warm"
                  minHeight="min-h-[80vh]"
                />
              }
            >
              <Drinks />
            </Suspense>

            {/* Arch Divider: Products -> Product Moment */}
            <ArchDivider variant="warm-to-gold" label="هنر دم‌آوری سرد" />

            {/* Section 3: Product Moment (Hero masterpiece, liquid rise scrub, flavor tags popup) */}
            <Suspense
              fallback={
                <SectionLoader
                  title="آماده‌سازی استودیوی دم‌آوری کلدبرو..."
                  theme="warm"
                  minHeight="min-h-[90vh]"
                />
              }
            >
              <ProductMoment />
            </Suspense>

            {/* Arch Divider: Product Moment -> Story */}
            <ArchDivider variant="gold-to-dark" label="روایت ما" />

            {/* Section 4: Story (Warm -> Dark transition, 3 chapters, arch dark rise) */}
            <Suspense
              fallback={
                <SectionLoader
                  title="فراخوانی روایت ریشه‌ها در بوشهر..."
                  theme="dark"
                  minHeight="min-h-[80vh]"
                />
              }
            >
              <Story />
            </Suspense>

            {/* Section 5: Contact (Dark ink, static form + direct channels) */}
            <Suspense
              fallback={
                <SectionLoader
                  title="ارتباط با کارگاه SEA BREW..."
                  theme="dark"
                  minHeight="min-h-[60vh]"
                />
              }
            >
              <Contact />
            </Suspense>
          </main>

          {/* 5. Footer (Dark ink, vertical parallax reveal, letter-by-letter rising wordmark, TideLine progress) */}
          <Footer />
        </div>
      </div>

      {/* 6. Global Solar Scroll Progress Indicator (Line with sliding sun + circular dial) */}
      <SunScrollIndicator />
    </div>
  );
}

