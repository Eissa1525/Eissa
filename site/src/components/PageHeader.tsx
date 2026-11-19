import type { ReactNode } from 'react'

export default function PageHeader({ label, title, intro }: { label: string; title: ReactNode; intro?: ReactNode }) {
  return (
    <header className="shell relative overflow-hidden pt-[22vh] pb-[10vh]">
      <div className="pointer-events-none absolute -top-[40vmax] left-1/2 size-[90vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_92_255/0.14),transparent_60%)]" aria-hidden />
      <p className="label text-violet-soft" data-reveal="fade">{label}</p>
      <h1 data-reveal="lines" className="display-tight mt-6 max-w-[14ch] text-h1 leading-[0.9]">{title}</h1>
      {intro && <p data-reveal="fade" className="mt-10 max-w-[44ch] text-lead text-silver">{intro}</p>}
    </header>
  )
}
