import React, { useEffect, useRef, useMemo } from 'react';
import { getReducedMotionPreference } from '../../lib/motion';

const BOTTOM_INNER_Y = 388;
const TOP_MAX_Y = 115;
const FILLABLE_HEIGHT = BOTTOM_INNER_Y - TOP_MAX_Y;

interface Glass2DCanvasProps {
  motionRef: React.MutableRefObject<{ progress: number; isPouring: boolean }>;
  className?: string;
  /** Product accent colour — tints the drink so each recipe looks different */
  tint?: string;
  /** Product id — decides which ingredients float in the glass */
  recipe?: string;
}

const Glass2DCanvasView: React.FC<Glass2DCanvasProps> = ({
  motionRef,
  className = '',
  tint = '#C95F24',
  recipe = 'vigor',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const liquidBodyRef = useRef<SVGPathElement>(null);
  const meniscusRef = useRef<SVGPathElement>(null);
  const tintRef = useRef<SVGRectElement>(null);
  const bubble1Ref = useRef<SVGCircleElement>(null);
  const bubble2Ref = useRef<SVGCircleElement>(null);
  const bubble3Ref = useRef<SVGCircleElement>(null);
  const bubble4Ref = useRef<SVGCircleElement>(null);
  const ice1Ref = useRef<SVGGElement>(null);
  const ice2Ref = useRef<SVGGElement>(null);
  const ice3Ref = useRef<SVGGElement>(null);
  const ingredientRef = useRef<SVGGElement>(null);
  const bean1Ref = useRef<SVGGElement>(null);
  const bean2Ref = useRef<SVGGElement>(null);
  const puddleRef = useRef<SVGEllipseElement>(null);
  const rippleRef = useRef<SVGGElement>(null);
  const rippleSurface1Ref = useRef<SVGEllipseElement>(null);
  const rippleSurface2Ref = useRef<SVGEllipseElement>(null);
  const dropletRefs = useRef<Array<SVGCircleElement | null>>([]);

  // Initial values are rendered immediately; the visible SVG is then updated
  // in place so scroll and wave animation never trigger a React tree render.
  const initialProgress = Math.max(0.06, Math.min(0.96, motionRef.current.progress));
  const initialPouring = motionRef.current.isPouring;
  const isReduced = getReducedMotionPreference();

  const p = initialProgress;
  const liquidHeight = p * FILLABLE_HEIGHT;
  const liquidLevelY = BOTTOM_INNER_Y - liquidHeight;

  // Initial wave position; animation frames update SVG attributes directly.
  const wavePhase = 0;
  const waveAmp = isReduced ? 0 : initialPouring ? 7 : 3.5;
  const waveOffset1 = Math.sin(wavePhase) * waveAmp;
  const waveOffset2 = Math.cos(wavePhase * 2) * waveAmp * 0.8;

  // Calculate inner width at current liquid level (tapered glass profile)
  // At BOTTOM_INNER_Y (388): left=118, right=242 (width=124)
  // At TOP_MAX_Y (115): left=86, right=274 (width=188)
  const t = (BOTTOM_INNER_Y - liquidLevelY) / FILLABLE_HEIGHT;
  const currentLeftX = 118 - t * 32;
  const currentRightX = 242 + t * 32;
  const currentWidth = currentRightX - currentLeftX;

  // Floating Ice Cubes Physics
  const ice1RestY = 350;
  const ice1TargetY = Math.max(160, Math.min(ice1RestY, liquidLevelY + 30));
  const ice1T = Math.min(1, Math.max(0, (liquidHeight - 25) / 40));
  const ice1Y = ice1RestY + (ice1TargetY - ice1RestY) * ice1T;
  const ice1Rot = -12;

  const ice2RestY = 340;
  const ice2TargetY = Math.max(175, Math.min(ice2RestY, liquidLevelY + 50));
  const ice2T = Math.min(1, Math.max(0, (liquidHeight - 45) / 40));
  const ice2Y = ice2RestY + (ice2TargetY - ice2RestY) * ice2T;
  const ice2Rot = 16;

  const ice3RestY = 320;
  const ice3TargetY = Math.max(140, Math.min(ice3RestY, liquidLevelY + 22));
  const ice3T = Math.min(1, Math.max(0, (liquidHeight - 65) / 40));
  const ice3Y = ice3RestY + (ice3TargetY - ice3RestY) * ice3T;
  const ice3Rot = 8;

  // Floating Strawberry Slice
  const strawRestY = 345;
  const strawTargetY = Math.max(130, Math.min(strawRestY, liquidLevelY + 18));
  const strawT = Math.min(1, Math.max(0, (liquidHeight - 35) / 40));
  const strawY = strawRestY + (strawTargetY - strawRestY) * strawT;
  const strawRot = -18;

  // Floating Roasted Coffee Beans
  const bean1Y = Math.max(180, Math.min(360, liquidLevelY + 80));
  const bean2Y = Math.max(200, Math.min(370, liquidLevelY + 115));

  // Condensation droplets: 28 droplets along glass outer profile
  const droplets = useMemo(() => {
    const list: { cx: number; cy: number; r: number; opacity: number }[] = [];
    const seedPoints = [
      { y: 370, side: 'left', r: 2.2 },
      { y: 350, side: 'left', r: 2.8 },
      { y: 330, side: 'left', r: 1.8 },
      { y: 310, side: 'left', r: 3.2 },
      { y: 290, side: 'left', r: 2.4 },
      { y: 270, side: 'left', r: 3.5 },
      { y: 250, side: 'left', r: 2.0 },
      { y: 230, side: 'left', r: 2.9 },
      { y: 210, side: 'left', r: 2.3 },
      { y: 190, side: 'left', r: 3.0 },
      { y: 170, side: 'left', r: 2.1 },
      { y: 150, side: 'left', r: 2.6 },
      { y: 365, side: 'right', r: 2.5 },
      { y: 345, side: 'right', r: 3.0 },
      { y: 325, side: 'right', r: 1.9 },
      { y: 305, side: 'right', r: 3.4 },
      { y: 285, side: 'right', r: 2.2 },
      { y: 265, side: 'right', r: 2.8 },
      { y: 245, side: 'right', r: 3.1 },
      { y: 225, side: 'right', r: 2.0 },
      { y: 205, side: 'right', r: 2.7 },
      { y: 185, side: 'right', r: 3.2 },
      { y: 165, side: 'right', r: 2.3 },
      { y: 145, side: 'right', r: 2.9 },
      { y: 340, side: 'mid', r: 2.2 },
      { y: 300, side: 'mid', r: 2.6 },
      { y: 260, side: 'mid', r: 2.0 },
      { y: 220, side: 'mid', r: 2.4 },
    ];

    seedPoints.forEach((pt, i) => {
      const heightRatio = (420 - pt.y) / (420 - 70);
      const pseudoOffset = ((i * 13 + 7) % 10) / 10; // Deterministic 0.0 .. 0.9
      let cx: number;
      if (pt.side === 'left') {
        const outerX = 104 - heightRatio * 28;
        cx = outerX + 5 + pseudoOffset * 8;
      } else if (pt.side === 'right') {
        const outerX = 256 + heightRatio * 28;
        cx = outerX - 5 - pseudoOffset * 8;
      } else {
        cx = 160 + (pseudoOffset - 0.5) * 60;
      }
      list.push({ cx, cy: pt.y, r: pt.r, opacity: 0.75 });
    });
    return list;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId = 0;
    let running = false;
    let lastTime = performance.now();
    let progress = Math.max(0.06, Math.min(0.96, motionRef.current.progress));
    let phase = 0;
    let waveSpeed = 2;

    const setAttribute = (node: Element | null, name: string, value: number | string) => {
      if (node) node.setAttribute(name, String(value));
    };

    const updateSvg = (currentProgress: number, wavePhase: number, pouring: boolean, reducedMotion: boolean) => {
      const liquidHeight = currentProgress * FILLABLE_HEIGHT;
      const levelY = BOTTOM_INNER_Y - liquidHeight;
      const waveAmplitude = reducedMotion ? 0 : pouring ? 7 : 3.5;
      const offset1 = Math.sin(wavePhase) * waveAmplitude;
      const offset2 = Math.cos(wavePhase * 2) * waveAmplitude * 0.8;
      const t = (BOTTOM_INNER_Y - levelY) / FILLABLE_HEIGHT;
      const leftX = 118 - t * 32;
      const rightX = 242 + t * 32;
      const width = rightX - leftX;

      const surface = `
        M ${leftX - 4} ${levelY + offset1}
        C ${leftX + width * 0.3} ${levelY + offset1 - 5},
          ${leftX + width * 0.7} ${levelY + offset2 + 5},
          ${rightX + 4} ${levelY + offset2}
      `;

      setAttribute(
        liquidBodyRef.current,
        'd',
        `${surface} L 260 410 L 100 410 Z`
      );
      setAttribute(
        meniscusRef.current,
        'd',
        `${surface}
          C ${leftX + width * 0.7} ${levelY + offset2 + 4},
            ${leftX + width * 0.3} ${levelY + offset1 + 4},
            ${leftX - 4} ${levelY + offset1} Z`
      );
      setAttribute(tintRef.current, 'y', Math.max(0, levelY - 4));
      setAttribute(tintRef.current, 'height', Math.max(0, 480 - (levelY - 4)));

      setAttribute(bubble1Ref.current, 'cx', leftX + 12);
      setAttribute(bubble1Ref.current, 'cy', levelY + offset1 + 1);
      setAttribute(bubble2Ref.current, 'cx', leftX + 24);
      setAttribute(bubble2Ref.current, 'cy', levelY + offset1 + 2);
      setAttribute(bubble3Ref.current, 'cx', rightX - 16);
      setAttribute(bubble3Ref.current, 'cy', levelY + offset2 + 1);
      setAttribute(bubble4Ref.current, 'cx', rightX - 32);
      setAttribute(bubble4Ref.current, 'cy', levelY + offset2 + 2);

      const ice1T = Math.min(1, Math.max(0, (liquidHeight - 25) / 40));
      const ice2T = Math.min(1, Math.max(0, (liquidHeight - 45) / 40));
      const ice3T = Math.min(1, Math.max(0, (liquidHeight - 65) / 40));
      const ice1Y = 350 + (Math.max(160, Math.min(350, levelY + 30)) - 350) * ice1T +
        Math.sin(wavePhase * 2) * 2.5 * ice1T;
      const ice2Y = 340 + (Math.max(175, Math.min(340, levelY + 50)) - 340) * ice2T +
        Math.cos(wavePhase * 3) * 2.2 * ice2T;
      const ice3Y = 320 + (Math.max(140, Math.min(320, levelY + 22)) - 320) * ice3T +
        Math.sin(wavePhase * 4 + 1) * 2.8 * ice3T;

      setAttribute(ice1Ref.current, 'transform',
        `translate(142, ${ice1Y}) rotate(${-12 + Math.sin(wavePhase) * 5 * ice1T})`);
      setAttribute(ice2Ref.current, 'transform',
        `translate(210, ${ice2Y}) rotate(${16 + Math.cos(wavePhase * 2) * 6 * ice2T})`);
      setAttribute(ice3Ref.current, 'transform',
        `translate(178, ${ice3Y}) rotate(${8 + Math.sin(wavePhase * 3 + 1) * 4 * ice3T})`);

      const strawT = Math.min(1, Math.max(0, (liquidHeight - 35) / 40));
      const strawY = 345 + (Math.max(130, Math.min(345, levelY + 18)) - 345) * strawT +
        Math.sin(wavePhase * 3 + 0.6) * 2 * strawT;
      const strawRotation = -18 + Math.sin(wavePhase * 2) * 6 * strawT;
      setAttribute(ingredientRef.current, 'transform',
        `translate(195, ${strawY}) rotate(${strawRotation})`);

      const bean1Y = Math.max(180, Math.min(360, levelY + 80 + Math.sin(wavePhase) * 6));
      const bean2Y = Math.max(200, Math.min(370, levelY + 115 + Math.cos(wavePhase * 2) * 7));
      setAttribute(bean1Ref.current, 'transform', `translate(135, ${bean1Y}) rotate(32)`);
      setAttribute(bean2Ref.current, 'transform', `translate(225, ${bean2Y}) rotate(-24)`);

      droplets.forEach((droplet, index) => {
        const opacity = droplet.cy >= levelY - 10 ? droplet.opacity : 0;
        const node = dropletRefs.current[index];
        setAttribute(node, 'fill-opacity', opacity);
        setAttribute(node, 'stroke-opacity', opacity * 0.8);
      });

      setAttribute(rippleRef.current, 'opacity', pouring ? 1 : 0);
      setAttribute(rippleSurface1Ref.current, 'cy', levelY + offset1);
      setAttribute(rippleSurface2Ref.current, 'cy', levelY + offset1);
      if (puddleRef.current) {
        puddleRef.current.style.opacity = String(0.75 + currentProgress * 0.25);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const targetProgress = Math.max(0.06, Math.min(0.96, motionRef.current.progress));
      const reducedMotion = getReducedMotionPreference();
      const response = reducedMotion ? 1 : 1 - Math.exp(-dt * 15);
      progress += (targetProgress - progress) * response;
      if (Math.abs(targetProgress - progress) < 0.0005) progress = targetProgress;

      const pouring = motionRef.current.isPouring && !reducedMotion;
      if (!reducedMotion) {
        const targetSpeed = pouring ? 4.5 : 2;
        waveSpeed += (targetSpeed - waveSpeed) * Math.min(1, dt * 2.2);
        phase = (phase + dt * waveSpeed) % (Math.PI * 2);
      }

      updateSvg(progress, phase, pouring, reducedMotion);
      animationId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      animationId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (animationId) cancelAnimationFrame(animationId);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.01 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [motionRef, droplets]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      style={{ perspective: '1000px' }}
      aria-label="پیاله شیشه‌ای بلورین نوشیدنی SEA BREW"
    >
      <div className="relative w-full h-full max-w-[380px] max-h-[480px] flex items-center justify-center">
        <svg
          viewBox="0 0 360 480"
          className="w-full h-full drop-shadow-2xl overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 1. Glass Outer Outline Path Definition */}
            {/* Tapered Rocks Tumbler: Top width=214 (73 to 287), Bottom width=152 (104 to 256) */}
            <clipPath id="glass-interior-clip">
              {/* Inside Wall contour - liquid never leaks outside this */}
              <path d="M 86 78 L 115 382 C 117 392 126 396 138 396 L 222 396 C 234 396 243 392 245 382 L 274 78 Z" />
            </clipPath>

            {/* 2. Cold Brew Liquid Rich Vertical Gradient */}
            <linearGradient id="cold-brew-gradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#1e0e06" stopOpacity="0.98" />
              <stop offset="25%" stopColor="#311608" stopOpacity="0.96" />
              <stop offset="55%" stopColor="#4a220b" stopOpacity="0.94" />
              <stop offset="80%" stopColor="#7a3a0e" stopOpacity="0.92" />
              <stop offset="96%" stopColor="#b45309" stopOpacity="0.90" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
            </linearGradient>

            {/* 3. Meniscus Golden Crema Ring */}
            <linearGradient id="crema-shimmer" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.7" />
              <stop offset="20%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
            </linearGradient>

            {/* 4. Crystal Glass Reflection Gradients */}
            <linearGradient id="glass-specular-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="glass-specular-right" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* 5. Thick Crystal Base Refraction Gradient */}
            <linearGradient id="crystal-base-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#fef3c7" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
            </linearGradient>

            {/* 6. Contact Amber Caustic Glow */}
            <radialGradient id="caustic-pool" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={tint} stopOpacity="0.4" />
              <stop offset="45%" stopColor="#825f27" stopOpacity="0.25" />
              <stop offset="75%" stopColor="#161617" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#161617" stopOpacity="0" />
            </radialGradient>

            {/* 7. Ice Cube Material Gradient */}
            <linearGradient id="ice-body-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#e0f2fe" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
            </linearGradient>

            {/* 8. Pouring Stream Gradient */}
            <linearGradient id="pour-stream-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350f" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#b45309" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
            </linearGradient>

            {/* Frost Filter for Ice Core */}
            <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* LAYER 0: Ambient Contact Shadow & Golden Caustic Halo on Table Surface */}
          <ellipse
            ref={puddleRef}
            cx="180"
            cy="428"
            rx="110"
            ry="24"
            fill="url(#caustic-pool)"
            filter="blur(10px)"
            style={{ opacity: 0.75 + p * 0.25 }}
          />
          <ellipse
            cx="180"
            cy="426"
            rx="75"
            ry="12"
            fill="#161617"
            fillOpacity="0.35"
            filter="blur(4px)"
          />

          {/* LAYER 1: Thick Faceted Crystal Punt Base */}
          {/* Base spans Y=382 to Y=424 */}
          <path
            d="M 104 416 C 104 424 114 428 128 428 L 232 428 C 246 428 256 424 256 416 L 254 382 C 243 392 234 396 222 396 L 138 396 C 126 396 117 392 106 382 Z"
            fill="url(#crystal-base-grad)"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />

          {/* Base facet cuts for genuine crystal look */}
          <line x1="130" y1="396" x2="124" y2="426" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" />
          <line x1="160" y1="396" x2="156" y2="427" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
          <line x1="200" y1="396" x2="204" y2="427" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
          <line x1="230" y1="396" x2="236" y2="426" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" />

          {/* LAYER 2: INTERIOR CONTENTS (Clipped precisely to glass interior wall) */}
          <g clipPath="url(#glass-interior-clip)">
            {/* Subtle empty glass background tint */}
            <rect x="0" y="0" width="360" height="480" fill="#fef08a" fillOpacity="0.04" />

            {/* Liquid Volume Body */}
            {/* Dynamic wave path hugging the bottom and curving at the surface */}
            <path
              ref={liquidBodyRef}
              d={`
                M ${currentLeftX - 4} ${liquidLevelY + waveOffset1}
                C ${currentLeftX + currentWidth * 0.3} ${liquidLevelY + waveOffset1 - 5},
                  ${currentLeftX + currentWidth * 0.7} ${liquidLevelY + waveOffset2 + 5},
                  ${currentRightX + 4} ${liquidLevelY + waveOffset2}
                L 260 410
                L 100 410
                Z
              `}
              fill="url(#cold-brew-gradient)"
            />

            {/* Meniscus / Liquid Top Surface Wave Band */}
            <path
              ref={meniscusRef}
              d={`
                M ${currentLeftX - 4} ${liquidLevelY + waveOffset1}
                C ${currentLeftX + currentWidth * 0.3} ${liquidLevelY + waveOffset1 - 5},
                  ${currentLeftX + currentWidth * 0.7} ${liquidLevelY + waveOffset2 + 5},
                  ${currentRightX + 4} ${liquidLevelY + waveOffset2}
                C ${currentLeftX + currentWidth * 0.7} ${liquidLevelY + waveOffset2 + 4},
                  ${currentLeftX + currentWidth * 0.3} ${liquidLevelY + waveOffset1 + 4},
                  ${currentLeftX - 4} ${liquidLevelY + waveOffset1}
                Z
              `}
              fill="url(#crema-shimmer)"
            />

            {/* Product tint wash — the drink takes the recipe's colour */}
            <rect
              ref={tintRef}
              x="0"
              y={Math.max(0, liquidLevelY - 4)}
              width="360"
              height={Math.max(0, 480 - (liquidLevelY - 4))}
              fill={tint}
              opacity="0.3"
              style={{ mixBlendMode: 'color', transition: 'fill 600ms ease' }}
            />

            {/* Micro Effervescence Bubbles at Meniscus Edge */}
            <circle ref={bubble1Ref} cx={currentLeftX + 12} cy={liquidLevelY + waveOffset1 + 1} r="1.6" fill="#fef08a" opacity="0.8" />
            <circle ref={bubble2Ref} cx={currentLeftX + 24} cy={liquidLevelY + waveOffset1 + 2} r="1.2" fill="#fef08a" opacity="0.6" />
            <circle ref={bubble3Ref} cx={currentRightX - 16} cy={liquidLevelY + waveOffset2 + 1} r="1.5" fill="#fef08a" opacity="0.75" />
            <circle ref={bubble4Ref} cx={currentRightX - 32} cy={liquidLevelY + waveOffset2 + 2} r="1.1" fill="#fef08a" opacity="0.55" />

            {/* ICE CUBE 1 (Left-Mid) */}
            <g ref={ice1Ref} transform={`translate(142, ${ice1Y}) rotate(${ice1Rot})`}>
              {/* Drop shadow in fluid */}
              <rect x="-24" y="-20" width="48" height="42" rx="6" fill="#1e0e06" fillOpacity="0.4" />
              {/* Ice cube body */}
              <rect
                x="-24"
                y="-20"
                width="48"
                height="42"
                rx="6"
                fill="url(#ice-body-grad)"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
              {/* Internal frosty core */}
              <ellipse cx="0" cy="0" rx="14" ry="10" fill="#ffffff" fillOpacity="0.5" filter="url(#soft-glow)" />
              {/* Crisp faceted bevel lines */}
              <line x1="-24" y1="-20" x2="-14" y2="-12" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
              <line x1="24" y1="-20" x2="14" y2="-12" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
              <line x1="24" y1="22" x2="14" y2="14" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
              <rect x="-14" y="-12" width="28" height="26" rx="3" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" />
            </g>

            {/* ICE CUBE 2 (Right-Low) */}
            <g ref={ice2Ref} transform={`translate(210, ${ice2Y}) rotate(${ice2Rot})`}>
              <rect x="-22" y="-18" width="44" height="38" rx="5" fill="#1e0e06" fillOpacity="0.45" />
              <rect
                x="-22"
                y="-18"
                width="44"
                height="38"
                rx="5"
                fill="url(#ice-body-grad)"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.85"
              />
              <ellipse cx="0" cy="0" rx="12" ry="9" fill="#ffffff" fillOpacity="0.45" filter="url(#soft-glow)" />
              <line x1="-22" y1="-18" x2="-12" y2="-10" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.75" />
              <line x1="22" y1="-18" x2="12" y2="-10" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.75" />
              <rect x="-12" y="-10" width="24" height="22" rx="2" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.55" />
            </g>

            {/* ICE CUBE 3 (Center Top - Floating high) */}
            <g ref={ice3Ref} transform={`translate(178, ${ice3Y}) rotate(${ice3Rot})`}>
              <rect x="-20" y="-18" width="40" height="36" rx="5" fill="#1e0e06" fillOpacity="0.35" />
              <rect
                x="-20"
                y="-18"
                width="40"
                height="36"
                rx="5"
                fill="url(#ice-body-grad)"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.9"
              />
              <ellipse cx="0" cy="0" rx="10" ry="8" fill="#ffffff" fillOpacity="0.55" filter="url(#soft-glow)" />
              <line x1="-20" y1="-18" x2="-11" y2="-10" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
              <line x1="20" y1="-18" x2="11" y2="-10" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
              <rect x="-11" y="-10" width="22" height="20" rx="2" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" />
            </g>

            {/* Recipe ingredient — the tab decides what floats in the drink */}
            {recipe === 'bloom' && (
              <g ref={ingredientRef} transform={`translate(195, ${strawY}) rotate(${strawRot})`}>
                <path d="M -4 -3 C -9 -15, 1 -22, 10 -20" stroke="#4C7A3A" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                <path d="M 9 -2 C 10 -11, 12 -16, 10 -20" stroke="#4C7A3A" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <circle cx="-8" cy="6" r="10" fill="#B01E42" stroke="#7A0F2A" strokeWidth="1.2" />
                <circle cx="9" cy="9" r="9" fill="#C42A50" stroke="#7A0F2A" strokeWidth="1.2" />
                <ellipse cx="-12" cy="2" rx="2.6" ry="1.8" fill="#FFFFFF" opacity="0.45" />
              </g>
            )}

            {recipe === 'apex' && (
              <g ref={ingredientRef} transform={`translate(195, ${strawY}) rotate(${strawRot})`}>
                <circle cx="0" cy="0" r="15" fill="#F0A83A" stroke="#C97B18" strokeWidth="1.4" />
                <circle cx="0" cy="0" r="11" fill="#FFC96B" opacity="0.85" />
                <path d="M 0 -11 L 0 11 M -11 0 L 11 0 M -8 -8 L 8 8 M 8 -8 L -8 8" stroke="#E08E22" strokeWidth="1.1" />
                <circle cx="0" cy="0" r="3.2" fill="#FFF3D6" />
              </g>
            )}

            {recipe === 'focus' && (
              <g ref={ingredientRef} transform={`translate(195, ${strawY}) rotate(${strawRot})`}>
                <path d="M 0 -20 C 16 -12, 16 8, 0 20 C -16 8, -16 -12, 0 -20 Z" fill="#5F8C39" stroke="#3F6323" strokeWidth="1.3" />
                <path d="M 0 -18 L 0 18" stroke="#9CCB6E" strokeWidth="1.2" />
                <path d="M 0 -8 L 8 -2 M 0 2 L -8 8 M 0 -1 L 7 4" stroke="#9CCB6E" strokeWidth="0.9" />
              </g>
            )}

            {recipe === 'grace' && (
              <g ref={ingredientRef} transform={`translate(195, ${strawY}) rotate(${strawRot})`}>
                <circle cx="-9" cy="2" r="8" fill="#5B2A5E" stroke="#3A1740" strokeWidth="1.1" />
                <circle cx="8" cy="-3" r="7.5" fill="#7C3A8E" stroke="#3A1740" strokeWidth="1.1" />
                <circle cx="2" cy="10" r="7" fill="#4A1F55" stroke="#3A1740" strokeWidth="1.1" />
                <ellipse cx="-12" cy="-2" rx="2" ry="1.4" fill="#FFFFFF" opacity="0.35" />
              </g>
            )}

            {recipe === 'haven' && (
              <g ref={ingredientRef} transform={`translate(195, ${strawY}) rotate(${strawRot})`}>
                <path d="M 0 -22 C 12 -10, 12 10, 0 22 C -12 10, -12 -10, 0 -22 Z" fill="#3E8C78" stroke="#245C4D" strokeWidth="1.3" />
                <path d="M 0 -19 L 0 19" stroke="#9AD6C6" strokeWidth="1.1" />
                <path d="M 0 -6 L 7 -1 M 0 4 L -7 9" stroke="#9AD6C6" strokeWidth="0.9" />
              </g>
            )}

            {recipe === 'vigor' && (
              <g ref={ingredientRef} transform={`translate(195, ${strawY}) rotate(${strawRot})`}>
                <ellipse cx="0" cy="0" rx="11" ry="15" fill="#241004" stroke="#451a03" strokeWidth="1.2" />
                <path d="M 0 -12 C 4 -5 -4 5 0 12" stroke="#8A4310" strokeWidth="1.6" fill="none" />
                <ellipse cx="-4" cy="-7" rx="2" ry="1.4" fill="#FFFFFF" opacity="0.18" />
              </g>
            )}

            {/* small recipe accents (same buoyancy as the hero ingredient) */}
            <g ref={bean1Ref} transform={`translate(135, ${bean1Y}) rotate(32)`}>
              <ellipse cx="0" cy="0" rx="7.5" ry="10.5" fill={tint} stroke="#00000044" strokeWidth="1" />
              <ellipse cx="-2" cy="-4" rx="1.8" ry="1.2" fill="#FFFFFF" opacity="0.25" />
            </g>
            <g ref={bean2Ref} transform={`translate(225, ${bean2Y}) rotate(-24)`}>
              <ellipse cx="0" cy="0" rx="6.8" ry="9.6" fill={tint} stroke="#00000044" strokeWidth="1" />
              <ellipse cx="-2" cy="-3" rx="1.6" ry="1.1" fill="#FFFFFF" opacity="0.25" />
            </g>
          </g>

          {/* LAYER 3: POURING SURFACE RIPPLE (NO vertical stream line) */}
          <g ref={rippleRef} aria-hidden="true" opacity={initialPouring ? 1 : 0}>
              {/* Gentle surface ripple rings only - zero vertical lines */}
              <ellipse
                ref={rippleSurface1Ref}
                cx="180"
                cy={liquidLevelY + waveOffset1}
                rx="18"
                ry="5"
                fill="none"
                stroke="#fef08a"
                strokeWidth="1.2"
                opacity="0.8"
              />
              <ellipse
                ref={rippleSurface2Ref}
                cx="180"
                cy={liquidLevelY + waveOffset1}
                rx="28"
                ry="7"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                opacity="0.5"
              />
          </g>

          {/* LAYER 4: GLASS SPECULAR REFLECTIONS & HIGHLIGHTS (Overlay above fluid) */}
          {/* Left Vertical High-Gloss Reflection Beam */}
          <path
            d="M 88 78 L 98 78 L 124 382 L 115 382 Z"
            fill="url(#glass-specular-left)"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Thin curved secondary gleam on left */}
          <path
            d="M 104 85 L 107 85 L 131 378 L 128 378 Z"
            fill="#ffffff"
            fillOpacity="0.25"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Right Warm Rim Reflection */}
          <path
            d="M 272 78 L 263 78 L 238 382 L 246 382 Z"
            fill="url(#glass-specular-right)"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* LAYER 5: CHILLED CONDENSATION DEW DROPLETS */}
          {/* Form only below current liquid height (chill line) */}
          <g>
            {droplets.map((d, i) => {
              const isChilled = d.cy >= liquidLevelY - 10;
              const opacity = isChilled ? d.opacity : 0;
              return (
                <circle
                  key={i}
                  ref={(node) => { dropletRefs.current[i] = node; }}
                  cx={d.cx}
                  cy={d.cy}
                  r={d.r}
                  fill="#ffffff"
                  fillOpacity={opacity}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  strokeOpacity={opacity * 0.8}
                />
              );
            })}
          </g>

          {/* LAYER 6: GLASS FRAME & RIM BORDER (Crisp crystal contour) */}
          {/* Beveled Top Lip Rim */}
          <ellipse
            cx="180"
            cy="76"
            rx="96"
            ry="7"
            fill="#ffffff"
            fillOpacity="0.12"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.85"
          />
          {/* Inner Lip Rim */}
          <ellipse
            cx="180"
            cy="76"
            rx="91"
            ry="5.5"
            fill="none"
            stroke="#fef3c7"
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />

          {/* Outer Glass Side Walls */}
          {/* Left Wall */}
          <path
            d="M 84 76 L 104 416"
            stroke="#ffffff"
            strokeWidth="2"
            strokeOpacity="0.75"
            strokeLinecap="round"
          />
          {/* Right Wall */}
          <path
            d="M 276 76 L 256 416"
            stroke="#fef08a"
            strokeWidth="1.8"
            strokeOpacity="0.7"
            strokeLinecap="round"
          />

          {/* Bottom Rim Line */}
          <path
            d="M 104 416 C 104 426 116 430 132 430 L 228 430 C 244 430 256 426 256 416"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Decorative Subtle Star Glint at Top-Left Rim */}
          <g transform="translate(86, 75)" className="animate-pulse">
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#ffffff" strokeWidth="1.2" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export const Glass2DCanvas = React.memo(Glass2DCanvasView);
