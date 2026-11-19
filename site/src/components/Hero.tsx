import { lazy, Suspense, useRef, useState } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { appReady, scroll } from '../lib/store'
import { site } from '../content'

const HeroScene = lazy(() => import('../three/HeroScene'))

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState(true)
  const phase = useRef<0 | 1>(0)

  useGSAP(
    () => {
      const name = nameRef.current!
      const split = SplitText.create('.hero__line', { type: 'words,chars', mask: 'chars' })
      gsap.set(split.chars, { yPercent: 110 })
      const fades = root.current!.querySelectorAll('.hero__top > *, .hero__foot > *')
      gsap.set(fades, { autoAlpha: 0, y: 20 })

      appReady.on(() => {
        const tl = gsap.timeline({ delay: 0.15 })
        tl.to(split.chars, { yPercent: 0, duration: 1.4, stagger: 0.04, ease: 'out-expo' })
          .to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06, ease: 'out-expo' }, 0.4)
      })

      const swap = (to: 0 | 1) => {
        if (phase.current === to) return
        phase.current = to
        root.current!.classList.toggle('is-alter', to === 1)
        gsap.to(name, {
          duration: 1.1,
          scrambleText: { text: to ? site.alias : site.name, chars: '!<>-_\\/[]{}—=+*^?#01', speed: 0.6, revealDelay: 0.2 },
          ease: 'none',
        })
        gsap.fromTo('.hero__flash', { autoAlpha: 0.6 }, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' })
      }

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scroll.hero = self.progress
          gsap.set('.hero__progress i', { scaleX: self.progress })
          swap(self.progress > 0.45 ? 1 : 0)
        },
        onToggle: (self) => setActive(self.isActive || self.progress < 1),
      })

      gsap.to('.hero__cue', {
        autoAlpha: 0,
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=300', scrub: true },
      })
      gsap.to('.hero__sticky', {
        scale: 0.92,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'bottom bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__sticky">
        <Suspense fallback={null}>
          <HeroScene active={active} />
        </Suspense>
        <div className="hero__flash" />
        <div className="hero__top mono">
          <span>({site.role})</span>
          <span>Portfolio ©{new Date().getFullYear()}</span>
          <span className="hero__avail"><i /> {site.available}</span>
        </div>

        <div className="hero__center">
          <p className="hero__line hero__line--a serif">the one you hire</p>
          <p className="hero__line hero__line--b serif">the one who shows up</p>
        </div>

        <div className="hero__foot">
          <h1 className="hero__name" ref={nameRef} aria-label={site.name}>{site.name}</h1>
          <div className="hero__phase mono">
            <span className="hero__phase-a">01 — The self</span>
            <span className="hero__phase-b">02 — The alter ego</span>
            <span className="hero__progress"><i /></span>
          </div>
        </div>
        <div className="hero__cue mono">Scroll to suit up ↓</div>
      </div>
    </section>
  )
}
