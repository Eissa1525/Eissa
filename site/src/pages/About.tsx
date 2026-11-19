import { useRef } from 'react'
import { site } from '../data/site'
import { services } from '../data/services'
import { useReveal } from '../animations/useReveal'
import PageHeader from '../components/PageHeader'
import OriginStory from '../sections/home/OriginStory'
import Abilities from '../sections/home/Abilities'

const process = [
  { n: '01', t: 'Brief', b: 'One conversation to find the single thing the brand must make people feel.' },
  { n: '02', t: 'Direction', b: 'Type, colour, motion and tone agreed on before any polishing starts.' },
  { n: '03', t: 'Build', b: 'Design and prototype together, hardest interaction first.' },
  { n: '04', t: 'Launch', b: 'Final files, guidelines and a handoff a developer can actually use.' },
]

export default function About() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    <div ref={root}>
      <PageHeader label="About" title={<>Two modes, <span className="text-accent">one designer</span></>} intro={site.bio} />
      <OriginStory />
      <Abilities />
      <section className="shell py-[14vh]" aria-labelledby="process-title">
        <p className="hud flex items-center gap-3 text-faint" data-reveal="fade"><span className="text-accent">//</span><span id="process-title" className="text-fg">Protocol</span><span>{services.length} steps</span></p>
        <ol className="mt-10 grid border-t border-line md:grid-cols-4">
          {process.map((s) => (
            <li key={s.n} className="border-b border-line py-8 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0" data-reveal="fade">
              <span className="display outline-text text-[clamp(3rem,6vw,5rem)] [-webkit-text-stroke-color:var(--color-accent)]">{s.n}</span>
              <h3 className="display mt-6 text-h3">{s.t}</h3>
              <p className="mt-3 max-w-xs text-dim">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
