import type { Project } from '../data/projects'
import { asset } from './asset'

/**
 * Generative cover art — used only when a project has no `cover` image.
 * Deterministic per project so it is stable between visits.
 */
const cache = new Map<string, HTMLCanvasElement>()

function rng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}
const seedOf = (str: string) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

export function drawCover(p: Project, w = 1200, h = 1500): HTMLCanvasElement {
  const key = `${p.slug}-${w}x${h}`
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  const [bg, accent, light] = p.palette
  const r = rng(seedOf(p.slug))
  const cx = w / 2
  const cy = h * 0.46
  const R = Math.min(w, h) * 0.32

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // atmospheric light
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.9)
  g.addColorStop(0, accent + '55')
  g.addColorStop(0.45, accent + '14')
  g.addColorStop(1, bg + '00')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.save()
  switch (p.motif) {
    case 'halo': {
      // eclipse halo
      for (let i = 0; i < 90; i++) {
        ctx.globalAlpha = 0.012 + i * 0.0004
        ctx.fillStyle = accent
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.02 + i * 2.2, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
      const rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R)
      rim.addColorStop(0, light); rim.addColorStop(0.5, accent); rim.addColorStop(1, light)
      ctx.strokeStyle = rim; ctx.lineWidth = 3
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = bg
      ctx.beginPath(); ctx.arc(cx, cy, R - 2, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 'shards': {
      for (let i = 0; i < 46; i++) {
        const a = r() * Math.PI * 2
        const d = R * (0.2 + r() * 1.1)
        const x = cx + Math.cos(a) * d
        const y = cy + Math.sin(a) * d
        const s = 20 + r() * 90
        ctx.globalAlpha = 0.25 + r() * 0.7
        const lg = ctx.createLinearGradient(x - s, y - s, x + s, y + s)
        lg.addColorStop(0, light); lg.addColorStop(1, accent)
        ctx.fillStyle = lg
        ctx.beginPath()
        ctx.moveTo(x + Math.cos(a) * s, y + Math.sin(a) * s)
        ctx.lineTo(x + Math.cos(a + 2.2) * s * 0.6, y + Math.sin(a + 2.2) * s * 0.6)
        ctx.lineTo(x + Math.cos(a + 4.1) * s * 0.8, y + Math.sin(a + 4.1) * s * 0.8)
        ctx.closePath(); ctx.fill()
      }
      break
    }
    case 'orbit': {
      ctx.strokeStyle = light
      for (let i = 0; i < 7; i++) {
        ctx.globalAlpha = 0.15 + i * 0.1
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.ellipse(cx, cy, R * (0.5 + i * 0.16), R * (0.18 + i * 0.05), -0.4 + i * 0.07, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      const og = ctx.createRadialGradient(cx - 18, cy - 18, 4, cx, cy, R * 0.22)
      og.addColorStop(0, '#fff'); og.addColorStop(0.5, accent); og.addColorStop(1, bg)
      ctx.fillStyle = og
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.22, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 'grid': {
      const step = w / 16
      ctx.strokeStyle = light
      ctx.globalAlpha = 0.09
      for (let x = 0; x <= w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = 0; y <= h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
      ctx.globalAlpha = 1
      ctx.strokeStyle = accent; ctx.lineWidth = 3
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const y = cy + Math.sin(x * 0.012) * R * 0.25 + Math.sin(x * 0.041) * R * 0.08
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
      break
    }
    case 'prism': {
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.5 - i * 0.12
        ctx.strokeStyle = i === 1 ? accent : light
        ctx.lineWidth = 2
        const rr = R * (0.7 + i * 0.25)
        ctx.beginPath()
        for (let k = 0; k <= 3; k++) {
          const a = -Math.PI / 2 + (k * Math.PI * 2) / 3 + i * 0.18
          const x = cx + Math.cos(a) * rr
          const y = cy + Math.sin(a) * rr
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 0.85
      const beam = ctx.createLinearGradient(0, cy, w, cy)
      beam.addColorStop(0, '#00000000'); beam.addColorStop(0.5, accent); beam.addColorStop(1, '#ffffff00')
      ctx.fillStyle = beam
      ctx.fillRect(0, cy - 2, w, 4)
      break
    }
    case 'dune': {
      for (let i = 0; i < 26; i++) {
        ctx.globalAlpha = 0.06 + (i / 26) * 0.5
        ctx.strokeStyle = i % 5 === 0 ? accent : light
        ctx.lineWidth = 1.5
        ctx.beginPath()
        const y0 = h * 0.3 + i * (h * 0.022)
        for (let x = 0; x <= w; x += 10) {
          const y = y0 + Math.sin(x * 0.006 + i * 0.4) * 40 + Math.sin(x * 0.017 + i) * 10
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      break
    }
  }
  ctx.restore()

  // film grain
  const img = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * 18
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)

  cache.set(key, c)
  return c
}

const urlCache = new Map<string, string>()
/** Returns the project cover URL — the real image when provided, otherwise a generated one. */
export function coverURL(p: Project, w = 900, h = 1125) {
  if (p.cover) return asset(p.cover)
  const key = `${p.slug}-${w}`
  const hit = urlCache.get(key)
  if (hit) return hit
  const u = drawCover(p, w, h).toDataURL('image/jpeg', 0.86)
  urlCache.set(key, u)
  return u
}
