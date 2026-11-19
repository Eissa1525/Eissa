import type { Project } from '../data/projects'
import { coverURL } from '../lib/covers'

export default function ProjectCover({ project, className = '', parallax, eager }: { project: Project; className?: string; parallax?: number; eager?: boolean }) {
  return (
    <img
      src={coverURL(project)}
      alt={`${project.title} — cover artwork`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover ${parallax ? 'scale-[1.2]' : ''} ${className}`}
      data-parallax={parallax}
    />
  )
}
