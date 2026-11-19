import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="shell grid min-h-svh place-content-center gap-8 text-center">
      <p className="label text-violet-soft">404 — lost in orbit</p>
      <h1 className="display-wide text-metal text-mega leading-none">VOID</h1>
      <Link to="/" className="btn btn-ghost mx-auto"><span className="btn-dot" /> Return home</Link>
    </section>
  )
}
