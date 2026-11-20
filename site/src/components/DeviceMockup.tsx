import type { Project } from '../data/projects'
import { coverURL } from '../lib/covers'

/** CSS-only device frames (no third-party mockup assets). */
export function BrowserMockup({ project }: { project: Project }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-panel-2 shadow-[0_2px_4px_rgb(0_0_0/0.4),0_24px_60px_-20px_rgb(0_0_0/0.75)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <i className="size-2.5 rounded-full bg-panel-3" /><i className="size-2.5 rounded-full bg-panel-3" /><i className="size-2.5 rounded-full bg-panel-3" />
        <span className="label ml-4 truncate rounded-full bg-panel px-3 py-1 text-faint">{project.slug}.concept</span>
      </div>
      <img src={coverURL(project, 1400, 860)} alt={`${project.title} — website concept`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
    </figure>
  )
}

export function PhoneMockup({ project }: { project: Project }) {
  return (
    <figure className="mx-auto w-[min(72vw,300px)] rounded-[2.6rem] border border-line-strong bg-panel-2 p-2.5 shadow-[0_2px_4px_rgb(0_0_0/0.4),0_24px_60px_-20px_rgb(0_0_0/0.75)]">
      <div className="relative overflow-hidden rounded-[2.1rem]">
        <span className="absolute top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        <img src={coverURL(project, 600, 1300)} alt={`${project.title} — mobile concept`} loading="lazy" className="aspect-[9/19.5] w-full object-cover" />
      </div>
    </figure>
  )
}
