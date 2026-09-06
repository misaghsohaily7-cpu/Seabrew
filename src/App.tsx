import { useState, useEffect, lazy, Suspense } from 'react';
import { Preloader } from './components/ui/Preloader';
import { CustomCursor } from './components/ui/Cursor';
import { NavBar } from './components/ui/NavBar';
import { Hero } from './components/sections/Hero';
import { Statement } from './components/sections/Statement';
import { Marquee } from './components/ui/Marquee';
import { Footer } from './components/ui/Footer';
import { SunScrollIndicator } from './components/ui/SunScrollIndicator';
import { SectionLoader } from './components/ui/SectionLoader';
import { ArchDivider } from './components/ui/ArchDivider';
import { registerMotionPlugins } from './lib/motion';

// Lazy-loaded visual and narrative sections for performance & rapid initial hydration
const Interlude = lazy(() =>
  import('./components/sections/Interlude').then((m) => ({ default: m.Interlude }))
);
const Drinks = lazy(() =>
  import('./components/sections/Drinks').then((m) => ({ default: m.Drinks }))
);
const ProductMoment = lazy(() =>
  import('./components/sections/ProductMoment').then((m) => ({ default: m.ProductMoment }))
);
const Story = lazy(() =>
  import('./components/sections/Story').then((m) => ({ default: m.Story }))
);
const FindUs = lazy(() =>
  import('./components/sections/FindUs').then((m) => ({ default: m.FindUs }))
);
const Contact = lazy(() =>
  import('./components/sections/Contact').then((m) => ({ default: m.Contact }))
);

export default function App() {
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    registerMotionPlugins();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FFFADE] text-[#161617] font-['Estedad'] antialiased selection:bg-[#A78040] selection:text-[#FFFADE]">
      {/* 1. Sunrise Preloader (≤2.5s, skippable on click, bypassed on reduced-motion) */}
      <Preloader onComplete={() => setIntroReady(true)} />

      {/* 2. Custom Desktop Cursor (Fine pointer only, sun dot + difference ring, magnetic) */}
      <CustomCursor />

      {/* 3. Sticky Navigation Bar (Cream canvas, no blur, anchor links, circular mobile overlay) */}
      <NavBar />

      {/* 4. Main Page Structure — 8 Sections in Chronological Day-to-Night Narrative */}
      <main id="main-content" role="main">
        {/* Section 1: Hero (Morning light, cream) */}
        <Hero introReady={introReady} />

        {/* Section 2: Statement (Single sentence, cream, scrub word by word) */}
        <Statement />

        {/* Arch Divider: Statement -> Interlude */}
        <ArchDivider variant="cream-to-warm" label="چشم‌انداز ساحل بوشهر" />

        {/* Section 3: Interlude (Cream -> Warm, full width SVG scene, 3-layer parallax) */}
        <Suspense
          fallback={
            <SectionLoader
              title="بارگذاری چشم‌انداز ساحلی بوشهر..."
              theme="warm"
              minHeight="min-h-[70vh]"
            />
          }
        >
          <Interlude />
        </Suspense>

        {/* Marquee Ticker: Warm phase transition */}
        <Marquee bg="bg-[#C9B8B6]/30" textColor="text-[#825F27]" />

        {/* Arch Divider: Marquee -> Drinks */}
        <ArchDivider variant="warm" label="مجموعه نوشیدنی‌های ساحلی" />

        {/* Section 4: Drinks (Warm phase, two arch cards, horizontal scrub pin on desktop) */}
        <Suspense
          fallback={
            <SectionLoader
              title="بارگذاری نوشیدنی‌های ساحلی..."
              theme="warm"
              minHeight="min-h-[80vh]"
            />
          }
        >
          <Drinks />
        </Suspense>

        {/* Arch Divider: Drinks -> Product Moment */}
        <ArchDivider variant="warm-to-gold" label="هنر دم‌آوری پیاله کلدبرو" />

        {/* Section 5: Product Moment (Hero masterpiece, liquid rise scrub, flavor tags popup) */}
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
        <ArchDivider variant="gold-to-dark" label="روایت سه‌گانه ریشه‌ها" />

        {/* Section 6: Story (Warm -> Dark transition, 3 chapters, arch dark rise) */}
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

        {/* Section 7: Find Us (Dark, store & cafe list, commercial clarity, hover arch panel) */}
        <Suspense
          fallback={
            <SectionLoader
              title="نقشه شعب و مراکز عرضه..."
              theme="dark"
              minHeight="min-h-[60vh]"
            />
          }
        >
          <FindUs />
        </Suspense>

        {/* Section 8: Contact (Dark ink, static form + direct channels) */}
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

      {/* 6. Global Solar Scroll Progress Indicator (Line with sliding sun + circular dial) */}
      <SunScrollIndicator />
    </div>
  );
}

