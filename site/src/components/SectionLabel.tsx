export default function SectionLabel({ children, meta, id }: { children: React.ReactNode; meta?: React.ReactNode; id?: string }) {
  return (
    <div className="hud flex items-center gap-3 text-faint" data-reveal="fade">
      <span className="text-accent" aria-hidden>//</span>
      <h2 id={id} className="text-fg">{children}</h2>
      {meta && <span>{meta}</span>}
    </div>
  )
}
