import { useId, useState, type FormEvent } from 'react'
import { site } from '../data/site'

const field = 'w-full border border-line bg-panel px-4 py-3.5 text-base text-fg outline-none transition-colors placeholder:text-faint focus:border-accent'

/** Project brief. Composes an email (mailto) and also copies the brief, since some hosts block mail links. */
export default function BriefForm() {
  const id = useId()
  const [status, setStatus] = useState<'idle' | 'sent' | 'copied'>('idle')
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const g = (k: string) => String(f.get(k) ?? '').trim()
    const body = [
      `Name: ${g('name')}`,
      `Email: ${g('email')}`,
      g('company') && `Company: ${g('company')}`,
      `Needs: ${g('need')}`,
      `Budget: ${g('budget')}`,
      '—',
      g('brief'),
    ].filter(Boolean).join('\n')
    try { await navigator.clipboard.writeText(body); setStatus('copied') } catch { setStatus('sent') }
    if (site.contact.email) window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(`New case — ${g('name')}`)}&body=${encodeURIComponent(body)}`
  }
  const L = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="hud mb-2 block text-faint">{children}</label>
  )
  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" aria-label="Project brief">
      <div><L htmlFor={`${id}-name`}>Name</L><input id={`${id}-name`} name="name" required autoComplete="name" placeholder="Your name" className={field} /></div>
      <div><L htmlFor={`${id}-email`}>Email</L><input id={`${id}-email`} name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} /></div>
      <div className="sm:col-span-2"><L htmlFor={`${id}-co`}>Company (optional)</L><input id={`${id}-co`} name="company" autoComplete="organization" placeholder="Studio or product name" className={field} /></div>
      {([['need', 'What needs solving', site.briefOptions.needs], ['budget', 'Budget', site.briefOptions.budgets]] as const).map(([name, label, opts]) => (
        <div key={name} className="relative">
          <L htmlFor={`${id}-${name}`}>{label}</L>
          <select id={`${id}-${name}`} name={name} className={`${field} appearance-none pr-10`} defaultValue={opts[0]}>
            {opts.map((o) => <option key={o} className="bg-panel">{o}</option>)}
          </select>
          <span className="pointer-events-none absolute right-4 bottom-4 text-accent" aria-hidden>⌄</span>
        </div>
      ))}
      <div className="sm:col-span-2"><L htmlFor={`${id}-brief`}>The brief</L><textarea id={`${id}-brief`} name="brief" required rows={5} placeholder="What is the product, and why is it hard to explain?" className={`${field} resize-none`} /></div>
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button type="submit" className="btn btn-primary"><span className="btn-dot" /> Transmit brief</button>
        <p className="hud text-faint" role="status">
          {status === 'copied' && <span className="text-signal">Brief copied — paste it into an email if your mail app did not open.</span>}
          {status === 'sent' && <span className="text-signal">Your mail app should open with the brief.</span>}
        </p>
      </div>
    </form>
  )
}
