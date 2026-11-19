import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../animations/gsap'
import { appReady, loading } from '../lib/store'
import { lockScroll } from '../lib/lenis'
import { prefersReducedMotion } from '../hooks/useMedia'
import { site } from '../data/site'

/**
 * Preloader driven by genuine progress: fonts + every promise registered with `loading.track`
 * (3D module download, first rendered frame). No artificial waiting. Skippable at any time.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)
  const leaving = useRef(false)

  const { contextSafe } = useGSAP({ scope: root })

  const leave = contextSafe(() => {
    if (leaving.current) return
    leaving.current = true
    if (num.current) num.current.textContent = '100'
    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true)
        lockScroll(false)
      },
    })
    const q = gsap.utils.selector(root)
    tl.to(q('.pre-word'), { yPercent: -110, duration: 0.7, ease: 'cine', stagger: 0.04 })
      .to(q('.pre-meta'), { autoAlpha: 0, duration: 0.3 }, '<')
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'cine' }, '-=0.3')
      .add(() => appReady.fire(), '-=0.65')
  })

  const leaveRef = useRef(leave)
  leaveRef.current = leave

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) {
      appReady.fire()
      setGone(true)
      return
    }
    lockScroll(true)
    gsap.from(el.querySelectorAll('.pre-word'), { yPercent: 110, duration: 0.9, ease: 'out-expo', stagger: 0.06 })
    const fonts = loading.track(document.fonts?.ready ?? Promise.resolve())
    void fonts
    let shown = 0
    let raf = 0
    const start = performance.now()
    const tick = () => {
      const target = loading.ratio
      shown += (target - shown) * 0.12
      if (num.current) num.current.textContent = String(Math.round(shown * 100)).padStart(3, '0')
      const bar = el.querySelector<HTMLElement>('.pre-bar i')
      if (bar) bar.style.transform = `scaleX(${shown})`
      const elapsed = performance.now() - start
      // leave when all registered work is done (min 700ms so the intro reads), or after a hard 10s cap
      if ((loading.complete && elapsed > 700 && shown > 0.97) || elapsed > 10000) leaveRef.current()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // run once on mount — `leave` is read through a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div
      ref={root}
      className="fixed inset-0 z-[110] flex flex-col justify-between bg-obsidian p-[var(--pad)] text-platinum [clip-path:inset(0_0_0_0)]"
      role="status"
      aria-live="polite"
      aria-label="Loading AETHER"
    >
      <div className="pre-meta label flex justify-between text-mist">
        <span>{site.studio}</span>
        <span>Project {site.codename}</span>
      </div>
      <div className="overflow-hidden text-center">
        <div className="pre-word display-wide text-metal whitespace-nowrap text-[clamp(2.4rem,13vw,13rem)] leading-[0.9]">{site.brand}</div>
      </div>
      <div className="pre-meta label flex items-center gap-4 text-mist">
        <span ref={num} className="w-10 text-platinum">000</span>
        <span className="pre-bar relative h-px flex-1 bg-line">
          <i className="absolute inset-0 origin-left scale-x-0 bg-platinum" />
        </span>
        <button type="button" onClick={leave} className="roll text-platinum" data-text="Skip intro">
          <span>Skip intro</span>
        </button>
      </div>
    </div>
  )
}
