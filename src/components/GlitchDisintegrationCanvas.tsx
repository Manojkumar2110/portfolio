'use client';

import React, { useEffect, useRef } from 'react';

interface GlitchDisintegrationCanvasProps {
  className?: string;
  intensity?: number;
}

// All x/y are normalized 0–1 relative to the FULL viewport canvas.
// ORIGIN_X ≈ 0.55 — where the centered portrait's right silhouette fades out.
// Particles spawn at/near ORIGIN_X and fly rightward, matching the reference.
const ORIGIN_X = 0.55;

interface Particle {
  x: number;         // normalized 0–1 (full viewport)
  y: number;
  w: number;         // pixel width
  h: number;         // pixel height
  color: string;
  glowColor?: string;
  baseAlpha: number;
  alpha: number;
  flickerSpeed: number;
  life: number;
  maxLife: number;
  vx: number;        // normalized units/frame (NOT pixels)
  vy: number;
  kind: 'micro' | 'block' | 'laser';
}

function randColor(): { color: string; glowColor: string } {
  const r = Math.random();
  if (r < 0.30) return { color: '#ff003c', glowColor: 'rgba(255,0,60,0.9)' };
  if (r < 0.58) return { color: '#00f0ff', glowColor: 'rgba(0,240,255,0.9)' };
  if (r < 0.72) return { color: '#ffffff', glowColor: 'rgba(255,255,255,0.8)' };
  if (r < 0.84) return { color: '#ff3366', glowColor: 'rgba(255,51,102,0.85)' };
  if (r < 0.92) return { color: '#38b6ff', glowColor: 'rgba(56,182,255,0.8)' };
  return { color: 'rgba(10,12,16,0.95)', glowColor: '' };
}

function spawnMicro(initial: boolean, intensity: number): Particle {
  const { color, glowColor } = randColor();
  const sq = Math.random() < 0.6;
  const sz = 5 + Math.random() * 7;   // bigger: 5–12px (was 2–6px)
  // Dense cluster right at the disintegration edge, power-curve distribution
  const spread = initial
    ? Math.pow(Math.random(), 1.8) * 0.38
    : Math.pow(Math.random(), 2.5) * 0.08;
  return {
    x: ORIGIN_X + spread,
    y: 0.06 + Math.random() * 0.90,
    w: Math.round(sq ? sz : 5 + Math.random() * 12),   // wider rectangles
    h: Math.round(sq ? sz : 3   + Math.random() * 7),  // taller rectangles
    color,
    glowColor: glowColor || undefined,
    baseAlpha: 0.80 + Math.random() * 0.20,
    alpha: 0.9,
    flickerSpeed: 0.06 + Math.random() * 0.28,
    life: initial ? Math.random() * 100 : 0,
    maxLife: 80 + Math.random() * 120,
    // Slower: ~0.3–1.0 px/frame on 1280px screen (was 1–3.6 px/frame)
    vx: (0.00022 + Math.random() * 0.00055) * intensity,
    vy: (Math.random() - 0.5) * 0.0002,
    kind: 'micro',
  };
}

function spawnBlock(initial: boolean, intensity: number): Particle {
  const { color, glowColor } = randColor();
  const spread = initial
    ? Math.pow(Math.random(), 1.5) * 0.42
    : Math.random() * 0.10;
  return {
    x: ORIGIN_X - 0.01 + spread,
    y: 0.08 + Math.random() * 0.84,
    w: Math.round(14 + Math.random() * 28),  // bigger: 14–42px (was 8–26px)
    h: Math.round(5  + Math.random() * 9),   // bigger: 5–14px (was 3–8px)
    color,
    glowColor: glowColor || undefined,
    baseAlpha: 0.75 + Math.random() * 0.25,
    alpha: 0.85,
    flickerSpeed: 0.04 + Math.random() * 0.18,
    life: initial ? Math.random() * 140 : 0,
    maxLife: 100 + Math.random() * 180,
    vx: (0.00040 + Math.random() * 0.00090) * intensity,  // slower
    vy: (Math.random() - 0.5) * 0.0003,
    kind: 'block',
  };
}

function spawnLaser(initial: boolean, intensity: number): Particle {
  const { color, glowColor } = randColor();
  // Lasers spawn very close to the edge and fly out fast
  const sx = initial
    ? ORIGIN_X - 0.02 + Math.random() * 0.38
    : ORIGIN_X - 0.03 + Math.random() * 0.08;
  const landmarks = [0.10, 0.18, 0.27, 0.36, 0.46, 0.57, 0.68, 0.78, 0.88, 0.95];
  const base = landmarks[Math.floor(Math.random() * landmarks.length)];
  return {
    x: sx,
    y: Math.max(0.05, Math.min(0.97, base + (Math.random() - 0.5) * 0.05)),
    w: Math.round(80 + Math.random() * 260),  // longer: 80–340px (was 55–275px)
    h: Math.max(2, Math.round((2 + Math.random() * 2) * 2) / 2),  // thicker: 2–4px
    color,
    glowColor: glowColor || undefined,
    baseAlpha: 0.85 + Math.random() * 0.15,
    alpha: 0.9,
    flickerSpeed: 0,
    life: initial ? Math.random() * 100 : 0,
    maxLife: 80 + Math.random() * 150,
    vx: (0.0010 + Math.random() * 0.0024) * intensity,  // slower lasers
    vy: 0,
    kind: 'laser',
  };
}

export default function GlitchDisintegrationCanvas({
  className = '',
  intensity = 1.0,
}: GlitchDisintegrationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let time = 0;

    // ── Resize: always use window dimensions so coords are correct ──────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / W;
      mouseRef.current.y = e.clientY / H;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Particle pools ───────────────────────────────────────────────────────
    const MICRO_COUNT  = Math.floor(120 * intensity);
    const BLOCK_COUNT  = Math.floor(35  * intensity);
    const LASER_COUNT  = Math.floor(18  * intensity);

    const particles: Particle[] = [];

    for (let i = 0; i < MICRO_COUNT; i++) particles.push(spawnMicro(true, intensity));
    for (let i = 0; i < BLOCK_COUNT; i++) particles.push(spawnBlock(true, intensity));
    for (let i = 0; i < LASER_COUNT; i++) particles.push(spawnLaser(true, intensity));

    // ── Glitch slice state ───────────────────────────────────────────────────
    let sliceActive = false;
    let sliceTimer = 0;
    let sliceY = 0;
    let sliceH = 0;

    // ── Render loop ──────────────────────────────────────────────────────────
    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.016;

      ctx.clearRect(0, 0, W, H);

      // Occasional full-width horizontal glitch slice
      sliceTimer += 0.016;
      if (sliceTimer > 3.5 + Math.random() * 3) {
        sliceActive = true;
        sliceTimer = 0;
        sliceY = (0.10 + Math.random() * 0.78) * H;
        sliceH = 2 + Math.random() * 9;
        setTimeout(() => { sliceActive = false; }, 60);
      }
      if (sliceActive) {
        // Only slice from ORIGIN to right edge so it looks like it comes from the body
        const ox = ORIGIN_X * W;
        ctx.save();
        ctx.fillStyle = 'rgba(255,0,60,0.14)';
        ctx.fillRect(ox, sliceY, W - ox, sliceH);
        ctx.fillStyle = 'rgba(0,240,255,0.12)';
        ctx.fillRect(ox + 2, sliceY + 1, W - ox - 2, Math.max(1, sliceH - 2));
        ctx.restore();
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // ── Move ────────────────────────────────────────────────────────────
        p.x  += p.vx;
        p.y  += p.vy + Math.sin(time * 3.5 + i * 1.4) * 0.00008;
        p.life += 1;

        // Mouse repulsion (normalized coords)
        if (p.kind !== 'laser' && mx > 0) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.007) {
            const d = Math.sqrt(d2);
            const push = (1 - d / 0.084) * 0.0012;
            p.x += (dx / d) * push;
            p.y += (dy / d) * push * 0.5;
          }
        }

        // ── Recycle ─────────────────────────────────────────────────────────
        if (p.x > 1.08 || p.life >= p.maxLife) {
          if (p.kind === 'micro')  { particles[i] = spawnMicro(false, intensity); continue; }
          if (p.kind === 'block')  { particles[i] = spawnBlock(false, intensity); continue; }
          if (p.kind === 'laser')  { particles[i] = spawnLaser(false, intensity); continue; }
        }

        // ── Alpha / fade ─────────────────────────────────────────────────────
        const lr = p.life / p.maxLife;
        let fade = 1.0;
        if (lr < 0.08) fade = lr / 0.08;
        else if (lr > 0.80) fade = (1 - lr) / 0.20;

        const flicker = p.kind === 'laser'
          ? 1
          : Math.sin(time * 20 * p.flickerSpeed + i * 1.9) * 0.18 + 0.82;

        p.alpha = p.baseAlpha * fade * flicker;

        const a = Math.max(0, Math.min(1, p.alpha));
        if (a < 0.01) continue;

        const px = Math.round(p.x * W);
        const py = Math.round(p.y * H);

        // ── Draw ─────────────────────────────────────────────────────────────
        ctx.save();
        ctx.globalAlpha = a;

        if (p.glowColor) {
          ctx.shadowColor = p.glowColor;
          ctx.shadowBlur  = p.kind === 'laser' ? 10 : p.kind === 'block' ? 7 : 4;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, p.w, p.h);
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
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 25 }}
    />
  );
}
