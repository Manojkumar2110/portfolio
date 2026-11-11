'use client';

import React, { useEffect, useRef } from 'react';

interface CyberEyeFlareProps {
  xPercent?: number; // relative to container or image (default 48.5%)
  yPercent?: number; // relative to container or image (default 34.2%)
  interactive?: boolean;
}

export default function CyberEyeFlare({
  xPercent = 48.5,
  yPercent = 34.2,
  interactive = true,
}: CyberEyeFlareProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      // Normalized offset (-1 to 1)
      targetX = (e.clientX - cx) / cx;
      targetY = (e.clientY - cy) / cy;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (streakRef.current) {
        // Subtly tilt and stretch the anamorphic streak based on cursor position
        const tiltAngle = currentX * 6; // -6 to +6 degrees
        const stretch = 1 + Math.abs(currentX) * 0.2;
        streakRef.current.style.transform = `translate(-50%, -50%) rotate(${tiltAngle}deg) scaleX(${stretch})`;
      }

      if (coreRef.current) {
        coreRef.current.style.transform = `translate(-50%, -50%) translate(${currentX * 4}px, ${currentY * 4}px)`;
      }

      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none z-30"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* ── Outer soft radial bloom (electric cyan / ice blue) ── */}
      <div
        ref={auraRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-cyber-breathe"
        style={{
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.45) 0%, rgba(0, 150, 255, 0.18) 40%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      {/* ── Mid-range intense cyan bloom ── */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-cyber-pulse"
        style={{
          width: '64px',
          height: '64px',
          background: 'radial-gradient(circle, rgba(200, 245, 255, 0.95) 0%, rgba(0, 240, 255, 0.8) 35%, rgba(0, 110, 255, 0.3) 70%, transparent 100%)',
          filter: 'blur(3px)',
        }}
      />

      {/* ── Anamorphic Horizontal Lens Flare Streak ── */}
      <div
        ref={streakRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '320px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 180, 255, 0.15) 15%, rgba(0, 240, 255, 0.8) 45%, #ffffff 50%, rgba(0, 240, 255, 0.8) 55%, rgba(0, 180, 255, 0.15) 85%, transparent 100%)',
          boxShadow: '0 0 16px rgba(0, 240, 255, 0.9), 0 0 30px rgba(0, 150, 255, 0.6)',
          filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))',
        }}
      />

      {/* ── Secondary narrower vertical glare pin ── */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-80"
        style={{
          width: '2px',
          height: '48px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 240, 255, 0.7) 40%, #ffffff 50%, rgba(0, 240, 255, 0.7) 60%, transparent 100%)',
          boxShadow: '0 0 8px rgba(0, 240, 255, 0.8)',
        }}
      />

      {/* ── Blazing White Core Pupil ── */}
      <div
        ref={coreRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '12px',
          height: '12px',
          background: '#ffffff',
          boxShadow: '0 0 10px #ffffff, 0 0 20px #00f0ff, 0 0 35px #00aaff',
        }}
      />

      {/* ── Micro star sparkle glint ── */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-spin-slow opacity-90"
        style={{
          width: '24px',
          height: '24px',
          background: 'radial-gradient(circle, #ffffff 10%, rgba(0, 240, 255, 0.6) 30%, transparent 60%)',
        }}
      />
    </div>
  );
}

