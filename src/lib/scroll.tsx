import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { theme } from '../config/theme';
import { useReducedMotion } from './device';

gsap.registerPlugin(ScrollTrigger);

type Ctx = { scrollTo: (target: string | number, opts?: { offset?: number; immediate?: boolean }) => void; stop: () => void; start: () => void };
const ScrollCtx = createContext<Ctx>({ scrollTo: () => {}, stop: () => {}, start: () => {} });
export const useScroll = () => useContext(ScrollCtx);

/** Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger and Lenis share one clock. */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return; // native scrolling when the user asks for less motion
    const lenis = new Lenis({ duration: theme.motion.lenisDuration, smoothWheel: true, syncTouch: false });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); lenisRef.current = null; };
  }, [reduced]);

  const api = useRef<Ctx>({
    scrollTo: (target, opts) => {
      const l = lenisRef.current;
      if (l) return l.scrollTo(target as never, { offset: opts?.offset ?? 0, immediate: opts?.immediate });
      const el = typeof target === 'string' ? document.querySelector(target) : null;
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      else if (typeof target === 'number') window.scrollTo(0, target);
    },
    stop: () => { lenisRef.current?.stop(); document.documentElement.style.overflow = 'hidden'; },
    start: () => { lenisRef.current?.start(); document.documentElement.style.overflow = ''; },
  }).current;

  // In-page anchors: one delegated handler so every <a href="#id"> scrolls smoothly and updates the hash.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!;
      if (id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      api.scrollTo(id);
      history.replaceState(null, '', id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [api]);

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>;
}
