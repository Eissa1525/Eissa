import { useRef } from 'react'
import { Link } from 'react-router'
import { services } from '../../data/services'
import { useReveal } from '../../animations/useReveal'
import SectionLabel from '../../components/SectionLabel'
import SpotlightCard from '../../components/vendor/reactbits/SpotlightCard'

export default function ServicesPreview() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="shell py-[16vh]" aria-labelledby="services-title">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-6">
          <SectionLabel n="04">Capabilities</SectionLabel>
          <h2 id="services-title" data-reveal="lines" className="display-tight max-w-[16ch] text-h2 leading-[0.95]">
            What we <em className="editorial text-violet-soft">make</em>
          </h2>
        </div>
        <Link to="/studio" className="btn btn-ghost" data-reveal="fade"><span className="btn-dot" /> About the studio</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.n} data-reveal="fade">
            <SpotlightCard
              className="h-full !rounded-2xl !p-0"
              style={{ '--spotlight-card-surface': '#0e0e13', '--spotlight-card-border': 'rgb(228 226 236 / 0.1)' } as React.CSSProperties}
              spotlightColor="#7c5cff"
              intensity={0.22}
              spotlightSize={340}
              grain={0.3}
            >
              <article className="flex h-full flex-col gap-8 p-7 md:p-10">
                <div className="flex items-start justify-between">
                  <span className="label text-violet-soft">{s.n}</span>
                  <span className="label text-mist">{s.items.length} disciplines</span>
                </div>
                <h3 className="display-tight text-h3 leading-none">{s.title}</h3>
                <p className="max-w-md text-silver">{s.body}</p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <li key={it} className="label rounded-full border border-line px-3 py-1.5 text-silver">{it}</li>
                  ))}
                </ul>
              </article>
            </SpotlightCard>
          </div>
        ))}
      </div>
    </section>
  )
}
