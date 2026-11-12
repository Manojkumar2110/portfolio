'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import GlitchDisintegrationCanvas from './GlitchDisintegrationCanvas';
import './hero.css';

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

    // 2. Left Typography Reveal
    tl.to(leftColRef.current, { opacity: 1, x: 0, duration: 0.75, clearProps: 'transform' }, 0.35);

    // 3. Centered Portrait Emerges
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
    <section ref={containerRef} className="hero-container">
      {/* ── Background & Scanlines ── */}
      <div className="hero-bg" />
      <div className="hero-scanlines" />

      {/* ── TOP-LEFT HUD ── */}
      <div ref={hudTopLeftRef} className="hero-hud-tl">
        <div className="bracket-tl" />
        <div className="hud-meta">
          <div className="cross">×</div>
          <div>CODE</div>
          <div>CREATES</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>REALITY</div>
          <div className="hud-dots">
            <span>•</span>
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* ── TOP-RIGHT HUD ── */}
      <div ref={hudTopRightRef} className="hero-hud-tr">
        <div className="bracket-tr" />
        <div className="hud-crosses">
          <span>×</span>
          <span>×</span>
          <span>×</span>
        </div>
      </div>

      {/* ── BOTTOM-LEFT HUD ── */}
      <div ref={hudBottomLeftRef} className="hero-hud-bl">
        <div className="bracket-bl" />
      </div>

      {/* ── BOTTOM-RIGHT HUD ── */}
      <div ref={hudBottomRightRef} className="hero-hud-br">
        <div className="cyber-node">
          <span />
        </div>
        <div className="bracket-br" />
      </div>

      {/* ── LEFT-SIDE TYPOGRAPHY ── */}
      <div ref={leftColRef} className="hero-left-col">
        <div
          onClick={triggerGlitch}
          onMouseEnter={() => {
            triggerMicroGlitch();
            triggerNameScramble();
          }}
          className="hero-title-wrap group"
        >
          <h1
            className={`hero-name-title animate-title-hologram ${
              isMicroGlitching || isGlitching ? 'micro-glitching' : ''
            }`}
            suppressHydrationWarning
          >
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

          {/* ── FULL STACK DEVELOPER ── */}
          <div onMouseEnter={triggerRoleScramble} className="hero-role-wrap">
            <div className="hero-role-inner">
              <span className="hero-role-status-dot" />
              <h2
                className={`hero-role-text ${
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
                <span className="hero-role-cursor">_</span>
              </h2>
            </div>
            <div className="hero-laser-line">
              <div className="hero-laser-beam" />
            </div>
          </div>
        </div>

        {/* Developer Quote Box */}
        <div className="hero-quote-box">
          <div className="corner-tr" />
          <div className="corner-bl" />
          <p>
            <span className="quote-line1">BUILDING DIGITAL EXPERIENCES</span>
            <span className="quote-line2">
              WHERE CODE MEETS <span className="neon-red">REALITY</span>
            </span>
          </p>
        </div>
      </div>

      {/* ── CENTERED PORTRAIT ── */}
      <div ref={portraitCenterRef} className="hero-portrait-stage">
        <div className="hero-portrait-frame">
          {/* Studio Backlight */}
          <Image
            src="/images/user_backlight_seamless_white.png"
            alt="Silhouette Backlight"
            fill
            priority
            unoptimized
            className="hero-backlight-img"
            sizes="100vw"
          />

          {/* Portrait Image */}
          <Image
            src="/images/user_new_cutout.png"
            alt="Manoj Kumar — Portrait"
            fill
            priority
            unoptimized
            className="hero-portrait-img"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ── FULL VIEWPORT DISINTEGRATION CANVAS (fixed, sits above portrait) ── */}
      <GlitchDisintegrationCanvas intensity={1.0} />

      {/* Interactive Glitch Flash on Click */}
      {isGlitching && <div className="hero-click-flash" />}
    </section>
  );
}
