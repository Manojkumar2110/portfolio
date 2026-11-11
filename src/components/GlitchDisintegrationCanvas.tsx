'use client';

import React, { useEffect, useRef } from 'react';

interface GlitchDisintegrationCanvasProps {
  className?: string;
  intensity?: number;
}

interface GlitchParticle {
  x: number; // 0 to 1 relative to right-half canvas (0 = midline of person)
  y: number; // 0 to 1 relative to right-half canvas
  w: number;
  h: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  flickerSpeed: number;
  life: number;
  maxLife: number;
  isLaser: boolean;
  hasGlow: boolean;
}

const GLITCH_PALETTE = [
  // Crisp stark whites
  '#ffffff',
  '#f0f4f8',
  // Electric cyan & ice blue (matching eye flare)
  '#00f0ff',
  '#4deeea',
  '#74b9ff',
  // Crimson red & magenta accents (matching theme & reference)
  '#e00000',
  '#ff1a2a',
  '#ff4757',
  // Subtle translucent data chips
  'rgba(0, 240, 255, 0.65)',
  'rgba(255, 26, 42, 0.65)',
  'rgba(255, 255, 255, 0.75)',
];

export default function GlitchDisintegrationCanvas({
  className = '',
  intensity = 0.65,
}: GlitchDisintegrationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // REDUCED DENSITY: clean, sparse, and elegant matching the reference
    const COUNT = Math.floor(55 * intensity);
    const particles: GlitchParticle[] = [];

    const spawnParticle = (forceOrigin = false): GlitchParticle => {
      const isLaser = Math.random() < 0.32;
      let w: number;
      let h: number;

      if (isLaser) {
        // Horizontal laser lines
        w = 30 + Math.random() * 200;
        h = 1 + Math.random() * 1.8;
      } else {
        // Sparse digital chips
        const isMicro = Math.random() < 0.4;
        w = isMicro ? 4 + Math.random() * 6 : 8 + Math.random() * 22;
        h = isMicro ? 3 + Math.random() * 5 : 4 + Math.random() * 9;
      }

      // X origin: starts from the midline (0.0 to 0.25) or distributed across right half
      let startX: number;
      if (forceOrigin) {
        startX = Math.random() * 0.16;
      } else {
        startX = Math.pow(Math.random(), 1.4) * 0.85;
      }

      // Y position: from upper head level down to chest
      const startY = 0.12 + Math.random() * 0.82;

      // Color selection matching reference
      let color: string;
      const colRand = Math.random();
      if (isLaser) {
        color = colRand < 0.5 ? '#ff1a2a' : colRand < 0.85 ? '#00f0ff' : '#ffffff';
      } else if (colRand < 0.42) {
        // Crimson reds
        color = GLITCH_PALETTE[5 + Math.floor(Math.random() * 3)];
      } else if (colRand < 0.78) {
        // Cyans
        color = GLITCH_PALETTE[2 + Math.floor(Math.random() * 3)];
      } else {
        // White
        color = '#ffffff';
      }

      const baseAlpha = 0.35 + Math.random() * 0.55;

      return {
        x: startX,
        y: startY,
        w,
        h,
        vx: (0.12 + Math.random() * 0.65) * (isLaser ? 2.2 : 1.0),
        vy: (Math.random() - 0.5) * 0.06,
        color,
        alpha: baseAlpha,
        baseAlpha,
        flickerSpeed: 0.06 + Math.random() * 0.2,
        life: 0,
        maxLife: 90 + Math.random() * 180,
        isLaser,
        hasGlow: isLaser || color === '#00f0ff' || color === '#ff1a2a',
      };
    };

    for (let i = 0; i < COUNT; i++) {
      const p = spawnParticle(false);
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    // Periodic subtle horizontal glitch slice
    let sliceActive = false;
    let sliceTimer = 0;
    let sliceY = 0;
    let sliceH = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Subtle horizontal glitch slice
      sliceTimer += 0.016;
      if (sliceTimer > 3.2 + Math.random() * 2.5) {
        sliceActive = true;
        sliceTimer = 0;
        sliceY = (0.18 + Math.random() * 0.64) * height;
        sliceH = 8 + Math.random() * 24;
        setTimeout(() => { sliceActive = false; }, 60);
      }

      if (sliceActive) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 60, 0.12)';
        ctx.fillRect(0, sliceY, width, sliceH);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.fillRect(4, sliceY + 1, width - 4, sliceH - 2);
        ctx.restore();
      }

      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        p.x += (p.vx / width) * 1.5;
        p.y += (p.vy / height) + Math.sin(time * 2.5 + i) * 0.0002;

        const px = p.x * width;
        const py = p.y * height;

        // Subtle mouse deflection
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const push = (1 - dist / 110) * 1.0;
          p.x += (dx / dist) * push * 0.006;
          p.y += (dy / dist) * push * 0.003;
        }

        // Alpha fade in/out
        const lifeRatio = p.life / p.maxLife;
        let fade = 1.0;
        if (lifeRatio < 0.12) fade = lifeRatio / 0.12;
        else if (lifeRatio > 0.8) fade = (1 - lifeRatio) / 0.2;

        const flicker = Math.sin(time * 18 * p.flickerSpeed + i);
        p.alpha = p.baseAlpha * fade * (0.75 + 0.25 * flicker);

        if (p.x > 1.15 || p.life >= p.maxLife || p.alpha <= 0.01) {
          particles[i] = spawnParticle(true);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        if (p.hasGlow) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.isLaser ? 6 : 3;
        }

        ctx.fillStyle = p.color;

        // Subtle jitter
        const jx = Math.random() > 0.95 ? (Math.random() - 0.5) * 3 : 0;
        const jy = Math.random() > 0.97 ? (Math.random() - 0.5) * 2 : 0;

        ctx.fillRect(px + jx, py + jy, p.w, p.h);
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-20 w-full h-full ${className}`}
    />
  );
}
