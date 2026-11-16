# IRON//VOID — The Future of Strength

An interactive 3D concept site for a fictional premium gym.
React + Vite + TypeScript + Tailwind, GSAP/ScrollTrigger + Lenis, Motion, three.js / React Three Fiber.

> Concept only. Prices, plans, timetable and contact details are demo data. There is no backend:
> the join form validates input and opens an email draft (`mailto:`), nothing is stored or processed.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the build on http://localhost:4173
```

## Change the content

Everything you would normally want to edit is data, not markup:

| What | File |
| --- | --- |
| Brand name, tagline, navigation, all section copy, contact details | `src/data/siteData.ts` |
| Image / video / HDRI / hero-model paths | `src/data/assets.ts` |
| Showroom equipment list (model file, name, description, dimensions) | `src/data/equipment.ts` |
| The four training programs | `src/data/programs.ts` |
| Plans, demo prices, comparison rows | `src/data/memberships.ts` |
| Demo timetable | `src/data/schedule.ts` |
| Colours, 3D material finishes, background atmosphere per section, scroll feel | `src/config/theme.ts` |

### Theme

`src/config/theme.ts` is the single source of truth.

- `colors` are written to CSS variables at startup and exposed as Tailwind colours
  (`bg-void`, `text-bone`, `text-accent`, `border-steel` …). Change `accent` and the whole site follows,
  including the light rays, selected states and the 3D accent material.
- `materials` maps the material names inside the GLB models (`metal`, `frame`, `rubber`, `accent` …)
  to a finish. Edit colour / metalness / roughness to re-skin every model at once.
- `atmosphere` sets the colour, strength and origin of the background light for each section id.

### Swap media or models

Drop a file into `public/media/img`, `public/media/video` or `public/models` and point the entry in
`src/data/assets.ts` / `src/data/equipment.ts` at it. Any `.glb` works in the showroom; it is scaled
and centred automatically. Record new third-party files in `ASSET_CREDITS.md`.

## Structure

```
src/
  config/theme.ts            theme tokens
  data/                      all editable content
  sections/                  one file per page section (Hero, Philosophy, Equipment, …)
  components/
    layout/                  Nav, Preloader, Atmosphere (background), JoinModal, Footer
    three/                   GymModel loader + Hero / Showroom / Floor scenes
    reactbits/               React Bits components, unmodified (see LICENSE.md there)
    ui/primitives.tsx        buttons, section heading, lazy video, picture
  lib/                       Lenis + ScrollTrigger setup, device / quality hooks, pointer store
public/                      models, HDRI, optimised photos and video
ASSET_CREDITS.md             source and licence of every asset
```

## How it behaves

- **Motion**: Lenis runs on the GSAP ticker so ScrollTrigger and smooth scrolling share one clock.
  Scroll is never hijacked — the hero is a tall section with a CSS-sticky stage and a scrubbed timeline.
- **3D**: each scene mounts only when it is near the viewport, pauses when off screen and unmounts
  when far away, so only one or two WebGL contexts are alive at a time. Pixel ratio adapts to frame
  rate; shadows, bloom and the electric border are desktop-only.
- **Background**: one fixed light-ray canvas for the whole page; its colour and intensity follow the
  section in view. It never receives pointer events.
- **Reduced motion**: with `prefers-reduced-motion`, smooth scrolling, parallax, auto-rotation and
  entrance animations are switched off; content stays fully readable.
- **No WebGL**: the page still works — the hero keeps its film, and the viewers show a text fallback.

## Known limitations

- The equipment models are stylised low-poly CC0 assets, re-lit and re-finished — not photoreal scans.
- "The Experience" pairs real footage with a stylised 3D floor model; it is not a walkthrough of a real venue.
- Join / enquiry flows are `mailto:` drafts to a placeholder address.
