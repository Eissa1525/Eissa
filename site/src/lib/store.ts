// Shared mutable state between DOM (GSAP) and WebGL (useFrame) — never triggers React renders.
export const scroll = {
  hero: 0, // 0..1 suit-up progress
  tunnel: 0, // 0..1 case-files tunnel progress
  velocity: 0, // Lenis velocity
  intro: 0, // 0..1 light-up after preloader
}

type Listener = () => void
function signal() {
  let fired = false
  const ls = new Set<Listener>()
  return {
    get value() { return fired },
    fire() { if (fired) return; fired = true; ls.forEach((l) => l()) },
    on(l: Listener) { if (fired) l(); else ls.add(l); return () => { ls.delete(l) } },
  }
}
/** Fires once when the preloader has left the screen. */
export const appReady = signal()

/** Genuine loading registry: sections register real async work (modules, fonts, first frame). */
export const loading = (() => {
  let total = 0
  let done = 0
  return {
    track<T>(p: Promise<T>) {
      total++
      p.finally(() => { done++ })
      return p
    },
    get ratio() { return total === 0 ? 0 : done / total },
    get complete() { return total > 0 && done === total },
  }
})()
