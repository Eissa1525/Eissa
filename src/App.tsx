import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollProvider } from './lib/scroll';
import { bindPointer } from './lib/store';
import { useIsTouch, useReducedMotion } from './lib/device';
import { JoinProvider } from './components/layout/JoinModal';
import Nav from './components/layout/Nav';
import Preloader from './components/layout/Preloader';
import Atmosphere from './components/layout/Atmosphere';
import Footer from './components/layout/Footer';
import TargetCursor from './components/reactbits/TargetCursor';
import { theme } from './config/theme';
import Hero from './sections/Hero';
import Philosophy from './sections/Philosophy';

// Below-the-fold sections are split so the first paint only ships the hero.
const Equipment = lazy(() => import('./sections/Equipment'));
const Programs = lazy(() => import('./sections/Programs'));
const Gallery = lazy(() => import('./sections/Gallery'));
const Experience = lazy(() => import('./sections/Experience'));
const Membership = lazy(() => import('./sections/Membership'));
const Schedule = lazy(() => import('./sections/Schedule'));
const FinalCta = lazy(() => import('./sections/FinalCta'));

export default function App() {
  const [entered, setEntered] = useState(false);
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const enter = useCallback(() => setEntered(true), []);

  useEffect(() => bindPointer(), []);
  // Lazy sections change the page height — keep ScrollTrigger measurements honest.
  useEffect(() => {
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  return (
    <ScrollProvider>
      <JoinProvider>
        <a href="#philosophy" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
        {!entered && <Preloader onDone={enter} />}
        <Atmosphere />
        <div className="pointer-glow" aria-hidden />
        <div className="grain" aria-hidden />
        {!touch && !reduced && (
          <TargetCursor targetSelector=".cursor-target" hideDefaultCursor={false} cursorColor={theme.colors.bone} cursorColorOnTarget={theme.colors.accent} spinDuration={6} size={30} />
        )}
        <Nav />
        <main className="relative z-[3] overflow-x-clip">
          <Hero entered={entered} />
          <Philosophy />
          <Suspense fallback={<div className="h-screen" />}>
            <Equipment />
            <Programs />
            <Gallery />
            <Experience />
            <Membership />
            <Schedule />
            <FinalCta />
          </Suspense>
        </main>
        <Footer />
      </JoinProvider>
    </ScrollProvider>
  );
}
