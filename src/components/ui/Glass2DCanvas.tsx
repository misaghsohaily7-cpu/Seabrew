import React, { useEffect, useRef, useState, useMemo } from 'react';
import { getReducedMotionPreference } from '../../lib/motion';

interface Glass2DCanvasProps {
  progress: number; // 0.08 to 0.96
  isPouring?: boolean;
  className?: string;
}

export const Glass2DCanvas: React.FC<Glass2DCanvasProps> = ({
  progress,
  isPouring = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth lerp progress for buttery animation
  const [smoothProgress, setSmoothProgress] = useState<number>(progress);
  const targetProgressRef = useRef<number>(progress);

  useEffect(() => {
    targetProgressRef.current = progress;
  }, [progress]);

  // Wave phase animation
  const [wavePhase, setWavePhase] = useState<number>(0);

  // Interactive tilt state
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isInteractingRef = useRef<boolean>(false);

  // Animation loop for wave motion & progress lerp
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const isReduced = getReducedMotionPreference();

      // Smooth progress lerp
      setSmoothProgress((prev) => {
        const diff = targetProgressRef.current - prev;
        if (Math.abs(diff) < 0.001) return targetProgressRef.current;
        return prev + diff * (isReduced ? 0.25 : 0.12);
      });

      // Advance wave phase
      if (!isReduced) {
        setWavePhase((prev) => (prev + dt * (isPouring ? 4.5 : 2.0)) % (Math.PI * 2));
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPouring]);

  // Mouse / Pointer Parallax handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (getReducedMotionPreference()) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({
      x: Math.max(-10, Math.min(10, -normY * 9)),
      y: Math.max(-12, Math.min(12, normX * 11)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
    isInteractingRef.current = false;
  };

  // Dimensional Geometry constants (SVG coordinate space 360 x 480)
  const BOTTOM_INNER_Y = 388;
  const TOP_MAX_Y = 115;
  const FILLABLE_HEIGHT = BOTTOM_INNER_Y - TOP_MAX_Y; // 273px

  // Current liquid level Y coordinate
  const p = Math.max(0.06, Math.min(0.96, smoothProgress));
  const liquidHeight = p * FILLABLE_HEIGHT;
  const liquidLevelY = BOTTOM_INNER_Y - liquidHeight;

  // Wave amplitude based on pouring & motion
  const isReduced = getReducedMotionPreference();
  const waveAmp = isReduced ? 0 : isPouring ? 7 : 3.5;
  const waveOffset1 = Math.sin(wavePhase) * waveAmp;
  const waveOffset2 = Math.cos(wavePhase * 1.3) * waveAmp * 0.8;

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
  const ice1Y = liquidHeight > 45 ? ice1TargetY : ice1RestY;
  const ice1Rot = -12 + (liquidHeight > 45 ? Math.sin(wavePhase * 0.8) * 5 : 0);

  const ice2RestY = 340;
  const ice2TargetY = Math.max(175, Math.min(ice2RestY, liquidLevelY + 50));
  const ice2Y = liquidHeight > 65 ? ice2TargetY : ice2RestY;
  const ice2Rot = 16 + (liquidHeight > 65 ? Math.cos(wavePhase * 0.9) * 6 : 0);

  const ice3RestY = 320;
  const ice3TargetY = Math.max(140, Math.min(ice3RestY, liquidLevelY + 22));
  const ice3Y = liquidHeight > 85 ? ice3TargetY : ice3RestY;
  const ice3Rot = 8 + (liquidHeight > 85 ? Math.sin(wavePhase * 1.1 + 1) * 4 : 0);

  // Floating Strawberry Slice
  const strawRestY = 345;
  const strawTargetY = Math.max(130, Math.min(strawRestY, liquidLevelY + 18));
  const strawY = liquidHeight > 55 ? strawTargetY : strawRestY;
  const strawRot = -18 + (liquidHeight > 55 ? Math.sin(wavePhase * 1.2) * 6 : 0);

  // Floating Roasted Coffee Beans
  const bean1Y = Math.max(180, Math.min(360, liquidLevelY + 80 + Math.sin(wavePhase) * 6));
  const bean2Y = Math.max(200, Math.min(370, liquidLevelY + 115 + Math.cos(wavePhase * 0.7) * 7));

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

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full flex items-center justify-center select-none transition-transform duration-300 ease-out ${className}`}
      style={{
        perspective: '1000px',
      }}
      aria-label="پیاله شیشه‌ای بلورین نوشیدنی SEA BREW"
    >
      <div
        className="relative w-full h-full max-w-[380px] max-h-[480px] flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
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
              <stop offset="0%" stopColor="#fdb716" stopOpacity="0.45" />
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
            cx="180"
            cy="428"
            rx="110"
            ry="24"
            fill="url(#caustic-pool)"
            filter="blur(10px)"
            className="transition-opacity duration-300"
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

            {/* Micro Effervescence Bubbles at Meniscus Edge */}
            <circle cx={currentLeftX + 12} cy={liquidLevelY + waveOffset1 + 1} r="1.6" fill="#fef08a" opacity="0.8" />
            <circle cx={currentLeftX + 24} cy={liquidLevelY + waveOffset1 + 2} r="1.2" fill="#fef08a" opacity="0.6" />
            <circle cx={currentRightX - 16} cy={liquidLevelY + waveOffset2 + 1} r="1.5" fill="#fef08a" opacity="0.75" />
            <circle cx={currentRightX - 32} cy={liquidLevelY + waveOffset2 + 2} r="1.1" fill="#fef08a" opacity="0.55" />

            {/* ICE CUBE 1 (Left-Mid) */}
            <g transform={`translate(142, ${ice1Y}) rotate(${ice1Rot})`}>
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
            <g transform={`translate(210, ${ice2Y}) rotate(${ice2Rot})`}>
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
            <g transform={`translate(178, ${ice3Y}) rotate(${ice3Rot})`}>
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

            {/* FRESH STRAWBERRY SLICE (Floating near liquid surface) */}
            <g
              transform={`translate(195, ${strawY}) rotate(${strawRot}) scale(0.85)`}
              className="transition-transform duration-150"
            >
              {/* Red strawberry flesh */}
              <path
                d="M 0 -24 C 18 -24 24 2 0 24 C -24 2 -18 -24 0 -24 Z"
                fill="#dc2626"
                stroke="#b91c1c"
                strokeWidth="1.2"
              />
              {/* Inner core pattern */}
              <path
                d="M 0 -16 C 10 -16 14 0 0 16 C -14 0 -10 -16 0 -16 Z"
                fill="#fca5a5"
                fillOpacity="0.7"
              />
              {/* Golden seeds */}
              <circle cx="-6" cy="-8" r="1" fill="#fef08a" />
              <circle cx="6" cy="-8" r="1" fill="#fef08a" />
              <circle cx="-8" cy="2" r="1" fill="#fef08a" />
              <circle cx="8" cy="2" r="1" fill="#fef08a" />
              <circle cx="0" cy="-2" r="1.1" fill="#fef08a" />
              <circle cx="-4" cy="10" r="0.9" fill="#fef08a" />
              <circle cx="4" cy="10" r="0.9" fill="#fef08a" />
            </g>

            {/* ROASTED SPECIALTY COFFEE BEAN 1 */}
            <g transform={`translate(135, ${bean1Y}) rotate(32) scale(0.9)`}>
              <ellipse cx="0" cy="0" rx="9" ry="13" fill="#241004" stroke="#451a03" strokeWidth="1" />
              <path d="M 0 -10 C 3 -4 -3 4 0 10" stroke="#78350f" strokeWidth="1.4" fill="none" />
            </g>

            {/* ROASTED SPECIALTY COFFEE BEAN 2 */}
            <g transform={`translate(225, ${bean2Y}) rotate(-24) scale(0.85)`}>
              <ellipse cx="0" cy="0" rx="8.5" ry="12" fill="#241004" stroke="#451a03" strokeWidth="1" />
              <path d="M 0 -9 C -3 -3 3 3 0 9" stroke="#78350f" strokeWidth="1.4" fill="none" />
            </g>
          </g>

          {/* LAYER 3: POURING SURFACE RIPPLE (NO vertical stream line) */}
          {isPouring && (
            <g className="animate-pulse">
              {/* Gentle surface ripple rings only - zero vertical lines */}
              <ellipse
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
          )}

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
                  cx={d.cx}
                  cy={d.cy}
                  r={d.r}
                  fill="#ffffff"
                  fillOpacity={opacity}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  strokeOpacity={opacity * 0.8}
                  className="transition-opacity duration-500"
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
