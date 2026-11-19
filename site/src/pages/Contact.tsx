import { useRef, useState, type FormEvent } from 'react'
import { site } from '../data/site'
import { useReveal } from '../animations/useReveal'
import PageHeader from '../components/PageHeader'
import ContactChannels from '../components/ContactChannels'

export default function Contact() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Project — ${f.get('name')}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  const field = 'w-full border-0 border-b border-line-strong bg-transparent py-3 text-lead tracking-tight outline-none transition-colors placeholder:text-faint focus:border-accent'
  return (
    <div ref={root}>
      <PageHeader label="Contact" title={<>Write to <em className="editorial text-metal">us</em></>} intro="We reply to every written message. Tell us about the idea — even if it is still unfinished." />
      <section className="shell grid gap-16 pb-[16vh] md:grid-cols-2">
        <div data-reveal="fade">
          <p className="label mb-6 text-faint">Written channels</p>
          <ContactChannels />
        </div>
        <form onSubmit={submit} className="grid gap-8" data-reveal="fade" aria-label="Project enquiry">
          <label className="grid gap-2">
            <span className="label text-faint">01 — Name</span>
            <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
          </label>
          <label className="grid gap-2">
            <span className="label text-faint">02 — Email</span>
            <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
          </label>
          <label className="grid gap-2">
            <span className="label text-faint">03 — The idea</span>
            <textarea name="message" required rows={4} className={`${field} resize-none`} placeholder="What are we making together?" />
          </label>
          <div className="flex items-center gap-6">
            <button type="submit" className="btn btn-primary"><span className="btn-dot" /> Compose email</button>
            {sent && <span className="label text-accent" role="status">Your email app should now be open.</span>}
          </div>
        </form>
      </section>
    </div>
  )
}
