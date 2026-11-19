import { useRef } from 'react'
import { site } from '../../data/site'
import { useReveal } from '../../animations/useReveal'
import SectionLabel from '../../components/SectionLabel'

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  const [a, b, body] = site.manifesto
  return (
    <section ref={root} className="shell relative overflow-hidden py-[20vh]" aria-labelledby="manifesto-title">
      <div className="pointer-events-none absolute -top-1/3 left-1/2 size-[90vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_92_255/0.12),transparent_60%)]" aria-hidden />
      <SectionLabel n="03">Manifesto</SectionLabel>
      <h2 id="manifesto-title" className="mt-10 text-h1 leading-[0.92]">
        <span data-reveal="lines" className="display-tight block">{a}</span>
        <span data-reveal="lines" className="editorial text-metal block">{b}</span>
      </h2>
      <p data-reveal="scrub" className="mt-[10vh] ml-auto max-w-[36ch] text-lead leading-snug md:text-h3">{body}</p>
    </section>
  )
}
