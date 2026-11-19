import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../../animations/gsap'
import { appReady, loading, scroll } from '../../lib/store'
import { eclipseChapters, site } from '../../data/site'
import { useIsMobile, useReducedMotion } from '../../hooks/useMedia'
import { hasWebGL } from '../../hooks/webgl'
import ErrorBoundary from '../../components/ErrorBoundary'
import EclipseFallback from '../../scenes/eclipse/EclipseFallback'

// The 3D chunk is downloaded in parallel with the page; its progress is reported to the preloader.
const scenePromise = () => import('../../scenes/eclipse/EclipseScene')
const EclipseScene = lazy(scenePromise)

/**
 * THE ECLIPSE SEQUENCE — one pinned, scrubbed scroll story.
 * The same ScrollTrigger progress drives the DOM timeline and the WebGL scene (via `scroll.eclipse`),
 * so reverse scrolling replays everything backwards without resets.
 */
export default function EclipseHero() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const webgl = useMemo(() => hasWebGL(), [])
  const use3D = webgl && !reduced
  const [active, setActive] = useState(true)

  // register genuine loading work with the preloader
  const firstFrame = useRef<() => void>(() => {})
  const onFirstFrame = useMemo(() => () => firstFrame.current(), [])
  useEffect(() => {
    if (!use3D) return
    loading.track(scenePromise())
    loading.track(new Promise<void>((res) => { firstFrame.current = res; setTimeout(res, 6000) }))
  }, [use3D])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      if (reduced) return

      const word = SplitText.create(q('.ec-word'), { type: 'chars' })
      const caps = q('.ec-cap').map((el) => SplitText.create(el.querySelector('.ec-line'), { type: 'words', mask: 'words' }))

      // intro (after preloader)
      gsap.set(word.chars, { yPercent: 105, opacity: 0 })
      gsap.set(q('.ec-fade'), { autoAlpha: 0, y: 16 })
      const offReady = appReady.on(() => {
        gsap.to(scroll, { intro: 1, duration: 2.6, ease: 'power2.out' })
        gsap.to(word.chars, { yPercent: 0, opacity: 1, duration: 1.6, ease: 'out-expo', stagger: 0.07, delay: 0.2 })
        gsap.to(q('.ec-fade'), { autoAlpha: 1, y: 0, duration: 1.2, ease: 'out-expo', stagger: 0.08, delay: 0.6 })
      })

      // scrubbed story — timeline duration = 1 so positions read as progress
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.to(word.chars, { opacity: 0, filter: 'blur(14px)', xPercent: (i: number) => (i - 2.5) * 55, duration: 0.14 }, 0)
        .to(q('.ec-cue'), { autoAlpha: 0, duration: 0.05 }, 0)

      const ranges: [number, number][] = [[0.0, 0.22], [0.27, 0.48], [0.53, 0.74], [0.79, 1.01]]
      caps.forEach((split, i) => {
        const [a, b] = ranges[i]
        const cap = q('.ec-cap')[i]
        if (i > 0) tl.fromTo(split.words, { yPercent: 110 }, { yPercent: 0, stagger: 0.006, duration: 0.05 }, a)
        tl.fromTo(cap.querySelectorAll('.ec-meta'), { autoAlpha: i === 0 ? 1 : 0 }, { autoAlpha: 1, duration: 0.03 }, a)
        if (i < 3) {
          tl.to(split.words, { yPercent: -110, stagger: 0.004, duration: 0.04 }, b - 0.04)
          tl.to(cap.querySelectorAll('.ec-meta'), { autoAlpha: 0, duration: 0.03 }, b - 0.03)
        }
        tl.to(q('.ec-tick')[i], { backgroundColor: '#e4e2ec', scaleX: 1, duration: 0.02 }, a)
      })
      tl.fromTo(q('.ec-enter'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.82)
      tl.to(q('.ec-veil'), { opacity: 1, duration: 0.08 }, 0.93)

      // initial state for later captions
      caps.forEach((split, i) => i > 0 && gsap.set(split.words, { yPercent: 110 }))

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: 0.6,
        onUpdate: (self) => {
          scroll.eclipse = self.progress
          gsap.set(q('.ec-progress i'), { scaleY: self.progress })
        },
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setActive(self.isActive),
      })
      return () => { offReady() }
    },
    { scope: root, dependencies: [reduced] },
  )

  const scene = use3D ? (
    <ErrorBoundary fallback={<EclipseFallback />}>
      <Suspense fallback={null}>
        {active && <EclipseScene mobile={mobile} onFirstFrame={onFirstFrame} />}
      </Suspense>
    </ErrorBoundary>
  ) : (
    <EclipseFallback />
  )

  if (reduced) {
    return (
      <section ref={root} className="relative h-svh min-h-[560px] overflow-hidden" aria-labelledby="hero-title">
        {scene}
        <div className="shell absolute inset-x-0 bottom-0 pb-10">
          <h1 id="hero-title" className="display-wide text-metal whitespace-nowrap text-[clamp(2.6rem,0.5rem+15vw,17rem)] leading-[0.85]">{site.brand}</h1>
          <ol className="mt-6 grid gap-2 sm:grid-cols-4">
            {eclipseChapters.map((c) => (
              <li key={c.key} className="label text-silver"><span className="text-platinum">{c.n} {c.title}</span> — {c.line}</li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section ref={root} className="relative h-[520vh] max-md:h-[440vh]" aria-labelledby="hero-title">
      <div className="sticky top-0 h-svh overflow-hidden">
        {scene}

        {/* top meta */}
        <div className="ec-fade shell label pointer-events-none absolute inset-x-0 top-20 flex justify-between text-mist">
          <span>{site.studio}</span>
          <span className="hidden sm:inline">Project {site.codename}</span>
          <span>©{site.year}</span>
        </div>

        {/* wordmark */}
        <h1 id="hero-title" className="ec-word display-wide text-metal pointer-events-none absolute inset-x-0 top-[50%] -translate-y-1/2 text-center text-[clamp(2.6rem,0.5rem+15vw,17rem)] leading-none whitespace-nowrap select-none" aria-label={`${site.studio}`}>
          {site.brand}
        </h1>

        {/* chapters */}
        <div className="shell pointer-events-none absolute inset-x-0 bottom-0 pb-[max(2rem,4vh)]">
          <div className="relative h-[clamp(7rem,18vw,12rem)] max-w-[52rem]">
            {eclipseChapters.map((c) => (
              <div key={c.key} className={`ec-cap absolute inset-x-0 bottom-0 ${c.n === "01" ? "ec-fade" : ""}`}>
                <div className="ec-meta label mb-3 flex gap-3 text-violet-soft">
                  <span>{c.n}</span><span className="text-silver">{c.title}</span>
                </div>
                <p className="ec-line display-tight text-h2 leading-[0.95]">{c.line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* chapter ticks + progress */}
        <div className="ec-fade shell pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex">
          {eclipseChapters.map((c) => (
            <div key={c.key} className="label flex items-center gap-3 text-mist">
              <span>{c.title}</span>
              <i className="ec-tick block h-px w-6 origin-right scale-x-50 bg-mist" />
            </div>
          ))}
        </div>
        <div className="ec-progress pointer-events-none absolute top-0 left-[calc(var(--pad)/2)] h-full w-px bg-line" aria-hidden>
          <i className="block h-full w-full origin-top scale-y-0 bg-violet-soft" />
        </div>

        <div className="ec-cue ec-fade label pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-silver max-md:hidden">
          Scroll to begin <span className="ml-2 inline-block animate-pulse-soft">↓</span>
        </div>

        <div className="ec-enter shell absolute right-0 bottom-[max(2rem,4vh)] max-md:bottom-auto max-md:top-32">
          <Link to="/work" className="btn btn-ghost backdrop-blur-sm" data-cursor="Enter">
            <span className="btn-dot" /> Enter the work
          </Link>
        </div>

        <div className="ec-veil pointer-events-none absolute inset-0 bg-obsidian opacity-0" aria-hidden />
      </div>
    </section>
  )
}
