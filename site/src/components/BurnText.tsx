import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/useMedia'

/**
 * Crisp display text that burns away under the pointer: a heat field on a pixel grid punches
 * dithered holes through the text with orange embers at the edges, then slowly heals.
 * When no pointer is around (touch, idle) an autonomous probe wanders across it.
 */
export default function BurnText({ lines, className = '' }: { lines: string[]; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = wrap.current!
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const reduce = prefersReducedMotion()
    const CELL = 5
    let dpr = 1, W = 0, H = 0, cols = 0, rows = 0
    let text: HTMLCanvasElement
    let mask = new Uint8Array(0)
    let heat = new Float32Array(0)
    let raf = 0, visible = false, frame = 0
    const ptr = { x: -9999, y: -9999, last: 0, inside: false }
    const coarse = window.matchMedia('(pointer: coarse)').matches

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = el.clientWidth
      if (W < 10) return // not laid out yet (hidden route, transition) — the ResizeObserver calls again
      const fs = Math.min(W * (W < 600 ? 0.235 : 0.205), 330)
      const lh = fs * 0.84
      H = Math.ceil(lh * lines.length + fs * 0.12)
      cv.width = W * dpr; cv.height = H * dpr
      cv.style.height = `${H}px`
      text = document.createElement('canvas')
      text.width = cv.width; text.height = cv.height
      const t = text.getContext('2d')!
      t.scale(dpr, dpr)
      t.fillStyle = '#ededf0'
      t.font = `800 ${fs}px "Big Shoulders Variable", Impact, sans-serif`
      t.textBaseline = 'alphabetic'
      lines.forEach((ln, i) => {
        const w = t.measureText(ln).width
        const x = i === 0 ? 0 : Math.max(0, W - w)
        t.fillText(ln, x, lh * (i + 1) - fs * 0.04)
      })
      cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL)
      const data = t.getImageData(0, 0, text.width, text.height).data
      mask = new Uint8Array(cols * rows)
      heat = new Float32Array(cols * rows)
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const px = Math.min(text.width - 1, Math.floor((x + 0.5) * CELL * dpr))
          const py = Math.min(text.height - 1, Math.floor((y + 0.5) * CELL * dpr))
          mask[y * cols + x] = data[(py * text.width + px) * 4 + 3] > 100 ? 1 : 0
        }
      draw()
    }

    const hash = (x: number, y: number, f: number) => {
      const s = Math.sin(x * 12.9898 + y * 78.233 + f * 3.17) * 43758.5453
      return s - Math.floor(s)
    }

    const addHeat = (cx: number, cy: number, radius: number, amt: number) => {
      const gx = cx / CELL, gy = cy / CELL, r = radius / CELL
      for (let y = Math.max(0, Math.floor(gy - r)); y < Math.min(rows, Math.ceil(gy + r)); y++)
        for (let x = Math.max(0, Math.floor(gx - r)); x < Math.min(cols, Math.ceil(gx + r)); x++) {
          const d = Math.hypot(x - gx, y - gy) / r
          if (d < 1) heat[y * cols + x] = Math.min(1.4, heat[y * cols + x] + (1 - d) * amt * (0.6 + Math.random() * 0.8))
        }
    }

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.drawImage(text, 0, 0)
      ctx.scale(dpr, dpr)
      // punch burnt cells out of the text
      ctx.globalCompositeOperation = 'destination-out'
      for (let i = 0; i < heat.length; i++) {
        const h = heat[i]
        if (h < 0.3) continue
        const x = i % cols, y = (i / cols) | 0
        if (h > 0.62 || hash(x, y, frame) < (h - 0.3) * 3) ctx.fillRect(x * CELL, y * CELL, CELL, CELL)
      }
      // fire inside the hole + embers on its edges
      ctx.globalCompositeOperation = 'source-over'
      for (let i = 0; i < heat.length; i++) {
        const h = heat[i]
        if (h < 0.22) continue
        const x = i % cols, y = (i / cols) | 0
        const r = hash(x, y, frame)
        if (h > 0.62) {
          if (r < 0.5 + (h - 0.62) * 0.7) {
            ctx.fillStyle = h > 1.12 && r < 0.3 ? '#fff3e2'
              : mask[i] ? (r < 0.07 ? '#38ff9c' : r < 0.15 ? '#ff2d6f' : r < 0.62 ? '#ff4a1c' : '#ff9a2e')
              : r < 0.35 ? '#b82c14' : '#4a1208'
            ctx.fillRect(x * CELL, y * CELL, CELL, CELL)
          }
          continue
        }
        if (mask[i] && r < 0.5) {
          ctx.fillStyle = h > 0.6 && r < 0.12 ? '#31a8ff' : `rgba(255,${90 + ((r * 120) | 0)},31,${0.55 + r})`
          ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1)
        } else if (!mask[i] && r < 0.06 * h) {
          ctx.fillStyle = 'rgba(255,90,31,0.8)'
          ctx.fillRect(x * CELL + 1, y * CELL + 1, 2, 2)
        }
      }
    }

    const tick = (now: number) => {
      raf = 0
      if (!visible || !cols) return
      frame = (frame + 1) % 1000
      const idle = now - ptr.last > 2200 || !ptr.inside
      if (!idle) addHeat(ptr.x, ptr.y, coarse ? Math.max(60, W * 0.13) : Math.max(56, W * 0.06), 0.38)
      else {
        // autonomous probe
        const t = now * 0.00035
        addHeat(W * (0.5 + 0.42 * Math.sin(t * 1.3)), H * (0.5 + 0.38 * Math.sin(t * 2.1 + 1)), coarse ? Math.max(48, W * 0.1) : Math.max(40, W * 0.035), 0.26)
      }
      for (let i = 0; i < heat.length; i++) if (heat[i] > 0) heat[i] = Math.max(0, heat[i] * 0.972 - 0.002)
      draw()
      raf = requestAnimationFrame(tick)
    }
    const start = () => { if (!raf && visible && !reduce) raf = requestAnimationFrame(tick) }

    const onMove = (e: PointerEvent | TouchEvent) => {
      const r = cv.getBoundingClientRect()
      const pt = 'touches' in e ? e.touches[0] : e
      if (!pt) return
      ptr.x = pt.clientX - r.left; ptr.y = pt.clientY - r.top
      ptr.inside = ptr.x > -80 && ptr.y > -80 && ptr.x < r.width + 80 && ptr.y < r.height + 80
      ptr.last = performance.now()
      start()
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start() })
    const ro = new ResizeObserver(() => layout())
    document.fonts?.ready.then(() => layout())
    layout()
    io.observe(el); ro.observe(el)
    const onTap = (e: PointerEvent) => {
      onMove(e)
      if (ptr.inside) addHeat(ptr.x, ptr.y, coarse ? W * 0.16 : W * 0.08, 0.9) // burst
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    cv.addEventListener('pointerdown', onTap)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchmove', onMove)
      cv.removeEventListener('pointerdown', onTap)
    }
  }, [lines])

  return (
    <div ref={wrap} className={`relative w-full ${className}`}>
      <canvas ref={canvas} className="block w-full" aria-hidden />
    </div>
  )
}
