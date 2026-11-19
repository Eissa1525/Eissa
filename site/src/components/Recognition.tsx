import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { recognition } from '../content'

export default function Recognition() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.rec__row').forEach((row) => {
        gsap.from(row, {
          clipPath: 'inset(0 0 100% 0)',
          y: 30,
          duration: 1.1,
          ease: 'out-expo',
          scrollTrigger: { trigger: row, start: 'top 92%' },
        })
      })
      gsap.from('.rec__big', {
        textContent: 0,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: { trigger: '.rec__stats', start: 'top 85%' },
      })
    },
    { scope: root },
  )
  return (
    <section className="rec" ref={root}>
      <div className="rec__stats">
        <div><b className="rec__big">9</b><span className="mono">Years in practice</span></div>
        <div><b className="rec__big">64</b><span className="mono">Brands launched</span></div>
        <div><b className="rec__big">17</b><span className="mono">Awards & mentions</span></div>
      </div>
      <div className="rec__list">
        <span className="mono rec__label">(Recognition)</span>
        {recognition.map((r) => (
          <div className="rec__row" key={r.award + r.year}>
            <span>{r.award}</span>
            <span className="serif">{r.detail}</span>
            <span className="mono">{r.year}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
