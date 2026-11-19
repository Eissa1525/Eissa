# EISSA — ALTER/EGO portfolio

Cinematic designer portfolio inspired by the *feel* of the Framer “Alter Ego” template (inspected live in a browser),
rebuilt from scratch in React with real WebGL — no Framer code, images or copy reused.

```bash
cd site
npm install
npm run dev          # development
npm run build        # production build → site/dist
npm run preview      # serve the build on :4173
npm run test:e2e     # browser QA (needs preview running)
```

## Your two photos (hero transformation)
1. Put them in `site/public/hero/`, e.g. `me.jpg` and `me-suited.jpg` — **same pose, same framing**, portrait (3:4), subject centred, dark background works best.
2. In `site/src/data/site.ts` set:
   ```ts
   portraits: { civilian: '/hero/me.jpg', suited: '/hero/me-suited.jpg' }
   ```
Until then, procedural placeholder figures are used. The civilian photo is graded to black & white automatically.

## Sections (home)
| Section | What it does | Beyond the reference |
|---|---|---|
| Hero — suit-up | Scroll drives an ignition scan line that converts the civilian portrait into the suited one; name decodes into the alias; SYNC % and STATE HUD | Single WebGL shader: glitch slicing + chromatic split in the scan band, contour lines that ignite near the line, sparks, mouse parallax |
| Origin | Scroll-lit paragraph with orange emphasis + journey line | Driven from one editable string (`*emphasis*`) |
| Case files | Pinned 3D tunnel of nested frames; projects on curved CRT screens; titles decode | Real R3F scene: velocity-reactive bend + RGB split, warp streaks, click a screen to open the case study |
| Abilities | Ability list + radar | Radar morphs between abilities, rotating scan sweep, auto-cycle, keyboard accessible |
| Transmit | Huge contact headline that burns under the cursor | Pixel heat-field burn with embers; autonomous probe so touch devices see it too |

Pages: `/work`, `/work/:slug` (case study), `/about`, `/contact`, 404. Reduced motion and no-WebGL get static versions.

## Editing content
- `site/src/data/site.ts` — name, alias, bio, origin text, photos, contact (empty fields are hidden; `hello@example.com` is a placeholder).
- `site/src/data/projects.ts` — sample concept projects (replace; add `cover` image paths).
- `site/src/data/services.ts` — abilities + radar scores.

## Deployment
Static SPA — `vercel.json` / `public/_redirects` rewrite all routes to `index.html`.
