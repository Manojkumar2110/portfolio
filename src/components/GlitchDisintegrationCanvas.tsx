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
  type: 'laser' | 'block' | 'chip';
  hasGlow: boolean;
  glowColor?: string;
  glowBlur?: number;
}

export default function GlitchDisintegrationCanvas({
  className = '',
  intensity = 1.0,
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

    // Sleek, refined particle count
    const COUNT = Math.floor(42 * intensity);
    const particles: GlitchParticle[] = [];

    const spawnParticle = (forceOrigin = false): GlitchParticle => {
      const rand = Math.random();
      let type: GlitchParticle['type'];
      let w: number;
      let h: number;
      let color: string;
      let isLaser = false;
      let hasGlow = true;
      let glowColor: string | undefined;
      let glowBlur = 8;
      let baseAlpha = 0.8;

      if (rand < 0.3) {
        // Sleek horizontal laser lines (reduced thickness: 1.5 - 3px)
        type = 'laser';
        isLaser = true;
        w = 60 + Math.random() * 190;
        h = 1.5 + Math.random() * 2;
        const laserRand = Math.random();
        if (laserRand < 0.55) {
          color = '#ff1a2a';
          glowColor = 'rgba(255, 26, 42, 0.85)';
          glowBlur = 10;
        } else if (laserRand < 0.85) {
          color = '#00f0ff';
          glowColor = 'rgba(0, 240, 255, 0.85)';
          glowBlur = 9;
        } else {
          color = '#ffffff';
          glowColor = 'rgba(255, 255, 255, 0.7)';
          glowBlur = 6;
        }
        baseAlpha = 0.7 + Math.random() * 0.25;
      } else if (rand < 0.68) {
        // Scaled-down crisp cyber blocks (reduced size: 10px - 22px)
        type = 'block';
        const isSquare = Math.random() < 0.65;
        const size = 11 + Math.random() * 11; // 11px to 22px max
        w = size;
        h = isSquare ? size : 8 + Math.random() * 16;

        const colRand = Math.random();
        if (colRand < 0.38) {
          // Crimson red
          color = '#ff1a2a';
          glowColor = 'rgba(255, 26, 42, 0.7)';
          glowBlur = 8;
          baseAlpha = 0.75 + Math.random() * 0.2;
        } else if (colRand < 0.58) {
          // Translucent dark red
          color = 'rgba(224, 0, 40, 0.6)';
          glowColor = 'rgba(255, 0, 60, 0.4)';
          glowBlur = 6;
          baseAlpha = 0.6 + Math.random() * 0.25;
        } else if (colRand < 0.8) {
          // Electric cyan
          color = '#00f0ff';
          glowColor = 'rgba(0, 240, 255, 0.8)';
          glowBlur = 10;
          baseAlpha = 0.75 + Math.random() * 0.2;
        } else if (colRand < 0.9) {
          // Pale pinkish white
          color = 'rgba(255, 230, 235, 0.85)';
          glowColor = 'rgba(255, 80, 100, 0.6)';
          glowBlur = 8;
          baseAlpha = 0.8;
        } else {
          // Slate blue chip
          color = 'rgba(74, 115, 155, 0.65)';
          glowColor = 'rgba(0, 180, 255, 0.35)';
          glowBlur = 6;
          baseAlpha = 0.65;
        }
      } else {
        // Micro digital chips (reduced size: 5px - 10px)
        type = 'chip';
        w = 5 + Math.random() * 7;
        h = 4 + Math.random() * 7;

        const colRand = Math.random();
        if (colRand < 0.45) {
          color = colRand < 0.25 ? '#ff1a2a' : 'rgba(255, 26, 42, 0.65)';
          glowColor = 'rgba(255, 26, 42, 0.6)';
        } else if (colRand < 0.8) {
          color = '#00f0ff';
          glowColor = 'rgba(0, 240, 255, 0.7)';
        } else {
          color = 'rgba(240, 244, 248, 0.8)';
          glowColor = 'rgba(255, 255, 255, 0.5)';
        }
        glowBlur = 6;
        baseAlpha = 0.6 + Math.random() * 0.3;
      }

      // X origin: slightly over the midline (-0.05 to 0.15) or across right side
      let startX: number;
      if (forceOrigin) {
        startX = -0.04 + Math.random() * 0.2;
      } else {
        startX = -0.04 + Math.pow(Math.random(), 1.25) * 0.85;
      }

      // Y position: from head level down to chest
      const startY = 0.08 + Math.random() * 0.84;

      return {
        x: startX,
        y: startY,
        w,
        h,
        vx: (0.12 + Math.random() * 0.45) * (isLaser ? 1.8 : 1.0),
        vy: (Math.random() - 0.5) * 0.04,
        color,
        alpha: baseAlpha,
        baseAlpha,
        flickerSpeed: 0.05 + Math.random() * 0.18,
        life: 0,
        maxLife: 110 + Math.random() * 180,
        type,
        hasGlow,
        glowColor,
        glowBlur,
      };
    };

    for (let i = 0; i < COUNT; i++) {
      const p = spawnParticle(false);
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    // Periodic horizontal digital slice effect
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
      if (sliceTimer > 3.0 + Math.random() * 2.5) {
        sliceActive = true;
        sliceTimer = 0;
        sliceY = (0.15 + Math.random() * 0.68) * height;
        sliceH = 4 + Math.random() * 12;
        setTimeout(() => {
          sliceActive = false;
        }, 50);
      }

      if (sliceActive) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 60, 0.1)';
        ctx.fillRect(0, sliceY, width, sliceH);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.fillRect(4, sliceY + 1, width - 4, sliceH - 2);
        ctx.restore();
      }

      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        // Smooth horizontal dissipation drift
        p.x += (p.vx / width) * 1.5;
        p.y += (p.vy / height) + Math.sin(time * 2.0 + i * 0.4) * 0.0002;

        const px = p.x * width;
        const py = p.y * height;

        // Subtle mouse deflection
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const push = (1 - dist / 100) * 1.0;
          p.x += (dx / dist) * push * 0.004;
          p.y += (dy / dist) * push * 0.002;
        }

        // Alpha fade in/out
        const lifeRatio = p.life / p.maxLife;
        let fade = 1.0;
        if (lifeRatio < 0.1) fade = lifeRatio / 0.1;
        else if (lifeRatio > 0.8) fade = (1 - lifeRatio) / 0.2;

        const flicker = Math.sin(time * 15 * p.flickerSpeed + i);
        p.alpha = p.baseAlpha * fade * (0.8 + 0.2 * flicker);

        if (p.x > 1.15 || p.life >= p.maxLife || p.alpha <= 0.01) {
          particles[i] = spawnParticle(true);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        if (p.hasGlow && p.glowColor) {
          ctx.shadowColor = p.glowColor;
          ctx.shadowBlur = p.glowBlur || 8;
        }

        ctx.fillStyle = p.color;

        // Subtle digital jitter
        const jx = Math.random() > 0.95 ? (Math.random() - 0.5) * 2 : 0;
        const jy = Math.random() > 0.97 ? (Math.random() - 0.5) * 1.5 : 0;

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
