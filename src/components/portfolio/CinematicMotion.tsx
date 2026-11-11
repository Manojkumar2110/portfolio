"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Extra motion is scoped to the portfolio, never the existing hero. */
export function useCinematicMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const sections = Array.from(element.querySelectorAll<HTMLElement>(".portfolio-section"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("in-scene", entry.isIntersecting));
    }, { rootMargin: "80px" });
    sections.forEach(section => observer.observe(section));

    const progress = element.querySelector<HTMLElement>(".reading-progress");
    const progressTrigger = ScrollTrigger.create({
      trigger: element, start: "top top", end: "bottom bottom",
      onUpdate: self => { if (progress) progress.style.transform = `scaleX(${self.progress})`; },
    });
    const navTriggers = sections.map(section => ScrollTrigger.create({
      trigger: section, start: "top 40%", end: "bottom 40%",
      onToggle: self => {
        const link = element.querySelector(`.section-nav a[href="#${section.id}"]`);
        if (self.isActive) link?.setAttribute("aria-current", "location");
        else link?.removeAttribute("aria-current");
      },
    }));

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".section-heading h2").forEach((heading, i) => {
          gsap.from(heading, {
            clipPath: i % 2 ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)",
            y: 25, duration: 1.15, ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 94%", once: true },
          });
        });
        gsap.from(".code-profile p", { x: 15, opacity: .15, stagger: .12, duration: .6,
          scrollTrigger: { trigger: ".terminal", start: "top 75%", once: true } });
        gsap.from(".identity-signature", { clipPath: "inset(0 100% 0 0)", duration: 1,
          scrollTrigger: { trigger: ".identity-signature", start: "top 90%", once: true } });
        gsap.utils.toArray<HTMLElement>(".project-card").forEach(card => {
          gsap.from(card.querySelectorAll(".project-info > h3, .project-info > p, .capabilities li"), {
            y: 22, opacity: .15, stagger: .09, duration: .7,
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
          gsap.from(card.querySelectorAll(".bars i"), { scaleY: .05, transformOrigin: "bottom", stagger: .045, duration: .9,
            scrollTrigger: { trigger: card, start: "top 75%", once: true } });
        });
        gsap.from(".process-node", { scale: .82, stagger: .08, duration: .7, ease: "power3.out",
          scrollTrigger: { trigger: ".process-constellation", start: "top 85%", once: true } });
        gsap.from(".metric", { y: 55, rotateX: 8, opacity: .3, stagger: .16, duration: .9,
          scrollTrigger: { trigger: ".metrics-grid", start: "top 85%", once: true } });
        gsap.from(".contact-form", { y: 40, rotateY: -6, opacity: .35, duration: 1,
          scrollTrigger: { trigger: ".contact-form", start: "top 90%", once: true } });
      }, element);
      return () => ctx.revert();
    });

    media.add("(min-width: 1000px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const cleanup: (() => void)[] = [];
      const ctx = gsap.context(() => {
        sections.forEach(section => {
          const backdrop = section.querySelector(".chapter-ghost");
          if (backdrop) gsap.fromTo(backdrop, { y: -35 }, { y: 70, ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
      }, element);
      element.querySelectorAll<HTMLElement>(".terminal, .project-preview, .metric, .contact-form").forEach(panel => {
        let frame = 0;
        const move = (event: PointerEvent) => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            const rect = panel.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            panel.style.setProperty("--light-x", `${x * 100}%`);
            panel.style.setProperty("--light-y", `${y * 100}%`);
            panel.style.setProperty("--tilt-x", `${(y - .5) * -5}deg`);
            panel.style.setProperty("--tilt-y", `${(x - .5) * 6}deg`);
            panel.classList.add("pointer-lit");
          });
        };
        const leave = () => { cancelAnimationFrame(frame); panel.classList.remove("pointer-lit"); panel.style.setProperty("--tilt-x", "0deg"); panel.style.setProperty("--tilt-y", "0deg"); };
        panel.addEventListener("pointermove", move);
        panel.addEventListener("pointerleave", leave);
        cleanup.push(() => { leave(); panel.removeEventListener("pointermove", move); panel.removeEventListener("pointerleave", leave); });
      });
      return () => { cleanup.forEach(dispose => dispose()); ctx.revert(); };
    });
    const visibility = () => element.classList.toggle("scene-paused", document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.revert(); observer.disconnect(); progressTrigger.kill(); navTriggers.forEach(trigger => trigger.kill());
      document.removeEventListener("visibilitychange", visibility);
      sections.forEach(section => section.classList.remove("in-scene"));
    };
  }, [root]);
}

export function SceneAtmosphere() {
  return <div className="scene-atmosphere" aria-hidden="true">
    <div className="signal-rail"><i /><i /><i /></div>
    <div className="scene-fragments">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ left: `${8 + i * 10}%`, top: `${15 + (i * 17) % 65}%`, animationDelay: `${i * -.7}s` }} />)}</div>
  </div>;
}


