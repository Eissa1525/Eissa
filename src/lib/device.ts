import { useEffect, useState, useSyncExternalStore } from 'react';

const mq = (q: string) => (typeof window !== 'undefined' ? window.matchMedia(q) : null);

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => { const m = mq(query); m?.addEventListener('change', cb); return () => m?.removeEventListener('change', cb); },
    () => !!mq(query)?.matches,
    () => false,
  );
}
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');
export const useIsTouch = () => useMedia('(hover: none), (pointer: coarse)');
export const useIsMobile = () => useMedia('(max-width: 767px)');

/** Quality tier for 3D: fewer effects and lower pixel ratio on small / touch / low-core devices. */
export function useQuality(): 'low' | 'high' {
  const touch = useIsTouch();
  const mobile = useIsMobile();
  const [low, setLow] = useState(false);
  useEffect(() => { setLow((navigator.hardwareConcurrency ?? 8) <= 4); }, []);
  return touch || mobile || low ? 'low' : 'high';
}

/** `near`: within rootMargin of the viewport (mount / unmount heavy scenes). `inView`: actually visible (run / pause). */
export function useNearView<T extends Element>(rootMargin = '600px') {
  const [el, setEl] = useState<T | null>(null);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!el) return;
    const a = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: `${rootMargin} 0px` });
    const b = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' });
    a.observe(el); b.observe(el);
    return () => { a.disconnect(); b.disconnect(); };
  }, [el, rootMargin]);
  return { ref: setEl, near, inView };
}
