import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { appReady } from '../lib/store'
import { site } from '../content'
import Clock from './Clock'
import Magnetic from './Magnetic'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.set(root.current, { yPercent: -120 })
    appReady.on(() => gsap.to(root.current, { yPercent: 0, duration: 1.2, ease: 'out-expo', delay: 0.6 }))
  })
  return (
    <header className="nav" ref={root}>
      <a href="#top" className="nav__logo" aria-label="Home">
        <span className="nav__mark" /> {site.name}
      </a>
      <div className="nav__meta mono">
        <span>{site.location}</span>
        <Clock />
      </div>
      <nav className="nav__links">
        {links.map((l) => (
          <Magnetic key={l.href}>
            <a href={l.href} className="roll" data-text={l.label}>
              <span>{l.label}</span>
            </a>
          </Magnetic>
        ))}
      </nav>
    </header>
  )
}
