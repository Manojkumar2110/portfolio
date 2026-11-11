"use client";
import { useState, type FormEvent } from "react";
import { SceneAtmosphere } from "./CinematicMotion";
import { profile } from "@/data/portfolio";
export default function ContactSection({ enabled }: { enabled: boolean }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || status === "sending") return;
    const form = event.currentTarget;
    setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(20000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send. Please try again.");
      setStatus("success"); setMessage("> TRANSMISSION ACCEPTED — Thank you. Your message has been accepted for delivery."); form.reset();
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Connection interrupted. Please try again."); }
  }
  return <section id="contact" className="portfolio-section contact-section"><SceneAtmosphere /><p className="eyebrow"><span>08 /</span> ESTABLISH CONNECTION_</p><div className="contact-grid"><div><h2>Let’s build<br />something<br /><span className="outline-text">extraordinary.</span><span className="cyan">↗</span></h2><p>Have a challenging idea or a project in mind?<br />Let’s turn it into something that matters.</p><div className="contact-links">{profile.email && <a href={`mailto:${profile.email}`}>{profile.email} ↗</a>}{profile.github && <a href={profile.github}>GitHub ↗</a>}{profile.linkedin && <a href={profile.linkedin}>LinkedIn ↗</a>}{!profile.email && <span className="small-label">CONTACT DETAILS COMING SOON</span>}</div></div><form className="contact-form panel" onSubmit={submit}><div className="form-heading"><span className="status-dot" /><span>START A CONVERSATION</span><span>↗</span></div><div className="form-row"><label>Your name<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="How should I call you?" /></label><label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" /></label></div><label>What’s the idea?<input name="subject" required minLength={3} maxLength={150} placeholder="A project, an opportunity, a hello…" /></label><label>Your message<textarea name="message" required minLength={20} maxLength={5000} rows={4} placeholder="Tell me a little about what you have in mind." /></label><div className="form-trap" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div><button className="send-button" type="submit" disabled={!enabled || status === "sending"}>{status === "sending" ? "TRANSMITTING…" : enabled ? "SEND TRANSMISSION" : "DELIVERY NOT CONNECTED"}<span>↗</span></button><p className={`form-status ${status}`} role="status" aria-live="polite">{message || (!enabled ? "Preview mode. Message delivery will be available when contact setup is complete." : "Your details are used only to reply to your message.")}</p></form></div></section>;
}

