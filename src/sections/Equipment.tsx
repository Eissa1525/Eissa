import { lazy, Suspense, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useGLTF } from '@react-three/drei';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { site } from '../data/siteData';
import { equipment } from '../data/equipment';
import { SectionHead, litMove } from '../components/ui/primitives';
import { CanvasBoundary, webglAvailable } from '../components/three/CanvasBoundary';
import type { ShowroomHandle } from '../components/three/ShowroomScene';
import { useIsTouch, useNearView, useQuality, useReducedMotion } from '../lib/device';

const ShowroomScene = lazy(() => import('../components/three/ShowroomScene'));

export default function Equipment() {
  const [index, setIndex] = useState(0);
  const item = equipment[index];
  const scene = useRef<ShowroomHandle>(null);
  const { ref, near, inView } = useNearView<HTMLDivElement>('700px');
  const quality = useQuality();
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const [gl] = useState(() => webglAvailable());
  const e = site.equipment;

  const Fallback = (
    <div className="grid h-full place-items-center p-8 text-center">
      <p className="max-w-xs text-sm text-titanium">The 3D viewer needs WebGL, which is not available in this browser. Specifications for each piece are listed alongside.</p>
    </div>
  );

  return (
    <section id="equipment" className="relative bg-void py-24 md:py-36">
      <SectionHead eyebrow={e.eyebrow} title={e.title}><p>{e.intro}</p></SectionHead>

      <div className="gutter mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        {/* selector */}
        <div className="order-2 min-w-0 lg:order-1 lg:col-span-3" role="tablist" aria-label="Equipment" aria-orientation="vertical">
          <ul className="no-scrollbar -mx-[var(--gutter)] flex snap-x gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:block lg:max-h-[70vh] lg:overflow-y-auto lg:px-0" data-lenis-prevent-touch>
            {equipment.map((it, i) => (
              <li key={it.id} className="shrink-0 snap-start">
                <button type="button" role="tab" aria-selected={i === index} onClick={() => setIndex(i)}
                  onPointerEnter={() => useGLTF.preload(it.model, false, true)} onPointerMove={litMove}
                  className={`lit cursor-target flex w-full items-baseline gap-4 border px-4 py-3 text-left transition-colors lg:border-x-0 lg:border-t-0 lg:px-2 lg:py-4 ${i === index ? 'border-accent text-bone lg:border-b-accent' : 'hairline text-titanium hover:text-bone'}`}>
                  <span className={`label ${i === index ? '!text-accent' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="display whitespace-nowrap text-xl lg:text-2xl">{it.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* stage */}
        <div ref={ref} className="relative order-1 min-w-0 h-[58svh] min-h-[360px] overflow-hidden border hairline bg-carbon lg:order-2 lg:col-span-6 lg:h-[72vh]">
          {gl && near ? (
            <CanvasBoundary fallback={Fallback}>
              <Suspense fallback={<div className="grid h-full place-items-center label">Loading model…</div>}>
                <ShowroomScene ref={scene} url={item.model} active={inView} quality={quality} touch={touch} reduced={reduced} />
              </Suspense>
            </CanvasBoundary>
          ) : gl ? <div className="grid h-full place-items-center label">3D viewer</div> : Fallback}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <p className="label">{touch ? e.hintTouch : e.hintMouse}</p>
            <p className="label tabular-nums text-bone">{String(index + 1).padStart(2, '0')} / {String(equipment.length).padStart(2, '0')}</p>
          </div>
          {gl && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              {!touch && <>
                <button type="button" aria-label="Zoom out" onClick={() => scene.current?.zoom(-1)} className="cursor-target grid h-11 w-11 place-items-center border hairline bg-void/60 backdrop-blur hover:border-accent hover:text-accent"><Minus size={16} /></button>
                <button type="button" aria-label="Zoom in" onClick={() => scene.current?.zoom(1)} className="cursor-target grid h-11 w-11 place-items-center border hairline bg-void/60 backdrop-blur hover:border-accent hover:text-accent"><Plus size={16} /></button>
              </>}
              <button type="button" onClick={() => scene.current?.reset()} className="cursor-target flex h-11 items-center gap-2 border hairline bg-void/60 px-4 label !text-bone backdrop-blur hover:border-accent hover:!text-accent"><RotateCcw size={14} />Reset view</button>
            </div>
          )}
        </div>

        {/* context */}
        <div className="order-3 min-w-0 lg:col-span-3" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={item.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <p className="label !text-accent">{item.zone}</p>
              <h3 className="display display-md mt-3">{item.name}</h3>
              <p className="mt-2 text-bone/80">{item.kind}</p>
              <p className="mt-5 text-titanium">{item.blurb}</p>
              <dl className="mt-8 text-sm">
                {[['Width', item.size[0]], ['Height', item.size[1]], ['Depth', item.size[2]]].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b hairline py-2.5"><dt className="label">{k}</dt><dd className="tabular-nums">{(v as number).toFixed(2)} m</dd></div>
                ))}
                <div className="flex justify-between border-b hairline py-2.5"><dt className="label">Mesh</dt><dd className="tabular-nums">{item.triangles.toLocaleString('en-US')} tris</dd></div>
              </dl>
            </motion.div>
          </AnimatePresence>
          <p className="mt-8 text-xs leading-relaxed text-titanium/70">{e.assetNote}</p>
        </div>
      </div>
    </section>
  );
}
