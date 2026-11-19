import { contactChannels } from '../lib/contact'

export default function ContactChannels({ className = '' }: { className?: string }) {
  const list = contactChannels()
  return (
    <ul className={`divide-y divide-line border-y border-line ${className}`}>
      {list.map((c) => (
        <li key={c.label}>
          <a
            href={c.href}
            {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:text-violet-soft"
            data-cursor="Write"
          >
            <span className="label text-mist">{c.label}</span>
            <span className="text-lead tracking-tight">{c.value}</span>
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
