export default function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="label flex items-center gap-3 text-mist" data-reveal="fade">
      <span className="text-violet-soft">{n}</span>
      <span className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </div>
  )
}
