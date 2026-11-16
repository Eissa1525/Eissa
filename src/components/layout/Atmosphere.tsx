import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import LightRays, { type RaysOrigin } from '../reactbits/LightRays';
import { theme } from '../../config/theme';
import { useIsMobile, useReducedMotion } from '../../lib/device';

/**
 * One managed background for the whole page: a single React Bits <LightRays> canvas, fixed behind
 * the UI and screen-blended, whose colour / intensity / origin follow the section in view.
 * It never receives pointer events.
 */
export default function Atmosphere() {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const first = theme.atmosphere.hero;
  const [look, setLook] = useState({ color: first.color, intensity: first.intensity, origin: first.origin as RaysOrigin });
  const live = useRef({ intensity: first.intensity, color: new THREE.Color(first.color) });
  const current = useRef('hero');

  useEffect(() => {
    const go = (id: string) => {
      const next = theme.atmosphere[id];
      if (!next || current.current === id) return;
      current.current = id;
      const push = (origin?: RaysOrigin) => setLook((l) => ({ color: '#' + live.current.color.getHexString(), intensity: live.current.intensity, origin: origin ?? l.origin }));
      const target = new THREE.Color(next.color);
      gsap.killTweensOf(live.current);
      gsap.timeline()
        .to(live.current, { intensity: 0.05, duration: reduced ? 0 : 0.45, ease: 'power2.in', onUpdate: () => push() })
        .add(() => { live.current.color.copy(target); push(next.origin as RaysOrigin); })
        .to(live.current, { intensity: next.intensity, duration: reduced ? 0 : 1.1, ease: 'power2.out', onUpdate: () => push() });
    };
    // whichever section crosses the middle of the viewport owns the atmosphere
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && go(e.target.id)), { rootMargin: '-50% 0px -50% 0px' });
    const watch = () => Object.keys(theme.atmosphere).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    watch();
    const mo = new MutationObserver(watch); // lazy sections mount later
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); gsap.killTweensOf(live.current); };
  }, [reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[4] mix-blend-screen" aria-hidden>
      <LightRays
        raysOrigin={look.origin} raysColor={look.color} intensity={look.intensity}
        raysSpeed={reduced ? 0 : 0.55} lightSpread={0.85} rayLength={mobile ? 1.6 : 2.1} fadeDistance={1.1}
        followMouse={!mobile && !reduced} mouseInfluence={0.12} noiseAmount={0.06} distortion={0.03}
        pulsating={false} clickPulse={false} cursorShadow={false} intro={false}
        maxDevicePixelRatio={mobile ? 1 : 1.25} opacity={mobile ? 0.55 : 0.7}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
