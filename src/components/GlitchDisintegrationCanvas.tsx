'use client';

import React, { useEffect, useRef } from 'react';

interface GlitchDisintegrationCanvasProps {
  className?: string;
  intensity?: number;
}

interface MicroChip {
  x: number; // 0 to 1 relative to canvas (0 = midline of person)
  y: number; // 0 to 1 relative to canvas
  w: number;
  h: number;
  color: string;
  baseAlpha: number;
  alpha: number;
  flickerSpeed: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
}

interface FloatingBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  glowColor?: string;
  baseAlpha: number;
  alpha: number;
  flickerSpeed: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
}

interface LaserStreak {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  glowColor: string;
  alpha: number;
  vx: number;
  life: number;
  maxLife: number;
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
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Layer 1: Dense Core Micro-Pixels / Voxel Chips ────────────────────────
    // Clustered heavily along the midline (X: 0.00 to 0.28) over face and torso.
    // Sharp, crisp, un-blurred digital particles exactly matching reference design.
    const CHIP_COUNT = Math.floor(180 * intensity);
    const microChips: MicroChip[] = [];

    const spawnChip = (initial = false): MicroChip => {
      const colRand = Math.random();
      let color: string;
      if (colRand < 0.26) {
        // Dark void silhouette blocks that break off from clothing / shadow
        color = 'rgba(10, 12, 16, 0.94)';
      } else if (colRand < 0.54) {
        // Crimson Red / Hot Red accents
        const reds = ['#ff003c', '#ff1a2a', '#ff3366', '#ff4d6d'];
        color = reds[Math.floor(Math.random() * reds.length)];
      } else if (colRand < 0.78) {
        // Electric Cyan & Ice Blue
        const cyans = ['#00f0ff', '#00e5ff', '#38b6ff', '#5ce1e6'];
        color = cyans[Math.floor(Math.random() * cyans.length)];
      } else if (colRand < 0.90) {
        // Stark Pure White
        color = '#ffffff';
      } else {
        // Pale Pink-White
        color = 'rgba(255, 230, 238, 0.95)';
      }

      // Crisp tiny sizes: 2.5px to 5.5px squares, or small 3-8px rectangles
      const isSquare = Math.random() < 0.65;
      const baseSize = 2.5 + Math.random() * 4.0;
      const w = isSquare ? baseSize : 3.0 + Math.random() * 6.0;
      const h = isSquare ? baseSize : 2.0 + Math.random() * 4.0;

      // Heavy concentration right at origin (midline): power distribution
      const x = initial
        ? Math.pow(Math.random(), 2.4) * 0.42
        : Math.pow(Math.random(), 2.8) * 0.16;

      // Spans from head/hair level down to lower chest
      const y = 0.05 + Math.random() * 0.90;

      return {
        x,
        y,
        w: Math.round(w),
        h: Math.round(h),
        color,
        baseAlpha: 0.75 + Math.random() * 0.25,
        alpha: 0.9,
        flickerSpeed: 0.08 + Math.random() * 0.24,
        life: initial ? Math.random() * 140 : 0,
        maxLife: 70 + Math.random() * 130,
        vx: 0.08 + Math.random() * 0.32,
        vy: (Math.random() - 0.5) * 0.03,
      };
    };

    for (let i = 0; i < CHIP_COUNT; i++) {
      microChips.push(spawnChip(true));
    }

    // ── Layer 2: Medium Floating Glitch Rectangles & Glowing Debris ───────────
    // Dispersing outwards into the void (X: 0.05 to 0.70)
    const BLOCK_COUNT = Math.floor(45 * intensity);
    const blocks: FloatingBlock[] = [];

    const spawnBlock = (initial = false): FloatingBlock => {
      const colRand = Math.random();
      let color: string;
      let glowColor: string | undefined;

      if (colRand < 0.40) {
        color = '#ff1a2a';
        glowColor = 'rgba(255, 26, 42, 0.85)';
      } else if (colRand < 0.72) {
        color = '#00f0ff';
        glowColor = 'rgba(0, 240, 255, 0.85)';
      } else if (colRand < 0.88) {
        color = '#ffffff';
        glowColor = 'rgba(255, 255, 255, 0.75)';
      } else {
        color = 'rgba(60, 95, 140, 0.75)';
        glowColor = 'rgba(0, 180, 255, 0.4)';
      }

      // Medium rectangular glitch data blocks (8px to 22px wide, 3.5px to 7px high)
      const w = 8 + Math.random() * 14;
      const h = 3.5 + Math.random() * 4.5;

      const x = initial
        ? 0.04 + Math.pow(Math.random(), 1.4) * 0.70
        : 0.02 + Math.random() * 0.20;
      const y = 0.07 + Math.random() * 0.85;

      return {
        x,
        y,
        w: Math.round(w),
        h: Math.round(h),
        color,
        glowColor,
        baseAlpha: 0.70 + Math.random() * 0.28,
        alpha: 0.85,
        flickerSpeed: 0.05 + Math.random() * 0.16,
        life: initial ? Math.random() * 160 : 0,
        maxLife: 90 + Math.random() * 160,
        vx: 0.16 + Math.random() * 0.55,
        vy: (Math.random() - 0.5) * 0.04,
      };
    };

    for (let i = 0; i < BLOCK_COUNT; i++) {
      blocks.push(spawnBlock(true));
    }

    // ── Layer 3: Razor-Sharp Horizontal Laser Beams ──────────────────────────
    // Very thin (1.5px - 2.5px), glowing streaks shooting straight out to the right
    const LASER_COUNT = Math.floor(22 * intensity);
    const lasers: LaserStreak[] = [];

    const spawnLaser = (initial = false): LaserStreak => {
      const colRand = Math.random();
      let color: string;
      let glowColor: string;

      if (colRand < 0.52) {
        color = '#ff1a2a';
        glowColor = 'rgba(255, 26, 42, 0.95)';
      } else if (colRand < 0.84) {
        color = '#00f0ff';
        glowColor = 'rgba(0, 240, 255, 0.95)';
      } else {
        color = '#ffffff';
        glowColor = 'rgba(255, 255, 255, 0.9)';
      }

      // Thin sleek laser streaks (50px to 250px long, 1.5px to 2.5px height)
      const w = 50 + Math.random() * 200;
      const h = 1.5 + Math.random() * 1.5;

      const x = initial
        ? Math.random() * 0.75
        : -0.04 + Math.random() * 0.18;

      // Staggered along key vertical landmarks: temples, eyes, mouth, collar, chest
      const keyLandmarks = [0.14, 0.22, 0.32, 0.44, 0.58, 0.70, 0.82];
      const baseLandmark = keyLandmarks[Math.floor(Math.random() * keyLandmarks.length)];
      const y = Math.max(0.06, Math.min(0.92, baseLandmark + (Math.random() - 0.5) * 0.08));

      return {
        x,
        y,
        w: Math.round(w),
        h: Math.max(1.5, Math.round(h * 2) / 2),
        color,
        glowColor,
        alpha: 0.80 + Math.random() * 0.20,
        vx: 0.40 + Math.random() * 1.10,
        life: initial ? Math.random() * 120 : 0,
        maxLife: 75 + Math.random() * 140,
      };
    };

    for (let i = 0; i < LASER_COUNT; i++) {
      lasers.push(spawnLaser(true));
    }

    // Occasional subtle horizontal glitch slice
    let sliceActive = false;
    let sliceTimer = 0;
    let sliceY = 0;
    let sliceH = 0;

    // ── Main Animation Loop ──────────────────────────────────────────────────
    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Momentary horizontal slice pulse
      sliceTimer += 0.016;
      if (sliceTimer > 3.6 + Math.random() * 3.0) {
        sliceActive = true;
        sliceTimer = 0;
        sliceY = (0.15 + Math.random() * 0.70) * height;
        sliceH = 3 + Math.random() * 8;
        setTimeout(() => {
          sliceActive = false;
        }, 55);
      }

      if (sliceActive) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 60, 0.18)';
        ctx.fillRect(0, sliceY, width, sliceH);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.fillRect(2, sliceY + 1, width - 2, Math.max(1, sliceH - 2));
        ctx.restore();
      }

      const mouse = mouseRef.current;

      // 1. Draw Micro-Chips
      for (let i = 0; i < microChips.length; i++) {
        const c = microChips[i];
        c.life += 1;
        c.x += (c.vx / width) * 1.5;
        c.y += (c.vy / height) + Math.sin(time * 3.2 + i) * 0.00014;

        const px = c.x * width;
        const py = c.y * height;

        const lifeRatio = c.life / c.maxLife;
        let fade = 1.0;
        if (lifeRatio < 0.08) fade = lifeRatio / 0.08;
        else if (lifeRatio > 0.82) fade = (1 - lifeRatio) / 0.18;

        const flicker = Math.sin(time * 22 * c.flickerSpeed + i * 1.7);
        c.alpha = c.baseAlpha * fade * (0.80 + 0.20 * flicker);

        if (c.x > 0.65 || c.life >= c.maxLife || c.alpha <= 0.01) {
          microChips[i] = spawnChip(false);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, c.alpha));
        ctx.fillStyle = c.color;
        ctx.fillRect(Math.round(px), Math.round(py), c.w, c.h);
        ctx.restore();
      }

      // 2. Draw Floating Blocks with Neon Glow
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        b.life += 1;
        b.x += (b.vx / width) * 1.6;
        b.y += (b.vy / height) + Math.sin(time * 2.2 + i * 0.5) * 0.00018;

        const px = b.x * width;
        const py = b.y * height;

        // Subtle mouse repulsion
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const push = (1 - dist / 100) * 1.0;
          b.x += (dx / dist) * push * 0.004;
          b.y += (dy / dist) * push * 0.002;
        }

        const lifeRatio = b.life / b.maxLife;
        let fade = 1.0;
        if (lifeRatio < 0.08) fade = lifeRatio / 0.08;
        else if (lifeRatio > 0.84) fade = (1 - lifeRatio) / 0.16;

        const flicker = Math.sin(time * 16 * b.flickerSpeed + i * 1.3);
        b.alpha = b.baseAlpha * fade * (0.84 + 0.16 * flicker);

        if (b.x > 1.15 || b.life >= b.maxLife || b.alpha <= 0.01) {
          blocks[i] = spawnBlock(false);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha));
        if (b.glowColor) {
          ctx.shadowColor = b.glowColor;
          ctx.shadowBlur = 6;
        }
        ctx.fillStyle = b.color;
        ctx.fillRect(Math.round(px), Math.round(py), b.w, b.h);
        ctx.restore();
      }

      // 3. Draw Razor-Sharp Laser Beams
      for (let i = 0; i < lasers.length; i++) {
        const l = lasers[i];
        l.life += 1;
        l.x += (l.vx / width) * 2.2;

        const px = l.x * width;
        const py = l.y * height;

        const lifeRatio = l.life / l.maxLife;
        let fade = 1.0;
        if (lifeRatio < 0.08) fade = lifeRatio / 0.08;
        else if (lifeRatio > 0.86) fade = (1 - lifeRatio) / 0.14;

        const alpha = l.alpha * fade;

        if (l.x > 1.25 || l.life >= l.maxLife || alpha <= 0.01) {
          lasers[i] = spawnLaser(false);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowColor = l.glowColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = l.color;
        ctx.fillRect(Math.round(px), Math.round(py), l.w, l.h);
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
