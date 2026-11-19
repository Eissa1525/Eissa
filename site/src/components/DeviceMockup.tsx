import type { Project } from '../data/projects'
import { coverURL } from '../lib/covers'

/** CSS-only device frames (no third-party mockup assets). */
export function BrowserMockup({ project }: { project: Project }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-graphite shadow-[0_40px_120px_-40px_rgb(124_92_255/0.45)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <i className="size-2.5 rounded-full bg-smoke" /><i className="size-2.5 rounded-full bg-smoke" /><i className="size-2.5 rounded-full bg-smoke" />
        <span className="label ml-4 truncate rounded-full bg-charcoal px-3 py-1 text-mist">{project.slug}.concept</span>
      </div>
      <img src={coverURL(project, 1400, 860)} alt={`${project.title} — website concept`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
    </figure>
  )
}

export function PhoneMockup({ project }: { project: Project }) {
  return (
    <figure className="mx-auto w-[min(72vw,300px)] rounded-[2.6rem] border border-line-strong bg-graphite p-2.5 shadow-[0_40px_120px_-40px_rgb(124_92_255/0.5)]">
      <div className="relative overflow-hidden rounded-[2.1rem]">
        <span className="absolute top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-obsidian" />
        <img src={coverURL(project, 600, 1300)} alt={`${project.title} — mobile concept`} loading="lazy" className="aspect-[9/19.5] w-full object-cover" />
      </div>
    </figure>
  )
}
