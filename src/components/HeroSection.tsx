'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import GlitchDisintegrationCanvas from './GlitchDisintegrationCanvas';

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const portraitCenterRef = useRef<HTMLDivElement>(null);
  const hudTopLeftRef = useRef<HTMLDivElement>(null);
  const hudTopRightRef = useRef<HTMLDivElement>(null);
  const hudBottomLeftRef = useRef<HTMLDivElement>(null);
  const hudBottomRightRef = useRef<HTMLDivElement>(null);

  const [isGlitching, setIsGlitching] = useState(false);
  const [nameText, setNameText] = useState('MANOJ');
  const [isNameScrambling, setIsNameScrambling] = useState(false);
  const [isMicroGlitching, setIsMicroGlitching] = useState(false);
  const [roleText, setRoleText] = useState('FULL STACK DEVELOPER');
  const [isScrambling, setIsScrambling] = useState(false);
  const scrambleRef = useRef<NodeJS.Timeout | null>(null);
  const entranceTimeline = useRef<gsap.core.Timeline | null>(null);

  // ── Decrypt Scramble Animation for MANOJ ─────────────────────────
  const triggerNameScramble = () => {
    setIsNameScrambling(true);
    const original = 'MANOJ';
    const glyphs = 'MΔN0JX10#_';
    let iteration = 0;

    const interval = setInterval(() => {
      setNameText(
        original
          .split('')
          .map((char, index) => {
            if (index < iteration) return original[index];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('')
      );

      if (iteration >= original.length) {
        clearInterval(interval);
        setIsNameScrambling(false);
        setNameText(original);
      }
      iteration += 1 / 1.5;
    }, 32);
  };

  // ── Micro Glitch Trigger for MANOJ ──────────────────────────────
  const triggerMicroGlitch = () => {
    setIsMicroGlitching(true);
    setTimeout(() => setIsMicroGlitching(false), 240);
  };

  // ── Decrypt Scramble Animation for Full Stack Developer ──────────
  const triggerRoleScramble = () => {
    if (scrambleRef.current) clearInterval(scrambleRef.current);
    setIsScrambling(true);

    const original = 'FULL STACK DEVELOPER';
    const glyphs = '01#_<>[]XΔ%&*/+=';
    let iteration = 0;

    scrambleRef.current = setInterval(() => {
      setRoleText(
        original
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return original[index];
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('')
      );

      if (iteration >= original.length) {
        if (scrambleRef.current) clearInterval(scrambleRef.current);
        setIsScrambling(false);
        setRoleText(original);
      }
      iteration += 1 / 1.6;
    }, 28);
  };

  // ── Entrance Sequence ───────────────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    entranceTimeline.current = tl;

    // Initial hidden state
    gsap.set([hudTopLeftRef.current, hudTopRightRef.current, hudBottomLeftRef.current, hudBottomRightRef.current], {
      opacity: 0,
      scale: 0.92,
    });
    gsap.set(leftColRef.current, { opacity: 0, x: -30 });
    gsap.set(portraitCenterRef.current, { opacity: 0, scale: 0.96 });

    // 1. HUD Brackets Snap In
    tl.to(
      [hudTopLeftRef.current, hudTopRightRef.current, hudBottomLeftRef.current, hudBottomRightRef.current],
      { opacity: 1, scale: 1, duration: 0.45, stagger: 0.06 },
      0.1
    );

    // 2. Left Typography Reveal (clearProps keeps CSS vertical alignment)
    tl.to(leftColRef.current, { opacity: 1, x: 0, duration: 0.75, clearProps: 'transform' }, 0.35);

    // 3. Centered Portrait Emerges Clear & Sharp
    tl.to(portraitCenterRef.current, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0.5);

    // Initial decode of title and role on entrance
    const initialTimer = setTimeout(() => {
      triggerNameScramble();
      triggerRoleScramble();
    }, 650);

    // Autonomous micro-glitch twitch on MANOJ every 4.2 seconds
    const microGlitchInterval = setInterval(() => {
      triggerMicroGlitch();
    }, 4200);

    // Recurring decode pulse on role every 8.5 seconds
    const intervalTimer = setInterval(() => {
      triggerRoleScramble();
    }, 8500);

    return () => {
      tl.kill();
      clearTimeout(initialTimer);
      clearInterval(microGlitchInterval);
      clearInterval(intervalTimer);
      if (scrambleRef.current) clearInterval(scrambleRef.current);
    };
  }, []);

  // ── Interactive Glitch Trigger ──────────────────────────────────────────────
  const triggerGlitch = () => {
    setIsGlitching(true);
    triggerMicroGlitch();
    triggerNameScramble();
    triggerRoleScramble();
    setTimeout(() => setIsGlitching(false), 380);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-screen overflow-hidden bg-black select-none flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      {/* ── Pure Pitch Black Background (Zero Light Spill to Left) ── */}
      <div className="absolute inset-0 pointer-events-none bg-black" />

      {/* Subtle CRT Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] scanline-bg z-10" />

      {/* ── TOP-LEFT HUD: Bracket ┌ & 'CODE CREATES REALITY' ── */}
      <div
        ref={hudTopLeftRef}
        className="absolute top-6 left-6 sm:top-8 sm:left-10 md:top-10 md:left-14 z-30 pointer-events-none"
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-white/80 rounded-tl-sm" />

        <div className="mt-8 sm:mt-10 text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-white/60 space-y-1">
          <div className="text-white/80 font-bold text-xs pb-1">×</div>
          <div className="leading-tight space-y-0.5">
            <div>CODE</div>
            <div>CREATES</div>
            <div className="text-white/90">REALITY</div>
          </div>
          <div className="flex gap-1.5 pt-1.5 text-white/40 text-[9px]">
            <span>•</span>
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* ── TOP-RIGHT HUD: Bracket ┐ & Vertical '× × ×' ── */}
      <div
        ref={hudTopRightRef}
        className="absolute top-6 right-6 sm:top-8 sm:right-10 md:top-10 md:right-14 z-30 flex flex-col items-end pointer-events-none"
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-white/80 rounded-tr-sm" />

        <div className="mt-6 flex flex-col items-center gap-2 text-white/50 text-xs font-mono">
          <span>×</span>
          <span>×</span>
          <span>×</span>
        </div>
      </div>

      {/* ── BOTTOM-LEFT HUD: Bracket └ ── */}
      <div
        ref={hudBottomLeftRef}
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 md:bottom-10 md:left-14 z-30 pointer-events-none"
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-white/80 rounded-bl-sm" />
      </div>

      {/* ── BOTTOM-RIGHT HUD: Cyber Circle & Bracket ┘ ── */}
      <div
        ref={hudBottomRightRef}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 md:bottom-10 md:right-14 z-30 flex flex-col items-end gap-3 pointer-events-none"
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>

        <div className="w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-white/80 rounded-br-sm" />
      </div>

      {/* ── LEFT-SIDE TYPOGRAPHY: MANOJ FULL STACK DEVELOPER & QUOTE BOX ── */}
      <div
        ref={leftColRef}
        className="absolute left-6 sm:left-12 md:left-16 lg:left-20 top-1/2 -translate-y-1/2 z-30 max-w-sm sm:max-w-md pointer-events-auto"
      >
        {/* Clickable MANOJ Title with Chromatic RGB Split & Living Hologram Animations */}
        <div
          onClick={triggerGlitch}
          onMouseEnter={() => {
            triggerMicroGlitch();
            triggerNameScramble();
          }}
          className="cursor-pointer group select-none"
        >
          <h1
            className={`relative inline-block text-6xl sm:text-7xl md:text-8xl font-black uppercase font-mono tracking-tight leading-none animate-title-hologram transition-transform duration-100 ${
              isMicroGlitching || isGlitching ? 'micro-glitching' : ''
            }`}
            style={{
              fontFamily: '"SF Pro Display", -apple-system, "Inter", sans-serif',
              letterSpacing: '-0.03em',
            }}
            suppressHydrationWarning
          >
            {/* Holographic Raster Scanline Beam sweeping across MANOJ */}
            <div className="title-scanline" />

            <span
              className="glitch-text block text-white"
              data-text={nameText}
              suppressHydrationWarning
              style={{
                textShadow:
                  isGlitching || isMicroGlitching
                    ? '4px 0 #ff003c, -4px 0 #00f0ff, 0 0 20px rgba(255, 255, 255, 0.9)'
                    : isNameScrambling
                    ? '2.5px 0 #00f0ff, -2.5px 0 #ff003c, 0 0 16px rgba(0, 240, 255, 0.8)'
                    : undefined,
              }}
            >
              {nameText}
            </span>
          </h1>

          {/* ── FULL STACK DEVELOPER (Highlighted with Cyber Shimmer, Matrix Scramble & Laser Underline) ── */}
          <div
            onMouseEnter={triggerRoleScramble}
            className="relative inline-block mt-3 sm:mt-4 group/role"
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Pulsing cyber cyan status node */}
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]" />

              <h2
                className={`text-sm sm:text-base md:text-lg lg:text-xl font-mono uppercase tracking-[0.24em] sm:tracking-[0.28em] font-medium transition-all duration-200 select-none whitespace-nowrap ${
                  isScrambling
                    ? 'text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.95)]'
                    : 'animate-text-shimmer drop-shadow-[0_0_8px_rgba(0,240,255,0.35)]'
                }`}
                suppressHydrationWarning
                style={{
                  textShadow: isGlitching
                    ? '2.5px 0 #00f0ff, -2.5px 0 #ff003c'
                    : isScrambling
                    ? '0 0 10px rgba(0, 240, 255, 0.85)'
                    : undefined,
                }}
              >
                {roleText}
                <span className="text-[#00f0ff] animate-cursor-blink ml-1">_</span>
              </h2>
            </div>

            {/* Glowing Cyber Laser Underline with Traveling Beam */}
            <div className="laser-line mt-2 sm:mt-2.5">
              <div className="laser-beam" />
            </div>
          </div>
        </div>

        {/* Framed Developer Quote Box with Neon Red Pulse & Tech Corner Accents */}
        <div className="mt-7 sm:mt-9 border border-white/25 hover:border-[#00f0ff]/50 transition-colors duration-300 px-5 py-3.5 sm:px-6 sm:py-4 bg-black/50 backdrop-blur-sm inline-block relative overflow-hidden group/box">
          {/* Subtle Cyber Corner Ticks */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00f0ff]/70" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff003c]/70" />

          <p className="text-xs sm:text-sm font-mono tracking-[0.22em] uppercase text-white/90 leading-relaxed">
            <span className="block text-white/80">BUILDING DIGITAL EXPERIENCES</span>
            <span className="block mt-1">
              WHERE CODE MEETS{' '}
              <span className="text-[#ff1a1a] font-bold tracking-wider animate-neon-red">REALITY</span>
            </span>
          </p>
        </div>
      </div>

      {/* ── EXACT CENTER: PORTRAIT LOCKED TO VIEWPORT ── */}
      <div
        ref={portraitCenterRef}
        className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none"
      >
        {/* Sized responsively and anchored directly to the bottom center */}
        <div className="relative h-[88vh] sm:h-[92vh] md:h-[96vh] aspect-[1024/571] max-w-full flex items-end justify-center">
          {/* ── Seamless Dual-Sided Studio Backlight in Pure White (Zero Edge Lines, Optical Light Wrap) ── */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src="/images/user_backlight_seamless_white.png"
              alt="Seamless Pure White Silhouette Backlight"
              fill
              priority
              unoptimized
              className="object-contain object-bottom select-none"
              sizes="100vw"
            />
          </div>

          {/* Crystal Clear Cutout Portrait Image from User Upload with Moody Dark Shading */}
          <div className="relative w-full h-full z-10">
            <Image
              src="/images/user_new_cutout.png"
              alt="Manoj Kumar — Portrait"
              fill
              priority
              unoptimized
              className="object-contain object-bottom select-none"
              sizes="100vw"
              style={{
                filter: 'brightness(0.72) contrast(1.28)',
              }}
            />
          </div>

          {/* ── Glitch Disintegration Canvas Placed on Right Half of Image ── */}
          <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-20">
            <GlitchDisintegrationCanvas intensity={1.0} />
          </div>
        </div>
      </div>

      {/* ── Interactive Glitch Flash on Click ── */}
      {isGlitching && (
        <div
          className="absolute inset-0 pointer-events-none z-40 bg-gradient-to-r from-transparent via-[#ff003c]/20 to-transparent"
          style={{ animation: 'loading-sweep 0.3s ease-out' }}
        />
      )}
    </section>
  );
}
