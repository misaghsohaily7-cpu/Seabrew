import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { SunDot } from '../ui/SunDot';
import { Glass2DCanvas } from '../ui/Glass2DCanvas';
import { Sparkles, Check } from 'lucide-react';

interface StageInfo {
  id: number;
  threshold: number;
  roman: string;
  badge: string;
  label: string;
  color: string;
}

const STAGES: StageInfo[] = [
  {
    id: 0,
    label: 'یخ',
    threshold: 0.15,
    roman: '۰۱',
    badge: 'گام ۱ • سرمای ماندگار',
    color: 'var(--color-gold)',
  },
  {
    id: 1,
    label: 'قهوه',
    threshold: 0.45,
    roman: '۰۲',
    badge: 'گام ۲ • عصاره سرد',
    color: 'var(--color-maroon)',
  },
  {
    id: 2,
    label: 'ترکیب',
    threshold: 0.75,
    roman: '۰۳',
    badge: 'گام ۳ • ریشه‌های نیروبخش',
    color: '#C95F24',
  },
  {
    id: 3,
    label: 'سرو',
    threshold: 0.95,
    roman: '۰۴',
    badge: 'گام ۴ • پایان ساحلی',
    color: 'var(--color-sun)',
  },
];

export const ProductMoment: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);
  const jumpTweenRef = useRef<gsap.core.Tween | null>(null);
  // 3D glass stage references
  const stageRef = useRef<HTMLDivElement>(null);
  const glassTiltRef = useRef<HTMLDivElement>(null);
  const glassGlossRef = useRef<HTMLDivElement>(null);
  const glassBackRef = useRef<SVGSVGElement>(null);

  // Scroll values live in refs so the pinned scene doesn't rerender React on every scroll frame.
  const initialProgress = prefersReducedMotion() ? 0.92 : 0.12;
  const glassMotionRef = useRef({ progress: initialProgress, isPouring: false });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activeStageIndexRef = useRef(prefersReducedMotion() ? 3 : 0);
  const isReadyRef = useRef(initialProgress >= 0.88);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(() => (prefersReducedMotion() ? 3 : 0));
  const [isReady, setIsReady] = useState<boolean>(() => initialProgress >= 0.88);
  // Which product's recipe the anatomy section follows (tab selection)
  const [activeProduct, setActiveProduct] = useState<number>(0);
  const activeProductData = siteContent.productList[activeProduct];
  // The step narrative belongs to the selected product (ingredient-driven)
  const activeStep = activeProductData.steps[activeStageIndex] ?? activeProductData.steps[0];

  // 3D parallax tilt on the glass stage — tracks the cursor so the tumbler
  // reads as a real object in space (depth layers shift at different rates).
  // Desktop / fine-pointer only; disabled under prefers-reduced-motion.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (glassTiltRef.current) {
        gsap.to(glassTiltRef.current, {
          rotateY: x * 16,
          rotateX: -y * 16,
          scale: 1.04,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (glassGlossRef.current) {
        gsap.to(glassGlossRef.current, {
          x: -x * 26,
          y: -y * 26,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (glassBackRef.current) {
        gsap.to(glassBackRef.current, {
          rotateY: x * 7,
          rotateX: -y * 7,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const onLeave = () => {
      if (glassTiltRef.current)
        gsap.to(glassTiltRef.current, {
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
        });
      if (glassGlossRef.current)
        gsap.to(glassGlossRef.current, { x: 0, y: 0, duration: 0.9, ease: 'power3.out' });
      if (glassBackRef.current)
        gsap.to(glassBackRef.current, { rotateY: 0, rotateX: 0, duration: 1.1, ease: 'power3.out' });
    };

    stage.addEventListener('mousemove', onMove, { passive: true });
    stage.addEventListener('mouseleave', onLeave);
    return () => {
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const applyScrollProgress = useCallback((self: ScrollTrigger) => {
    const progress = Math.max(0.08, Math.min(0.98, self.progress * 0.9 + 0.08));
    glassMotionRef.current.progress = progress;
    glassMotionRef.current.isPouring = self.direction > 0 && progress > 0.18 && progress < 0.94;

    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.round(progress * 100)}%`;
    }

    const nextStage = progress < 0.32 ? 0 : progress < 0.62 ? 1 : progress < 0.78 ? 2 : 3;
    if (nextStage !== activeStageIndexRef.current) {
      activeStageIndexRef.current = nextStage;
      setActiveStageIndex(nextStage);
    }

    const ready = progress >= 0.88;
    if (ready !== isReadyRef.current) {
      isReadyRef.current = ready;
      setIsReady(ready);
    }
  }, []);

  // Give mobile gestures enough distance to scrub through each recipe stage deliberately.
  useEffect(() => {
    registerMotionPlugins();

    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia(sectionRef);

    mm.add('(min-width: 768px)', () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2600',
        pin: pinContainerRef.current,
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: applyScrollProgress,
      });

      scrollTriggerInstance.current = trigger;
    });

    mm.add('(max-width: 767px)', () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2400',
        pin: pinContainerRef.current,
        anticipatePin: 1,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: applyScrollProgress,
      });

      scrollTriggerInstance.current = trigger;
    });

    return () => {
      if (jumpTweenRef.current) {
        jumpTweenRef.current.kill();
      }
      mm.revert();
      scrollTriggerInstance.current = null;
    };
  }, [applyScrollProgress]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === 'undefined') {
      section.classList.add('motion-visible');
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      section.classList.toggle('motion-visible', Boolean(entry?.isIntersecting));
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Jump to specific stage smoothly
  const jumpToStage = useCallback((stageIndex: number) => {
    const trigger = scrollTriggerInstance.current;
    if (!trigger) return;

    const targetProgress = [0.08, 0.40, 0.68, 0.97][stageIndex];
    const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);

    const scrollObj = { y: window.scrollY || window.pageYOffset || 0 };
    if (jumpTweenRef.current) {
      jumpTweenRef.current.kill();
    }

    jumpTweenRef.current = gsap.to(scrollObj, {
      y: targetScroll,
      duration: 1.2,
      ease: 'pour',
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
      },
    });
  }, []);

  const currentStage = STAGES[activeStageIndex];

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative w-full bg-[var(--color-cream)] select-none"
      style={{
        background: 'linear-gradient(180deg, var(--color-product-scroll-edge) 0%, var(--color-product-scroll-center) 50%, var(--color-product-scroll-edge) 100%)',
      }}
      aria-label="بخش آناتومی طعم و شبیه‌سازی سه‌بعدی پیاله SEA BREW"
    >
      {/* Pinned Viewport Container */}
      <div
        ref={pinContainerRef}
        className="product-moment-pin w-full flex flex-col justify-between px-[6vw] overflow-hidden"
      >
        <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
          {/* Top Bar: Section Badge & Stage Progress Tracker */}
          <header className="flex flex-col gap-2.5 border-b border-[var(--color-gold)]/25 pb-2.5">
            <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-ink)] text-[var(--color-sun)] flex items-center justify-center font-mono text-xs font-bold shadow-xs">
                {currentStage.roman}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[var(--color-product-muted)] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[var(--color-gold)]" />
                  <span>{siteContent.productMoment.tag}</span>
                </span>
                <span className="text-xs sm:text-sm font-black text-[var(--color-ink)]">
                  {currentStage.badge}
                </span>
              </div>
            </div>

            {/* Middle: 4 Stage Progress Dots */}
            <nav
              aria-label="مراحل آماده‌سازی پیاله"
              className="hidden md:flex items-center gap-2 bg-[var(--color-cream)]/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[var(--color-gold)]/30 shadow-xs"
            >
              {STAGES.map((s, idx) => {
                const isActive = activeStageIndex === idx;
                const isPassed = activeStageIndex > idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => jumpToStage(idx)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-[var(--color-ink)] text-[var(--color-cream)] shadow-xs'
                        : isPassed
                        ? 'bg-[var(--color-maroon)]/15 text-[var(--color-product-muted)] hover:bg-[var(--color-maroon)]/25'
                        : 'text-[var(--color-ink)]/75 hover:text-[var(--color-ink)]'
                    }`}
                  >
                    <span>{s.roman}</span>
                    <span className="hidden lg:inline">{s.label}</span>
                    {isPassed && <Check className="w-3 h-3 text-[var(--color-product-muted)]" />}
                  </button>
                );
              })}
            </nav>
            </div>

            {/* Product tabs — each product drives its own recipe & tint */}
            <nav
              aria-label="انتخاب محصول"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar"
            >
              {siteContent.productList.map((product, idx) => {
                const isActive = activeProduct === idx;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveProduct(idx)}
                    aria-pressed={isActive}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'text-[var(--color-cream)] shadow-md scale-[1.03]'
                        : 'text-[var(--color-ink)]/75 border border-[var(--color-gold)]/30 hover:text-[var(--color-ink)] hover:border-[var(--color-gold)]/60'
                    }`}
                    style={isActive ? { backgroundColor: product.accent } : undefined}
                  >
                    {product.name}
                  </button>
                );
              })}
            </nav>
          </header>

          {/* Main Interactive Stage: 3D WebGL Tumbler (Center) + Rich Stage Card (Side) */}
          <div className="product-moment-main flex-1 my-2 lg:my-4 flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-12 min-h-0">
            {/* Center-Left: Real 3D Tumbler Glass (Three.js WebGL with Buoyancy & Physics) */}
            <div
              ref={stageRef}
              className="product-moment-stage relative w-full lg:w-1/2 flex-1 min-h-[240px] sm:flex-none sm:h-[340px] lg:h-[480px] flex items-center justify-center [perspective:1200px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Decorative Authentic Motif from Bushehr Windows (depth layer, behind) */}
              <svg
                ref={glassBackRef}
                viewBox="0 0 400 480"
                className="absolute inset-0 w-full h-full pointer-events-none opacity-30 overflow-visible"
                fill="none"
                style={{ transform: 'translateZ(-60px)', willChange: 'transform' }}
              >
                <g stroke="var(--color-maroon)" strokeWidth="1.6" strokeLinecap="round">
                  {/* Outer arch window frame */}
                  <path d="M 60 440 L 60 200 A 140 140 0 0 1 340 200 L 340 440" />
                  <path d="M 75 440 L 75 210 A 125 125 0 0 1 325 210 L 325 440" strokeOpacity="0.5" />
                  {/* Subtle radiating sunlight rays without vertical center line */}
                  <line x1="180" y1="180" x2="110" y2="105" strokeOpacity="0.3" />
                  <line x1="220" y1="180" x2="290" y2="105" strokeOpacity="0.3" />
                </g>
              </svg>

              {/* Elegant Glass Tumbler Illustration — tilts in 3D space on hover */}
              <div
                ref={glassTiltRef}
                className="product-moment-glass relative w-full h-full max-w-[420px] max-h-[480px] z-10 flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                <Glass2DCanvas
                  motionRef={glassMotionRef}
                  tint={activeProductData.accent}
                  recipe={activeProductData.id}
                  className="product-moment-glass-canvas w-full h-full"
                />
                {/* Specular highlight that catches the light as the glass tilts */}
                <div
                  ref={glassGlossRef}
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
                  aria-hidden="true"
                  style={{ transform: 'translateZ(45px)', willChange: 'transform' }}
                >
                  <div
                    className="absolute inset-0 mix-blend-screen"
                    style={{
                      background:
                        'radial-gradient(120% 90% at 30% 22%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.0) 42%), linear-gradient(125deg, transparent 32%, rgba(255,255,255,0.14) 46%, rgba(255,255,255,0.34) 50%, rgba(255,255,255,0.14) 54%, transparent 68%)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Rich Sensory Editorial Narrative Card */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl z-20">
              <div className="product-moment-stage-card relative p-4 sm:p-8 rounded-3xl bg-[var(--color-cream)]/85 border border-[var(--color-gold)]/35 shadow-lg">
                {/* Step badge — follows the pour animation */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span
                    className="text-xs font-mono font-black tracking-widest uppercase px-3 py-1 rounded-full text-[var(--color-cream)]"
                    style={{ backgroundColor: currentStage.color === 'var(--color-sun)' ? 'var(--color-ink)' : currentStage.color }}
                  >
                    گام {currentStage.roman}
                  </span>
                  <span className="text-[11px] font-bold text-[var(--color-product-muted)]">
                    {currentStage.badge}
                  </span>
                </div>

                {/* Product identity — follows the selected tab */}
                <h3
                  key={activeProductData.id}
                  className="text-2xl sm:text-3xl font-black leading-none mb-1.5 transition-colors duration-500"
                  style={{ color: activeProductData.accent }}
                >
                  {activeProductData.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[var(--color-ink)]/75 mb-4">
                  {activeProductData.tagline}
                </p>

                {/* Current step narrative — follows the pour animation */}
                <p className="text-[11px] font-bold text-[var(--color-product-muted)] mb-1.5 flex items-center gap-1.5">
                  <SunDot size="sm" animate={false} />
                  <span>{activeStep.title}</span>
                </p>
                <p className="product-moment-step-lead text-xs sm:text-sm leading-relaxed font-medium text-[var(--color-ink)]/80 mb-5 min-h-[3.5rem]">
                  {activeStep.lead}
                </p>

                {/* Selected product's ingredient list */}
                <div className="border-t border-[var(--color-gold)]/25 pt-4">
                  <div className="text-[11px] font-bold text-[var(--color-product-muted)] mb-2 uppercase tracking-wider flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full transition-colors duration-500"
                      style={{ backgroundColor: activeProductData.accent }}
                    />
                    <span>ترکیبات {activeProductData.name}</span>
                  </div>
                  <div key={activeProductData.id} className="product-moment-ingredients flex flex-wrap gap-2 min-h-[3.5rem]">
                    {activeProductData.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-ink)] text-[var(--color-cream)] border border-[var(--color-gold)]/40 shadow-xs"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: activeProductData.accent }}
                        />
                        <span>{ing}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Scroll Cue Helper */}
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-[var(--color-product-muted)]">
                <div className="flex items-center gap-2">
                  <SunDot size="sm" animate={isReady} />
                  <span>
                    {isReady
                      ? 'نوشیدنی آماده است'
                      : 'برای دیدن مرحلهٔ بعد اسکرول کنید'}
                  </span>
                </div>

                <div className="w-32 h-1.5 bg-[var(--color-dust)]/40 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-[var(--color-maroon)]"
                    style={{ width: `${Math.round(initialProgress * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar: Authentic Attribution */}
          <footer className="product-moment-footer flex items-center justify-center border-t border-[var(--color-gold)]/20 pt-3 text-[11px] font-semibold text-[var(--color-product-muted)]/80">
            <span>فرمول اختصاصی دم‌آوری سرد • SEA BREW</span>
          </footer>
        </div>
      </div>
    </section>
  );
};
