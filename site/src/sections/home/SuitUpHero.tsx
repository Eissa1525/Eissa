import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../../animations/gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { appReady, loading, scroll } from '../../lib/store'
import { site } from '../../data/site'
import { useIsMobile, useReducedMotion } from '../../hooks/useMedia'
import { hasWebGL } from '../../hooks/webgl'
import ErrorBoundary from '../../components/ErrorBoundary'
import Icon from '../../components/icons/Icon'
import Clock from '../../components/Clock'
import type { PortraitImages } from '../../scenes/suitup/SuitUpScene'
import { loadPortraits } from '../../scenes/suitup/loadPortraits'

gsap.registerPlugin(ScrambleTextPlugin)

// With your own photos the photo transformation runs; without them, the original 3D suit-up scene.
const usePhotos = !!site.portraits.civilian
const scenePromise = () => (usePhotos ? import('../../scenes/suitup/SuitUpScene') : import('../../scenes/helmet/HelmetScene'))
const SuitUpScene = lazy(() => import('../../scenes/suitup/SuitUpScene'))
const HelmetScene = lazy(() => import('../../scenes/helmet/HelmetScene'))
const GLYPHS = '01<>/\\[]{}#*+=—_'

/** Static fallback (reduced motion / no WebGL): split portrait, civilian left — suited right. */
function StaticPortraits({ images }: { images: PortraitImages | null }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !images) return
    el.replaceChildren()
    for (const [k, img] of Object.entries(images)) {
      const c = img instanceof HTMLCanvasElement ? img : Object.assign(document.createElement('img'), { src: (img as HTMLImageElement).src })
      c.className = `h-full w-1/2 object-cover ${k === 'civil' ? 'grayscale' : ''}`
      el.appendChild(c as HTMLElement)
    }
  }, [images])
  return <div ref={ref} className="absolute inset-0 flex opacity-80 [mask-image:radial-gradient(70%_80%_at_50%_45%,#000_40%,transparent)]" aria-hidden />
}

export default function SuitUpHero() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const webgl = useMemo(() => hasWebGL(), [])
  const use3D = webgl && !reduced
  const [images, setImages] = useState<PortraitImages | null>(null)
  const [active, setActive] = useState(true)
  const firstFrame = useRef<() => void>(() => {})
  const onFirstFrame = useMemo(() => () => firstFrame.current(), [])

  // genuine loading work → preloader progress
  useEffect(() => {
    let alive = true
    if (usePhotos) loading.track(loadPortraits().then((imgs) => { if (alive) setImages(imgs) }))
    if (use3D) {
      loading.track(scenePromise())
      loading.track(new Promise<void>((res) => { firstFrame.current = res; setTimeout(res, 7000) }))
    }
    return () => { alive = false }
  }, [use3D])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const words = q('.su-word')
      const fades = q('.su-fade')
      if (reduced) return

      const split = SplitText.create(words, { type: 'chars', mask: 'chars' })
      gsap.set(split.chars, { yPercent: 110 })
      gsap.set(fades, { autoAlpha: 0 })
      const offReady = appReady.on(() => {
        gsap.to(scroll, { intro: 1, duration: 2.2, ease: 'power2.out' })
        gsap.to(split.chars, { yPercent: 0, duration: 1.3, ease: 'out-expo', stagger: 0.045, delay: 0.25 })
        gsap.to(fades, { autoAlpha: 1, duration: 0.9, stagger: 0.05, delay: 0.5 })
      })

      let suited = false
      const counter = q('.su-sync')[0]
      const bar = q('.su-bar')[0]
      const state = q('.su-state')[0]
      const file = q('.su-file')[0]
      const flip = (on: boolean) => {
        if (on === suited) return
        suited = on
        root.current?.classList.toggle('is-suited', on)
        split.revert()
        words.forEach((w, i) => {
          gsap.to(w, { duration: 1.1, ease: 'none', scrambleText: { text: on ? site.alias[i] : site.name[i], chars: GLYPHS, speed: 0.7, revealDelay: 0.15 } })
        })
        gsap.to(file, { duration: 0.6, scrambleText: { text: on ? 'DOSSIER 01 / ALTER EGO' : 'DOSSIER 01 / HUMAN MODE', chars: GLYPHS } })
      }

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = gsap.utils.clamp(0, 1, (self.progress - 0.06) / 0.78)
          scroll.hero = p
          counter.textContent = String(Math.round(p * 100)).padStart(3, '0') + '%'
          gsap.set(bar, { scaleX: p })
          const label = p < 0.01 ? 'OFF-DUTY' : p > 0.99 ? 'ON-DUTY' : 'SHIFTING'
          if (state.textContent !== label) state.textContent = label
          state.classList.toggle('text-signal', p > 0.99)
          state.classList.toggle('animate-blink', p >= 0.01 && p <= 0.99)
          flip(p > 0.5)
        },
      })
      ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top', onToggle: (s) => setActive(s.isActive) })
      gsap.to(q('.su-cue'), { autoAlpha: 0, scrollTrigger: { trigger: root.current, start: 'top top', end: '+=240', scrub: true } })
      return () => { offReady() }
    },
    { scope: root, dependencies: [reduced] },
  )

  const scene = !usePhotos ? (
    use3D ? (
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>{active && <HelmetScene mobile={mobile} onFirstFrame={onFirstFrame} />}</Suspense>
      </ErrorBoundary>
    ) : null
  ) : use3D && images ? (
    <ErrorBoundary fallback={<StaticPortraits images={images} />}>
      <Suspense fallback={null}>{active && <SuitUpScene images={images} mobile={mobile} onFirstFrame={onFirstFrame} />}</Suspense>
    </ErrorBoundary>
  ) : (
    <StaticPortraits images={images} />
  )

  return (
    <section ref={root} className={`group/hero relative ${reduced ? 'h-svh' : 'h-[340vh]'}`} aria-labelledby="hero-name">
      <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-ink">
        {scene}

        {/* HUD frame */}
        <div className="brackets pointer-events-none absolute inset-x-[var(--pad)] top-16 bottom-[var(--pad)] md:top-20">
          <i className="br-tr" /><i className="br-bl" />
        </div>
        <div className="su-fade hud pointer-events-none absolute inset-x-[calc(var(--pad)+1.25rem)] top-[5.2rem] flex justify-between text-faint md:top-[6.2rem]">
          <span className="flex items-center gap-2 text-fg"><i className="dot" /><span className="su-file">DOSSIER 01 / HUMAN MODE</span></span>
          <span className="hidden sm:inline">{site.location} · <Clock /></span>
        </div>

        {/* name */}
        <h1 id="hero-name" className="pointer-events-none absolute inset-0 select-none" aria-label={`${site.name.join(' ')} — ${site.role}`}>
          <span className="su-word display outline-text absolute top-[13%] left-[var(--pad)] text-[clamp(4.5rem,17vw,17rem)] leading-[0.8] md:top-[11%]" aria-hidden>
            {site.name[0]}
          </span>
          <span className="su-word display absolute top-[30%] right-[var(--pad)] text-[clamp(4.5rem,17vw,17rem)] leading-[0.8] text-accent max-md:top-[24%]" aria-hidden>
            {site.name[1]}
          </span>
        </h1>

        {/* bottom HUD */}
        <div className="absolute inset-x-[calc(var(--pad)+1.25rem)] bottom-[calc(var(--pad)+1.25rem)] grid items-end gap-6 md:grid-cols-[1fr_auto_1fr]">
          <p className="su-fade max-w-[19rem] text-sm leading-relaxed text-dim">{site.bio}</p>
          <p className="su-cue su-fade hud hidden text-faint md:block"><span className="inline-flex items-center gap-2">Scroll to shift <Icon name="arrow-down" className="size-3.5 animate-blink" /></span></p>
          <div className="su-fade hud grid w-full max-w-[18rem] gap-2 justify-self-end text-faint max-md:justify-self-start">
            <div className="flex justify-between"><span>Sync</span><span className="su-sync text-accent">000%</span></div>
            <div className="h-px bg-line"><i className="su-bar block h-full origin-left scale-x-0 bg-accent" /></div>
            <div className="flex justify-between"><span>State</span><span className="su-state text-fg">OFF-DUTY</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
