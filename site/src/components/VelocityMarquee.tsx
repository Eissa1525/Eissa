import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { scroll } from '../lib/store'

// على نمط ScrollVelocity من React Bits: السرعة والميلان يتبعان سرعة التمرير
function Row({ text, dir }: { text: string; dir: 1 | -1 }) {
  const inner = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = inner.current!
    let x = 0
    let skew = 0
    const tick = (_t: number, dt: number) => {
      const half = el.scrollWidth / 2
      const v = scroll.velocity
      x -= dir * (0.06 * dt + v * 0.04 * (dt / 16))
      if (x <= -half) x += half
      if (x > 0) x -= half
      skew += (gsap.utils.clamp(-12, 12, v * 0.12) - skew) * 0.12
      gsap.set(el, { x, skewX: -skew * dir })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [dir])
  const items = Array.from({ length: 6 }, (_, i) => (
    <span key={i}>
      {text} <i>✶</i>
    </span>
  ))
  return (
    <div className="marquee__row">
      <div className="marquee__inner" ref={inner}>
        {items}
        {items}
      </div>
    </div>
  )
}

export default function VelocityMarquee() {
  return (
    <section className="marquee" aria-hidden>
      <Row text="Brand Identity — Interface — Motion" dir={1} />
      <Row text="Available for select projects" dir={-1} />
    </section>
  )
}
