import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { site } from '../content'
import Magnetic from './Magnetic'
import Clock from './Clock'

export default function Footer() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const split = SplitText.create('.foot__cta h2', { type: 'lines', mask: 'lines' })
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.1,
        ease: 'out-expo',
        scrollTrigger: { trigger: '.foot__cta', start: 'top 75%' },
      })
      gsap.from('.foot__glitch-inner', {
        yPercent: 60,
        scaleY: 1.6,
        transformOrigin: '50% 100%',
        ease: 'none',
        scrollTrigger: { trigger: '.foot__glitch', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    },
    { scope: root },
  )

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = `${f.get('message') ?? ''}\n\n— ${f.get('name') ?? ''}`
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('New project — ' + (f.get('name') ?? ''))}&body=${encodeURIComponent(body)}`
  }

  return (
    <footer className="foot" id="contact" ref={root}>
      <div className="foot__cta">
        <span className="mono">(Contact)</span>
        <h2>
          Got a brand that needs <em className="serif">an alter ego?</em>
        </h2>
        <Magnetic strength={0.4}>
          <a className="foot__mail" href={`mailto:${site.email}`} data-cursor="Write">
            {site.email}
          </a>
        </Magnetic>
      </div>

      <form className="foot__form" onSubmit={onSubmit}>
        <label>
          <span className="mono">01 — Your name</span>
          <input name="name" required autoComplete="name" placeholder="Jane Doe" />
        </label>
        <label>
          <span className="mono">02 — Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="jane@studio.com" />
        </label>
        <label className="full">
          <span className="mono">03 — The project</span>
          <textarea name="message" rows={3} required placeholder="Tell me about the brand, the timeline, the budget…" />
        </label>
        <Magnetic>
          <button type="submit" className="btn" data-cursor="Send">Send it ↗</button>
        </Magnetic>
      </form>

      <div className="foot__bar mono">
        <span>{site.location} — <Clock /></span>
        <span className="foot__socials">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} className="roll" data-text={s.label}><span>{s.label}</span></a>
          ))}
        </span>
        <a href="#top" className="roll" data-text="Back to top ↑"><span>Back to top ↑</span></a>
      </div>

      <div className="foot__glitch" data-text={site.name} aria-hidden>
        <span className="foot__glitch-inner">{site.name}</span>
      </div>
    </footer>
  )
}
