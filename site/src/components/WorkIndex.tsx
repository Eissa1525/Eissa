import { useEffect, useRef } from 'react'
import { gsap, useGSAP, isTouch } from '../lib/gsap'
import { projects } from '../content'
import { coverURL } from '../lib/covers'

// فهرس المشاريع مع صورة تتبع المؤشر
export default function WorkIndex() {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.wi__row').forEach((row) => {
        gsap.from(row.querySelector('.wi__line'), {
          scaleX: 0,
          duration: 1.4,
          ease: 'out-expo',
          scrollTrigger: { trigger: row, start: 'top 90%' },
        })
        gsap.from(row.querySelectorAll('.wi__cell'), {
          yPercent: 100,
          autoAlpha: 0,
          stagger: 0.05,
          duration: 1,
          ease: 'out-expo',
          scrollTrigger: { trigger: row, start: 'top 90%' },
        })
      })
    },
    { scope: root },
  )

  useEffect(() => {
    if (isTouch()) return
    const p = preview.current!
    const xTo = gsap.quickTo(p, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(p, 'y', { duration: 0.6, ease: 'power3' })
    const rTo = gsap.quickTo(p, 'rotation', { duration: 0.8, ease: 'power3' })
    let lastX = 0
    const move = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY)
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6))
      lastX = e.clientX
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  const show = (i: number) => {
    const imgs = preview.current!.querySelectorAll('img')
    gsap.to(imgs, { yPercent: (j: number) => (j - i) * 100, duration: 0.7, ease: 'out-expo' })
    gsap.to(preview.current, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'out-expo' })
  }
  const hide = () => gsap.to(preview.current, { scale: 0.6, autoAlpha: 0, duration: 0.4, ease: 'power3.out' })

  return (
    <section className="wi" ref={root}>
      <div className="wi__head mono">
        <span>(Index)</span>
        <span>Client</span>
        <span>Discipline</span>
        <span>Year</span>
      </div>
      <ul onPointerLeave={hide}>
        {projects.map((p, i) => (
          <li key={p.id} className="wi__row" data-cursor="Open" onPointerEnter={() => show(i)}>
            <span className="wi__line" />
            <span className="wi__cell wi__title"><small className="mono">{p.id}</small>{p.title}</span>
            <span className="wi__cell">{p.client}</span>
            <span className="wi__cell">{p.category}</span>
            <span className="wi__cell mono">{p.year}</span>
          </li>
        ))}
      </ul>
      <div className="wi__preview" ref={preview} aria-hidden>
        {projects.map((p) => <img key={p.id} src={coverURL(p)} alt="" />)}
      </div>
    </section>
  )
}
