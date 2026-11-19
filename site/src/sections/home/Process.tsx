import { useRef } from 'react'
import { process } from '../../data/process'
import { useReveal } from '../../animations/useReveal'
import SectionLabel from '../../components/SectionLabel'

export default function Process({ n = '05' }: { n?: string }) {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="shell py-[16vh]" aria-labelledby="process-title">
      <SectionLabel n={n}>Process</SectionLabel>
      <h2 id="process-title" data-reveal="lines" className="display-tight mt-6 mb-16 max-w-[18ch] text-h2 leading-[0.95]">
        From a fracture <em className="editorial text-metal">to a form</em>
      </h2>
      <ol className="grid border-t border-line md:grid-cols-4">
        {process.map((s, i) => (
          <li key={s.n} className="relative border-b border-line py-8 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0" data-reveal="fade">
            <span className="display-wide block text-[clamp(3rem,6vw,5.5rem)] leading-none text-metal">{s.n}</span>
            <h3 className="mt-8 text-h3 tracking-tight">{s.title}</h3>
            <p className="mt-3 max-w-xs text-silver">{s.body}</p>
            <span className="label absolute top-8 right-0 text-mist md:right-6">{['Listen', 'Define', 'Build', 'Launch'][i]}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
