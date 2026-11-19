/**
 * SAMPLE PROJECTS — concept work used as placeholders.
 * Replace with real projects. Do not add metrics or client claims that are not true.
 * `cover` can be an image URL/import; when empty a generative cover is drawn from `palette` + `motif`.
 */
export type Motif = 'halo' | 'shards' | 'orbit' | 'grid' | 'prism' | 'dune'

export type Project = {
  slug: string
  index: string
  title: string
  client: string
  year: string
  disciplines: string[]
  summary: string
  palette: [string, string, string]
  motif: Motif
  cover?: string
  context: string
  objectives: string[]
  process: { title: string; body: string }[]
  direction: string
  outcome: string
  device: 'browser' | 'phone' | 'both'
}

export const projects: Project[] = [
  {
    slug: 'umbra-audio',
    index: '01',
    title: 'Umbra',
    client: 'Concept — audio brand',
    year: '2026',
    disciplines: ['Brand identity', 'Website', '3D'],
    summary: 'A sound company that sells silence. An identity built from shadows and resonance.',
    palette: ['#0b0812', '#5b3df5', '#d9d6ea'],
    motif: 'halo',
    context:
      'Umbra is a concept for a premium headphone maker whose product promise is not louder sound, but quieter space. The brief: make absence feel luxurious.',
    objectives: ['Express silence visually without feeling empty', 'Build a product launch site that feels like a listening room', 'Create a motion language driven by sound decay'],
    process: [
      { title: 'Listening sessions', body: 'We mapped how sound fades in a room and translated each decay curve into an easing function.' },
      { title: 'Identity', body: 'A wordmark cut by a single eclipse — the letters lose information exactly where the sound does.' },
      { title: 'Web', body: 'A scroll-driven product reveal where the headphone emerges as the ambient noise layer is removed.' },
    ],
    direction: 'Near-black surfaces, a single violet light source and typography that tracks wider as the page gets quieter.',
    outcome: 'A complete concept identity, a launch-site prototype and a motion toolkit — presented here as studio exploration.',
    device: 'both',
  },
  {
    slug: 'meridian-os',
    index: '02',
    title: 'Meridian',
    client: 'Concept — operating system',
    year: '2026',
    disciplines: ['Interface design', 'Design system', 'Motion'],
    summary: 'A calm interface for people who manage critical infrastructure at night.',
    palette: ['#070b10', '#2ec5b6', '#e3efee'],
    motif: 'grid',
    context: 'Meridian explores an operator console for night-shift infrastructure teams, where glare and alert fatigue are real problems.',
    objectives: ['Reduce visual noise during long shifts', 'Make critical states impossible to miss', 'Keep the system usable with keyboard only'],
    process: [
      { title: 'Constraints first', body: 'Low-luminance palette tested for long sessions, with alert colors reserved for genuine incidents.' },
      { title: 'System', body: 'A token-based component library with three density modes and full keyboard paths.' },
      { title: 'Motion', body: 'Movement only communicates state — nothing animates without a reason.' },
    ],
    direction: 'Dark graphite planes, precise mono typography, a single cyan signal color.',
    outcome: 'An interface concept and component library documented as a self-initiated study.',
    device: 'browser',
  },
  {
    slug: 'halide-studio',
    index: '03',
    title: 'Halide',
    client: 'Concept — photography studio',
    year: '2025',
    disciplines: ['Art direction', 'Website', 'WebGL'],
    summary: 'A portfolio where photographs develop on screen like film in a darkroom.',
    palette: ['#100907', '#ff6a3d', '#f4e3d7'],
    motif: 'dune',
    context: 'A concept site for an analog photography studio that wanted its website to respect the patience of its craft.',
    objectives: ['Make loading feel like developing', 'Let images dominate the layout', 'Keep it fast despite large imagery'],
    process: [
      { title: 'Darkroom shader', body: 'A WebGL shader reveals each photograph through simulated chemical development.' },
      { title: 'Editorial grid', body: 'A flexible grid that adapts to portrait, landscape and panoramic frames.' },
      { title: 'Performance', body: 'Progressive image loading so the effect never waits on bandwidth.' },
    ],
    direction: 'Warm safelight red, deep blacks, contact-sheet typography.',
    outcome: 'A working prototype of the darkroom reveal and editorial gallery — a studio exploration.',
    device: 'browser',
  },
  {
    slug: 'vela-mobility',
    index: '04',
    title: 'Vela',
    client: 'Concept — electric mobility',
    year: '2025',
    disciplines: ['Brand identity', 'App design', 'Motion'],
    summary: 'An electric-boat brand that borrows its grammar from wind and sail.',
    palette: ['#060a14', '#4c7dff', '#dbe4ff'],
    motif: 'orbit',
    context: 'Vela imagines an electric water-mobility brand that needed to feel both technical and poetic.',
    objectives: ['Unify hardware, app and campaign under one system', 'Visualize energy without clichés', 'Design an app usable with wet hands'],
    process: [
      { title: 'Wind grammar', body: 'Logo and iconography derived from sail geometry and wind-direction diagrams.' },
      { title: 'App', body: 'Oversized touch targets and high-contrast states for on-water use.' },
      { title: 'Campaign', body: 'Motion studies where type behaves like fabric under tension.' },
    ],
    direction: 'Midnight blue, signal white and a single ultramarine accent.',
    outcome: 'Identity concept, app flows and motion studies — presented as self-initiated work.',
    device: 'phone',
  },
  {
    slug: 'orrery-museum',
    index: '05',
    title: 'Orrery',
    client: 'Concept — science museum',
    year: '2024',
    disciplines: ['Exhibition', 'Interactive', '3D'],
    summary: 'An exhibition website that lets visitors hold the solar system in their hands.',
    palette: ['#0c0a05', '#e2b33c', '#f6edd2'],
    motif: 'prism',
    context: 'A concept digital companion for a museum exhibition about historical mechanical models of the cosmos.',
    objectives: ['Turn a static archive into a hands-on experience', 'Work on museum touch screens and phones', 'Stay accessible for school groups'],
    process: [
      { title: 'Archive', body: 'Objects organized by mechanism rather than date, revealing how ideas evolved.' },
      { title: 'Interactive', body: 'A real-time 3D orrery visitors can wind, pause and inspect.' },
      { title: 'Access', body: 'Every interaction has a non-3D equivalent and narrated descriptions.' },
    ],
    direction: 'Brass, ivory and museum black. Serif captions with technical mono annotations.',
    outcome: 'A prototype exhibition site and 3D interaction study — a studio exploration.',
    device: 'both',
  },
  {
    slug: 'nadir-fragrance',
    index: '06',
    title: 'Nadir',
    client: 'Concept — fragrance house',
    year: '2024',
    disciplines: ['Packaging', 'Campaign', 'Website'],
    summary: 'A fragrance named after the lowest point of the sky — and designed from it.',
    palette: ['#0a0710', '#b46cff', '#efe6ff'],
    motif: 'shards',
    context: 'Nadir is a concept fragrance whose story is told from beneath — every visual starts at the bottom of the frame.',
    objectives: ['Invert the usual luxury hierarchy', 'Make the bottle the hero without photography clichés', 'Create a narrative website for a single product'],
    process: [
      { title: 'Inversion', body: 'Layouts anchored to the bottom edge; type rises like vapor.' },
      { title: 'Bottle', body: 'A fractured glass form modeled for both packaging renders and real-time web.' },
      { title: 'Story', body: 'A short scroll film from midnight to the lowest point of the night.' },
    ],
    direction: 'Violet glass, smoke, and silver foil on black.',
    outcome: 'Packaging concept, campaign frames and a narrative web prototype — self-initiated.',
    device: 'phone',
  },
]

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug)
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
