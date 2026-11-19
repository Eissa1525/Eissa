import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { site } from '../content'

// على نمط ScrollReveal من React Bits: الكلمات تتضح مع التمرير
export default function Manifesto() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const split = SplitText.create('.manifesto__text', { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.1, filter: 'blur(8px)', y: 8 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.from('.manifesto__label > *', {
        yPercent: 100,
        stagger: 0.1,
        duration: 1,
        ease: 'out-expo',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    },
    { scope: root },
  )
  return (
    <section className="manifesto" id="about" ref={root}>
      <div className="manifesto__label mono">
        <span>(About)</span>
        <span>Two minds, one practice</span>
      </div>
      <p className="manifesto__text">{site.manifesto}</p>
    </section>
  )
}
