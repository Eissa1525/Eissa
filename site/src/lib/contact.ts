import { site } from '../data/site'

/** Written channels only. A channel appears only when configured in data/site.ts. */
export function contactChannels() {
  const { email, whatsapp, sms, telegram, defaultMessage } = site.contact
  const msg = encodeURIComponent(defaultMessage)
  const list: { label: string; value: string; href: string; external?: boolean }[] = []
  if (email) list.push({ label: 'Email', value: email, href: `mailto:${email}?subject=${encodeURIComponent('New project')}&body=${msg}` })
  if (whatsapp) list.push({ label: 'WhatsApp', value: 'Message on WhatsApp', href: `https://wa.me/${whatsapp}?text=${msg}`, external: true })
  if (sms) list.push({ label: 'SMS', value: 'Send a text', href: `sms:${sms}?&body=${msg}` })
  if (telegram) list.push({ label: 'Telegram', value: `@${telegram}`, href: `https://t.me/${telegram}`, external: true })
  return list
}
