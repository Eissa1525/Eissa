import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react';
import { site } from '../data/siteData';
import { media, type Img, type Vid } from '../data/assets';
import { LazyVideo, Picture, SectionHead } from '../components/ui/primitives';
import { useScroll } from '../lib/scroll';

type Item = { kind: 'img'; image: Img; shape: string; caption: string } | { kind: 'vid'; video: Vid; shape: string; caption: string };
const TALL = 'w-[62vw] sm:w-[36vw] lg:w-[24vw] aspect-[3/4]';
const WIDE = 'w-[84vw] sm:w-[58vw] lg:w-[42vw] aspect-[4/3] sm:aspect-[16/10]';

/** Gallery line-up — reorder or swap freely. Captions describe the picture, nothing more. */
const items: Item[] = [
  { kind: 'img', image: media.img.plateClose, shape: WIDE, caption: 'Collar and bumper plate' },
  { kind: 'img', image: media.img.ropesFront, shape: TALL, caption: 'Battle ropes, head-on' },
  { kind: 'vid', video: media.video.bench, shape: WIDE, caption: 'Bench press, from the rack' },
  { kind: 'img', image: media.img.dumbbellRack, shape: TALL, caption: 'Chrome dumbbell rack' },
  { kind: 'img', image: media.img.platesMono, shape: WIDE, caption: 'Plates on rubber' },
  { kind: 'img', image: media.img.ropesLow, shape: TALL, caption: 'Low stance, rope work' },
  { kind: 'img', image: media.img.ropesDuo, shape: WIDE, caption: 'Partner rope intervals' },
  { kind: 'img', image: media.img.barbellFloor, shape: TALL, caption: 'Bar on the floor' },
  { kind: 'vid', video: media.video.floor, shape: WIDE, caption: 'Along the dumbbell run' },
  { kind: 'img', image: media.img.rigInterior, shape: WIDE, caption: 'Rig, rings and air bikes' },
];

export default function Gallery() {
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [limit, setLimit] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    const measure = () => setLimit(Math.max(0, track.current!.scrollWidth - viewport.current!.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current!); ro.observe(viewport.current!);
    return () => ro.disconnect();
  }, []);
  useEffect(() => { if (x.get() < -limit) x.set(-limit); }, [limit, x]);

  const step = (dir: 1 | -1) => {
    const to = Math.max(-limit, Math.min(0, x.get() - dir * viewport.current!.clientWidth * 0.7));
    animate(x, to, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
  };
  const progress = useTransform(x, (v) => (limit ? -v / limit : 0));

  return (
    <section id="gallery" className="relative overflow-x-clip bg-void py-24 md:py-36">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHead eyebrow={site.gallery.eyebrow} title={site.gallery.title} />
        <div className="gutter flex items-center gap-3">
          <span className="label mr-2 hidden sm:inline">{site.gallery.hint}</span>
          <button type="button" aria-label="Previous images" onClick={() => step(-1)} className="cursor-target grid h-12 w-12 place-items-center border hairline hover:border-accent hover:text-accent"><ArrowLeft size={18} /></button>
          <button type="button" aria-label="Next images" onClick={() => step(1)} className="cursor-target grid h-12 w-12 place-items-center border hairline hover:border-accent hover:text-accent"><ArrowRight size={18} /></button>
        </div>
      </div>

      <div ref={viewport} className="mt-12 md:mt-16">
        <motion.div ref={track} style={{ x }} drag="x" dragConstraints={{ left: -limit, right: 0 }} dragElastic={0.08} dragTransition={{ power: 0.25, timeConstant: 280 }}
          onDragStart={() => { dragged.current = true; }} onDragEnd={() => { setTimeout(() => { dragged.current = false; }, 60); }}
          className="flex w-max cursor-grab touch-pan-y items-center gap-4 md:items-end px-[var(--gutter)] active:cursor-grabbing md:gap-6">
          {items.map((it, i) => (
            <Card key={i} item={it} index={i} x={x} onOpen={() => { if (!dragged.current) setOpen(i); }} />
          ))}
        </motion.div>
      </div>

      <div className="gutter mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="h-px w-full max-w-md bg-steel"><motion.div className="h-px origin-left bg-accent" style={{ scaleX: progress }} /></div>
        <p className="max-w-xl text-xs text-titanium/80">{site.gallery.note}</p>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} setIndex={setOpen} />}</AnimatePresence>
    </section>
  );
}

function Card({ item, index, x, onOpen }: { item: Item; index: number; x: MotionValue<number>; onOpen: () => void }) {
  // inner media slides against the track for depth
  const inner = useTransform(x, (v) => `${((v / 60 + index * 3) % 100) * 0.12 - 4}%`);
  return (
    <figure className={`${item.shape} group relative shrink-0 ${index % 2 ? 'md:mb-20' : ''}`}>
      <button type="button" onClick={onOpen} aria-label={`Open: ${item.caption}`} className="cursor-target relative block h-full w-full overflow-hidden bg-graphite">
        <motion.div className="absolute inset-y-0 -inset-x-[8%]" style={{ x: inner }}>
          {item.kind === 'img'
            ? <Picture image={item.image} sizes="(min-width:1024px) 42vw, 84vw" className="pointer-events-none h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05] [filter:grayscale(0.3)_contrast(1.06)_brightness(0.86)]" />
            : <LazyVideo src={item.video.src} poster={item.video.poster} className="pointer-events-none h-full w-full object-cover [filter:grayscale(0.3)_contrast(1.06)_brightness(0.86)]" />}
        </motion.div>
        {item.kind === 'vid' && <span className="absolute left-4 top-4 flex items-center gap-2 bg-void/70 px-3 py-1.5 label !text-bone backdrop-blur"><Play size={11} fill="currentColor" />Film</span>}
      </button>
      <figcaption className="label mt-3 flex justify-between"><span>{String(index + 1).padStart(2, '0')}</span><span>{item.caption}</span></figcaption>
    </figure>
  );
}

function Lightbox({ index, setIndex }: { index: number; setIndex: (i: number | null) => void }) {
  const scroll = useScroll();
  const item = items[index];
  const go = useCallback((d: number) => setIndex((index + d + items.length) % items.length), [index, setIndex]);
  useEffect(() => {
    scroll.stop();
    return () => scroll.start();
  }, [scroll]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIndex(null); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, setIndex]);
  return (
    <motion.div role="dialog" aria-modal="true" aria-label="Media viewer" className="fixed inset-0 z-[95] flex flex-col bg-void/95 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-lenis-prevent>
      <div className="gutter flex h-16 shrink-0 items-center justify-between">
        <p className="label tabular-nums !text-bone">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} — {item.caption}</p>
        <button type="button" autoFocus onClick={() => setIndex(null)} aria-label="Close viewer" className="grid h-11 w-11 place-items-center border hairline hover:border-accent hover:text-accent"><X size={18} /></button>
      </div>
      <motion.div className="relative min-h-0 flex-1 touch-pan-y px-4 pb-4" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
        onDragEnd={(_, info) => { if (info.offset.x < -80) go(1); else if (info.offset.x > 80) go(-1); }}>
        <AnimatePresence mode="wait">
          <motion.div key={index} className="grid h-full w-full place-items-center" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            {item.kind === 'img'
              ? <img src={item.image.src} srcSet={item.image.srcSet} sizes="100vw" alt={item.image.alt} draggable={false} className="max-h-full max-w-full object-contain" />
              : <video src={item.video.src} poster={item.video.poster} controls autoPlay muted loop playsInline className="max-h-full max-w-full" />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="gutter flex h-16 shrink-0 items-center justify-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous" className="grid h-11 w-14 place-items-center border hairline hover:border-accent hover:text-accent"><ArrowLeft size={18} /></button>
        <button type="button" onClick={() => go(1)} aria-label="Next" className="grid h-11 w-14 place-items-center border hairline hover:border-accent hover:text-accent"><ArrowRight size={18} /></button>
      </div>
    </motion.div>
  );
}
