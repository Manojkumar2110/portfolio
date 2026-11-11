"use client";

import { useCallback, useEffect, useRef } from "react";

import "./intro.css";

const SESSION_KEY = "manoj-cinematic-intro-v1";

/** A short, original panther-inspired title sequence. No external media or audio. */
export default function CinematicIntro() {
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replay = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    dialog.current?.close();
    document.dispatchEvent(new CustomEvent("portfolio:intro", { detail: false }));
    try { sessionStorage.setItem(SESSION_KEY, "seen"); } catch { /* Storage is optional. */ }
  }, []);

  const play = useCallback(() => {
    const el = dialog.current;
    if (!el || el.open) return;
    el.showModal();
    document.dispatchEvent(new CustomEvent("portfolio:intro", { detail: true }));
    el.classList.remove("intro-playing", "intro-reduced");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("intro-reduced");
      return;
    }
    // Restart native CSS animation on every replay.
    void el.offsetWidth;
    el.classList.add("intro-playing");
    timer.current = setTimeout(finish, 7200);
  }, [finish]);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === "seen"; } catch { /* Still offer the intro. */ }
    if (!seen && !window.location.hash) play();
    return () => { if (timer.current) clearTimeout(timer.current); dialog.current?.close(); document.dispatchEvent(new CustomEvent("portfolio:intro", { detail: false })); };
  }, [play]);

  return <>
    <button ref={replay} className="intro-replay" onClick={play} aria-label="Replay cinematic introduction"><span aria-hidden="true">▷</span> WATCH INTRO</button>
    <dialog ref={dialog} className="cinematic-intro" aria-labelledby="intro-accessible-title" onCancel={finish} data-lenis-prevent>
      <h2 id="intro-accessible-title" className="intro-sr">Manoj Kumar. Full-stack developer. Cinematic introduction.</h2>
      <div className="intro-texture" aria-hidden="true" />
      <div className="intro-letterbox intro-letterbox-top" aria-hidden="true" />
      <div className="intro-letterbox intro-letterbox-bottom" aria-hidden="true" />
      <header className="intro-header"><span>MK<span className="intro-violet"> / </span>ORIGIN</span><span>A DEVELOPER’S UNIVERSE</span></header>
      <div className="intro-scene" aria-hidden="true">
        <div className="intro-energy" />
        <div className="intro-dust">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 13) % 100}%`, top: `${(i * 23 + 9) % 100}%`, animationDelay: `${-i * .37}s`, animationDuration: `${5 + i % 4}s` }} />)}</div>
        <svg className="intro-emblem" viewBox="0 0 400 440" fill="none">
          <defs>
            <linearGradient id="panther-metal" x1="50" y1="0" x2="350" y2="440" gradientUnits="userSpaceOnUse"><stop stopColor="#c8b8e4"/><stop offset=".28" stopColor="#30263f"/><stop offset=".55" stopColor="#756383"/><stop offset="1" stopColor="#17141e"/></linearGradient>
            <linearGradient id="panther-shell" x1="90" y1="70" x2="300" y2="380" gradientUnits="userSpaceOnUse"><stop stopColor="#1d1729"/><stop offset=".5" stopColor="#07070b"/><stop offset="1" stopColor="#181020"/></linearGradient>
            <filter id="panther-eye-glow"><feGaussianBlur stdDeviation="4"/></filter>
          </defs>
          <path d="M64 160 65 35 139 82 200 64 261 82 335 35 336 160 354 218 326 326 260 391 200 422 140 391 74 326 46 218Z" fill="url(#panther-shell)" stroke="url(#panther-metal)" strokeWidth="2"/>
          <path d="m65 35 52 118-38-22Zm270 0-52 118 38-22Z" fill="#272030" stroke="#82708e" strokeWidth="1"/>
          <path d="m200 65-29 119 29 49 29-49ZM64 160l89 56-36 50-63-48Zm272 0-89 56 36 50 63-48ZM117 266l31 81 52 75-126-96Zm166 0-31 81-52 75 126-96Z" stroke="url(#panther-metal)" strokeWidth="1.4"/>
          <path d="m200 233-25 64 25 19 25-19ZM148 347l52-18 52 18-52 42Z" fill="#1b1522" stroke="#594665"/>
          <path d="m91 200 66 27-17 19-43-22Zm218 0-66 27 17 19 43-22Z" fill="#30213f"/>
          <g className="intro-eye"><path d="m96 205 58 24-16 10-36-17Z" fill="#ae62ff" filter="url(#panther-eye-glow)"/><path d="m96 205 58 24-16 10-36-17Z" fill="#dfbdff"/></g>
          <g className="intro-eye"><path d="m304 205-58 24 16 10 36-17Z" fill="#ae62ff" filter="url(#panther-eye-glow)"/><path d="m304 205-58 24 16 10 36-17Z" fill="#dfbdff"/></g>
          <path className="intro-veins" d="m86 267 23 13 13 40m192-53-23 13-13 40M153 102l-10 55 16 27m88-82 10 55-16 27M178 362l22 32 22-32" stroke="#9860cd" strokeWidth="1.3"/>
        </svg>
        <p className="intro-prelude">EVERY UNIVERSE HAS A BUILDER.</p>
        <div className="intro-title-block">
          <p className="intro-title-kicker">QUIET FOCUS. EXTRAORDINARY POSSIBILITIES.</p>
          <div className="intro-name">{["MANOJ", "KUMAR"].map(word => <span className="intro-name-word" key={word}>{Array.from(word).map((letter, i) => <span className="intro-title-letter" key={i} style={{ animationDelay: `${3 + (word === "KUMAR" ? i + 5 : i) * .075}s` }}>{letter}</span>)}</span>)}</div>
          <p className="intro-role"><span /> FULL-STACK DEVELOPER <span /></p>
          <p className="intro-tagline">From imagination to impact.</p>
        </div>
      </div>
      <footer className="intro-controls"><span>01 <span className="intro-muted">/ THE ORIGIN</span></span><button autoFocus onClick={finish}>ENTER PORTFOLIO <span aria-hidden="true">↗</span><small>SKIP INTRO · ESC</small></button></footer>
      <div className="intro-progress" aria-hidden="true"><i /></div>
    </dialog>
  </>;
}
