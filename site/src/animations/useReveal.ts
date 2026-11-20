import type { RefObject } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from './gsap'
import { prefersReducedMotion } from '../hooks/useMedia'

/**
 * Declarative reveals for a page/section. Mark elements with:
 *   data-reveal="lines"   masked line reveal (SplitText)
 *   data-reveal="fade"    fade + rise
 *   data-reveal="image"   clip-path wipe + inner image settle
 *   data-reveal="scrub"   words brighten while scrolling (editorial reading effect)
 *   data-parallax="0.15"  depth parallax (fraction of element height)
 * Entry plays once when entering; reverse is handled for scrub/parallax by scrubbing.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(scope)
      q('[data-reveal="lines"]').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (s) =>
          gsap.from(s.lines, { yPercent: 105, duration: 1.2, ease: 'out-expo', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
        })
        void split
      })
      q('[data-reveal="fade"]').forEach((el) => {
        gsap.from(el, { y: 32, autoAlpha: 0, duration: 1.1, ease: 'out-expo', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
      q('[data-reveal="image"]').forEach((el) => {
        const img = el.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        tl.from(el, { clipPath: 'inset(18% 12% 18% 12% round 1rem)', duration: 1.5, ease: 'cine' })
        if (img) tl.from(img, { scale: 1.25, duration: 1.8, ease: 'out-expo' }, 0)
      })
      q('[data-reveal="scrub"]').forEach((el) => {
        const split = SplitText.create(el, { type: 'words' })
        gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true } })
      })
      q('[data-parallax]').forEach((el) => {
        const amt = parseFloat(el.dataset.parallax || '0.15')
        gsap.fromTo(el, { yPercent: -amt * 100 }, { yPercent: amt * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      ScrollTrigger.refresh()
    },
    { scope, dependencies: deps },
  )
}
