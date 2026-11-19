// كل محتوى الموقع هنا — غيّر الاسم والمشاريع والروابط من هذا الملف فقط.
export const site = {
  name: 'EISSA',
  alias: 'ALTER/EGO',
  role: 'Brand & Interface Designer',
  location: 'Amman, JO',
  timezone: 'Asia/Amman',
  email: 'hello@eissa.studio',
  available: 'Available — Q1 2027',
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'Behance', href: '#' },
    { label: 'Dribbble', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
  manifesto:
    'By day I design calm, honest interfaces. By night the other one takes over — loud identities, broken grids, and motion that refuses to sit still. Every brand I build carries both.',
}

export type Project = {
  id: string
  title: string
  client: string
  year: string
  category: string
  colors: [string, string, string]
  motif: 'rings' | 'grid' | 'bars' | 'orb' | 'diagonal' | 'dots'
}

export const projects: Project[] = [
  { id: '01', title: 'Nocturne', client: 'Nocturne Audio', year: '2026', category: 'Brand Identity', colors: ['#120c1f', '#6b3cff', '#ff3b1f'], motif: 'rings' },
  { id: '02', title: 'Halcyon OS', client: 'Halcyon Labs', year: '2026', category: 'Product / UI', colors: ['#071318', '#1fd1b2', '#ece8e1'], motif: 'grid' },
  { id: '03', title: 'Ferro', client: 'Ferro Motors', year: '2025', category: 'Art Direction', colors: ['#1a0b08', '#ff3b1f', '#ffb199'], motif: 'bars' },
  { id: '04', title: 'Atlas Bank', client: 'Atlas Financial', year: '2025', category: 'Design System', colors: ['#0b0f1c', '#3d6bff', '#c9d6ff'], motif: 'orb' },
  { id: '05', title: 'Saffron', client: 'Saffron House', year: '2025', category: 'Packaging', colors: ['#1c1206', '#ffb000', '#fff1cc'], motif: 'diagonal' },
  { id: '06', title: 'Wavelength', client: 'Wavelength FM', year: '2024', category: 'Motion Identity', colors: ['#0d0d0d', '#e6ff3b', '#ece8e1'], motif: 'dots' },
  { id: '07', title: 'Ondine', client: 'Ondine Skincare', year: '2024', category: 'E‑commerce', colors: ['#0e1414', '#9fe0d6', '#ffffff'], motif: 'rings' },
  { id: '08', title: 'Kiln', client: 'Kiln Ceramics', year: '2024', category: 'Brand Identity', colors: ['#170f0c', '#d26a3c', '#f5e6da'], motif: 'grid' },
]

export const capabilities = [
  { n: '01', title: 'Brand Identity', body: 'Naming, strategy, logo systems and the rules that keep them alive.', tags: ['Strategy', 'Logo', 'Type', 'Guidelines'] },
  { n: '02', title: 'Interface Design', body: 'Products people return to — from first wireframe to a shipped design system.', tags: ['UX', 'UI', 'Design Systems', 'Prototyping'] },
  { n: '03', title: 'Motion & 3D', body: 'Identities that move. Launch films, micro‑interactions and real‑time WebGL.', tags: ['Motion', 'WebGL', '3D', 'Sound'] },
  { n: '04', title: 'Creative Direction', body: 'One voice across every surface — campaign, product, packaging, space.', tags: ['Campaign', 'Art Direction', 'Photo'] },
]

export const recognition = [
  { award: 'Awwwards', detail: 'Site of the Day', year: '2026' },
  { award: 'CSS Design Awards', detail: 'Best UI / UX', year: '2025' },
  { award: 'FWA', detail: 'FWA of the Day', year: '2025' },
  { award: 'Brand New', detail: 'Noted', year: '2024' },
  { award: 'Behance', detail: 'Featured — Branding', year: '2024' },
]
