import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../animations/gsap'
import { services } from '../../data/services'
import { radarAxes } from '../../data/site'
import { prefersReducedMotion } from '../../hooks/useMedia'
import SectionLabel from '../../components/SectionLabel'

const R = 120
const C = 160
const pt = (i: number, v: number) => {
  const a = -Math.PI / 2 + (i * Math.PI * 2) / radarAxes.length
  return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v] as const
}
const poly = (vals: number[]) => vals.map((v, i) => pt(i, v / 100).join(',')).join(' ')

export default function Abilities() {
  const root = useRef<HTMLElement>(null)
  const shape = useRef<SVGPolygonElement>(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const paused = useRef(false)
  const vals = useRef({ v: services[0].scores.map(() => 0) })

  // morph radar to the active ability
  useEffect(() => {
    const target = services[active].scores
    const state = vals.current
    const tw = gsap.to(state.v, {
      ...Object.fromEntries(target.map((t, i) => [i, t])),
      duration: prefersReducedMotion() ? 0 : 0.9,
      ease: 'out-expo',
      onUpdate: () => shape.current?.setAttribute('points', poly(state.v)),
    })
    return () => { tw.kill() }
  }, [active])

  // auto-cycle while visible, unless the visitor is interacting
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return
    const id = setInterval(() => { if (!paused.current) setActive((a) => (a + 1) % services.length) }, 3800)
    return () => clearInterval(id)
  }, [inView])

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: 'top 70%', end: 'bottom 30%', onToggle: (s) => setInView(s.isActive) })
      if (prefersReducedMotion()) return
      gsap.to('.ab-sweep', { rotation: 360, svgOrigin: `${C} ${C}`, duration: 4, ease: 'none', repeat: -1 })
      gsap.from('.ab-row', { yPercent: 60, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'out-expo', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
    },
    { scope: root },
  )

  const s = services[active]
  return (
    <section ref={root} className="shell py-[18vh]" aria-labelledby="abilities-title">
      <SectionLabel id="abilities-title" meta={`${String(services.length).padStart(2, '0')} abilities`}>Abilities</SectionLabel>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <ul className="border-t border-line" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
          {services.map((sv, i) => (
            <li key={sv.n} className="ab-row border-b border-line">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => { paused.current = true; setActive(i) }}
                aria-pressed={i === active}
                className="group flex w-full items-center gap-5 py-4 text-left md:py-5"
              >
                <span className={`hud w-14 shrink-0 ${i === active ? 'text-accent' : 'text-faint'}`}>AB-{sv.n}</span>
                <span className={`display text-[clamp(2rem,4.5vw,4.25rem)] transition-[color,transform] duration-500 ${i === active ? 'translate-x-2 text-fg' : 'text-faint group-hover:text-dim'}`}>
                  {sv.title}
                </span>
                <span className={`hud ml-auto text-signal transition-opacity ${i === active ? 'opacity-100' : 'opacity-0'}`}>Active</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="border border-line bg-panel" aria-live="polite">
          <div className="hud flex justify-between border-b border-line px-4 py-3 text-faint">
            <span className="text-signal">Scan / AB-{s.n}</span>
            <span className="flex items-center gap-2"><i className="dot-live animate-blink" />Live</span>
          </div>
          <svg viewBox="0 0 320 320" className="mx-auto block w-full max-w-[380px] p-4" role="img" aria-label={`${s.title} profile: ${radarAxes.map((a, i) => `${a} ${s.scores[i]}`).join(', ')}`}>
            <defs>
              <linearGradient id="sweep" x1="0" x2="1">
                <stop offset="0" stopColor="#31a8ff" stopOpacity="0" />
                <stop offset="1" stopColor="#31a8ff" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((k) => (
              <polygon key={k} points={poly(radarAxes.map(() => k * 100))} fill="none" stroke="rgb(237 237 240 / 0.1)" />
            ))}
            {radarAxes.map((a, i) => {
              const [x, y] = pt(i, 1)
              const [lx, ly] = pt(i, 1.2)
              return (
                <g key={a}>
                  <line x1={C} y1={C} x2={x} y2={y} stroke="rgb(237 237 240 / 0.1)" />
                  <text x={lx} y={ly} fill="rgb(237 237 240 / 0.45)" fontSize="9" fontFamily="JetBrains Mono Variable, monospace" textAnchor="middle" dominantBaseline="middle" letterSpacing="1.5">
                    {a.toUpperCase()}
                  </text>
                </g>
              )
            })}
            <path className="ab-sweep" d={`M${C},${C} L${C + R},${C} A${R},${R} 0 0,0 ${C + Math.cos(-0.6) * R},${C + Math.sin(-0.6) * R} Z`} fill="url(#sweep)" />
            <polygon ref={shape} points={poly(vals.current.v)} fill="rgb(255 90 31 / 0.22)" stroke="#ff5a1f" strokeWidth="1.5" />
          </svg>
          <div className="border-t border-line p-5">
            <h3 className="display text-h3 text-accent">{s.title}</h3>
            <p className="mt-2 max-w-md text-sm text-dim">{s.body}</p>
            <dl className="hud mt-4 flex flex-wrap gap-x-5 gap-y-1 text-faint">
              {radarAxes.map((a, i) => (
                <div key={a} className="flex gap-2"><dt>{a.slice(0, 3)}</dt><dd className="text-fg">{String(s.scores[i]).padStart(3, '0')}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
