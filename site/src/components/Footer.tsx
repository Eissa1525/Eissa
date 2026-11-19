import { Link } from 'react-router'
import { site } from '../data/site'
import Clock from './Clock'

export default function Footer() {
  return (
    <footer className="shell border-t border-line py-6">
      <div className="hud flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-faint">
        <span>© {site.year} {site.studio}</span>
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
          <Link to="/" className="roll" data-text="Home"><span>Home</span></Link>
          {site.nav.map((l) => (
            <Link key={l.to} to={l.to} className="roll" data-text={l.label}><span>{l.label}</span></Link>
          ))}
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="roll" data-text={s.label}><span>{s.label}</span></a>
          ))}
        </nav>
        <span>{site.location} · <Clock /></span>
        <button type="button" className="roll" data-text="Top ↑" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span>Top ↑</span></button>
      </div>
    </footer>
  )
}
