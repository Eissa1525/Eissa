import { useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../../animations/gsap'
import { site } from '../../data/site'
import { prefersReducedMotion } from '../../hooks/useMedia'

/** Renders *emphasis* segments from the content string as orange italics. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') ? <em key={i} className="editorial">{part.slice(1, -1)}</em> : <span key={i}>{part}</span>,
      )}
    </>
  )
}

export default function OriginStory() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      const split = SplitText.create(q('.os-text'), { type: 'words' })
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.fromTo(split.words, { opacity: 0.45 }, { opacity: 1, stagger: 0.04, duration: 0.4 }, 0) // readable at rest (≥3:1), brightens on scroll
        .fromTo(q('.os-line'), { scaleX: 0 }, { scaleX: 1, duration: split.words.length * 0.04 + 0.4 }, 0)
      q('.os-stop').forEach((el, i, all) =>
        tl.fromTo(el, { opacity: 0.6 }, { opacity: 1, duration: 0.05 }, ((split.words.length * 0.04 + 0.4) * i) / (all.length - 1 || 1)),
      )
      const pct = q('.os-pct')[0]
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.5,
        animation: tl,
        onUpdate: (s) => { pct.textContent = String(Math.round(s.progress * 100)).padStart(3, '0') + '%' },
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} id="about" className="shell py-[22vh]" aria-labelledby="origin-title">
      <div className="hud mb-12 flex items-center gap-3 text-faint">
        <span className="text-accent" aria-hidden>//</span><h2 id="origin-title" className="text-fg">Origin</h2><span className="os-pct tabular-nums">000%</span>
      </div>
      <p className="os-text max-w-[26ch] text-[clamp(1.9rem,1rem+3.6vw,4.4rem)] leading-[1.06] font-medium tracking-[-0.03em]">
        <Rich text={site.origin} />
      </p>
      <div className="relative mt-16 max-w-[60rem]">
        <div className="h-px bg-line"><i className="os-line block h-full origin-left bg-accent" /></div>
        <ol className="hud mt-4 grid grid-cols-2 gap-3 text-dim md:grid-cols-4">
          {site.journey.map((j) => (
            <li key={j} className="os-stop flex items-center gap-2"><i className="dot" />{j}</li>
          ))}
        </ol>
      </div>
    </section>
  )
}
