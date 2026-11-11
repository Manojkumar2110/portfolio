"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import TechCore from "./TechCore";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile, technologies, projects, experiences, achievements } from "@/data/portfolio";
import ContactSection from "./ContactSection";
import ProcessSection from "./ProcessSection";
import PortfolioFooter from "./PortfolioFooter";
import "./portfolio.css";
import { SceneAtmosphere, useCinematicMotion } from "./CinematicMotion";
import "./cinematic.css";


const nav = [["about", "Identity"], ["stack", "Arsenal"], ["projects", "Work"], ["experience", "Journey"], ["process", "Process"], ["contact", "Contact"]];
function Heading({ number, label, children, aside }: { number: string; label: string; children: ReactNode; aside?: string }) {
  return <header className="section-heading"><span className="chapter-ghost" aria-hidden="true">{number}</span><div><p className="eyebrow"><span>{number} /</span> {label}</p><h2>{children}</h2></div>{aside && <p className="heading-aside">{aside}</p>}</header>;
}
function Terminal() {
  return <div className="terminal panel"><div className="panel-bar"><span><i /> <i /> <i /></span><span>identity.config.ts</span><span>UTF-8</span></div><div className="terminal-body"><div className="terminal-commands"><p>&gt; initializing_profile...</p><p>&gt; loading_developer_identity...</p><p className="cyan">&gt; access_granted <span className="cursor-blink">▌</span></p></div><div className="code-profile"><p><span className="dim">01</span> <span className="red">const</span> developer = {'{'}</p><p><span className="dim">02</span> &nbsp; name: <span className="cyan">&quot;{profile.name}&quot;</span>,</p><p><span className="dim">03</span> &nbsp; role: <span className="cyan">&quot;Full-Stack Developer&quot;</span>,</p><p><span className="dim">04</span> &nbsp; focus: [<span className="cyan">&quot;craft&quot;, &quot;scale&quot;</span>],</p><p><span className="dim">05</span> &nbsp; mindset: <span className="cyan">&quot;always building&quot;</span></p><p><span className="dim">06</span> {'}'};</p></div><div className="terminal-footer"><span className="status-dot" /> HUMAN BEHIND THE CODE <span>↵</span></div></div></div>;
}
function TechStack() {
  const [active, setActive] = useState(0);
  return <section id="stack" className="portfolio-section"><SceneAtmosphere /><Heading number="03" label="DIGITAL ARSENAL" aside="Different technologies. One connected way of thinking.">The right tools.<br /><span className="muted">Infinite possibilities.</span></Heading><div className="stack-layout"><div className="orbital-system"><div className="orbit-ring ring-two" /><div className="orbit-cross" /><div className="core"><TechCore /><span className="core-mark">M<span>_</span></span><small>TECH ECOSYSTEM</small></div>{technologies.map((tech, i) => <div key={tech.name} className={`orbit-slot orbit-${i}`} style={{ "--angle": `${i * 45}deg` } as CSSProperties}><button className={`tech-node ${active === i ? "selected" : ""}`} aria-pressed={active === i} onClick={() => setActive(i)} onFocus={() => setActive(i)} onMouseEnter={() => setActive(i)}><Image className={`tech-logo tech-logo-${tech.name === "Next.js" ? "nextjs" : "brand"}`} src={tech.logo} alt="" width={34} height={34} unoptimized /><span>{tech.name}</span></button></div>)}<span className="orbital-coordinate">SYS.03 / CONNECTED</span></div><div className="tech-detail" aria-live="polite" key={active}><p className="eyebrow cyan">{technologies[active].category} / {String(active + 1).padStart(2, "0")}</p><h3>{technologies[active].name}</h3><p>{technologies[active].description}</p><span className="small-label">{technologies[active].verified ? "USED IN THIS PORTFOLIO" : "SAMPLE STACK ENTRY"}</span><div className="tech-index">{["Frontend", "Backend", "Infrastructure"].map(category => <div key={category}><span>{category}</span><span>{technologies.filter(t => t.category === category).length.toString().padStart(2, "0")}</span></div>)}</div><p className="micro">SELECT A NODE TO EXPLORE ↗</p></div></div></section>;
}
function ProjectPreview({ project }: { project: typeof projects[number] }) {
  const [tab, setTab] = useState(0);
  return <div className={`project-preview preview-${project.accent}`}><div className="preview-top"><span className="preview-brand">{project.id === "01" ? "W / WEBNOX" : project.id === "02" ? "E / EASY FIELD" : "EV / EVENTS"}</span><span className="preview-dot" /> <span>WORKSPACE</span></div><div className="preview-content"><aside><b>◈</b><span>▦</span><span>▤</span><span>◎</span><span>⚙</span></aside><div className="preview-main"><div className="preview-tabs" aria-label={`${project.title} concept views`}>{project.tabs.map((name, i) => <button key={name} aria-pressed={tab === i} onClick={() => setTab(i)}>{name}</button>)}</div><div className="dashboard-heading"><div><small>YOUR WORKSPACE, CONNECTED</small><h4>{project.tabs[tab]} overview</h4></div><span>↗</span></div><div className="dashboard-stats">{["Activity", "In progress", "Completed"].map((name, i) => <div key={name}><small>{name}</small><b>{[24, 8, 16][i] + tab * (i + 3)}</b><span>DEMO DATA</span></div>)}</div><div className="dashboard-chart"><div><small>ACTIVITY SNAPSHOT</small><span>THIS WEEK</span></div><div className="bars">{[32, 55, 42, 68, 52, 80, 65, 90, 74, 95, 82, 100].map((height, i) => <i key={i} style={{ height: `${25 + ((height + tab * 17) % 76)}%` }} />)}</div></div><div className="preview-row"><span className="status-dot" /><span>{project.tabs[tab]} workspace</span><span>CONNECTED</span></div></div></div><div className="preview-caption">INTERACTIVE CONCEPT / NOT A PRODUCT SCREENSHOT</div></div>;
}
function Projects() {
  return <section id="projects" className="portfolio-section projects-section"><Heading number="04" label="PROJECT LABORATORY" aside="Selected ideas, engineered into experiences. Sample case studies for now.">Built to make<br /><span className="outline-text">a difference.</span><span className="red">*</span></Heading><div className="project-stack">{projects.map(project => <article className="project-card panel" key={project.id}><div className="project-info"><div className="project-kicker"><span className="project-number">{project.id}</span><span className="eyebrow">{project.category}</span></div><span className="sample-label">SAMPLE CASE STUDY</span><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><ul className="capabilities">{project.capabilities.map(item => <li key={item}><span>↗</span>{item}</li>)}</ul><details><summary className="text-link">Explore concept <span>↗</span></summary><p className="case-detail">{project.detail}</p></details>{project.github && <a href={project.github}>GitHub ↗</a>}{project.live && <a href={project.live}>Live demo ↗</a>}</div><ProjectPreview project={project} /></article>)}</div></section>;
}
export default function PortfolioSections({ contactEnabled }: { contactEnabled: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useCinematicMotion(root);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".section-heading").forEach(el => gsap.from(el, { x: -28, opacity: .4, duration: .85, scrollTrigger: { trigger: el, start: "top 92%", once: true } }));
        gsap.from(".terminal-commands p", { clipPath: "inset(0 100% 0 0)", stagger: .65, duration: .65, ease: "steps(30)", scrollTrigger: { trigger: ".terminal", start: "top 80%", once: true } });
        gsap.from(".orbital-system", { scale: .78, rotate: -12, scrollTrigger: { trigger: "#stack", start: "top 85%", end: "center center", scrub: 1 } });
        gsap.from(".timeline-progress", { scaleY: 0, transformOrigin: "top", scrollTrigger: { trigger: ".timeline", start: "top 65%", end: "bottom 65%", scrub: true } });
        gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((el, i) => gsap.from(el, { x: i % 2 ? 35 : -35, opacity: .2, duration: .7, scrollTrigger: { trigger: el, start: "top 85%", once: true } }));
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach(el => { const value = { count: 0 }; gsap.to(value, { count: Number(el.dataset.count), duration: 1.5, ease: "power2.out", onUpdate: () => { el.textContent = Math.round(value.count).toString(); }, scrollTrigger: { trigger: el, start: "top 90%", once: true } }); });
      }, root);
      return () => ctx.revert();
    });
    media.add("(min-width: 1000px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => { gsap.utils.toArray<HTMLElement>(".project-card").forEach((el, i, cards) => { if (i < cards.length - 1) gsap.to(el, { scale: .95, scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 150px", scrub: true } }); }); }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  return <div className="portfolio" ref={root}><nav className="section-nav" aria-label="Portfolio sections"><span className="reading-progress" aria-hidden="true" /><a href="#top" className="nav-logo">M<span>_</span></a><div>{nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</div><span className="nav-status"><i className="status-dot" /> OPEN TO IDEAS</span></nav><div className="chapter-divider"><span>SCROLL TO EXPLORE</span><span>↓</span><span>THE HUMAN. THE CRAFT. THE WORK.</span></div><section id="about" className="portfolio-section about-section"><SceneAtmosphere /><Heading number="02" label="IDENTITY UNLOCKED">More than<br />lines of <span className="cyan">code.</span></Heading><div className="about-grid"><div className="about-copy"><p className="intro">I’m {profile.name}.<br />A builder at heart.</p><p>{profile.introduction}</p><p>Thoughtful <em>interfaces</em>. Scalable <em>systems</em>. Reliable <em>APIs</em>. It’s the connection between them that makes the difference.</p><a href="#projects" className="text-link">Explore my work <span>↘</span></a><div className="identity-signature"><span className="identity-emblem" aria-hidden="true">M</span><div><strong>ENGINEERED WITH INTENT.</strong><small>HUMAN CURIOSITY / DIGITAL PRECISION</small></div></div><div className="identity-tags"><span>FULL-STACK THINKING</span><span>DETAIL-DRIVEN CRAFT</span></div></div><Terminal /></div></section><TechStack /><Projects /><section id="experience" className="portfolio-section"><Heading number="05" label="SYSTEM HISTORY" aside="A journey of learning, building, and taking on bigger challenges.">Always moving<br /><span className="muted">forward.</span></Heading><p className="sample-label">ILLUSTRATIVE TIMELINE — REPLACE WITH VERIFIED EXPERIENCE</p><div className="timeline"><div className="timeline-progress" /><span className="timeline-traveler" aria-hidden="true" />{experiences.map(item => <article className="timeline-item" key={item.title}><span className="timeline-node" /><p className="eyebrow cyan">{item.period}</p><h3>{item.title}</h3><p className="company">{item.company}</p><p>{item.description}</p><div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div></section><ProcessSection /><section id="achievements" className="portfolio-section"><Heading number="07" label="SYSTEM METRICS">Small steps.<br /><span className="muted">Meaningful progress.</span></Heading><p className="sample-label">SAMPLE ACHIEVEMENTS / NOT VERIFIED CLAIMS</p><div className="metrics-grid">{achievements.map(item => <article className="metric panel" key={item.label}><span className="eyebrow">PRACTICE / PROGRESS</span><strong><span data-count={item.value}>{item.value}</span><span className="cyan">{item.suffix}</span></strong><h3>{item.label}</h3><p>{item.detail}</p></article>)}<article className="metric metric-statement panel"><span className="eyebrow">THE CONSTANT</span><div className="infinity">∞</div><h3>Never stop learning.</h3><p>Every challenge is another reason to get better at the craft.</p><span className="small-label">CURIOSITY → CAPABILITY</span></article></div></section><ContactSection enabled={contactEnabled} /><PortfolioFooter contactEnabled={contactEnabled} /></div>;
}






