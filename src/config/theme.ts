/**
 * IRON//VOID theme — single source of truth for colours and motion feel.
 * Every value here is pushed to CSS custom properties at startup (see applyTheme),
 * so Tailwind utilities (bg-void, text-bone, text-accent …), the WebGL light rays
 * and the 3D materials all follow whatever you set here.
 */
export const theme = {
  colors: {
    void: '#050506', // page background
    carbon: '#0c0c0e', // raised surfaces
    graphite: '#16161a', // cards
    steel: '#2a2a30', // hairlines / borders
    titanium: '#8f929b', // secondary text, brushed metal
    bone: '#eceae4', // primary off-white text
    accent: '#ff5a14', // electric orange — use sparingly
    accentHot: '#ff8a3c',
  },
  /** 3D material look applied to the downloaded GLB models, keyed by their material name. */
  materials: {
    metal: { color: '#c9ccd3', metalness: 1, roughness: 0.22 },
    frame: { color: '#1b1c20', metalness: 0.85, roughness: 0.42 },
    dark: { color: '#101114', metalness: 0.6, roughness: 0.5 },
    rubber: { color: '#0b0b0c', metalness: 0.05, roughness: 0.82 },
    pad: { color: '#131316', metalness: 0.1, roughness: 0.6 },
    carcass: { color: '#8f929b', metalness: 0.9, roughness: 0.35 },
    accent: { color: '#ff5a14', metalness: 0.35, roughness: 0.38, emissive: '#ff3c00', emissiveIntensity: 0.18 },
    /** quieter accent used on large surfaces (the floor model's accent tiles) */
    accentMuted: { color: '#7a3214', metalness: 0.25, roughness: 0.62 },
    screen: { color: '#0a0d12', metalness: 0.2, roughness: 0.15, emissive: '#ff5a14', emissiveIntensity: 0.25 },
    floor: { color: '#0d0d0f', metalness: 0.2, roughness: 0.75 },
    glass: { color: '#9aa4b0', metalness: 1, roughness: 0.08 },
    timber: { color: '#2a211b', metalness: 0.1, roughness: 0.7 },
    soft: { color: '#d9d6cf', metalness: 0, roughness: 0.9 },
  } as Record<string, { color: string; metalness: number; roughness: number; emissive?: string; emissiveIntensity?: number }>,
  /** Atmosphere (background light rays) per section. Keys match section ids. */
  atmosphere: {
    hero: { color: '#ffd9c2', intensity: 0.9, origin: 'top-center' },
    philosophy: { color: '#cfd3dc', intensity: 0.55, origin: 'top-left' },
    equipment: { color: '#ffb48a', intensity: 0.7, origin: 'top-center' },
    programs: { color: '#c9ccd3', intensity: 0.4, origin: 'top-right' },
    gallery: { color: '#ff9a5e', intensity: 0.45, origin: 'top-left' },
    experience: { color: '#d7dbe4', intensity: 0.6, origin: 'top-center' },
    membership: { color: '#ff7a2e', intensity: 0.5, origin: 'top-right' },
    schedule: { color: '#c9ccd3', intensity: 0.35, origin: 'top-left' },
    join: { color: '#ff6a22', intensity: 1, origin: 'top-center' },
  } as Record<string, { color: string; intensity: number; origin: string }>,
  motion: {
    ease: 'power3.out',
    easeInOut: 'power3.inOut',
    lenisDuration: 1.15,
  },
} as const;

export function applyTheme() {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([k, v]) => {
    root.style.setProperty(`--iv-${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`, v);
  });
}
