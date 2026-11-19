import type { Project } from '../content'

// أغلفة مشاريع مولّدة برمجياً — بديل مؤقت حتى تضيف صورك (ضع مسار الصورة بدلها لاحقاً).
const cache = new Map<string, HTMLCanvasElement>()

function rand(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function makeCover(p: Project, w = 1024, h = 1280): HTMLCanvasElement {
  const key = `${p.id}-${w}x${h}`
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  const [bg, a, b] = p.colors
  const r = rand(Number(p.id) * 9973 + 7)

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const g = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.6, h * 0.4, w * 0.95)
  g.addColorStop(0, a + 'cc')
  g.addColorStop(0.55, a + '22')
  g.addColorStop(1, bg + '00')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = b
  ctx.fillStyle = b
  const cx = w * 0.5
  const cy = h * 0.46
  switch (p.motif) {
    case 'rings':
      for (let i = 1; i < 14; i++) {
        ctx.globalAlpha = 0.9 - i * 0.06
        ctx.lineWidth = 2 + (i % 3)
        ctx.beginPath()
        ctx.arc(cx, cy, i * w * 0.035, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    case 'grid':
      ctx.globalAlpha = 0.35
      ctx.lineWidth = 1.5
      for (let x = 0; x <= w; x += w / 12) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = 0; y <= h; y += w / 12) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = a
      for (let i = 0; i < 9; i++) {
        const gx = Math.floor(r() * 12) * (w / 12)
        const gy = Math.floor(r() * 14) * (w / 12)
        ctx.fillRect(gx, gy, w / 12, w / 12)
      }
      break
    case 'bars':
      for (let i = 0; i < 18; i++) {
        ctx.globalAlpha = 0.25 + r() * 0.75
        const bh = h * (0.15 + r() * 0.6)
        ctx.fillRect((i / 18) * w + 6, h - bh, w / 18 - 12, bh)
      }
      break
    case 'orb': {
      const og = ctx.createRadialGradient(cx - 80, cy - 100, 20, cx, cy, w * 0.34)
      og.addColorStop(0, b)
      og.addColorStop(0.4, a)
      og.addColorStop(1, bg)
      ctx.fillStyle = og
      ctx.beginPath(); ctx.arc(cx, cy, w * 0.34, 0, Math.PI * 2); ctx.fill()
      break
    }
    case 'diagonal':
      ctx.lineWidth = 26
      for (let i = -h; i < w + h; i += 70) {
        ctx.globalAlpha = 0.15 + ((i / 70) % 4) * 0.2
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - h, h); ctx.stroke()
      }
      break
    case 'dots':
      for (let y = 40; y < h; y += 44) {
        for (let x = 40; x < w; x += 44) {
          const d = Math.hypot(x - cx, y - cy) / (w * 0.6)
          ctx.globalAlpha = Math.max(0.05, 1 - d)
          ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, 9 * (1.2 - d)), 0, Math.PI * 2); ctx.fill()
        }
      }
      break
  }
  ctx.globalAlpha = 1

  // حبيبات فيلم
  const img = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * 28
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)

  // طباعة
  ctx.fillStyle = '#ece8e1'
  ctx.font = `600 ${w * 0.03}px "JetBrains Mono Variable", monospace`
  ctx.fillText(`(${p.id})`, w * 0.06, h * 0.07)
  ctx.textAlign = 'right'
  ctx.fillText(p.year, w * 0.94, h * 0.07)
  ctx.textAlign = 'left'
  ctx.font = `600 ${w * 0.13}px "Inter Tight Variable", sans-serif`
  ctx.fillText(p.title, w * 0.06, h * 0.9)
  ctx.font = `500 ${w * 0.028}px "JetBrains Mono Variable", monospace`
  ctx.globalAlpha = 0.7
  ctx.fillText(p.category.toUpperCase(), w * 0.06, h * 0.95)
  cache.set(key, c)
  return c
}

const urlCache = new Map<string, string>()
export function coverURL(p: Project) {
  const hit = urlCache.get(p.id)
  if (hit) return hit
  const u = makeCover(p, 640, 800).toDataURL('image/jpeg', 0.85)
  urlCache.set(p.id, u)
  return u
}
