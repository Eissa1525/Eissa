import { useRef } from 'react'
import { Link } from 'react-router'
import { projects } from '../data/projects'
import { useReveal } from '../animations/useReveal'
import PageHeader from '../components/PageHeader'
import ProjectCover from '../components/ProjectCover'

export default function Work() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    <div ref={root}>
      <PageHeader
        label={`Archive — ${projects.length} projects`}
        title={<>The <em className="editorial text-metal">archive</em></>}
        intro="Self-initiated concept work exploring identity, interface and real-time 3D. Sample content — replace it in src/data/projects.ts."
      />
      <ul className="shell grid gap-x-6 gap-y-[10vh] pb-[16vh] md:grid-cols-2">
        {projects.map((p, i) => (
          <li key={p.slug} className={i % 2 ? 'md:mt-[18vh]' : ''}>
            <Link to={`/work/${p.slug}`} className="group block" data-cursor="View">
              <div data-reveal="image" className="frame aspect-[4/5]">
                <ProjectCover project={p} className="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105" />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-4">
                <h2 className="display-tight text-h3 leading-none transition-colors group-hover:text-violet-soft">
                  <span className="label mr-3 align-middle text-mist">{p.index}</span>{p.title}
                </h2>
                <span className="label text-mist">{p.year}</span>
              </div>
              <p className="label mt-3 text-silver">{p.disciplines.join(' · ')}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
