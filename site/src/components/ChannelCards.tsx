import { site } from '../data/site'
import { contactChannels } from '../lib/contact'
import Icon from './icons/Icon'

const glyph = { Email: 'mail', WhatsApp: 'message', SMS: 'message', Telegram: 'send' } as const

/** Contact + social cards — only configured channels are shown. */
export default function ChannelCards() {
  const cards = [
    ...contactChannels().map((c) => ({ label: c.label, handle: c.value, href: c.href, external: c.external })),
    ...site.socials.map((s) => ({ label: s.label, handle: s.handle, href: s.href, external: true })),
  ]
  if (!cards.length) return null
  return (
    <ul className="grid border-t border-line sm:grid-cols-2">
      {cards.map((c) => (
        <li key={c.label} className="border-b border-line sm:odd:border-r">
          <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})} className="group flex items-center gap-4 py-5 pr-2 sm:px-4" data-cursor="Open">
            <span className="grid size-12 shrink-0 place-items-center border border-line text-lg text-dim transition-colors group-hover:border-accent group-hover:text-accent" aria-hidden><Icon name={glyph[c.label as keyof typeof glyph] ?? 'link'} className="size-5" /></span>
            <span className="min-w-0">
              <span className="display block text-[1.6rem] leading-none">{c.label}</span>
              <span className="hud mt-1 block truncate text-faint">{c.handle}</span>
            </span>
            <span className="ml-auto text-faint transition-[transform,color] duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" aria-hidden><Icon name="arrow-up-right" /></span>
          </a>
        </li>
      ))}
    </ul>
  )
}
