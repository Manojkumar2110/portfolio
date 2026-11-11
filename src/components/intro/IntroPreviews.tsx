"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./previews.css";
import CinematicScenes, { INTRO_DURATION } from "./CinematicScenes";

const concepts = [
  { title: "From thought to interface", accent: "#00efff" },
  { title: "The living signature", accent: "#edc58b" },
  { title: "One interaction, many layers", accent: "#b19aff" },
];

export default function IntroPreviews() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    // Pick on the client after hydration; Strict Mode cancels the first frame.
    const frame = requestAnimationFrame(() => {
      setSelected(Math.floor(Math.random() * concepts.length));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const element = dialog.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.body.style.overflow;
    const previousScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
    element.showModal();
    document.body.style.overflow = "hidden";
    document.dispatchEvent(new CustomEvent("portfolio:intro", { detail: true }));
    if (!reducedMotion) {
      document.dispatchEvent(new CustomEvent("portfolio:hero-intro", { detail: "prepare" }));
    }
    const reveal = window.setTimeout(() => {
      if (!reducedMotion) {
        document.dispatchEvent(new CustomEvent("portfolio:hero-intro", { detail: "reveal" }));
      }
    }, 3250);
    const finish = window.setTimeout(() => element.close(), reducedMotion ? 1600 : INTRO_DURATION);

    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(finish);
      element.close();
      document.body.style.overflow = previousOverflow;
      history.scrollRestoration = previousScrollRestoration;
      document.dispatchEvent(new CustomEvent("portfolio:intro", { detail: false }));
      document.dispatchEvent(new CustomEvent("portfolio:hero-intro", { detail: "restore" }));
    };
  }, [selected]);

  if (selected === null) return null;
  const concept = concepts[selected];

  return <dialog ref={dialog} className="ip-dialog ip-fullscreen" aria-label={concept.title} data-lenis-prevent onClose={() => setSelected(null)}>
    <button autoFocus className="ip-skip" onClick={() => dialog.current?.close()}>SKIP INTRO ↗</button>
    <div className="ip-shell" style={{ "--ip-accent": concept.accent } as CSSProperties}>
      <div className="ip-stage">
        <div className="ip-stage-label"><span>CODE CREATES REALITY</span><span>MANOJ KUMAR</span></div>
        <CinematicScenes variant={selected} />
        <div className="cs-hero-portal" aria-hidden="true"><i /><i /></div>
        <div className="ip-stage-bottom"><span>FULL-STACK DEVELOPER</span><span>IDEAS INTO EXPERIENCES ↗</span></div>
        <div className="ip-timeline" />
      </div>
    </div>
  </dialog>;
}
