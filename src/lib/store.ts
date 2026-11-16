/** Tiny mutable stores read inside requestAnimationFrame loops (no React re-renders). */
export const pointer = { x: 0, y: 0 }; // normalised -1..1, smoothed by consumers
export const heroState = { progress: 0 }; // 0..1 scroll progress through the hero

let bound = false;
export function bindPointer() {
  if (bound || typeof window === 'undefined') return () => {};
  bound = true;
  const root = document.documentElement;
  const onMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  return () => { bound = false; window.removeEventListener('pointermove', onMove); };
}
