/**
 * Central content. Change names, copy, photos and contact details here only.
 * Empty contact fields are hidden automatically — nothing is invented.
 */
export const site = {
  /** Shown on the hero: first word in outline, second in solid orange. Replace with your real name. */
  name: ['EISSA', 'STUDIO'] as [string, string],
  /** What the name decodes into once the suit is on. */
  alias: ['ALTER', 'EGO'] as [string, string],
  brand: 'EISSA',
  studio: 'EISSA STUDIO',
  role: 'Brand & interface designer',
  location: 'Remote — worldwide',
  timezone: 'Asia/Amman',
  year: 2026,
  available: 'Booking Q1 2027',
  bio: 'Brand and interface designer. Calm in the kickoff meeting. Something else entirely once the deadline is on.',

  /**
   * Hero portraits — put YOUR two photos in /public/hero/ and set the paths.
   * civilian: normal portrait (any colour, shown in black & white)
   * suited:   the same pose as your alter ego (shown in full colour)
   * Leave empty to use the built-in placeholder figures.
   */
  portraits: {
    civilian: '',
    suited: '',
  },

  /** About / origin text. Wrap words in *asterisks* to highlight them in orange italics. */
  origin:
    'I spent years inside agencies learning one thing: *a brand that needs explaining is not done yet.* Now I work directly with founders — one product at a time, *no layers in between*, from the first rough idea to the files that go live.',
  journey: ['First sketch', 'Agency years', 'Lead designer', 'Independent'],

  contact: {
    /** Replace with your real address (example.com is reserved and never delivers). */
    email: 'hello@example.com',
    /** International format, digits only, e.g. "962790000000". Empty = hidden. */
    whatsapp: '',
    /** e.g. "+962790000000". Empty = hidden. */
    sms: '',
    /** Telegram username without @. Empty = hidden. */
    telegram: '',
    defaultMessage: 'Hi — I have a project that needs an alter ego.',
  },

  socials: [
    // { label: 'Instagram', href: 'https://instagram.com/yourname' },
  ] as { label: string; href: string }[],

  nav: [
    { label: 'Work', to: '/work' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],

  seo: {
    title: 'EISSA — Brand & interface designer',
    description: 'Portfolio of an independent brand and interface designer. Identities, websites and motion.',
  },
}

/** Ability radar — axes and per-ability scores (0–100). */
export const radarAxes = ['Strategy', 'Craft', 'Motion', 'Systems', 'Speed'] as const
