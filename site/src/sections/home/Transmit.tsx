import { useRef } from 'react'
import { Link } from 'react-router'
import { site } from '../../data/site'
import { useReveal } from '../../animations/useReveal'
import BurnText from '../../components/BurnText'
import Magnetic from '../../components/Magnetic'

const LINES = ['MAKE', 'CONTACT']

export default function Transmit() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="shell relative pt-[16vh] pb-10" aria-labelledby="transmit-title">
      <div className="hud flex justify-between text-faint" data-reveal="fade">
        <span className="flex items-center gap-3"><span className="text-accent">//</span><span className="text-fg">Transmit</span></span>
        <span className="flex items-center gap-2"><i className="dot-live" />{site.available}</span>
      </div>
      <h2 id="transmit-title" className="sr-only">{LINES.join(' ')}</h2>
      <div className="relative mt-10">
        <div className="pointer-events-none absolute -inset-x-[var(--pad)] -inset-y-10 bg-[radial-gradient(rgb(49_168_255/0.16)_1px,transparent_1.2px)] bg-[size:14px_14px] [mask-image:radial-gradient(80%_70%_at_50%_50%,#000_30%,transparent)]" aria-hidden />
        <BurnText lines={LINES} className="relative" />
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-5" data-reveal="fade">
          <p className="max-w-xs text-sm text-dim">An idea that is hard to put into words? Write anyway — every message gets a reply.</p>
          {site.contact.email && (
            <Magnetic strength={0.2}>
              <a href={`mailto:${site.contact.email}`} className="inline-block border-b border-accent pb-1 text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] tracking-tight hover:text-accent" data-cursor="Write">
                {site.contact.email}
              </a>
            </Magnetic>
          )}
        </div>
        <Link to="/contact" className="btn btn-primary justify-self-start" data-reveal="fade"><span className="btn-dot" /> All channels</Link>
      </div>
    </section>
  )
}
