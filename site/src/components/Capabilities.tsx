import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { capabilities, projects } from '../content'
import { coverURL } from '../lib/covers'

// تمرير أفقي مثبّت مع بارالاكس داخلي للصور
export default function Capabilities() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const t = track.current!
        const dist = () => t.scrollWidth - window.innerWidth
        const tween = gsap.to(t, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => '+=' + dist(),
            invalidateOnRefresh: true,
          },
        })
        gsap.utils.toArray<HTMLElement>('.cap__img img').forEach((img) => {
          gsap.fromTo(img, { xPercent: -12 }, {
            xPercent: 12,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          })
        })
        gsap.utils.toArray<HTMLElement>('.cap__n').forEach((n) => {
          gsap.from(n, {
            yPercent: 60,
            opacity: 0,
            ease: 'none',
            scrollTrigger: { trigger: n, containerAnimation: tween, start: 'left 95%', end: 'left 55%', scrub: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="caps" ref={root}>
      <div className="caps__track" ref={track}>
        <div className="caps__intro">
          <span className="mono">(Capabilities)</span>
          <h2>
            What the <em className="serif">other one</em> does
          </h2>
        </div>
        {capabilities.map((c, i) => (
          <article className="cap" key={c.n}>
            <div className="cap__n">{c.n}</div>
            <div className="cap__img">
              <img src={coverURL(projects[(i * 2 + 1) % projects.length])} alt="" loading="lazy" />
            </div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <ul className="mono">
              {c.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
