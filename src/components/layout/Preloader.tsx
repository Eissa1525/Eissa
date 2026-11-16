import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProgress } from '@react-three/drei';
import { site } from '../../data/siteData';
import { useScroll } from '../../lib/scroll';
import { useReducedMotion } from '../../lib/device';

/**
 * Intro. Progress is real: it follows three.js' loading manager (GLB + HDR) and the hero video's
 * `canplay` event. It can be skipped, and it lets go by itself after MAX_WAIT even if assets are slow.
 */
const MIN_SHOW = 1400;
const MAX_WAIT = 8000;

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const { active, progress, item, loaded, total } = useProgress();
  const [video, setVideo] = useState(false);
  const [minDone, setMinDone] = useState(false);
  const leaving = useRef(false);
  const scroll = useScroll();
  const reduced = useReducedMotion();

  const threeDone = !active && total > 0 && loaded >= total;
  const pct = Math.round((total > 0 ? progress : 0) * 0.75 + (video ? 25 : 0));

  const leave = () => {
    if (leaving.current) return;
    leaving.current = true;
    scroll.start();
    onDoneRef.current(); // hero starts its entrance underneath while the shutter lifts
  };
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    scroll.stop();
    window.scrollTo(0, 0);
    const onVideo = () => setVideo(true);
    window.addEventListener('iv:hero-video-ready', onVideo);
    const a = setTimeout(() => setMinDone(true), MIN_SHOW);
    const b = setTimeout(leave, MAX_WAIT);
    return () => { clearTimeout(a); clearTimeout(b); window.removeEventListener('iv:hero-video-ready', onVideo); scroll.start(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(() => {
    if (reduced) return;
    gsap.timeline()
      .fromTo('[data-in]', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'power4.out' })
      .fromTo('.metal-text', { backgroundPosition: '120% 0' }, { backgroundPosition: '-20% 0', duration: 2.2, ease: 'power1.inOut' }, 0.1);
  }, { scope: root, dependencies: [reduced] });

  useEffect(() => { if (minDone && threeDone && video) leave(); /* eslint-disable-next-line */ }, [minDone, threeDone, video]);

  const file = item ? item.split('/').pop() : video ? 'hero.mp4' : 'starting';
  return (
    <div ref={root} className="fixed inset-0 z-[90] flex flex-col justify-between bg-void gutter py-8" role="status" aria-live="polite">
      <div className="flex items-center justify-between label">
        <span>{site.brand.tagline}</span>
        <span>Concept 01</span>
      </div>
      <div>
        <div className="overflow-hidden">
          <p data-in className="display display-xl metal-text select-none">{site.brand.left}<span className="text-accent" style={{ WebkitTextFillColor: 'var(--iv-accent)' }}>//</span>{site.brand.right}</p>
        </div>
        <div className="mt-8 h-px w-full bg-steel">
          <div className="h-px origin-left bg-accent transition-transform duration-500 ease-out" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 label">
          <span className="truncate">Loading assets — {file}</span>
          <span className="tabular-nums text-bone">{String(pct).padStart(3, '0')}%</span>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={leave} className="label cursor-target border-b border-titanium pb-1 text-bone hover:border-accent hover:text-accent">Skip intro</button>
      </div>
    </div>
  );
}
