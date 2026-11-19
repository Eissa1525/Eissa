import { useRef } from 'react'
import { Link } from 'react-router'
import { projects } from '../../data/projects'
import { useReveal } from '../../animations/useReveal'
import ProjectCover from '../../components/ProjectCover'
import SectionLabel from '../../components/SectionLabel'
import GlareHover from '../../components/vendor/reactbits/GlareHover'

/** Editorial exhibition of featured work (also the static fallback for the Phase-3 spatial gallery). */
export default function SelectedWork() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  const featured = projects.slice(0, 4)
  return (
    <section ref={root} id="work" className="shell relative py-[18vh]" aria-labelledby="work-title">
      <div className="mb-[10vh] flex flex-wrap items-end justify-between gap-8">
        <div className="space-y-6">
          <SectionLabel n="02">Selected work</SectionLabel>
          <h2 id="work-title" data-reveal="lines" className="display-tight max-w-[14ch] text-h2 leading-[0.95]">
            Worlds we have <em className="editorial text-violet-soft">brought into orbit</em>
          </h2>
        </div>
        <Link to="/work" className="btn btn-ghost" data-reveal="fade">
          <span className="btn-dot" /> Full archive ({projects.length})
        </Link>
      </div>

      <ol className="grid gap-[14vh]">
        {featured.map((p, i) => (
          <li key={p.slug} className={`grid items-end gap-6 md:grid-cols-12 ${i % 2 ? 'md:[&>*:first-child]:col-start-6' : ''}`}>
            <Link
              to={`/work/${p.slug}`}
              className={`group block md:col-span-7 ${i % 2 ? 'md:order-2' : ''}`}
              data-cursor="View"
              aria-label={`${p.title} — view case study`}
            >
              <div data-reveal="image" className="frame aspect-[4/5] sm:aspect-[5/4]">
                <GlareHover width="100%" height="100%" background="transparent" borderRadius="0.75rem" borderColor="transparent" glareColor="#e4e2ec" glareOpacity={0.22} glareSize={260}>
                  <div className="absolute inset-0 overflow-hidden">
                    <ProjectCover project={p} parallax={0.08} className="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.26]" />
                  </div>
                </GlareHover>
              </div>
            </Link>
            <div className={`space-y-4 md:col-span-4 ${i % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-9'}`}>
              <div className="label flex gap-4 text-mist" data-reveal="fade">
                <span className="text-violet-soft">{p.index}</span>
                <span>{p.year}</span>
                <span>{p.disciplines[0]}</span>
              </div>
              <h3 className="display-tight text-h2 leading-none" data-reveal="lines">
                <Link to={`/work/${p.slug}`} className="hover:text-violet-soft">{p.title}</Link>
              </h3>
              <p className="max-w-sm text-silver" data-reveal="fade">{p.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
