/**
 * Placeholder figures for the hero, drawn procedurally so the site works before real photos exist.
 * Replace them by setting `site.portraits.civilian` / `site.portraits.suited` (see data/site.ts).
 */
const W = 900
const H = 1200

function bust(ctx: CanvasRenderingContext2D, fillBody: CanvasGradient | string, fillHead: CanvasGradient | string) {
  // shoulders / torso
  ctx.fillStyle = fillBody
  ctx.beginPath()
  ctx.moveTo(W * 0.04, H)
  ctx.bezierCurveTo(W * 0.06, H * 0.8, W * 0.2, H * 0.71, W * 0.38, H * 0.665)
  ctx.lineTo(W * 0.62, H * 0.665)
  ctx.bezierCurveTo(W * 0.8, H * 0.71, W * 0.94, H * 0.8, W * 0.96, H)
  ctx.closePath()
  ctx.fill()
  // neck
  ctx.beginPath()
  ctx.moveTo(W * 0.415, H * 0.52)
  ctx.lineTo(W * 0.585, H * 0.52)
  ctx.lineTo(W * 0.6, H * 0.69)
  ctx.quadraticCurveTo(W * 0.5, H * 0.73, W * 0.4, H * 0.69)
  ctx.closePath()
  ctx.fill()
  // head
  ctx.fillStyle = fillHead
  ctx.beginPath()
  ctx.ellipse(W * 0.5, H * 0.37, W * 0.165, H * 0.175, 0, 0, Math.PI * 2)
  ctx.fill()
}

function backdrop(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#08090b'
  ctx.fillRect(0, 0, W, H)
}

export function drawCivilian(): HTMLCanvasElement {
  const c = Object.assign(document.createElement('canvas'), { width: W, height: H })
  const ctx = c.getContext('2d')!
  backdrop(ctx)
  const body = ctx.createLinearGradient(W * 0.2, H * 0.65, W * 0.8, H)
  body.addColorStop(0, '#3b3c41'); body.addColorStop(0.5, '#1f2024'); body.addColorStop(1, '#0d0e10')
  const head = ctx.createRadialGradient(W * 0.43, H * 0.3, 10, W * 0.5, H * 0.38, W * 0.24)
  head.addColorStop(0, '#d8d6d2'); head.addColorStop(0.45, '#8c8a86'); head.addColorStop(1, '#232325')
  bust(ctx, body, head)
  // hair
  ctx.fillStyle = '#141416'
  ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.255, W * 0.17, H * 0.085, 0, Math.PI, 0); ctx.fill()
  // sculptural shading: side shadow + rim light (no drawn features — this is a mannequin placeholder)
  const side = ctx.createLinearGradient(W * 0.34, 0, W * 0.67, 0)
  side.addColorStop(0, 'rgba(0,0,0,0)'); side.addColorStop(0.55, 'rgba(0,0,0,0)'); side.addColorStop(1, 'rgba(0,0,0,0.55)')
  ctx.fillStyle = side
  ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.37, W * 0.165, H * 0.175, 0, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.37, W * 0.163, H * 0.173, 0, Math.PI * 0.95, Math.PI * 1.45); ctx.stroke()
  // jacket collar
  ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 5
  ctx.beginPath(); ctx.moveTo(W * 0.4, H * 0.69); ctx.lineTo(W * 0.47, H * 0.86); ctx.moveTo(W * 0.6, H * 0.69); ctx.lineTo(W * 0.53, H * 0.86); ctx.stroke()
  return c
}

export function drawSuited(): HTMLCanvasElement {
  const c = Object.assign(document.createElement('canvas'), { width: W, height: H })
  const ctx = c.getContext('2d')!
  backdrop(ctx)
  const body = ctx.createLinearGradient(W * 0.2, H * 0.65, W * 0.85, H)
  body.addColorStop(0, '#2c3a52'); body.addColorStop(0.55, '#141b28'); body.addColorStop(1, '#07090d')
  const head = ctx.createRadialGradient(W * 0.42, H * 0.29, 10, W * 0.5, H * 0.38, W * 0.25)
  head.addColorStop(0, '#6f86a8'); head.addColorStop(0.5, '#2a3850'); head.addColorStop(1, '#0b0f17')
  bust(ctx, body, head)

  const glow = (color: string, blur: number, width: number, draw: () => void) => {
    ctx.save(); ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.lineWidth = width; ctx.lineCap = 'round'
    ctx.beginPath(); draw(); ctx.stroke(); ctx.restore()
  }
  // visor
  ctx.save(); ctx.shadowColor = '#ff5a1f'; ctx.shadowBlur = 40; ctx.fillStyle = '#ff7a3d'
  ctx.beginPath(); ctx.roundRect(W * 0.355, H * 0.343, W * 0.29, H * 0.03, 20); ctx.fill(); ctx.restore()
  ctx.fillStyle = '#ffd2b8'; ctx.beginPath(); ctx.roundRect(W * 0.38, H * 0.352, W * 0.24, H * 0.01, 8); ctx.fill()
  // helmet seams
  glow('#ff5a1f', 18, 4, () => {
    ctx.moveTo(W * 0.5, H * 0.2); ctx.lineTo(W * 0.5, H * 0.3)
    ctx.moveTo(W * 0.37, H * 0.44); ctx.lineTo(W * 0.44, H * 0.5); ctx.lineTo(W * 0.56, H * 0.5); ctx.lineTo(W * 0.63, H * 0.44)
  })
  // armour lines
  glow('#ff5a1f', 22, 4, () => {
    ctx.moveTo(W * 0.38, H * 0.67); ctx.lineTo(W * 0.3, H * 0.78); ctx.lineTo(W * 0.14, H * 0.86)
    ctx.moveTo(W * 0.62, H * 0.67); ctx.lineTo(W * 0.7, H * 0.78); ctx.lineTo(W * 0.86, H * 0.86)
    ctx.moveTo(W * 0.4, H * 0.95); ctx.lineTo(W * 0.43, H * 1.0)
    ctx.moveTo(W * 0.6, H * 0.95); ctx.lineTo(W * 0.57, H * 1.0)
  })
  // chest emblem
  ctx.save(); ctx.shadowColor = '#31a8ff'; ctx.shadowBlur = 30
  ctx.strokeStyle = '#4fb6ff'; ctx.lineWidth = 6
  ctx.beginPath(); ctx.arc(W * 0.5, H * 0.86, W * 0.065, 0, Math.PI * 2); ctx.stroke()
  ctx.fillStyle = '#1a3a5c'; ctx.fill()
  ctx.restore()
  glow('#ff5a1f', 14, 3, () => { ctx.arc(W * 0.5, H * 0.86, W * 0.025, 0, Math.PI * 2) })
  return c
}
