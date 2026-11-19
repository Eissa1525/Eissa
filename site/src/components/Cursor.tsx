import { useEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { isTouch } from '../hooks/useMedia'

// مؤشر مخصص: نقطة + حلقة، يكبر ويعرض نصاً فوق العناصر ذات data-cursor
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isTouch()) return
    const d = dot.current!
    const r = ring.current!
    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' })
    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
    }
    const setState = (text: string | null) => {
      if (text) {
        label.current!.textContent = text
        gsap.to(r, { scale: 1, width: 96, height: 96, backgroundColor: '#e4e2ec', borderColor: '#e4e2ec', duration: 0.4, ease: 'out-expo' })
        gsap.to(label.current, { autoAlpha: 1, duration: 0.25 })
        gsap.to(d, { scale: 0, duration: 0.2 })
      } else {
        gsap.to(r, { width: 36, height: 36, backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(228,226,236,.5)', duration: 0.4, ease: 'out-expo' })
        gsap.to(label.current, { autoAlpha: 0, duration: 0.15 })
        gsap.to(d, { scale: 1, duration: 0.2 })
      }
    }
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      if (el) setState(el.dataset.cursor || null)
      else if ((e.target as HTMLElement).closest('a,button')) {
        gsap.to(r, { width: 56, height: 56, duration: 0.3 })
      } else if (!document.body.dataset.cursor) setState(null)
    }
    // مراقبة data-cursor على body (تستخدمه مشاهد WebGL)
    const mo = new MutationObserver(() => setState(document.body.dataset.cursor ?? null))
    mo.observe(document.body, { attributes: true, attributeFilter: ['data-cursor'] })
    const down = () => gsap.to(r, { scale: 0.8, duration: 0.15 })
    const up = () => gsap.to(r, { scale: 1, duration: 0.3 })
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.classList.add('has-cursor')
    return () => {
      mo.disconnect()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring}><span ref={label} className="mono" /></div>
      <div className="cursor-dot" ref={dot} />
    </>
  )
}
