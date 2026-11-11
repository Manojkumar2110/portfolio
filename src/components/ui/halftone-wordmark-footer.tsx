"use client";

import * as React from "react";

export interface HalftonePalette { background: string; ink: string; warm: string }
export type HalftonePreset = "night" | "paper" | "ember" | "cobalt";
export interface FooterLink { label: string; href?: string }
export interface FooterColumn { title: string; links: FooterLink[] }
export interface HalftoneWordmarkFooterProps {
  wordmark?: string; label?: string; meta?: string; columns?: FooterColumn[];
  backToTop?: boolean; preset?: HalftonePreset; palette?: Partial<HalftonePalette>;
  dotGap?: number; radius?: number; crop?: number; grain?: number; interactive?: boolean;
  fontFamily?: string; fontWeight?: number; monoFamily?: string; height?: string; className?: string;
  /** Embed only the particle wordmark inside an existing footer. */
  wordmarkOnly?: boolean;
  /** Delay between letters, in milliseconds. */
  letterDelay?: number;
}
const PRESETS: Record<HalftonePreset, HalftonePalette> = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
};
const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Work", links: [{ label: "Selected work", href: "#projects" }] },
  { title: "About", links: [{ label: "Identity", href: "#about" }, { label: "Process", href: "#process" }] },
  { title: "Connect", links: [{ label: "Contact", href: "#contact" }] },
];
export function hwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map(c => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
export function hwfRadius(coverage: number, gap: number) { return Math.sqrt(Math.max(0, Math.min(1, coverage))) * gap * .43; }
export function hwfStep(x: number, y: number, vx: number, vy: number, hx: number, hy: number, px: number, py: number, r: number) {
  const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + .001, f = (1 - d / r) * 2.6;
    vx += dx / d * f; vy += dy / d * f;
  }
  vx = (vx + (hx - x) * .05) * .84; vy = (vy + (hy - y) * .05) * .84;
  return [x + vx, y + vy, vx, vy];
}
export function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number) { return span > 0 ? Math.min(1, Math.hypot(x - hx, y - hy) / span) : 0; }
export function hwfFitSize(measured: number, width: number) { return measured > 0 ? width / measured * 100 : 0; }

const CSS = `
.hwf-root{position:relative;width:100%;overflow:hidden;isolation:isolate;background:var(--hwf-bg);color:var(--hwf-ink)}
.hwf-root canvas{position:absolute;inset:0;width:100%;height:100%;display:block;max-width:none}
.hwf-top{position:relative;z-index:1;display:grid;grid-template-columns:1.25fr repeat(3,1fr);gap:24px;padding:32px;font:10px/1.8 var(--hwf-mono);letter-spacing:.15em;text-transform:uppercase}
.hwf-brand strong{display:block;font-weight:500}.hwf-brand span{opacity:.65}.hwf-col h3{font:inherit;opacity:.65;margin:0}.hwf-col ul{list-style:none;padding:0;margin:0}
.hwf-col a,.hwf-up{color:inherit;text-decoration:none;font:inherit;letter-spacing:inherit;text-transform:inherit}.hwf-col a:hover,.hwf-up:hover{color:var(--hwf-warm)}.hwf-col a:focus-visible,.hwf-up:focus-visible{outline:1px solid currentColor;outline-offset:4px}
.hwf-rule{position:relative;z-index:1;margin:24px 32px 0;padding-top:12px;border-top:1px solid #ffffff25;text-align:right;font:10px var(--hwf-mono)}
.hwf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media(max-width:720px){.hwf-top{grid-template-columns:1fr 1fr;padding:22px;gap:18px}.hwf-brand{grid-column:1/-1}.hwf-rule{margin-inline:22px}}
`;

/** Adapted from the supplied Halftone Wordmark Footer: no dependencies beyond React. */
export default function HalftoneWordmarkFooter({
  wordmark = "Manojkumar", label = "Manojkumar", meta = "Built with intent.", columns = DEFAULT_COLUMNS,
  backToTop = true, preset = "night", palette, dotGap = 6, radius = 80, crop = .2, grain = .5,
  interactive = true, fontFamily = 'Impact, "Arial Black", "Helvetica Neue", sans-serif', fontWeight = 900,
  monoFamily = 'ui-monospace, Consolas, monospace', height = "560px", className = "", wordmarkOnly = false, letterDelay = 240,
}: HalftoneWordmarkFooterProps) {
  const colors = { ...PRESETS[preset], ...palette };
  const rootRef = React.useRef<HTMLElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { background, ink: inkColor, warm: warmColor } = colors;

  React.useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    let w = 0, h = 0, dpr = 1, px = -1e5, py = -1e5, raf = 0, start = -1, last = 0;
    let visible = false, alive = true;
    let ring = { x: 0, y: 0, t: -1e6 };
    // x, y, velocity x/y, home x/y, radius, letter index.
    let dots = new Float32Array(0);
    const ink = hwfHex(inkColor) ?? [120, 170, 185], warm = hwfHex(warmColor) ?? [0, 229, 240];
    const letters = Array.from(wordmark);
    const revealDuration = Math.max(0, letters.length - 1) * letterDelay + 1100;
    let grainPattern: CanvasPattern | null = null;

    const layout = () => {
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width)); h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      const mask = document.createElement("canvas"); mask.width = w; mask.height = h;
      const m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      m.font = `${fontWeight} 100px ${fontFamily}`;
      const fit = hwfFitSize(m.measureText(wordmark).width, w * .96);
      m.font = `${fontWeight} ${fit}px ${fontFamily}`;
      const box = m.measureText(wordmark), cap = box.actualBoundingBoxAscent || fit * .72;
      const x0 = (w - box.width) / 2;
      // Preserve the whole name in embedded mode; the standalone component supports cropping.
      const stretch = wordmarkOnly ? 1.35 : 1;
      const baseline = wordmarkOnly ? (h / stretch + cap) / 2 - (box.actualBoundingBoxDescent || 0) : h + cap * Math.max(0, Math.min(.6, crop));
      m.save(); m.scale(1, stretch); m.fillText(wordmark, x0, baseline); m.restore();
      const edges = letters.map((_, i) => x0 + m.measureText(letters.slice(0, i + 1).join("")).width);
      const img = m.getImageData(0, 0, w, h).data;
      const gap = Math.max(2.5, Math.min(dotGap, w < 600 ? 3 : dotGap));
      const tmp: number[] = [];
      for (let gy = 0; gy < h / gap; gy++) for (let gx = 0; gx < w / gap; gx++) {
        let sum = 0;
        for (let sy = 0; sy < 3; sy++) for (let sx = 0; sx < 3; sx++) {
          const x = Math.min(w - 1, Math.floor(gx * gap + (sx + .5) * gap / 3));
          const y = Math.min(h - 1, Math.floor(gy * gap + (sy + .5) * gap / 3));
          sum += img[(y * w + x) * 4 + 3];
        }
        const coverage = sum / 2295;
        if (coverage < .06) continue;
        const hx = gx * gap + gap / 2, hy = gy * gap + gap / 2;
        const index = edges.findIndex(edge => hx < edge);
        tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(coverage, gap), Math.max(0, index));
      }
      dots = new Float32Array(tmp);
      const tile = document.createElement("canvas"); tile.width = tile.height = 128;
      const g = tile.getContext("2d");
      if (g && grain > 0) {
        const data = g.createImageData(128, 128);
        for (let i = 0; i < data.data.length; i += 4) { const v = Math.random() * 255; data.data[i] = data.data[i + 1] = data.data[i + 2] = v; data.data[i + 3] = 22; }
        g.putImageData(data, 0, 0); grainPattern = ctx.createPattern(tile, "repeat");
      }
    };
    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); if (!wordmarkOnly) { ctx.fillStyle = background; ctx.fillRect(0, 0, w, h); }
      const elapsed = start < 0 ? 0 : now - start;
      const ringAge = now - ring.t;
      // Physics uses a capped 60 Hz step so high-refresh displays behave consistently.
      const physics = now - last >= 15;
      if (physics) last = now;
      for (let j = 0; j < dots.length; j += 8) {
        const hx = dots[j + 4], hy = dots[j + 5];
        const progress = reduced ? 1 : Math.max(0, Math.min(1, (elapsed - dots[j + 7] * letterDelay) / 1100));
        if (progress === 0) continue;
        let x = dots[j], y = dots[j + 1], vx = dots[j + 2], vy = dots[j + 3];
        if (!reduced && physics) {
          if (ringAge < 900) {
            const dx = hx - ring.x, dy = hy - ring.y, d = Math.hypot(dx, dy) + .001;
            const force = Math.max(0, 1 - Math.abs(d - ringAge * .9) / 26) * 3.2 * (1 - ringAge / 900);
            vx += dx / d * force; vy += dy / d * force;
          }
          [x, y, vx, vy] = hwfStep(x, y, vx, vy, hx, hy, px, py, interactive ? radius : 0);
          dots[j] = x; dots[j + 1] = y; dots[j + 2] = vx; dots[j + 3] = vy;
        }
        // Independent, softly breathing clusters: no directional beam or white stripe.
        const time = Math.max(0, elapsed - revealDuration) / 1000;
        const seed = Math.sin(hx * 12.9898 + hy * 78.233);
        const breath = .5 + .5 * Math.sin(time * 1.15 + hx * .027 + Math.sin(hy * .052) * 2.8);
        const shimmer = !reduced && elapsed > revealDuration
          ? Math.pow(breath, 4) * (.12 + Math.abs(seed) * .24) : 0;
        const k = Math.max(hwfWarmth(x, y, hx, hy, 28), shimmer);
        const depth = .55 + .45 * (1 - hy / h);
        ctx.fillStyle = `rgb(${ink.map((v, i) => Math.round(v * depth + (warm[i] - v * depth) * k)).join(",")})`;
        const ease = 1 - Math.pow(1 - progress, 3);
        ctx.globalAlpha = ease;
        const scatter = 1 - ease;
        const noise = Math.sin(hx * 12.9898 + hy * 78.233);
        const drawX = x + scatter * noise * 65;
        const drawY = y + scatter * (Math.min(120, h * .65) + Math.cos(hx * .2) * 35);
        // Tiny offset shadows give the dots depth while preserving the halftone edges.
        if (ease > .9) { ctx.globalAlpha = .16; ctx.fillRect(drawX + 1.5, drawY + 2, dots[j + 6] * 1.5, dots[j + 6] * 1.5); }
        ctx.globalAlpha = ease;
        ctx.beginPath(); ctx.arc(drawX, drawY, dots[j + 6] * (.3 + ease * .7), 0, Math.PI * 2); ctx.fill();

      }
      ctx.globalAlpha = 1;
      if (grainPattern && grain > 0) { ctx.globalAlpha = Math.min(1, grain); ctx.fillStyle = grainPattern; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1; }
    };
    const loop = (now: number) => { raf = 0; if (!visible || document.hidden) return; draw(now); if (!reduced) raf = requestAnimationFrame(loop); };
    const wake = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const local = (e: PointerEvent) => { const b = canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    const move = (e: PointerEvent) => { if (!interactive || reduced || e.pointerType === "touch") return; [px, py] = local(e); wake(); };
    const leave = () => { px = py = -1e5; wake(); };
    const down = (e: PointerEvent) => { if (!interactive || reduced || (e.target as HTMLElement).closest("a,button")) return; const [x, y] = local(e); ring = { x, y, t: performance.now() }; wake(); };
    const preference = () => { reduced = media.matches; layout(); wake(); };
    layout();
    const ro = new ResizeObserver(() => { layout(); wake(); }); ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { if (start < 0) start = performance.now(); wake(); }
      else { cancelAnimationFrame(raf); raf = 0; start = -1; px = py = -1e5; }
    }, { threshold: .2 }); io.observe(canvas);
    root.addEventListener("pointermove", move); root.addEventListener("pointerleave", leave); root.addEventListener("pointerdown", down);
    document.addEventListener("visibilitychange", wake); media.addEventListener("change", preference);
    document.fonts.ready.then(() => { if (alive) { layout(); wake(); } });
    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); root.removeEventListener("pointerdown", down);
      document.removeEventListener("visibilitychange", wake); media.removeEventListener("change", preference);
    };
  }, [wordmark, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, background, inkColor, warmColor, wordmarkOnly, letterDelay]);

  const Tag = wordmarkOnly ? "div" : "footer";
  return <Tag ref={rootRef as React.Ref<HTMLDivElement>} className={`hwf-root ${className}`} style={{ height, "--hwf-bg": wordmarkOnly ? "transparent" : background, "--hwf-ink": inkColor, "--hwf-warm": warmColor, "--hwf-mono": monoFamily } as React.CSSProperties}>
    <style>{CSS}</style><canvas ref={canvasRef} aria-hidden="true" /><span className="hwf-sr">{wordmark}</span>
    {!wordmarkOnly && <><div className="hwf-top"><div className="hwf-brand"><strong>{label}</strong><span>{meta}</span></div>{columns.map(col => <nav className="hwf-col" key={col.title} aria-label={col.title}><h3>{col.title}</h3><ul>{col.links.map(link => <li key={link.label}>{link.href ? <a href={link.href}>{link.label}</a> : <span>{link.label}</span>}</li>)}</ul></nav>)}</div><div className="hwf-rule">{backToTop && <a href="#top" className="hwf-up">Back to top ↑</a>}</div></>}
  </Tag>;
}
