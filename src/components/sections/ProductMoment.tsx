import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerMotionPlugins, prefersReducedMotion } from '../../lib/motion';
import { siteContent } from '../../content';
import { SunDot } from '../ui/SunDot';
import { Glass2DCanvas } from '../ui/Glass2DCanvas';
import { Play, Pause, Sparkles, Droplets, Check } from 'lucide-react';

interface StageInfo {
  id: number;
  threshold: number;
  roman: string;
  badge: string;
  title: string;
  flavorProfile: string;
  lead: string;
  ingredients: string[];
  color: string;
}

const STAGES: StageInfo[] = [
  {
    id: 0,
    threshold: 0.15,
    roman: '۰۱',
    badge: 'گام نخست • کالبد بلورین',
    title: 'تراش بلورین و یخ کریستالی',
    flavorProfile: 'بستر آماده‌سازی در دمای صفر درجه',
    lead: 'پیاله شیشه‌ای دست‌ساز با خطوط ملهم از درگاه‌های چوبی بوشهر، همراه با قطعات یخ بلورین زاویه‌دار برای تثبیت سرمای ماندگار.',
    ingredients: ['پیاله شیشه‌ای دست‌ساز', 'قطعات یخ بلورین', 'خنکای تثبیت‌شده'],
    color: '#A78040',
  },
  {
    id: 1,
    threshold: 0.45,
    roman: '۰۲',
    badge: 'گام دوم • استخراج سرد',
    title: 'عصاره دم‌آوری پور-اور (Pour-Over)',
    flavorProfile: '۱۰۰٪ عربیکا تخصصی با غلظت ابریشمی',
    lead: 'باریکه‌ای زلال و زرین از قهوه فرآوری سرد که به آرامی بر روی یخ‌های کریستالی می‌نشیند و عطر میوه‌ای و شکوفه‌ای دانه‌ها را رها می‌سازد.',
    ingredients: ['قهوه تخصصی عربیکا', 'عصاره‌گیری سرد', 'کف مخملی کرما'],
    color: '#825F27',
  },
  {
    id: 2,
    threshold: 0.75,
    roman: '۰۳',
    badge: 'گام سوم • غنای اقلیمی',
    title: 'ریشه ماکا و جینسینگ قرمز',
    flavorProfile: 'طراوت و انرژی پایدار ساحلی',
    lead: 'ترکیب ریشه‌های طبیعی محرک با عصاره خالص میوه جمبولان جنوب و عسل طبیعی؛ لایه‌ای عمیق با رنگ کهربایی درخشان.',
    ingredients: ['جینسینگ سرخ کوهی', 'ریشه تقویت‌کننده ماکا', 'میوه جمبولان جنوب'],
    color: '#C95F24',
  },
  {
    id: 3,
    threshold: 0.95,
    roman: '۰۴',
    badge: 'گام چهارم • شاهکار نهایی',
    title: 'خنکای میوه ساحلی و سرو نهایی',
    flavorProfile: 'آماده نوشیدن • تعادل کامل طعم و انرژی',
    lead: 'با افزودن برش توت‌فرنگی تازه و بازتاب طلایی خورشید بوشهر بر سطح پیاله، تجربه نوشیدنی SEA BREW کامل می‌شود.',
    ingredients: ['برش توت‌فرنگی تازه', 'پودر ماچای تشریفاتی', 'عسل وحشی بوشهر'],
    color: '#FDB716',
  },
];

export const ProductMoment: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);
  const autoPlayTweenRef = useRef<gsap.core.Tween | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Progressive states
  const [scrollPercent, setScrollPercent] = useState<number>(() =>
    prefersReducedMotion() ? 0.92 : 0.12
  );
  const [activeStageIndex, setActiveStageIndex] = useState<number>(() =>
    prefersReducedMotion() ? 3 : 0
  );
  const [isPouringStream, setIsPouringStream] = useState<boolean>(false);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);

  // Synchronized GSAP ScrollTrigger with long, deliberate scroll distance
  useEffect(() => {
    registerMotionPlugins();

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const scrollDistance = isMobile ? 1800 : 2600;

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: pinContainerRef.current,
        anticipatePin: 1,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!isPlayingRef.current) {
            const p = Math.max(0.08, Math.min(0.96, self.progress * 0.92 + 0.08));
            setScrollPercent(p);
            setIsPouringStream(self.direction > 0 && p > 0.18 && p < 0.94);

            // Determine active stage
            if (p < 0.32) setActiveStageIndex(0);
            else if (p < 0.62) setActiveStageIndex(1);
            else if (p < 0.86) setActiveStageIndex(2);
            else setActiveStageIndex(3);
          }
        },
      });

      scrollTriggerInstance.current = trigger;
    }, sectionRef);

    return () => {
      if (autoPlayTweenRef.current) {
        autoPlayTweenRef.current.kill();
      }
      ctx.revert();
      scrollTriggerInstance.current = null;
    };
  }, []);

  // Jump to specific stage smoothly
  const jumpToStage = useCallback((stageIndex: number) => {
    const trigger = scrollTriggerInstance.current;
    if (!trigger) return;

    const targetProgress = [0.08, 0.42, 0.72, 0.96][stageIndex];
    const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);

    const scrollObj = { y: window.scrollY || window.pageYOffset || 0 };
    if (autoPlayTweenRef.current) {
      autoPlayTweenRef.current.kill();
    }

    autoPlayTweenRef.current = gsap.to(scrollObj, {
      y: targetScroll,
      duration: 1.2,
      ease: 'pour',
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
      },
    });
  }, []);

  // Cinematic Auto-Play presentation mode
  const handleToggleAutoPlay = () => {
    const trigger = scrollTriggerInstance.current;
    if (!trigger) return;

    if (isPlayingAuto) {
      isPlayingRef.current = false;
      setIsPlayingAuto(false);
      if (autoPlayTweenRef.current) {
        autoPlayTweenRef.current.kill();
      }
      setIsPouringStream(false);
    } else {
      isPlayingRef.current = true;
      setIsPlayingAuto(true);
      setIsPouringStream(true);

      const scrollObj = { y: trigger.start };
      window.scrollTo(0, trigger.start);

      if (autoPlayTweenRef.current) {
        autoPlayTweenRef.current.kill();
      }

      // Smoothly scroll window from start to end of the pinned section
      autoPlayTweenRef.current = gsap.to(scrollObj, {
        y: trigger.end - 50,
        duration: 7.5,
        ease: 'tide',
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
          if (trigger) {
            const p = Math.max(0.08, Math.min(0.96, trigger.progress * 0.92 + 0.08));
            setScrollPercent(p);
            if (p < 0.32) setActiveStageIndex(0);
            else if (p < 0.62) setActiveStageIndex(1);
            else if (p < 0.86) setActiveStageIndex(2);
            else setActiveStageIndex(3);
          }
        },
        onComplete: () => {
          isPlayingRef.current = false;
          setIsPlayingAuto(false);
          setIsPouringStream(false);
        },
      });
    }
  };

  const currentStage = STAGES[activeStageIndex];

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative w-full bg-[#FFFADE] select-none"
      style={{
        background: 'linear-gradient(180deg, #FFFADE 0%, #F5ECC9 50%, #FFFADE 100%)',
      }}
      aria-label="بخش آناتومی طعم و شبیه‌سازی سه‌بعدی پیاله SEA BREW"
    >
      {/* Pinned Viewport Container */}
      <div
        ref={pinContainerRef}
        className="w-full h-screen min-h-[640px] flex flex-col justify-between py-6 sm:py-8 px-[6vw] overflow-hidden"
      >
        <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col justify-between">
          {/* Top Bar: Section Badge, Progress Tracker & Play Controls */}
          <header className="flex items-center justify-between gap-4 border-b border-[#A78040]/25 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#161617] text-[#FDB716] flex items-center justify-center font-mono text-xs font-bold shadow-xs">
                {currentStage.roman}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#825F27] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#A78040]" />
                  <span>{siteContent.productMoment.tag}</span>
                </span>
                <span className="text-xs sm:text-sm font-black text-[#161617]">
                  {currentStage.badge}
                </span>
              </div>
            </div>

            {/* Middle: 4 Stage Progress Dots */}
            <nav
              aria-label="مراحل آماده‌سازی پیاله"
              className="hidden md:flex items-center gap-2 bg-[#FFFADE]/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#A78040]/30 shadow-xs"
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
                        ? 'bg-[#161617] text-[#FFFADE] shadow-xs'
                        : isPassed
                        ? 'bg-[#825F27]/15 text-[#825F27] hover:bg-[#825F27]/25'
                        : 'text-[#161617]/50 hover:text-[#161617]'
                    }`}
                  >
                    <span>{s.roman}</span>
                    <span className="hidden lg:inline">{s.title.split(' ')[0]}</span>
                    {isPassed && <Check className="w-3 h-3 text-[#825F27]" />}
                  </button>
                );
              })}
            </nav>

            {/* Auto Play / Showcase Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleAutoPlay}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#161617] text-[#FFFADE] text-xs font-bold hover:bg-[#825F27] transition-all duration-300 shadow-sm"
                aria-label={isPlayingAuto ? 'توقف شوکیس' : 'پخش خودکار شوکیس'}
              >
                {isPlayingAuto ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">توقف شوکیس</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">اجرای شوکیس</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Main Interactive Stage: 3D WebGL Tumbler (Center) + Rich Stage Card (Side) */}
          <div className="flex-1 my-4 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 min-h-0">
            {/* Center-Left: Real 3D Tumbler Glass (Three.js WebGL with Buoyancy & Physics) */}
            <div className="relative w-full lg:w-1/2 h-[340px] sm:h-[420px] lg:h-[480px] flex items-center justify-center">
              {/* Background Architectural Halo & Palm Silhouettes */}
              <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#FDB716]/10 blur-3xl pointer-events-none" />

              {/* Decorative Authentic Motif from Bushehr Windows */}
              <svg
                viewBox="0 0 400 480"
                className="absolute inset-0 w-full h-full pointer-events-none opacity-30 overflow-visible"
                fill="none"
              >
                <g stroke="#825F27" strokeWidth="1.6" strokeLinecap="round">
                  {/* Outer arch window frame */}
                  <path d="M 60 440 L 60 200 A 140 140 0 0 1 340 200 L 340 440" />
                  <path d="M 75 440 L 75 210 A 125 125 0 0 1 325 210 L 325 440" strokeOpacity="0.5" />
                  {/* Subtle radiating sunlight rays without vertical center line */}
                  <line x1="180" y1="180" x2="110" y2="105" strokeOpacity="0.3" />
                  <line x1="220" y1="180" x2="290" y2="105" strokeOpacity="0.3" />
                </g>
              </svg>

              {/* Elegant 2D Glass Tumbler Illustration */}
              <div className="relative w-full h-full max-w-[420px] max-h-[480px] z-10 flex items-center justify-center">
                <Glass2DCanvas
                  progress={scrollPercent}
                  isPouring={isPouringStream}
                  className="w-full h-full"
                />

                {/* Craftsmanship Hint Badge */}
                <div className="absolute bottom-2 inset-x-0 flex items-center justify-center pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#161617]/80 text-[#FFFADE] text-[11px] font-semibold tracking-wide backdrop-blur-xs opacity-80 border border-[#A78040]/30 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#FDB716]" />
                    <span>پیاله بلورین دست‌ساز • فرآوری دم‌آوری سرد</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Rich Sensory Editorial Narrative Card */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl z-20">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FFFADE]/85 border border-[#A78040]/35 backdrop-blur-md shadow-lg">
                {/* Stage Header & Tasting Level */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-mono font-black tracking-widest uppercase px-3 py-1 rounded-full text-[#FFFADE]"
                    style={{ backgroundColor: currentStage.color === '#FDB716' ? '#161617' : currentStage.color }}
                  >
                    گام {currentStage.roman}
                  </span>

                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#825F27]">
                    <Droplets className="w-3.5 h-3.5 text-[#A78040]" />
                    <span>تراز پیاله: {Math.round(scrollPercent * 100)}٪</span>
                  </div>
                </div>

                {/* Title and Profile */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#161617] mb-2 leading-tight">
                  {currentStage.title}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-[#825F27] mb-4">
                  {currentStage.flavorProfile}
                </p>

                {/* Editorial Body */}
                <p className="text-xs sm:text-sm leading-relaxed font-medium text-[#161617]/80 mb-6">
                  {currentStage.lead}
                </p>

                {/* Active Key Ingredients Chips */}
                <div className="border-t border-[#A78040]/25 pt-4">
                  <div className="text-[11px] font-bold text-[#825F27] mb-2 uppercase tracking-wider">
                    عناصر فعال این لایه:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentStage.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#161617] text-[#FFFADE] border border-[#A78040]/40 shadow-xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FDB716]" />
                        <span>{ing}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Scroll Cue Helper */}
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-[#825F27]">
                <div className="flex items-center gap-2">
                  <SunDot size="sm" animate={scrollPercent >= 0.88} />
                  <span>
                    {scrollPercent >= 0.88
                      ? 'پیاله آماده سرو نهایی است'
                      : 'برای تداوم دم‌آوری به پایین اسکرول کنید'}
                  </span>
                </div>

                <div className="w-32 h-1.5 bg-[#C9B8B6]/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#825F27] transition-all duration-100 ease-out"
                    style={{ width: `${Math.round(scrollPercent * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar: Authentic Attribution */}
          <footer className="flex items-center justify-between border-t border-[#A78040]/20 pt-3 text-[11px] font-semibold text-[#825F27]/80">
            <span>فرمولاسیون اختصاصی دم‌آوری سرد • SEA BREW</span>
            <span className="font-mono">BUSHEHR • COFFEE & DRINKS</span>
          </footer>
        </div>
      </div>
    </section>
  );
};
