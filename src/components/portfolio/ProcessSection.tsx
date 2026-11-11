"use client";

import { useEffect, useRef, useState } from "react";
import { process as stages } from "@/data/portfolio";
import "./process.css";
import ProcessSculpture from "./ProcessSculpture";

export default function ProcessSection() {
  const host = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduced, setReduced] = useState(true);
  const running = visible && pageVisible && !paused && !reduced;

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduced(preference.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncPreference(); syncVisibility();
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    if (host.current) observer.observe(host.current);
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => { observer.disconnect(); preference.removeEventListener("change", syncPreference); document.removeEventListener("visibilitychange", syncVisibility); };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => { setActive(value => (value + 1) % stages.length); setCycle(value => value + 1); }, 5000);
    return () => window.clearTimeout(timer);
  }, [running, active, cycle]);

  function select(index: number) { setActive(index); setCycle(value => value + 1); }
  const stage = stages[active];
  return <section id="process" className={`portfolio-section process-sequence ${running ? "sequence-running" : "sequence-still"}`} ref={host}>
    <header className="section-heading"><span className="chapter-ghost" aria-hidden="true">06</span><div><p className="eyebrow"><span>06 /</span> THE ENGINEERING PROCESS</p><h2>Intent. Execution.<br /><span className="muted">Iteration.</span></h2></div><p className="heading-aside">Good software starts long before the first commit.</p></header>
    <div className="sequence-toolbar"><span><i className="status-dot" /> ENGINEERING IN MOTION</span><div><span>{String(active + 1).padStart(2, "0")} / 06</span><button type="button" aria-pressed={paused} disabled={reduced} onClick={() => setPaused(value => !value)}>{reduced ? "MANUAL MODE" : paused ? "▶ RESUME" : "Ⅱ PAUSE"}</button></div></div>
    <div className="process-constellation" aria-label="Development process steps">

      {stages.map((item, index) => <button type="button" key={item.name} className={`process-node ${active === index ? "is-active" : ""} ${index < active ? "is-complete" : ""}`} aria-pressed={active === index} aria-controls="process-detail" onClick={() => select(index)}>
        <span className="node-coordinate">PHASE / 0{index + 1}</span>
        <ProcessSculpture index={index} />
        <span className="node-title">{item.name}</span><span className="node-status">{active === index ? "ACTIVE SEQUENCE" : index < active ? "STAGE COMPLETE" : "AWAITING SIGNAL"}</span>
        <span className="node-timer" aria-hidden="true">{active === index && <i key={`${cycle}-${running}`} />}</span>
      </button>)}
    </div>
    <div id="process-detail" className="sequence-detail" aria-live={running ? "off" : "polite"} aria-atomic="true">
      <span className="sequence-number" aria-hidden="true" key={`number-${active}`}>0{active + 1}</span>
      <div className="sequence-copy" key={active}><p className="eyebrow cyan">{stage.label}</p><h3>{stage.name} with purpose.</h3><p>{stage.description}</p><div className="tags">{stage.tools.map(tool => <span key={tool}>{tool}</span>)}</div></div>
      <div className="sequence-next"><span>UP NEXT / 0{(active + 1) % stages.length + 1}</span><button onClick={() => select((active + 1) % stages.length)} aria-label={`Go to ${stages[(active + 1) % stages.length].name}`}>{stages[(active + 1) % stages.length].name} <b>↗</b></button><small>{reduced ? "SELECT A PHASE TO EXPLORE" : paused ? "SEQUENCE PAUSED" : "ONE STEP EVERY 5 SECONDS"}</small></div>
    </div>
  </section>;
}

