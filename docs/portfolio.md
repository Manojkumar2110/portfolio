# Portfolio content and delivery setup

The original HeroSection.tsx and its visual assets are untouched. The page now scrolls into eight additional sections. GSAP owns scroll sequences; CSS owns hover/orbit motion; one dynamically loaded Three.js canvas owns the core. No dependencies were added.

## Replace the samples

Edit src/data/portfolio.ts: profile, technologies, projects, experiences, process, achievements. Sample labels intentionally distinguish fictional work history, project stacks, concepts, and metrics from verified claims. Replace sample labels and descriptions when replacing data. Empty profile and project URLs are omitted rather than linked to fake destinations. Preview dashboards are explicitly concepts, not screenshots.

## Enable contact

Copy .env.example to .env.local. Set a Resend key, a verified CONTACT_FROM sender, CONTACT_TO recipient, and the exact CONTACT_ORIGIN (scheme and host, no trailing slash). Configure an Upstash Redis REST URL and token for atomic shared rate limiting. Restart/rebuild after changing configuration: the page computes contact availability when rendered/built. Never commit credentials.

The handler validates and bounds input, checks origin, rejects a honeypot, applies a shared per-email and global limit, and fails closed when Redis/email delivery is unavailable. Provider acceptance is reported as accepted for delivery, not as confirmed inbox delivery. No test messages are sent by default. Limits are three attempts per address per ten minutes and thirty total attempts per hour; for a public high-traffic deployment add a managed bot challenge and perimeter rate limiting.

## Reference research

21st.dev references reviewed for interaction direction:
- https://21st.dev/@dillionverma/components/orbiting-circles (orbit layout and HTML content)
- https://21st.dev/@dillionverma/components/animated-beam (connected workflow motif)
- https://21st.dev/community/components/explore/timeline-component
- https://21st.dev/community/components

Terminal and bento registry endpoints were unavailable during research. No third-party component code was copied; all additions are original implementations using existing dependencies. Full source/license inspection of every suggested component was not possible.

## Verification

Run npm run lint, npx tsc --noEmit, npm run build. Desktop uses sticky project stacking; screens below 800px use a static technology grid and single-sided timeline. New animations respect reduced motion; WebGL stops rendering offscreen and in hidden tabs. Existing hero animation behavior is preserved.

## Cinematic motion pass

CinematicMotion.tsx coordinates heading masks, sequential content reveals, dashboard chart entrances, workflow and metric entrances, active navigation, reading progress, and pointer lighting. cinematic.css adds terminal scanning, orbital radar, data packets, and controlled scene fragments. TechCore adds a counter-rotating red octahedron and cyan ring. All new animation respects reduced motion; continuous CSS effects pause outside the viewport and when the page is hidden. Desktop-only pointer lighting and preview tilt use one scheduled update per pointer event frame with cleanup. No new dependencies or hero changes were introduced.

Validation after this pass: production build (including TypeScript) passed; lint passed with the two existing AnimatedText.tsx warnings. Browser automation could not reconnect to the preview (browser.user unavailable), so the latest motion pass still needs visual confirmation. The earlier portfolio-preview.png predates these latest animations.
