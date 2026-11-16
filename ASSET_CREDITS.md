# IRON//VOID — Asset credits & licences

Every third-party file in this project, where it came from and the licence it is used under.
All files were downloaded on 2026-11-16 and are stored locally in `public/`.
IRON//VOID is a fictional brand; the people in the stock media are not staff, members or endorsers.

## 3D models — `public/models/`

Source: "Gym and Fitness Studio" pack, 3dassets.dev
Pack page: https://3dassets.dev/packs/gym-and-fitness-studio
Manifest: https://3dassets.dev/api/v1/packs/gym-and-fitness-studio
Licence: CC0 1.0 Universal (public domain, no attribution required) — as stated in the pack manifest.
Note: the manifest marks these assets as AI-generated. They are low-poly, untextured models.
In this site their geometry is used as shipped; only vertex normals are recomputed and the flat
materials are replaced at runtime with the metal palette in `src/config/theme.ts`.

| Local file | Asset | Source id |
| --- | --- | --- |
| barbell-loaded.glb | Olympic Barbell with Bumper Plates | 33563 |
| power-rack.glb | Power Rack | 33574 |
| dumbbell-rack.glb | Three-Tier Dumbbell Rack, Loaded | 33561 |
| leg-press.glb | Forty-Five Degree Leg Press | 33573 |
| cable-crossover.glb | Cable Crossover Frame | 33578 |
| lat-pulldown.glb | Lat Pulldown Station | 33572 |
| rower.glb | Air Rowing Machine | 33569 |
| treadmill.glb | Commercial Treadmill | 33568 |
| spin-bike.glb | Studio Spin Bike | 33571 |
| kettlebell.glb | Cast Kettlebell | 33564 |
| punching-bag.glb | Punching Bag on Weighted Stand | 33587 |
| bench-incline.glb | Adjustable Bench, Inclined | 33577 |
| gym-floor.glb | Commercial Gym Floor (starter scene), meshopt-compressed 2.97 MB → 0.78 MB | 33602 |

Each original is at `https://cdn.3dassets.dev/assets/<id>/v1/model.glb`.

## Environment lighting — `public/hdr/`

| Local file | Asset | Source | Licence |
| --- | --- | --- | --- |
| empty_warehouse_01_1k.hdr | Empty Warehouse 01 (1k HDRI) | Poly Haven — https://polyhaven.com/a/empty_warehouse_01 | CC0 |

## Video — `public/media/video/`

Re-encoded to H.264 720p without audio, trimmed, with a WebP poster frame each.

| Local file | Source page | Licence | Credit |
| --- | --- | --- | --- |
| hero.mp4 | https://mixkit.co/free-stock-video/strong-man-exercising-with-a-barbell-44442/ | Mixkit Stock Video Free License | Mixkit |
| strength.mp4 | https://www.pexels.com/video/a-man-working-out-inside-the-gym-5319434/ | Pexels License | see source page |
| performance.mp4 | https://www.pexels.com/video/man-doing-weightlifting-4745804/ | Pexels License | see source page |
| conditioning.mp4 | https://www.pexels.com/video/working-out-at-the-gym-4859758/ | Pexels License | see source page |
| bench.mp4 | https://www.pexels.com/video/a-man-lifting-weights-in-a-fitness-gym-3196220/ | Pexels License | see source page |
| floor.mp4 | https://www.pexels.com/video/close-up-of-dumbbells-6053511/ | Pexels License | Алексей Мазаев |

## Photography — `public/media/img/`

Converted to WebP at 800 px and 1600 px widths. File names keep the Pexels photo id.
All under the Pexels License (free to use, attribution not required).

| Pexels id | Source page | Credit |
| --- | --- | --- |
| 896058 | https://www.pexels.com/photo/grayscale-photography-of-man-carrying-barbell-896058/ | DreamLens Production |
| 1552252 | https://www.pexels.com/photo/barbell-on-the-floor-1552252/ | Leon Mart |
| 6389516 | https://www.pexels.com/photo/close-up-shot-of-a-barbell-6389516/ | Tima Miroshnichenko |
| 1431282 | https://www.pexels.com/photo/man-holding-barbell-1431282/ | Anush Gorak |
| 2261481 | https://www.pexels.com/photo/black-barbel-2261481/ | Victor Freitas |
| 949131 | https://www.pexels.com/photo/grayscale-photo-of-black-adjustable-dumbbell-949131/ | see source page |
| 4164513 | https://www.pexels.com/photo/man-training-with-battle-ropes-4164513/ | see source page |
| 4804294 | https://www.pexels.com/photo/man-lying-with-a-foam-roller-on-his-back-4804294/ | see source page |
| 1552242 | https://www.pexels.com/photo/man-and-woman-holding-battle-ropes-1552242/ | see source page |
| 14121526 | https://www.pexels.com/photo/a-man-working-out-using-battle-ropes-14121526/ | see source page |
| 4164763 | https://www.pexels.com/photo/silver-dumbbells-on-rack-4164763/ | see source page |
| 9545907 | https://www.pexels.com/photo/an-empty-gym-9545907/ | see source page |
| 27810163 | https://www.pexels.com/photo/a-barbell-and-weights-on-the-floor-in-a-gym-27810163/ | see source page |
| 12890811 | https://www.pexels.com/photo/a-shirtless-man-using-battle-ropes-12890811/ | see source page |

"see source page": the contributor name was not machine-verifiable when the file was fetched
(the Pexels site blocks automated page reads); the link above shows it.

## Code components — `src/components/reactbits/`

LightRays, SplitText, GlareHover, TargetCursor, ElectricBorder, Magnet, ScrollVelocity — copied
unmodified from React Bits (https://reactbits.dev, https://github.com/DavidHDev/react-bits),
MIT + Commons Clause licence. The licence text is kept alongside them in `LICENSE.md`.

## Fonts

Archivo Variable and JetBrains Mono Variable, self-hosted through Fontsource — SIL Open Font License 1.1.

## Libraries

React, Vite, Tailwind CSS, GSAP (+ ScrollTrigger, SplitText), Motion, Lenis, three.js,
React Three Fiber, Drei, @react-three/postprocessing, Lucide — each under its own open licence (see `package.json`).

## Changes from the brief

- The requested 3dassets.dev pack is stylised low-poly, not photoreal. No free, verifiably licensed
  photoreal gym-equipment models were reachable (Poly Haven's library has none; Sketchfab downloads
  need an account), so the pack is used with studio lighting and re-finished materials, and is
  described on the page as a low-poly / stylised asset.
- Unsplash was not used: its site refused automated access, so all photography comes from Pexels.
