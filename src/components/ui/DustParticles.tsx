import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

interface DustParticlesProps {
  count?: number;
  className?: string;
  color?: string; // Hex or rgb
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  speed: number;
}

export const DustParticles: React.FC<DustParticlesProps> = ({
  count = 50,
  className = '',
  color = '#FDB716',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracker for subtle reactive drift
    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseActive = false;

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.35, // Drifting gently upwards like warm coastal air
        size: 0.8 + Math.random() * 2.2,
        alpha: 0.15 + Math.random() * 0.55,
        baseAlpha: 0.15 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
      });
    }

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Browninan wave motion
        p.phase += p.speed * dt * 2;
        const driftX = Math.sin(p.phase) * 0.4;
        const driftY = Math.cos(p.phase * 0.8) * 0.2;

        p.x += (p.vx + driftX);
        p.y += (p.vy + driftY);

        // Repel slightly if mouse is nearby
        if (mouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 15000 && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 122) * 1.5;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Wrap around boundaries smoothly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
        }
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        // Twinkle pulsating alpha
        const currentAlpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase * 1.5));

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = color;
        ctx.shadowBlur = p.size * 3.5;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [count, color, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full select-none z-10 ${className}`}
      aria-hidden="true"
    />
  );
};
