import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { appReady } from '../lib/store'
import { site } from '../content'

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(root.current, { autoAlpha: 0 })
        appReady.set()
        return
      }
      const state = { v: 0 }
      const tl = gsap.timeline()
      tl.from('.pre__char', { yPercent: 120, duration: 1, stagger: 0.05, ease: 'out-expo' })
        .to(state, {
          v: 100,
          duration: 2.2,
          ease: 'cine',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(state.v)).padStart(3, '0')
          },
        }, 0.1)
        .to('.pre__bar i', { scaleX: 1, duration: 2.2, ease: 'cine' }, 0.1)
        .to('.pre__char', { yPercent: -120, duration: 0.7, stagger: 0.03, ease: 'cine' })
        .to('.pre__meta', { autoAlpha: 0, duration: 0.4 }, '<')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'cine' }, '-=0.25')
        .add(() => appReady.set(), '-=0.75')
        .set(root.current, { display: 'none' })
    },
    { scope: root },
  )

  return (
    <div className="pre" ref={root} aria-hidden>
      <div className="pre__meta pre__meta--top mono">
        <span>({site.role})</span>
        <span>Loading the other one</span>
      </div>
      <div className="pre__name">
        {site.name.split('').map((c, i) => (
          <span className="pre__mask" key={i}>
            <span className="pre__char">{c}</span>
          </span>
        ))}
      </div>
      <div className="pre__meta pre__meta--bottom mono">
        <span ref={count}>000</span>
        <span className="pre__bar"><i /></span>
        <span>©{new Date().getFullYear()}</span>
      </div>
    </div>
  )
}
