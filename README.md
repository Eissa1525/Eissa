# AETHER STUDIO — Project ECLIPSE

A cinematic creative-studio site: React 19 · TypeScript · Vite · Tailwind v4 · GSAP (ScrollTrigger, SplitText, Flip) · Lenis · Three.js / React Three Fiber · postprocessing · Motion · React Bits.

```bash
cd site
npm install
npm run dev          # development
npm run build        # production build → site/dist
npm run preview      # serve the build on :4173
npm run test:e2e     # browser QA (needs preview running)
```

## Phase 0 — reference audit (honest scope)
| Reference | Access from the build environment | Used |
|---|---|---|
| framer.com/…/alter-ego, alter.framer.photos | **blocked** (network policy) | Only the public marketplace description: scroll-driven hero, portrait transformation, 3D project tunnel, glitch footer. Nothing copied — the Eclipse concept, tunnel and glitch footer are deliberately avoided. |
| horizonx.so, motionsite.ai, Aceternity, Motion Primitives | **blocked** | Not used. |
| React Bits | site blocked, **GitHub source reachable** | `SpotlightCard`, `GlareHover` (+ `ShinyText`, `DecryptedText` vendored for later phases) in `src/components/vendor/reactbits` under its MIT + Commons Clause license (use inside a website is permitted). |

## Architecture
```
site/src
├─ data/          ← ALL editable content (site.ts, projects.ts, services.ts, process.ts)
├─ styles/        ← design tokens (@theme) + base/components layers
├─ animations/    ← gsap registration, motion tokens, useReveal (declarative data-reveal system)
├─ scenes/eclipse ← Eclipse WebGL scene, procedural shard geometry, CSS fallback
├─ shaders/       ← shard vertex/material injection, corona shader
├─ sections/home  ← EclipseHero, SelectedWork, Manifesto, ServicesPreview, Process, ContactCTA
├─ pages/         ← Home, Work, CaseStudy (/work/:slug), Studio, Contact, NotFound (code-split)
├─ layouts/       ← RootLayout: Lenis, preloader, nav, page-transition curtain, footer
├─ components/    ← Nav (+ mobile menu), Preloader, Cursor, Magnetic, DeviceMockup, vendor/
├─ hooks/ lib/    ← media queries, WebGL detection, shared scroll store, loading registry, covers
└─ tests/qa.cjs   ← Playwright QA
```

## The Eclipse Sequence
One pinned ScrollTrigger (scrub) drives both the DOM timeline and the WebGL uniforms — reverse scrolling replays exactly.
1. **Origin** — a fractured geodesic sculpture (1 280 prism shards on desktop, 320 on mobile) emerges as a key light rises after the preloader.
2. **Awakening** — shards separate into three counter-rotating orbital bands; a band of light sweeps through the geometry.
3. **Formation** — shards lock onto a torus halo; the material shifts from rough obsidian to platinum with dark-violet glass facets (MeshPhysicalMaterial + procedural Lightformer environment, no HDR download).
4. **Eclipse** — a corona ignites around the dark disc, the halo scales up and the camera flies through it into darkness → Selected Work.

All shard motion runs on the GPU (vertex-shader injection). Fallbacks: `prefers-reduced-motion` and no-WebGL → static CSS eclipse; any scene error → same fallback via ErrorBoundary. DPR is capped (1.75 desktop / 1.25 mobile); the 3D chunk is lazy-loaded and its download + first frame feed the preloader's real progress.

## Editing content
- Brand, contact, SEO, nav: `src/data/site.ts`. **Contact fields left empty are hidden** — `studio@example.com` is a reserved placeholder: replace it. Add `whatsapp`, `sms`, `telegram` to enable those written channels.
- Projects: `src/data/projects.ts` — the six projects are **sample concept work**; add a `cover` image path to replace the generated artwork.

## Deployment
Static SPA. `vercel.json` and `public/_redirects` (Netlify) rewrite all routes to `index.html`.

## Status
| Phase | State |
|---|---|
| 0 Audit | done (within access limits above) |
| 1 Foundation | done — tokens, routes, nav/mobile menu, Lenis, transitions, content config |
| 2 Eclipse hero | done — verified desktop/mobile/reduced-motion |
| 3 Immersive portfolio | partial — editorial exhibition + case studies work; spatial orbital gallery still to build |
| 4 Complete site | partial — manifesto, services, process, studio, contact done; **Experimental Showcase not built yet** |
| 5–7 | pending: motion polish, real-device performance testing, image optimisation |
