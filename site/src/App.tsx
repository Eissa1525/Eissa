import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './lib/gsap'
import { appReady, scroll } from './lib/store'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Tunnel from './components/Tunnel'
import VelocityMarquee from './components/VelocityMarquee'
import Capabilities from './components/Capabilities'
import WorkIndex from './components/WorkIndex'
import Recognition from './components/Recognition'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: 0 }, autoRaf: false })
    lenis.on('scroll', (l: Lenis) => {
      scroll.velocity = l.velocity
      ScrollTrigger.update()
    })
    const raf = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    lenis.stop()
    const off = appReady.on(() => lenis.start())
    // تهدئة السرعة عند التوقف
    const decay = () => { scroll.velocity *= 0.9 }
    gsap.ticker.add(decay)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => {
      off()
      gsap.ticker.remove(raf)
      gsap.ticker.remove(decay)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Tunnel />
        <VelocityMarquee />
        <Capabilities />
        <WorkIndex />
        <Recognition />
      </main>
      <Footer />
    </>
  )
}
