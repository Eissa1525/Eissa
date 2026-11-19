import { lazy, Suspense, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { scroll } from '../lib/store'
import { DEPTH, GAP } from '../three/tunnelConfig'
import { projects } from '../content'

const TunnelScene = lazy(() => import('../three/TunnelScene'))

export default function Tunnel() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  const current = useRef(-1)

  useGSAP(
    () => {
      const n = projects.length
      const setActiveIdx = (i: number) => {
        if (i === current.current) return
        current.current = i
        gsap.to('.tunnel__track', { yPercent: (-100 / n) * i, duration: 0.9, ease: 'out-expo' })
        gsap.to('.tunnel__meta-track', { yPercent: (-100 / n) * i, duration: 0.9, ease: 'out-expo' })
        const b = root.current?.querySelector('.tunnel__count b')
        if (b) b.textContent = String(i + 1).padStart(2, '0')
      }
      setActiveIdx(0)

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scroll.tunnel = self.progress
          gsap.set('.tunnel__bar i', { scaleY: self.progress })
          // المشروع الأقرب أمام الكاميرا
          setActiveIdx(Math.min(n - 1, Math.max(0, Math.round((self.progress * DEPTH - 1) / GAP))))
        },
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setActive(self.isActive),
      })
      gsap.from('.tunnel__intro > *', {
        yPercent: 100,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'out-expo',
        scrollTrigger: { trigger: root.current, start: 'top 60%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="tunnel" id="work" ref={root}>
      <div className="tunnel__sticky">
        <Suspense fallback={null}>{active && <TunnelScene active={active} />}</Suspense>
        <div className="tunnel__intro mono">
          <span>(Selected Work)</span>
          <span>{String(projects.length).padStart(2, '0')} projects — fly through</span>
        </div>
        <div className="tunnel__hud">
          <div className="tunnel__count mono">
            <b>01</b> / {String(projects.length).padStart(2, '0')}
          </div>
          <div className="tunnel__title">
            <div className="tunnel__track">
              {projects.map((p) => (
                <div key={p.id} className="tunnel__item">{p.title}</div>
              ))}
            </div>
          </div>
          <div className="tunnel__meta mono">
            <div className="tunnel__meta-track">
              {projects.map((p) => (
                <div key={p.id} className="tunnel__meta-item">
                  <span>{p.category}</span>
                  <span>{p.client}</span>
                  <span>{p.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="tunnel__bar"><i /></div>
      </div>
    </section>
  )
}
