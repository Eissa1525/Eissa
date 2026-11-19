import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ScrollTrigger } from '../animations/gsap'
import { initLenis, scrollToTop } from '../lib/lenis'
import { site } from '../data/site'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Cursor from '../components/Cursor'
import Preloader from '../components/Preloader'

const curtain = {
  initial: { clipPath: 'inset(0% 0% 0% 0%)' },
  animate: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const, delay: 0.05 } },
  exit: { clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const } },
}

export default function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()

  useEffect(() => initLenis(), [])
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // per-route document title
  useLayoutEffect(() => {
    const seg = location.pathname.split('/').filter(Boolean)
    document.title = seg.length ? `${seg[seg.length - 1].replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())} — ${site.studio}` : site.seo.title
  }, [location.pathname])

  return (
    <>
      <a href="#main" className="label fixed top-2 left-2 z-[200] -translate-y-20 rounded bg-fg px-3 py-2 text-ink focus:translate-y-0">
        Skip to content
      </a>
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          scrollToTop()
          requestAnimationFrame(() => ScrollTrigger.refresh())
        }}
      >
        <motion.div key={location.pathname} className="relative">
          <main id="main">{outlet}</main>
          <Footer />
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[95] bg-panel"
            variants={curtain}
            initial={location.key === 'default' ? false : 'initial'}
            animate="animate"
            exit="exit"
          />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
