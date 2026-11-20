export default function SectionLabel({ children, meta }: { children: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <div className="hud flex items-center gap-3 text-faint" data-reveal="fade">
      <span className="text-accent">//</span>
      <span className="text-fg">{children}</span>
      {meta && <span>{meta}</span>}
    </div>
  )
}
