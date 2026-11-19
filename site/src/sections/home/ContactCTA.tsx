import { useRef } from 'react'
import { Link } from 'react-router'
import { useReveal } from '../../animations/useReveal'
import ContactChannels from '../../components/ContactChannels'
import Magnetic from '../../components/Magnetic'
import SectionLabel from '../../components/SectionLabel'

export default function ContactCTA() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  return (
    <section ref={root} className="shell relative overflow-hidden py-[18vh]" aria-labelledby="cta-title">
      <div className="pointer-events-none absolute right-[-20vmax] bottom-[-30vmax] size-[70vmax] rounded-full bg-[radial-gradient(circle,rgb(124_92_255/0.16),transparent_62%)]" aria-hidden />
      <SectionLabel n="06">Contact</SectionLabel>
      <h2 id="cta-title" data-reveal="lines" className="display-tight mt-8 max-w-[12ch] text-h1 leading-[0.9]">
        Bring us the <em className="editorial text-metal">unfinished</em> idea.
      </h2>
      <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-end">
        <div data-reveal="fade">
          <Magnetic strength={0.3}>
            <Link to="/contact" className="btn btn-primary text-base" data-cursor="Write">
              <span className="btn-dot" /> Start a project
            </Link>
          </Magnetic>
        </div>
        <div data-reveal="fade"><ContactChannels /></div>
      </div>
    </section>
  )
}
