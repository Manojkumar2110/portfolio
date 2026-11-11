"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import IntroSculpture from "./IntroSculpture";
import "./cinematic-scenes.css";

const accents = ["#00efff", "#edc58b", "#b19aff"];
const wordmarks = ["IMAGINE.", "ORIGINAL.", "CONNECTED."];
export const INTRO_DURATION = 6400;
export const INTRO_PREVIEW_DURATION = 5800;

function ParticleField({ variant }: { variant: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      const burstProgress = Math.max(0, Math.min(1, (t - 3.05) / .7));
      const rush = Math.sin(burstProgress * Math.PI);
      const displacement = burstProgress * burstProgress * (3 - 2 * burstProgress) * 220;
      const fade = Math.max(0, 1 - Math.max(0, t - 3.9) / 1.2);
      for (let i = 0; i < 80; i++) {
        const angle = i * 2.39996 + t * (variant === 1 ? .055 : .012);
        const radius = ((i * 71.13 + t * (18 + i % 9) + displacement) % 650) / 650;
        const x = width / 2 + Math.cos(angle) * radius * width * .8;
        const y = height / 2 + Math.sin(angle) * radius * height * .85;
        ctx.globalAlpha = Math.min(.65, radius * .65) * Math.min(t, 1) * fade;
        ctx.fillStyle = i % 7 === 0 ? "#ff254c" : accents[variant];
        if (rush > 0) {
          ctx.strokeStyle = ctx.fillStyle;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * rush * 35, y + Math.sin(angle) * rush * 25);
          ctx.stroke();
        } else ctx.fillRect(x, y, i % 6 === 0 ? 2 : 1, i % 6 === 0 ? 2 : 1);
      }
      ctx.globalAlpha = 1;
      if (fade > 0) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [variant]);
  return <canvas ref={ref} className="cs-particles" aria-hidden="true" />;
}

export default function CinematicScenes({ variant }: { variant: number }) {
  return <div className={`cs-world cs-variant-${variant}`}>
    <ParticleField variant={variant} />
    <div className="cs-aura" aria-hidden="true" />
    <div className="cs-grid" aria-hidden="true" />
    <div className="cs-scan" aria-hidden="true" />
    <div className="cs-focus-reticle" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="cs-travel-line" aria-hidden="true" />
    <div className="cs-corners" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="cs-telemetry" aria-hidden="true"><span>MK / CREATIVE SYSTEMS</span><span>EST. WITH CURIOSITY</span><span>DESIGN × ENGINEERING</span></div>
    <div className="cs-act" aria-hidden="true">
      <IntroSculpture variant={variant} />
      <div className="cs-opening-word">{["CREATE", "DEFINE", "CONNECT"][variant]}<span>WITHOUT LIMITS.</span></div>
      <div className="cs-depth-tunnel">{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ "--depth": i } as CSSProperties} />)}</div>
      <div className="cs-ghost-word">{wordmarks[variant]}</div>
      {variant === 0 && <>
        <div className="cs-orbit cs-orbit-one" /><div className="cs-orbit cs-orbit-two" />
        <div className="cs-build-scene">
          <div className="cs-architecture"><svg viewBox="0 0 800 500" fill="none"><path className="cs-architecture-frame" pathLength="1" d="M400 20 730 170 730 350 400 480 70 350 70 170Z M400 20V480 M70 170 400 330 730 170 M70 350 400 190 730 350 M235 95V415 M565 95V415 M70 260 400 410 730 260" /><path className="cs-architecture-flow" pathLength="1" d="M70 350 400 190 730 350V170L400 20 70 170 400 330 730 170" /></svg></div>
          <div className="cs-code-panel"><span>01 / THE SPARK</span><code>&lt;possibility&gt;<br />&nbsp; imagine();<br />&nbsp; create();<br />&lt;/possibility&gt;</code><b>IDEA DETECTED_</b></div>
          <div className="cs-blueprint"><svg viewBox="0 0 600 360"><path pathLength="1" d="M20 20H580V340H20Z M20 65H580 M55 100H260V290H55Z M295 110H540 M295 140H480 M295 200H540V290H295Z" /></svg><span>CONSTRUCTING THE POSSIBLE</span></div>
          <div className="cs-product"><div className="cs-product-bar"><span>MK®</span><span>DESIGN WITHOUT LIMITS ↗</span></div><div className="cs-product-copy"><small>FROM ZERO TO SOMETHING REAL</small><strong>Ideas.<br /><em>Made real.</em></strong><span className="cs-product-cta">EXPLORE THE UNKNOWN ↗</span></div><div className="cs-product-sculpture"><i /><i /><i /></div><div className="cs-product-bottom">CONCEPT → CODE → EXPERIENCE <span>001</span></div></div>
          <div className="cs-build-badge">&lt;/&gt;<small>ENGINEERED<br />WITH INTENT</small></div>
        </div>
        <div className="cs-act-caption"><span>01 — THE BUILDER</span><strong>Thought becomes reality.</strong></div>
      </>}
      {variant === 1 && <>
        <div className="cs-seal">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ "--tick": i } as CSSProperties} />)}<span>MANOJ KUMAR · IMAGINATION WITHOUT LIMITS</span></div>
        <div className="cs-sign-halo"><i /><i /><i /></div>
        <div className="cs-monogram"><svg viewBox="0 0 500 400" fill="none"><defs><linearGradient id="cs-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff4df" /><stop offset=".5" stopColor="#b98245" /><stop offset="1" stopColor="#fff0d3" /></linearGradient></defs><path className="cs-mark-shadow" d="M105 295V105L250 255L395 105V295M145 295V200L250 307L355 200V295" /><path className="cs-mark" pathLength="1" d="M105 295V105L250 255L395 105V295M145 295V200L250 307L355 200V295" /><path className="cs-sign-underline" pathLength="1" d="M75 338 Q250 300 425 338" /></svg><span className="cs-mark-spark" /></div>
        <div className="cs-sign-coordinate cs-sign-left">25° / CURIOSITY<br />100% / PERSONAL</div><div className="cs-sign-coordinate cs-sign-right">CRAFTED, NOT COPIED.<br />MK — ORIGINAL EDITION</div>
        <div className="cs-act-caption"><span>02 — THE INDIVIDUAL</span><strong>Leave a mark. Make it yours.</strong></div>
      </>}
      {variant === 2 && <>
        <svg className="cs-network" viewBox="0 0 1000 600" fill="none"><path className="cs-network-base" d="M40 180H230L350 300H650L770 180H960 M40 420H230L350 300 M650 300 770 420H960 M500 50V550" /><path className="cs-network-flow" pathLength="1" d="M40 180H230L350 300H650L770 180H960 M40 420H230L350 300 M650 300 770 420H960" />{[[40,180],[960,180],[40,420],[960,420],[500,50],[500,550]].map(([cx,cy],i)=><g key={i}><circle cx={cx} cy={cy} r="12" /><circle cx={cx} cy={cy} r="3" fill="currentColor" /></g>)}</svg>
        <div className="cs-system-rings"><i /><i /><i /></div>
        <div className="cs-system"><div className="cs-system-plane cs-plane-data"><span>03 / DATA ENGINE</span><div className="cs-matrix">{Array.from({ length: 36 }, (_, i) => <i key={i} style={{ "--n": i } as CSSProperties} />)}</div></div><div className="cs-system-plane cs-plane-logic"><span>02 / LOGIC CORE</span><div className="cs-circuit"><b>INPUT</b><i /><strong>MK</strong><i /><b>IMPACT</b></div><code>connect(ideas, possibilities);</code></div><div className="cs-system-plane cs-plane-ui"><span>01 / HUMAN INTERFACE</span><strong>Built to<br /><em>connect.</em></strong><div className="cs-ui-bars"><i /><i /><i /></div></div><div className="cs-system-axis" /></div>
        <div className="cs-system-label cs-system-label-left">EXPERIENCE<br /><b>↑</b><br />INTELLIGENCE</div><div className="cs-system-label cs-system-label-right">ONE VISION.<br />EVERY LAYER.</div>
        <div className="cs-act-caption"><span>03 — THE ENGINEER</span><strong>Nothing works in isolation.</strong></div>
      </>}
    </div>
    <div className="cs-impact" aria-hidden="true" />
    <div className="cs-transition-seam" aria-hidden="true" />
    <div className="cs-identity">
      <div className="cs-portrait"><Image src="/images/user_new_cutout.png" alt="" fill unoptimized sizes="(max-width: 760px) 100vw, 70vw" className="cs-portrait-image" /></div>
      <div className="cs-identity-shade" />
      <div className="cs-title"><p>THE MIND BEHIND THE EXPERIENCE</p><h3 aria-label="Manoj Kumar"><span aria-hidden="true">{Array.from("MANOJ").map((letter, index) => <b key={index} style={{ "--n": index } as CSSProperties}>{letter}</b>)}</span><span className="cs-surname" aria-hidden="true">KUMAR<span>®</span></span></h3><div className="cs-title-rule" /><strong>FULL STACK DEVELOPER</strong><p className="cs-title-tagline">{["Where imagination becomes reality.", "A personal mark. An endless possibility.", "One vision. Every dimension."][variant]}</p></div>
      <div className="cs-identity-stamp" aria-hidden="true">CREATIVE<br />DEVELOPER<span>↗</span></div>
    </div>
    <div className="cs-chapter" aria-hidden="true"><span>0{variant + 1}</span><i /><span>IDEA / IDENTITY / IMPACT</span></div>
  </div>;
}
