import { Link } from 'react-router'
import { site } from '../data/site'
import Clock from './Clock'

export default function Footer() {
  return (
    <footer className="shell relative overflow-hidden border-t border-line pt-16 pb-8">
      <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="display-wide text-metal text-[clamp(2.5rem,7vw,6rem)] leading-none">{site.brand}</p>
          <p className="max-w-sm text-silver">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className="label flex flex-col gap-3">
          <span className="text-mist">Index</span>
          <Link to="/" className="roll w-fit" data-text="Home"><span>Home</span></Link>
          {site.nav.map((l) => (
            <Link key={l.to} to={l.to} className="roll w-fit" data-text={l.label}><span>{l.label}</span></Link>
          ))}
        </nav>
        <div className="label flex flex-col gap-3">
          <span className="text-mist">Contact</span>
          {site.contact.email && <a href={`mailto:${site.contact.email}`} className="roll w-fit" data-text={site.contact.email}><span>{site.contact.email}</span></a>}
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="roll w-fit" data-text={s.label}><span>{s.label}</span></a>
          ))}
          <span className="text-mist">{site.location} — <Clock /></span>
        </div>
      </div>
      <div className="label mt-16 flex flex-wrap justify-between gap-4 text-mist">
        <span>© {site.year} {site.studio}</span>
        <button type="button" className="roll" data-text="Back to top ↑" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span>Back to top ↑</span>
        </button>
      </div>
    </footer>
  )
}
