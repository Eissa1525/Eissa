import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { gsap, useGSAP } from '../animations/gsap'
import { appReady } from '../lib/store'
import { lockScroll } from '../lib/lenis'
import { site } from '../data/site'
import Magnetic from './Magnetic'
import Clock from './Clock'

export default function Nav() {
  const root = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === location.pathname
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenOn((prev) => {
      const cur = prev === location.pathname
      return (typeof v === 'function' ? v(cur) : v) ? location.pathname : null
    })

  useGSAP(() => {
    gsap.set(root.current, { yPercent: -120 })
    return appReady.on(() => gsap.to(root.current, { yPercent: 0, duration: 1.1, ease: 'out-expo', delay: 0.4 }))
  })


  // mobile menu animation, scroll lock, Escape + focus handling
  useGSAP(
    () => {
      const el = menu.current
      if (!el) return
      lockScroll(open)
      if (open) {
        gsap.set(el, { visibility: 'visible' })
        gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'cine' })
        gsap.fromTo(el.querySelectorAll('.m-item'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'out-expo', delay: 0.25 })
        el.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
      } else {
        gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'cine', onComplete: () => { gsap.set(el, { visibility: 'hidden' }) } })
      }
    },
    { dependencies: [open] },
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenOn(null)
        toggle.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header ref={root} className="fixed inset-x-0 top-0 z-[80] mix-blend-difference">
        <div className="shell grid grid-cols-[1fr_auto] items-center py-5 md:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="inline-flex items-center gap-3" aria-label={`${site.studio} — home`}>
            <span className="relative block size-4 rounded-full border-2 border-platinum after:absolute after:inset-[3px] after:rounded-full after:bg-platinum" />
            <span className="display-wide text-[0.95rem] tracking-[0.18em]">{site.brand}</span>
          </Link>
          <div className="label hidden gap-5 text-silver md:flex">
            <span>{site.location}</span>
            <Clock />
          </div>
          <nav aria-label="Primary" className="hidden justify-end gap-1 md:flex">
            {site.nav.map((l) => (
              <Magnetic key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) => `roll px-3 py-2 text-sm ${isActive ? 'text-violet-soft' : ''}`}
                  data-text={l.label}
                >
                  <span>{l.label}</span>
                </NavLink>
              </Magnetic>
            ))}
          </nav>
          <button
            ref={toggle}
            type="button"
            className="label flex items-center gap-3 py-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
            <span className="relative block h-2 w-5" aria-hidden>
              <i className={`absolute left-0 h-px w-full bg-platinum transition-transform duration-500 ${open ? 'top-1 rotate-45' : 'top-0'}`} />
              <i className={`absolute left-0 h-px w-full bg-platinum transition-transform duration-500 ${open ? 'top-1 -rotate-45' : 'top-2'}`} />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="invisible fixed inset-0 z-[70] flex flex-col justify-between bg-charcoal px-[var(--pad)] pt-28 pb-10 md:hidden"
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-2">
          {[{ label: 'Home', to: '/' }, ...site.nav].map((l, i) => (
            <div key={l.to} className="overflow-hidden">
              <NavLink to={l.to} className="m-item display-tight flex items-baseline gap-4 text-[clamp(2.75rem,13vw,4.5rem)] leading-[1.05]">
                <span className="label text-mist">0{i + 1}</span>
                {l.label}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="label space-y-2 text-silver">
          {site.contact.email && <a href={`mailto:${site.contact.email}`} className="block text-platinum">{site.contact.email}</a>}
          <span className="block">{site.location}</span>
        </div>
      </div>
    </>
  )
}
