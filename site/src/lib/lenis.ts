import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../animations/gsap'
import { scroll } from './store'
import { prefersReducedMotion } from '../hooks/useMedia'

/** Single smooth-scroll controller for the whole app (no other scroll systems). */
let lenis: Lenis | null = null

export function initLenis() {
  if (lenis || prefersReducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.085, anchors: !import.meta.env.VITE_HASH_ROUTER, autoRaf: false })
  lenis.on('scroll', (l: Lenis) => {
    scroll.velocity = l.velocity
    ScrollTrigger.update()
  })
  const raf = (t: number) => lenis?.raf(t * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis?.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}
export const lockScroll = (lock: boolean) => {
  if (lenis) {
    if (lock) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}
