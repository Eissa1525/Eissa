import type { ReactNode } from 'react'

export default function PageHeader({ label, title, intro }: { label: string; title: ReactNode; intro?: ReactNode }) {
  return (
    <header className="shell relative pt-[20vh] pb-[8vh]">
      <p className="hud flex items-center gap-3 text-faint" data-reveal="fade"><span className="text-accent">//</span><span className="text-fg">{label}</span></p>
      <h1 data-reveal="lines" className="display mt-6 max-w-[12ch] text-h1">{title}</h1>
      {intro && <p data-reveal="fade" className="mt-8 max-w-[42ch] text-lead text-dim">{intro}</p>}
    </header>
  )
}
