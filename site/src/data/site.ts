/**
 * Central content. Change names, copy, photos and contact details here only.
 * Empty contact fields are hidden automatically — nothing is invented.
 */
export const site = {
  /** Shown on the hero: first word in outline, second in solid orange. Replace with your real name. */
  name: ['EYAS', 'DESIGN'] as [string, string],
  /** What the name decodes into once the suit is on. */
  alias: ['ALTER', 'EGO'] as [string, string],
  brand: 'Eyas Design',
  studio: 'EYAS DESIGN',
  role: 'Brand & interface designer',
  location: 'Remote — worldwide',
  timezone: 'Asia/Amman',
  year: 2026,
  available: 'Booking Q1 2027',
  bio: 'Independent brand and interface designer. Calm in the kickoff meeting. Something else once the deadline is on.',

  /**
   * Hero portraits — put YOUR two photos in /public/hero/ and set the paths.
   * civilian: normal portrait (any colour, shown in black & white)
   * suited:   the same pose as your alter ego (shown in full colour)
   * Leave empty to use the built-in placeholder figures.
   */
  portraits: {
    civilian: '', // empty → the original 3D suit-up scene (no photo needed)
    suited: '', // with only a civilian photo, the shader builds the suit from it
    /** Landmarks for the generated suit, as fractions of the photo (0 = left/top, 1 = right/bottom). */
    suitMap: { faceX: 0.5, faceY: 0.27, faceW: 0.235, faceH: 0.26, visorY: 0.297, visorHalfWidth: 0.165, visorHalfHeight: 0.021, chestY: 0.74 },
  },

  /** About / origin text. Wrap words in *asterisks* to highlight them in orange italics. */
  origin:
    'I spent years inside agencies learning one thing: *a brand that needs explaining is not done yet.* Now I work directly with founders — one product at a time, *no layers in between*, from the first rough idea to the files that go live.',
  journey: ['First sketch', 'Agency years', 'Lead designer', 'Independent'],

  /** Shown above the brief form — change or empty it to match how fast you really reply. */
  replyPromise: 'Reply within 2 working days',
  briefOptions: {
    needs: ['Brand identity', 'Website', 'Motion', 'Art direction', 'Not sure yet'],
    budgets: ['Under $5k', '$5k – $15k', '$15k – $40k', '$40k+', 'Let’s talk'],
  },

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

  /** Add your real profiles — each one becomes a card in the contact section. */
  socials: [
    // { label: 'Instagram', handle: '@yourname', href: 'https://instagram.com/yourname' },
    // { label: 'Behance', handle: '@yourname', href: 'https://behance.net/yourname' },
  ] as { label: string; handle: string; href: string }[],

  nav: [
    { label: 'Work', to: '/work' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],

  seo: {
    title: 'Eyas Design, brand and interface designer',
    description: 'Portfolio of an independent brand and interface designer. Identities, websites and motion.',
  },
}

/** Ability radar — axes and per-ability scores (0–100). */
export const radarAxes = ['Strategy', 'Craft', 'Motion', 'Systems', 'Speed'] as const
