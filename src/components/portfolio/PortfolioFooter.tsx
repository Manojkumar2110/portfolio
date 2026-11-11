"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/data/portfolio";
import "./footer.css";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";

// Original implementation inspired by 21st.dev's animated footer collection.
const links = [["Identity", "about"], ["Arsenal", "stack"], ["Selected work", "projects"], ["Journey", "experience"], ["Process", "process"], ["Contact", "contact"]];

export default function PortfolioFooter({ contactEnabled }: { contactEnabled: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canContact = contactEnabled || Boolean(profile.email);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => element.classList.toggle("footer-active", entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="signature-footer" id="footer" ref={root} aria-label="Portfolio footer">
      <div className="footer-topline"><span><i /> ALWAYS CURIOUS. ALWAYS BUILDING.</span><span>THE NEXT CHAPTER / ↗</span></div>
      <div className="footer-main">
        <div className="footer-invitation">
          <p className="footer-kicker"><span className="footer-chapter">09 /</span> THE NEXT CHAPTER IS UNWRITTEN.</p>
          <h2>LET’S BUILD<br /><span>WHAT’S NEXT.</span><sup>↗</sup></h2>
          <p>Thoughtful interfaces. Ambitious ideas.<br />Something worth putting into the world.</p>
          <a className="footer-cta" href={canContact ? profile.email ? `mailto:${profile.email}` : "#contact" : "#projects"}>
            <span>{canContact ? "Let’s make it happen" : "Explore what I’m building"}</span><span className="footer-cta-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="footer-signal" aria-hidden="true"><div>{[0, 1].map(i => <span key={i}>IDEAS INTO REALITY <b>✳</b> BUILT WITH INTENT <b>✳</b> NEVER STOP CREATING <b>✳</b> </span>)}</div></div>
      <div className="footer-wordmark"><div className="footer-particle-label"><span><i /> THE HUMAN BEHIND THE PIXELS</span><span>MANOJ / FULL-STACK DEVELOPER</span></div>
        <HalftoneWordmarkFooter wordmark={profile.name.toUpperCase()} wordmarkOnly
          height="clamp(155px, 29vw, 430px)" dotGap={4} grain={0.12} radius={85} crop={0}
          palette={{ background: "#050809", ink: "#b8e0ec", warm: "#00efff" }}
          fontFamily={'Impact, "Arial Black", "Helvetica Neue", sans-serif'} letterDelay={240} />
        <div className="footer-wordmark-caption"><span>IDEA → INTERFACE → IMPACT</span><span>MOVE TO SCATTER · CLICK TO RIPPLE</span></div>
      </div>
      <div className="footer-directory">
          <nav aria-label="Footer navigation"><p className="footer-kicker">EXPLORE /</p>{links.map(([label, id], i) => <a href={`#${id}`} key={id}><span className="footer-link-number">0{i + 1}</span>{label}<span className="footer-link-arrow" aria-hidden="true">↗</span></a>)}</nav>
          <div className="footer-note"><span className="footer-monogram" aria-hidden="true">M<span>_</span></span><p>Built with intention.<br />Made to feel different.</p><span className="footer-kicker">{profile.role}</span>
            {(profile.github || profile.linkedin) && <div className="footer-socials">{profile.github && <a href={profile.github}>GitHub ↗</a>}{profile.linkedin && <a href={profile.linkedin}>LinkedIn ↗</a>}</div>}
          </div>
        </div>
      <div className="footer-bottom"><p>© {profile.copyrightYear} {profile.name}<span> / Built with intent.</span></p><span className="footer-signoff">END OF PAGE. START OF SOMETHING.</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></div>
    </footer>
  );
}
