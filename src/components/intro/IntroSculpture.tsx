"use client";

import { useEffect, useRef } from "react";

type Point = [number, number, number];
type Face = { points: Point[]; tone: number; edge?: boolean };
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => 1 - Math.pow(1 - clamp(n), 4);
const palettes = [[17, 220, 245], [230, 181, 102], [161, 123, 245]];

function box(faces: Face[], x: number, y: number, z: number, w: number, h: number, d: number, tone = 1) {
  const points: Point[] = [[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y+h,z-d],[x-w,y+h,z-d],[x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y+h,z+d],[x-w,y+h,z+d]];
  [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[1,5,6,2],[0,3,7,4]].forEach((indices, i) => {
    faces.push({ points: indices.map(index => points[index]), tone: tone * [.5,.8,1.1,.45,.7,.9][i], edge: true });
  });
}

/** A finite, depth-sorted 3D scene; no WebGL startup or external assets. */
export default function IntroSculpture({ variant }: { variant: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 1, height = 1, frame = 0;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas); resize();
    const start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      const assembly = ease((t - .15) / 1.3);
      const departure = ease((t - 2.7) / .65);
      const size = Math.min(width * .3, height * .32) * (.85 + assembly * .15);
      const faces: Face[] = [];
      if (variant === 0) {
        // Twenty-seven separate blocks snap into a single architectural core.
        for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
          const delay = (x + y + z + 3) * .055;
          const join = ease((t - delay) / 1.15);
          const spread = .46 + (1 - join) * 1.25 + departure * .14;
          box(faces, x * spread, y * spread, z * spread, .205, .205, .205, x === 0 && y === 0 ? 1.5 : .75);
        }
      } else if (variant === 1) {
        // A metallic torus turns around the hand-drawn monogram.
        const segments = 80, sides = 8;
        for (let i = 0; i < segments; i++) {
          if (i / segments > ease(t / 1.65)) continue;
          for (let j = 0; j < sides; j++) {
            const points: Point[] = [];
            for (const [a,b] of [[i,j],[i+1,j],[i+1,j+1],[i,j+1]]) {
              const u = a / segments * Math.PI * 2, v = b / sides * Math.PI * 2;
              const r = 1.05 + Math.cos(v) * .11;
              points.push([Math.cos(u)*r, Math.sin(u)*r, Math.sin(v)*.11]);
            }
            faces.push({points, tone: .65 + .4 * Math.cos(j / sides * Math.PI * 2 - 1) + .25 * Math.sin(i / segments * Math.PI * 2), edge:false});
          }
        }
      } else {
        // Three solid circuit plates separate, activate, then align.
        for (let layer = -1; layer <= 1; layer++) {
          const spread = .2 + .48 * assembly * (1 - departure);
          const y = layer * spread;
          box(faces, 0, y, 0, .8, .055, .6, .65 + layer * .12);
          for (let pin = 0; pin < 8; pin++) {
            const x = -.65 + pin * .185;
            box(faces, x, y, -.65, .025, .02, .06, 1.5);
            box(faces, x, y, .65, .025, .02, .06, 1.5);
          }
          box(faces, 0, y-.1, 0, .23, .045, .23, 1.1);
          for (let pin = 0; pin < 4; pin++) box(faces, -.5 + pin*.32, y-.08, -.4, .07, .02, .06, 1.4);
        }
      }
      const ry = variant === 1 ? -.35 + Math.sin(t*1.1)*.2 : -.65 + t*.22 + departure*.4;
      const rx = variant === 1 ? -.12 : -.4 - assembly*.12;
      const rz = variant === 1 ? t*.1 : -.12 + assembly*.06;
      const rotate = ([x,y,z]: Point): Point => {
        const ax = x*Math.cos(ry)+z*Math.sin(ry), az = z*Math.cos(ry)-x*Math.sin(ry);
        const ay = y*Math.cos(rx)-az*Math.sin(rx), bz = y*Math.sin(rx)+az*Math.cos(rx);
        return [ax*Math.cos(rz)-ay*Math.sin(rz), ax*Math.sin(rz)+ay*Math.cos(rz), bz];
      };
      const project = ([x,y,z]: Point) => {
        const scale = 4.5 / (4.5 + z);
        return [width*.5+x*size*scale, height*.46+y*size*scale];
      };
      const rendered = faces.map(face => ({...face, points:face.points.map(rotate)}));
      rendered.sort((a,b) => b.points.reduce((sum,p)=>sum+p[2],0)/b.points.length - a.points.reduce((sum,p)=>sum+p[2],0)/a.points.length);
      ctx.globalAlpha = ease(t/.4);
      const [r,g,b] = palettes[variant];
      for (const face of rendered) {
        const points = face.points.map(project);
        const depth = face.points.reduce((sum,p)=>sum+p[2],0)/face.points.length;
        const light = Math.max(.16, face.tone * (.7 - depth*.16));
        ctx.beginPath();
        points.forEach(([x,y],i) => i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y));
        ctx.closePath();
        const sheen = variant === 1 ? 1 : .36;
        ctx.fillStyle = `rgb(${Math.min(255,r*light*sheen+8)},${Math.min(255,g*light*sheen+8)},${Math.min(255,b*light*sheen+12)})`;
        ctx.fill();
        if (face.edge) {
          ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(.85,.28+light*.35)})`;
          ctx.lineWidth = .75; ctx.stroke();
        }
      }
      // A moving point light gives the assembled object a bright, clean edge.
      const lightAngle = t*.8;
      const lx = width*.5+Math.cos(lightAngle)*size*.8, ly = height*.46+Math.sin(lightAngle)*size*.5;
      const glow = ctx.createRadialGradient(lx,ly,0,lx,ly,size*.65);
      glow.addColorStop(0,`rgba(${r},${g},${b},.13)`); glow.addColorStop(1,`rgba(${r},${g},${b},0)`);
      ctx.globalCompositeOperation = "screen"; ctx.fillStyle=glow;
      ctx.fillRect(lx-size,ly-size,size*2,size*2); ctx.globalCompositeOperation="source-over";
      ctx.globalAlpha=1;
      if (t < 4.5) frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [variant]);
  return <canvas ref={ref} className="cs-sculpture-canvas" aria-hidden="true" />;
}
