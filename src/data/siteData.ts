/**
 * Brand, navigation and section copy. IRON//VOID is a fictional concept —
 * contact details below are placeholders (example.com / 555 numbers).
 */
export const site = {
  brand: { name: 'IRON//VOID', left: 'IRON', right: 'VOID', tagline: 'THE FUTURE OF STRENGTH' },
  conceptNotice: 'Concept site — IRON//VOID is a fictional gym. Plans, prices, schedule and contact details are demo content.',
  nav: [
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Equipment', href: '#equipment' },
    { label: 'Training', href: '#programs' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Experience', href: '#experience' },
    { label: 'Membership', href: '#membership' },
    { label: 'Schedule', href: '#schedule' },
  ],
  navCta: { label: 'Join', href: '#join' },
  hero: {
    eyebrow: 'Est. in the void — Concept 01',
    headline: ['BUILT', 'BEYOND', 'LIMITS.'],
    sub: 'A new dimension of strength.',
    primary: { label: 'EXPLORE THE EXPERIENCE', href: '#experience' },
    secondary: { label: 'DISCOVER TRAINING', href: '#programs' },
    scrollHint: 'Scroll',
  },
  philosophy: {
    eyebrow: '01 — The philosophy',
    statement: 'Strength is not decoration. It is a material — cast under load, shaped by repetition, finished by patience. We built a place that takes it as seriously as you do.',
    columns: [
      { title: 'Load is honest.', body: 'The bar weighs what it weighs. Training here is organised around measurable work, written down, repeated and progressed.' },
      { title: 'Fewer things, done properly.', body: 'A small number of movements, good equipment and room to use it. No mirrors-and-noise theatre between you and the session.' },
      { title: 'Rest is part of the plan.', body: 'Lighter weeks and recovery sessions are programmed in from the start, not added when something starts to hurt.' },
    ],
    marquee: ['IRON', 'VOID', 'LOAD', 'REPEAT', 'RECOVER'],
  },
  equipment: {
    eyebrow: '02 — Equipment experience',
    title: 'THE ARMOURY',
    intro: 'Turn it over. Every piece below is a real 3D model you can rotate and inspect.',
    hintMouse: 'Drag to rotate · use + / − to zoom',
    hintTouch: 'Drag to rotate · pinch to zoom',
    assetNote: 'Models: CC0 “Gym and Fitness Studio” pack, 3dassets.dev — low-poly geometry, re-lit and re-finished here.',
  },
  programs: { eyebrow: '03 — Training programs', title: 'FOUR WAYS IN' },
  gallery: {
    eyebrow: '04 — Training gallery',
    title: 'ON THE FLOOR',
    note: 'Licensed stock photography and footage (Pexels, Mixkit). The people shown are not IRON//VOID staff or members.',
    hint: 'Drag · click to open',
  },
  experience: {
    eyebrow: '05 — The experience',
    title: 'WALK THE FLOOR',
    intro: 'Real interior footage, and a 3D model of a training floor you can orbit.',
    zones: [
      { id: 'overview', label: 'Overview', body: 'The whole floor at once: platforms down the middle, machines along the walls, clear lanes between.', view: { azimuth: 0.7, polar: 0.95, distance: 1 } },
      { id: 'platforms', label: 'Platforms', body: 'Racks and lifting platforms sit on their own accent flooring so heavy work has its own territory.', view: { azimuth: -0.5, polar: 1.15, distance: 0.62 } },
      { id: 'engine', label: 'Engine room', body: 'Treadmills, rowers and bikes share one line, facing into the room rather than at a wall.', view: { azimuth: 2.3, polar: 1.1, distance: 0.66 } },
      { id: 'plan', label: 'Plan view', body: 'From above: how the lanes, storage and stations fit together.', view: { azimuth: 0, polar: 0.12, distance: 0.95 } },
    ],
    modelNote: 'Stylised floor model (CC0, 3dassets.dev) — a diagram of a layout, not a photograph of a real venue.',
  },
  membership: { eyebrow: '06 — Membership', title: 'CHOOSE YOUR LOAD', cta: 'Join with this plan' },
  schedule: { eyebrow: '07 — Training schedule', title: 'THE WEEK', demoNotice: 'Demonstration timetable — sessions, times and coaches are placeholders.' },
  finalCta: {
    headline: ['YOUR LIMITS', 'END HERE.'],
    sub: 'Tell us how you train. We will reply with a time to come in.',
    button: 'Request a first session',
  },
  join: {
    title: 'REQUEST A FIRST SESSION',
    demoNotice: 'No backend is connected. Submitting opens your email app with this request addressed to the demo inbox below — nothing is stored or processed by this site.',
    fields: { name: 'Full name', email: 'Email', plan: 'Plan', focus: 'Training focus', message: 'Anything we should know (optional)' },
    submit: 'Open email draft',
  },
  contact: {
    email: 'hello@ironvoid.example',
    phone: '+1 (555) 010-0199',
    address: ['Unit 0, The Void', 'Demo District', 'Nowhere 00000'],
    hours: [
      { label: 'Mon – Fri', value: '05:30 – 22:00' },
      { label: 'Sat – Sun', value: '07:00 – 18:00' },
    ],
  },
  footer: {
    line: 'Built beyond limits.',
    legal: 'IRON//VOID is a fictional brand created as a design and engineering concept.',
    creditsLabel: 'Asset credits',
  },
};
