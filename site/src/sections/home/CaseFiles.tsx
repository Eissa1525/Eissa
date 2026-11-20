import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { gsap, ScrollTrigger, useGSAP } from '../../animations/gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { scroll } from '../../lib/store'
import { projects } from '../../data/projects'
import { activeIndex } from '../../scenes/tunnel/config'
import { useIsMobile, useReducedMotion } from '../../hooks/useMedia'
import { hasWebGL } from '../../hooks/webgl'
import ErrorBoundary from '../../components/ErrorBoundary'
import ProjectCover from '../../components/ProjectCover'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrambleTextPlugin)
const TunnelScene = lazy(() => import('../../scenes/tunnel/TunnelScene'))
const pad = (n: number) => String(n).padStart(2, '0')

/** Static archive: used for reduced motion, no WebGL, or as a scene-error fallback. */
function StaticFiles() {
  return (
    <section className="shell py-[16vh]" aria-labelledby="files-title">
      <SectionLabel meta={`${pad(projects.length)} records`}><span id="files-title">Case files</span></SectionLabel>
      <ul className="mt-10 grid gap-10 md:grid-cols-2">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link to={`/work/${p.slug}`} className="group block">
              <div className="frame aspect-[16/10] border border-accent/60"><ProjectCover project={p} /></div>
              <p className="display mt-4 text-h3">{p.title}</p>
              <p className="hud mt-2 text-faint">{p.disciplines.join(', ')} / {p.year}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function CaseFiles() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const webgl = useMemo(() => hasWebGL(), [])
  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const [current, setCurrent] = useState(0)
  const idx = useRef(-1)

  useGSAP(
    () => {
      if (reduced || !webgl) return
      const q = gsap.utils.selector(root)
      const title = q('.cf-title')[0]
      const num = q('.cf-num')[0]
      const meta = q('.cf-meta')[0]
      const ticks = q('.cf-tick')
      const show = (i: number) => {
        if (i === idx.current) return
        idx.current = i
        setCurrent(i)
        const p = projects[i]
        gsap.to(title, { duration: 0.9, scrambleText: { text: p.title.toUpperCase(), chars: '01#<>/=+*ABCDEFGHKMNRSTXYZ', speed: 0.9, revealDelay: 0.1 } })
        gsap.fromTo(num, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'out-expo', onStart: () => { num.textContent = pad(i + 1) } })
        gsap.fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.25, onStart: () => { meta.textContent = `${p.disciplines.slice(0, 2).join(', ')}  /  ${p.client}  /  ${p.year}` } })
        ticks.forEach((t, k) => t.classList.toggle('is-on', k === i))
      }
      show(0)
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (s) => {
          scroll.tunnel = s.progress
          show(activeIndex(s.progress))
        },
      })
      ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onToggle: (s) => setActive(s.isActive) })
    },
    { scope: root, dependencies: [reduced, webgl] },
  )

  if (reduced || !webgl) return <StaticFiles />
  const cur = projects[current]

  return (
    <section ref={root} id="work" className="relative" style={{ height: `${projects.length * 85 + 100}vh` }} aria-labelledby="files-title">
      <div className="sticky top-0 h-svh overflow-hidden">
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>{active && <TunnelScene mobile={mobile} onOpen={(i) => navigate(`/work/${projects[i].slug}`)} />}</Suspense>
        </ErrorBoundary>

        <div className="shell pointer-events-none absolute inset-x-0 top-20 md:top-24">
          <SectionLabel meta={`${pad(projects.length)} records`}><span id="files-title">Case files</span></SectionLabel>
        </div>

        <div className="shell absolute inset-x-0 bottom-[max(2rem,6vh)]">
          <div className="cf-num display outline-text text-[clamp(4rem,9vw,8rem)] leading-none [-webkit-text-stroke-color:var(--color-accent)]" aria-hidden>01</div>
          <Link to={`/work/${cur.slug}`} className="group block w-fit" data-cursor="Open">
            <h2 className="cf-title display text-[clamp(2.6rem,6.5vw,6.5rem)] leading-[0.86] transition-colors group-hover:text-accent">{projects[0].title.toUpperCase()}</h2>
            <span className="sr-only">Open case file: {cur.title}</span>
          </Link>
          <p className="cf-meta hud mt-3 text-faint">{projects[0].disciplines.slice(0, 2).join(', ')}</p>
        </div>

        <ol className="pointer-events-none absolute top-1/2 right-[var(--pad)] grid -translate-y-1/2 gap-2" aria-hidden>
          {projects.map((p) => (
            <li key={p.slug} className="cf-tick h-px w-3 bg-faint transition-all duration-500 [&.is-on]:w-7 [&.is-on]:bg-accent" />
          ))}
        </ol>
      </div>
    </section>
  )
}
