'use client';

import React, { useEffect, useRef } from 'react';

interface GlitchDisintegrationCanvasProps {
  className?: string;
  intensity?: number;
}

// ── Design constants ─────────────────────────────────────────────────────────
// ORIGIN_X: where the portrait's right silhouette begins to dissolve (~55 %).
// All x/y are normalized 0–1 over the FULL viewport.
const ORIGIN_X = 0.54;

// ── Particle type ────────────────────────────────────────────────────────────
interface P {
  x: number; y: number;
  w: number; h: number;
  color: string; glow: string;
  baseA: number; alpha: number;
  flkSpd: number;
  life: number; maxLife: number;
  vx: number; vy: number;
  kind: 0 | 1 | 2 | 3; // 0=dust 1=chip 2=block 3=laser
}

// ── Colour palette ───────────────────────────────────────────────────────────
// Weighted toward cyan > red > white to match the reference glitch aesthetic.
function pickColor(): [string, string] {
  const r = Math.random();
  if (r < 0.35) return ['#00f0ff', 'rgba(0,240,255,1)'];
  if (r < 0.60) return ['#ff003c', 'rgba(255,0,60,1)'];
  if (r < 0.74) return ['#ffffff', 'rgba(255,255,255,0.9)'];
  if (r < 0.84) return ['#38b6ff', 'rgba(56,182,255,0.9)'];
  if (r < 0.91) return ['#ff4d6d', 'rgba(255,77,109,0.9)'];
  return ['rgba(8,10,14,0.92)', ''];   // dark silhouette chip
}

// ── Vertical weight: concentrate toward upper-body / head area ────────────────
// Returns a y value biased to 0.12–0.72 (head + chest) rather than uniform.
function weightedY(): number {
  const r = Math.random();
  if (r < 0.70) return 0.12 + Math.random() * 0.60;   // head + chest  (70%)
  if (r < 0.90) return 0.72 + Math.random() * 0.22;   // abdomen       (20%)
  return Math.random() * 0.12;                          // very top      (10%)
}

// ── Layer 0: Edge dust — tiny, near-static, right at the boundary ─────────────
function spawnDust(initial: boolean): P {
  const [color, glow] = pickColor();
  // Dust spawns within ±0.025 of ORIGIN_X (some peek left = emerging from body)
  const spread = (Math.random() - 0.15) * 0.05;
  return {
    x: ORIGIN_X + spread,
    y: weightedY(),
    w: Math.round(3 + Math.random() * 5),    // 3–8 px
    h: Math.round(3 + Math.random() * 5),
    color, glow,
    baseA: 0.70 + Math.random() * 0.30,
    alpha: 0.8,
    flkSpd: 0.14 + Math.random() * 0.40,     // fast random flicker
    life: initial ? Math.random() * 90 : 0,
    maxLife: 50 + Math.random() * 80,
    vx: 0.00005 + Math.random() * 0.00018,   // near-static drift
    vy: (Math.random() - 0.5) * 0.00012,
    kind: 0,
  };
}

// ── Layer 1: Scatter chips — medium pixels drifting outward ──────────────────
function spawnChip(initial: boolean): P {
  const [color, glow] = pickColor();
  // Power-curve: heavy at ORIGIN, sparse further right
  const spread = Math.pow(Math.random(), 2.0) * 0.32;
  return {
    x: ORIGIN_X + spread,
    y: weightedY(),
    w: Math.round(6 + Math.random() * 12),   // 6–18 px
    h: Math.round(5 + Math.random() * 10),   // 5–15 px
    color, glow,
    baseA: 0.80 + Math.random() * 0.20,
    alpha: 0.9,
    flkSpd: 0.08 + Math.random() * 0.22,
    life: initial ? Math.random() * 110 : 0,
    maxLife: 100 + Math.random() * 140,
    vx: 0.00028 + Math.random() * 0.00055,
    vy: (Math.random() - 0.5) * 0.00022,
    kind: 1,
  };
}

// ── Layer 2: Glitch blocks — larger bright rectangles with strong glow ────────
function spawnBlock(initial: boolean): P {
  const [color, glow] = pickColor();
  const spread = Math.pow(Math.random(), 1.6) * 0.38;
  return {
    x: ORIGIN_X - 0.01 + spread,
    y: weightedY(),
    w: Math.round(18 + Math.random() * 36),  // 18–54 px
    h: Math.round(5  + Math.random() * 11),  // 5–16 px
    color, glow,
    baseA: 0.80 + Math.random() * 0.20,
    alpha: 0.85,
    flkSpd: 0.04 + Math.random() * 0.14,
    life: initial ? Math.random() * 150 : 0,
    maxLife: 120 + Math.random() * 200,
    vx: 0.00018 + Math.random() * 0.00042,   // slow crawl
    vy: (Math.random() - 0.5) * 0.00018,
    kind: 2,
  };
}

// ── Layer 3: Laser streaks — razor-thin horizontal beams ─────────────────────
function spawnLaser(initial: boolean): P {
  const [color, glow] = pickColor();
  // Laser x: born near the edge, flies right
  const sx = initial
    ? ORIGIN_X - 0.015 + Math.pow(Math.random(), 1.4) * 0.35
    : ORIGIN_X - 0.02  + Math.random() * 0.06;
  // Vertically weighted to body landmarks
  const marks = [0.14, 0.22, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80];
  const base  = marks[Math.floor(Math.random() * marks.length)];
  return {
    x: sx,
    y: Math.max(0.05, Math.min(0.96, base + (Math.random() - 0.5) * 0.04)),
    w: Math.round(100 + Math.random() * 280), // 100–380 px
    h: Math.max(2, Math.round((1.5 + Math.random() * 2.5))),  // 2–4 px
    color, glow,
    baseA: 0.85 + Math.random() * 0.15,
    alpha: 0.9,
    flkSpd: 0,
    life: initial ? Math.random() * 90 : 0,
    maxLife: 70 + Math.random() * 130,
    vx: 0.0012 + Math.random() * 0.0028,     // faster than blocks
    vy: 0,
    kind: 3,
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function GlitchDisintegrationCanvas({
  className = '',
  intensity = 1.0,
}: GlitchDisintegrationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let time = 0;

    // ── Resize ───────────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / W;
      mouseRef.current.y = e.clientY / H;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Particle pools ───────────────────────────────────────────────────────
    const DUST_N  = Math.floor(60  * intensity);
    const CHIP_N  = Math.floor(90  * intensity);
    const BLOCK_N = Math.floor(40  * intensity);
    const LASER_N = Math.floor(20  * intensity);

    const pool: P[] = [
      ...Array.from({ length: DUST_N  }, () => spawnDust(true)),
      ...Array.from({ length: CHIP_N  }, () => spawnChip(true)),
      ...Array.from({ length: BLOCK_N }, () => spawnBlock(true)),
      ...Array.from({ length: LASER_N }, () => spawnLaser(true)),
    ];

    // ── Glitch-slice state ────────────────────────────────────────────────────
    let sliceOn = false, sliceTimer = 0;
    let sliceY = 0, sliceH = 0;

    // ── Render ───────────────────────────────────────────────────────────────
    const render = () => {
      animId = requestAnimationFrame(render);
      time  += 0.016;

      ctx.clearRect(0, 0, W, H);

      // ── Draw glowing edge veil right at ORIGIN_X ─────────────────────────
      // Subtle vertical gradient "tear line" so the disintegration has a clear source
      const veilX = ORIGIN_X * W;
      const veilGrad = ctx.createLinearGradient(veilX - 6, 0, veilX + 18, 0);
      veilGrad.addColorStop(0,   'rgba(0,240,255,0.00)');
      veilGrad.addColorStop(0.3, 'rgba(0,240,255,0.06)');
      veilGrad.addColorStop(0.6, 'rgba(0,240,255,0.03)');
      veilGrad.addColorStop(1,   'rgba(0,240,255,0.00)');
      ctx.fillStyle = veilGrad;
      ctx.fillRect(veilX - 6, 0, 24, H);

      // ── Occasional horizontal glitch slice ───────────────────────────────
      sliceTimer += 0.016;
      if (sliceTimer > 2.8 + Math.random() * 3.5) {
        sliceOn = true;
        sliceTimer = 0;
        sliceY = (0.10 + Math.random() * 0.78) * H;
        sliceH = 1 + Math.random() * 7;
        setTimeout(() => { sliceOn = false; }, 55);
      }
      if (sliceOn) {
        const ox = (ORIGIN_X - 0.02) * W;
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#ff003c';
        ctx.fillRect(ox, sliceY, W - ox, sliceH);
        ctx.globalAlpha = 0.14;
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(ox + 3, sliceY + 1, W - ox - 3, Math.max(1, sliceH - 1));
        ctx.restore();
      }

      // ── Particles ────────────────────────────────────────────────────────
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];

        // Move
        p.x    += p.vx;
        p.y    += p.vy + Math.sin(time * 2.8 + i * 1.6) * 0.00006;
        p.life += 1;

        // Gentle mouse repulsion (normalized space)
        if (p.kind !== 3 && mx > 0) {
          const dx = p.x - mx, dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.006 && d2 > 0) {
            const d = Math.sqrt(d2);
            const push = (1 - d / 0.077) * 0.001;
            p.x += (dx / d) * push;
            p.y += (dy / d) * push * 0.5;
          }
        }

        // Recycle
        if (p.x > 1.06 || p.life >= p.maxLife) {
          pool[i] = p.kind === 0 ? spawnDust(false)
                  : p.kind === 1 ? spawnChip(false)
                  : p.kind === 2 ? spawnBlock(false)
                  :                spawnLaser(false);
          continue;
        }

        // Fade in/out envelope
        const lr = p.life / p.maxLife;
        let fade = 1.0;
        if (lr < 0.10) fade = lr / 0.10;
        else if (lr > 0.78) fade = (1 - lr) / 0.22;

        // Flicker (skip for lasers)
        const flicker = p.kind === 3
          ? 1.0
          : 0.75 + 0.25 * Math.sin(time * 18 * p.flkSpd + i * 2.1);

        const a = Math.max(0, Math.min(1, p.baseA * fade * flicker));
        if (a < 0.015) continue;

        const px = Math.round(p.x * W);
        const py = Math.round(p.y * H);

        ctx.save();
        ctx.globalAlpha = a;

        // Glow — stronger for blocks and lasers
        if (p.glow) {
          ctx.shadowColor = p.glow;
          ctx.shadowBlur  = p.kind === 3 ? 14
                          : p.kind === 2 ? 10
                          : p.kind === 1 ? 6
                          : 3;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, p.w, p.h);

        // Double-pass glow for blocks (makes them pop more)
        if (p.kind === 2 && p.glow) {
          ctx.globalAlpha = a * 0.35;
          ctx.shadowBlur  = 20;
          ctx.fillRect(px, py, p.w, p.h);
        }

        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
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
