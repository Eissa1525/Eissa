import { lazy, Suspense, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '../data/siteData';
import { media } from '../data/assets';
import { LazyVideo } from '../components/ui/primitives';
import { CanvasBoundary, webglAvailable } from '../components/three/CanvasBoundary';
import { useIsTouch, useNearView, useQuality, useReducedMotion } from '../lib/device';

const FloorScene = lazy(() => import('../components/three/FloorScene'));

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const x = site.experience;
  const [zone, setZone] = useState(0);
  const { ref, near, inView } = useNearView<HTMLDivElement>('700px');
  const quality = useQuality();
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const [gl] = useState(() => webglAvailable());

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // the film opens from a letterboxed slot to full bleed as you arrive
      gsap.fromTo(q('[data-film]'), { clipPath: 'inset(18% 14% 18% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: q('[data-film]')[0], start: 'top 90%', end: 'top 15%', scrub: 0.6 } });
      gsap.fromTo(q('[data-film] video'), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: q('[data-film]')[0], start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(q('[data-film-title] span'), { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1, scrollTrigger: { trigger: q('[data-film]')[0], start: 'top 45%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section id="experience" ref={root} className="relative bg-void pb-24 md:pb-36">
      {/* real interior footage */}
      <div data-film className="relative h-[86svh] overflow-hidden">
        <LazyVideo src={media.video.floor.src} poster={media.video.floor.poster} className="h-full w-full object-cover [filter:contrast(1.1)_brightness(0.8)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-void/50" />
        <div className="absolute inset-x-0 bottom-0 gutter pb-10 md:pb-14">
          <p className="label mb-5"><span className="mr-3 inline-block h-px w-8 bg-accent align-middle" />{x.eyebrow}</p>
          <h2 data-film-title className="display display-xl">
            {x.title.split(' ').map((w, i) => <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.05em] align-bottom"><span className={`inline-block ${i === 1 ? 'outline-text' : ''}`}>{w}</span></span>)}
          </h2>
        </div>
      </div>

      {/* interactive floor model */}
      <div className="gutter mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <p className="max-w-sm text-titanium">{x.intro}</p>
          <div role="tablist" aria-label="Floor views" className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-0">
            {x.zones.map((z, i) => (
              <button key={z.id} type="button" role="tab" aria-selected={i === zone} onClick={() => setZone(i)}
                className={`cursor-target flex items-baseline gap-4 border px-4 py-3 text-left transition-colors lg:border-x-0 lg:border-t-0 lg:px-0 lg:py-4 ${i === zone ? 'border-accent text-bone' : 'hairline text-titanium hover:text-bone'}`}>
                <span className={`label ${i === zone ? '!text-accent' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="display text-xl lg:text-3xl">{z.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={zone} className="mt-6 max-w-sm text-bone/85" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>{x.zones[zone].body}</motion.p>
          </AnimatePresence>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <div ref={ref} className="relative h-[52svh] min-h-[320px] border hairline bg-[radial-gradient(ellipse_at_50%_60%,rgba(42,42,48,.55),transparent_70%)] lg:h-[68vh]">
            {gl && near ? (
              <CanvasBoundary fallback={<div className="grid h-full place-items-center p-8 text-center text-sm text-titanium">The floor model could not be displayed in this browser.</div>}>
                <Suspense fallback={<div className="grid h-full place-items-center label">Loading floor model…</div>}>
                  <FloorScene view={x.zones[zone].view} active={inView} quality={quality} touch={touch} reduced={reduced} />
                </Suspense>
              </CanvasBoundary>
            ) : <div className="grid h-full place-items-center p-8 text-center text-sm text-titanium">{gl ? 'Floor model' : 'The floor model needs WebGL, which is not available in this browser.'}</div>}
            <p className="label pointer-events-none absolute left-4 top-4">{touch ? 'Drag to orbit · pinch to zoom' : 'Drag to orbit'}</p>
            {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'left-0 bottom-0 border-l border-b', 'right-0 bottom-0 border-r border-b'].map((c) => <span key={c} className={`pointer-events-none absolute h-4 w-4 border-accent ${c}`} aria-hidden />)}
          </div>
          <p className="mt-3 text-xs text-titanium/70">{x.modelNote}</p>
        </div>
      </div>
    </section>
  );
}
