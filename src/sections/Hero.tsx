import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { site } from '../data/siteData';
import { media } from '../data/assets';
import { heroState } from '../lib/store';
import { useIsTouch, useNearView, useQuality, useReducedMotion } from '../lib/device';
import { MagneticLink } from '../components/ui/primitives';
import { CanvasBoundary, webglAvailable } from '../components/three/CanvasBoundary';

const HeroScene = lazy(() => import('../components/three/HeroScene'));

export default function Hero({ entered }: { entered: boolean }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(true);
  const [gl] = useState(() => webglAvailable());
  const [sceneReady, setSceneReady] = useState(false);
  const stage = useNearView<HTMLDivElement>('900px');
  const quality = useQuality();
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const h = site.hero;

  // real load signal for the intro; if the video can't load, don't hold the page hostage
  useEffect(() => {
    const v = video.current!;
    const ok = () => window.dispatchEvent(new Event('iv:hero-video-ready'));
    if (v.readyState >= 3) ok();
    v.addEventListener('canplay', ok, { once: true });
    v.addEventListener('error', ok, { once: true });
    if (!gl) window.dispatchEvent(new Event('iv:hero-video-ready'));
    return () => { v.removeEventListener('canplay', ok); v.removeEventListener('error', ok); };
  }, [gl]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting) video.current?.play().catch(() => {}); else video.current?.pause();
    });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  // scroll choreography — scrubbed, never pinned-by-force: the stage is CSS sticky inside a tall section
  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { motion } = ctx.conditions as { motion: boolean };
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: motion ? 0.6 : true, onUpdate: (s) => { heroState.progress = s.progress; } },
      });
      if (motion) {
        tl.to(q('[data-line="0"]'), { xPercent: -28, opacity: 0, duration: 0.7 }, 0.08)
          .to(q('[data-line="1"]'), { xPercent: 34, opacity: 0, duration: 0.7 }, 0.12)
          .to(q('[data-line="2"]'), { xPercent: -46, opacity: 0, duration: 0.7 }, 0.16)
          .to(q('[data-meta]'), { opacity: 0, y: -24, duration: 0.3 }, 0.02)
          .to(q('[data-video]'), { scale: 1.18, duration: 1 }, 0);
      }
      tl.to(q('[data-shade]'), { opacity: 1, duration: 0.45 }, 0.55);
    });
    return () => mm.revert();
  }, { scope: root });

  // entrance, once the intro releases
  useGSAP(() => {
    if (!entered) return;
    const q = gsap.utils.selector(root);
    if (reduced) { gsap.set(q('[data-rise], [data-meta]'), { clearProps: 'all' }); gsap.set(q('[data-stage]'), { autoAlpha: 1 }); return; }
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .set(q('[data-stage]'), { autoAlpha: 1 })
      .fromTo(q('[data-video]'), { scale: 1.25, filter: 'brightness(0)' }, { scale: 1, filter: 'brightness(1)', duration: 2.2, ease: 'power2.out' }, 0)
      .fromTo(q('[data-rise]'), { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.11 }, 0.15)
      .fromTo(q('[data-meta]'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.8);
  }, { scope: root, dependencies: [entered, reduced] });

  // DOM parallax layers (desktop pointer only)
  useEffect(() => {
    if (touch || reduced) return;
    const q = gsap.utils.selector(root);
    const vx = gsap.quickTo(q('[data-video-in]'), 'x', { duration: 1.2, ease: 'power3.out' });
    const vy = gsap.quickTo(q('[data-video-in]'), 'y', { duration: 1.2, ease: 'power3.out' });
    const tx = gsap.quickTo(q('[data-type]'), 'x', { duration: 0.9, ease: 'power3.out' });
    const ty = gsap.quickTo(q('[data-type]'), 'y', { duration: 0.9, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      vx(nx * -26); vy(ny * -18); tx(nx * 14); ty(ny * 9);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [touch, reduced]);

  return (
    <section id="hero" ref={root} className="relative h-[190svh]" aria-label="Introduction">
      <div data-stage ref={stage.ref} className="invisible sticky top-0 h-svh overflow-hidden">
        {/* layer 0 — real footage */}
        <div data-video className="absolute -inset-[4%] will-change-transform">
          <video ref={video} data-video-in className="h-full w-full object-cover [filter:grayscale(0.55)_contrast(1.12)_brightness(0.62)]"
            src={media.video.hero.src} poster={media.video.hero.poster} autoPlay muted loop playsInline preload="auto" aria-hidden />
        </div>
        {/* layer 1 — grade */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,6,.92)_0%,rgba(5,5,6,.55)_42%,rgba(5,5,6,.15)_70%,rgba(5,5,6,.6)_100%)]" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void via-void/70 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void/80 to-transparent" aria-hidden />

        {/* layer 2 — headline (first two lines sit behind the 3D model) */}
        <h1 data-type className="display display-xl absolute inset-x-0 bottom-[calc(15rem+env(safe-area-inset-bottom))] gutter md:bottom-[7svh]" aria-label={h.headline.join(' ')}>
          <span className="block overflow-hidden pb-[0.05em]"><span data-rise data-line="0" className="block">{h.headline[0]}</span></span>
          <span className="block overflow-hidden pb-[0.05em] pl-[9vw]"><span data-rise data-line="1" className="outline-text block">{h.headline[1]}</span></span>
          <span className="invisible block pb-[0.05em]" aria-hidden>{h.headline[2]}</span>
        </h1>

        {/* layer 3 — real-time 3D */}
        {gl && stage.near && (
          <div className={`absolute inset-0 z-[5] transition-opacity duration-[1600ms] ${sceneReady ? 'opacity-100' : 'opacity-0'}`} aria-hidden>
            <CanvasBoundary fallback={null}>
              <Suspense fallback={null}>
                <HeroScene active={inView} quality={quality} reduced={reduced} onReady={() => setSceneReady(true)} />
              </Suspense>
            </CanvasBoundary>
          </div>
        )}

        {/* layer 4 — last headline line in front of the model */}
        <div data-type className="display display-xl pointer-events-none absolute inset-x-0 bottom-[calc(15rem+env(safe-area-inset-bottom))] z-[6] gutter md:bottom-[7svh]" aria-hidden>
          <span className="invisible block pb-[0.05em]">{h.headline[0]}</span>
          <span className="invisible block pb-[0.05em]">{h.headline[1]}</span>
          <span className="block overflow-hidden pb-[0.05em]"><span data-rise data-line="2" className="block">{h.headline[2].replace('.', '')}<span className="text-accent">.</span></span></span>
        </div>

        {/* meta */}
        <p data-meta className="label absolute left-0 top-24 gutter md:top-28"><span className="mr-3 inline-block h-px w-8 bg-accent align-middle" />{h.eyebrow}</p>
        <div data-meta className="absolute inset-x-0 bottom-6 z-[7] gutter md:inset-x-auto md:bottom-[9svh] md:right-0 md:w-[25rem]">
          <p className="mb-5 max-w-[18rem] text-lg leading-snug text-bone/90 md:text-xl" style={{ fontStretch: '88%' }}>{h.sub}</p>
          <div className="flex flex-wrap gap-3">
            <MagneticLink href={h.primary.href}>{h.primary.label}</MagneticLink>
            <MagneticLink href={h.secondary.href} variant="ghost" arrow={false}>{h.secondary.label}</MagneticLink>
          </div>
        </div>
        <div data-meta className="label absolute right-0 top-1/2 hidden origin-right -translate-y-1/2 -rotate-90 gutter lg:block" aria-hidden>
          <span className="inline-block translate-y-[2.2rem]">{site.brand.tagline} — {h.scrollHint} ↓</span>
        </div>

        <div data-shade className="pointer-events-none absolute inset-0 z-[8] bg-void opacity-0" aria-hidden />
      </div>
    </section>
  );
}
