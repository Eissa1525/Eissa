import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { getProject, nextProject } from '../data/projects'
import { useReveal } from '../animations/useReveal'
import ProjectCover from '../components/ProjectCover'
import { BrowserMockup, PhoneMockup } from '../components/DeviceMockup'
import NotFound from './NotFound'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  const root = useRef<HTMLElement>(null)
  useReveal(root, [slug])
  if (!project) return <NotFound />
  const next = nextProject(project.slug)

  return (
    <article ref={root} key={project.slug}>
      {/* cinematic cover */}
      <header className="relative flex h-svh min-h-[600px] items-end overflow-hidden">
        <div className="absolute inset-0" data-reveal="image">
          <ProjectCover project={project} eager parallax={0.1} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="shell relative w-full pb-12">
          <h1 data-reveal="lines" className="display-wide text-metal text-mega leading-[0.85]">{project.title}</h1>
          <p className="hud mt-5 flex flex-wrap gap-x-4 gap-y-1 text-dim" data-reveal="fade"><span className="text-accent">{project.index}</span><span>{project.client}</span><span>{project.year}</span></p>
        </div>
      </header>

      {/* meta */}
      <section className="shell grid gap-10 border-b border-line py-[10vh] md:grid-cols-12">
        <p data-reveal="lines" className="text-h3 leading-tight tracking-tight md:col-span-7">{project.summary}</p>
        <dl className="label grid grid-cols-2 gap-6 text-dim md:col-span-4 md:col-start-9">
          <div><dt className="text-faint">Client</dt><dd className="mt-2 text-fg">{project.client}</dd></div>
          <div><dt className="text-faint">Year</dt><dd className="mt-2 text-fg">{project.year}</dd></div>
          <div className="col-span-2"><dt className="text-faint">Disciplines</dt><dd className="mt-2 text-fg">{project.disciplines.join(' · ')}</dd></div>
        </dl>
      </section>

      {/* context + objectives */}
      <section className="shell grid gap-12 py-[14vh] md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label text-faint" data-reveal="fade">Context</p>
          <p className="mt-6 text-lead text-dim" data-reveal="fade">{project.context}</p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="label text-faint" data-reveal="fade">Objectives</p>
          <ol className="mt-6 divide-y divide-line border-y border-line">
            {project.objectives.map((o, i) => (
              <li key={o} className="flex gap-6 py-5" data-reveal="fade">
                <span className="label pt-1 text-accent">0{i + 1}</span>
                <span className="text-lead">{o}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* full-width visual */}
      <div className="shell"><div className="frame aspect-[16/9]" data-reveal="image"><ProjectCover project={project} parallax={0.12} /></div></div>

      {/* process */}
      <section className="shell py-[14vh]">
        <p className="label text-faint" data-reveal="fade">Process</p>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {project.process.map((s, i) => (
            <li key={s.title} className="border-t border-line pt-6" data-reveal="fade">
              <span className="label text-accent">Step 0{i + 1}</span>
              <h2 className="display-tight mt-4 text-h3 leading-none">{s.title}</h2>
              <p className="mt-4 text-dim">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* creative direction */}
      <section className="shell py-[10vh]">
        <p className="label text-faint" data-reveal="fade">Creative direction</p>
        <blockquote data-reveal="lines" className="editorial text-metal mt-6 max-w-[24ch] text-h2 leading-[1]">“{project.direction}”</blockquote>
      </section>

      {/* devices */}
      <section className="shell grid items-center gap-12 py-[12vh] md:grid-cols-12">
        {project.device !== 'phone' && <div className="md:col-span-8" data-reveal="fade"><BrowserMockup project={project} /></div>}
        {project.device !== 'browser' && <div className={project.device === 'both' ? 'md:col-span-4' : 'md:col-span-12'} data-reveal="fade"><PhoneMockup project={project} /></div>}
      </section>

      {/* outcome */}
      <section className="shell grid gap-8 border-t border-line py-[12vh] md:grid-cols-12">
        <p className="label text-faint md:col-span-3" data-reveal="fade">Outcome</p>
        <p className="text-lead md:col-span-8" data-reveal="fade">{project.outcome}</p>
      </section>

      {/* next project */}
      <Link to={`/work/${next.slug}`} className="group relative block h-[70svh] overflow-hidden" data-cursor="Next">
        <div className="absolute inset-0 opacity-50 transition-[opacity,transform] duration-1000 group-hover:scale-105 group-hover:opacity-80">
          <ProjectCover project={next} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-ink/40" />
        <div className="shell relative flex h-full flex-col justify-end pb-12">
          <span className="label text-accent">Next project</span>
          <span className="display-wide text-metal mt-3 text-mega leading-[0.85]">{next.title}</span>
        </div>
      </Link>
    </article>
  )
}
