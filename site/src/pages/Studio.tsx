import { useRef } from 'react'
import { site } from '../data/site'
import { services } from '../data/services'
import { useReveal } from '../animations/useReveal'
import PageHeader from '../components/PageHeader'
import Process from '../sections/home/Process'

const principles = [
  { t: 'One idea, fully', b: 'A project should be remembered for one thing. We remove everything that competes with it.' },
  { t: 'Craft is invisible', b: 'Performance, accessibility and stability are part of the aesthetic, not a separate checklist.' },
  { t: 'Motion with a reason', b: 'Every movement explains a relationship, a state or a story. Nothing animates to fill silence.' },
]

export default function Studio() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    <div ref={root}>
      <PageHeader label="Studio" title={<>A small studio for <em className="editorial text-metal">large worlds</em></>} intro={site.tagline} />
      <section className="shell grid gap-12 py-[10vh] md:grid-cols-12">
        <p className="label text-mist md:col-span-3" data-reveal="fade">Philosophy</p>
        <p data-reveal="scrub" className="text-h3 leading-tight tracking-tight md:col-span-9">{site.manifesto[2]}</p>
      </section>
      <section className="shell grid gap-6 py-[10vh] md:grid-cols-3">
        {principles.map((p, i) => (
          <div key={p.t} className="rounded-2xl border border-line bg-charcoal p-8" data-reveal="fade">
            <span className="label text-violet-soft">0{i + 1}</span>
            <h2 className="display-tight mt-10 text-h3 leading-none">{p.t}</h2>
            <p className="mt-4 text-silver">{p.b}</p>
          </div>
        ))}
      </section>
      <section className="shell py-[12vh]">
        <p className="label text-mist" data-reveal="fade">Capabilities</p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {services.map((s) => (
            <li key={s.n} className="grid gap-4 py-8 md:grid-cols-12" data-reveal="fade">
              <span className="label text-violet-soft md:col-span-1">{s.n}</span>
              <h3 className="display-tight text-h3 leading-none md:col-span-4">{s.title}</h3>
              <p className="text-silver md:col-span-4">{s.body}</p>
              <p className="label text-mist md:col-span-3">{s.items.join(' · ')}</p>
            </li>
          ))}
        </ul>
      </section>
      <Process n="—" />
    </div>
  )
}
