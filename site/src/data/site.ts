/**
 * AETHER STUDIO — central configuration.
 * All brand content lives here (and in projects.ts / services.ts / process.ts).
 * Contact fields left empty are hidden from the UI automatically — no invented details.
 */
export const site = {
  brand: 'AETHER',
  studio: 'AETHER STUDIO',
  codename: 'ECLIPSE',
  tagline: 'An independent studio for immersive brands, interfaces and 3D experiences.',
  location: 'Remote — worldwide',
  timezone: 'UTC',
  year: 2026,

  contact: {
    /** Replace with your real address. `example.com` is a reserved, non-real domain. */
    email: 'studio@example.com',
    /** International format without “+” or spaces, e.g. "962790000000". Empty = hidden. */
    whatsapp: '',
    /** Number for SMS in international format, e.g. "+962790000000". Empty = hidden. */
    sms: '',
    /** Telegram username without “@”. Empty = hidden. */
    telegram: '',
    defaultMessage: 'Hello AETHER — I’d like to talk about a project.',
  },

  socials: [
    // { label: 'Instagram', href: 'https://instagram.com/…' },
  ] as { label: string; href: string }[],

  nav: [
    { label: 'Work', to: '/work' },
    { label: 'Studio', to: '/studio' },
    { label: 'Contact', to: '/contact' },
  ],

  seo: {
    title: 'AETHER STUDIO — Immersive brands & 3D experiences',
    description:
      'AETHER is an independent creative studio designing immersive websites, brand systems, motion and real-time 3D.',
  },

  manifesto: [
    'We don’t decorate brands.',
    'We give them a world to live in.',
    'Every project starts unfinished — fractured, uncertain, raw. Our work is the patient act of bringing it into orbit, until it holds its own light.',
  ],
} as const

export const eclipseChapters = [
  { n: '01', key: 'origin', title: 'Origin', line: 'Every idea arrives unfinished.' },
  { n: '02', key: 'awakening', title: 'Awakening', line: 'Then it starts to move.' },
  { n: '03', key: 'formation', title: 'Formation', line: 'Fragments find their form.' },
  { n: '04', key: 'eclipse', title: 'Eclipse', line: 'Step inside the work.' },
] as const
