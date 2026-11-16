import { useRef, type ComponentProps, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import Magnet from '../reactbits/Magnet';
import { useIsTouch, useReducedMotion } from '../../lib/device';
import type { Img } from '../../data/assets';

/** Magnetic CTA. On touch / reduced motion it is a plain button — no hover simulation. */
export function MagneticLink({ href, children, variant = 'primary', className = '', onClick, arrow = true }: {
  href?: string; children: ReactNode; variant?: 'primary' | 'ghost'; className?: string; onClick?: () => void; arrow?: boolean;
}) {
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const cls = `btn btn-${variant} cursor-target ${className}`;
  const inner = href
    ? <a href={href} className={cls} onClick={onClick}>{children}{arrow && <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />}</a>
    : <button type="button" className={cls} onClick={onClick}>{children}{arrow && <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />}</button>;
  if (touch || reduced) return inner;
  return <Magnet padding={48} magnetStrength={3} wrapperClassName="inline-block">{inner}</Magnet>;
}

export function Picture({ image, className = '', sizes = '100vw', eager = false, ...rest }: { image: Img; sizes?: string; eager?: boolean } & Omit<ComponentProps<'img'>, 'src' | 'srcSet' | 'alt'>) {
  return <img src={image.src} srcSet={image.srcSet} sizes={sizes} alt={image.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} draggable={false} {...rest} />;
}

/** Section heading block: mono eyebrow + condensed display title with a masked line reveal. */
export function SectionHead({ eyebrow, title, children, className = '' }: { eyebrow: string; title: string; children?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(ref.current!.querySelectorAll('[data-rise]'), {
        yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
      });
    });
    return () => mm.revert();
  }, { scope: ref });
  return (
    <div ref={ref} className={`gutter ${className}`}>
      <p className="label mb-5 flex items-center gap-3"><span className="inline-block h-px w-8 bg-accent" />{eyebrow}</p>
      <h2 className="display display-lg overflow-hidden pb-[0.06em]"><span data-rise className="block">{title}</span></h2>
      {children && <div className="mt-6 max-w-xl text-titanium overflow-hidden"><div data-rise>{children}</div></div>}
    </div>
  );
}

/** Tracks the pointer inside an element and exposes it as --lx / --ly for the `.lit` hover light. */
export function litMove(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--lx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--ly', `${e.clientY - r.top}px`);
}

/** Video that only loads + plays while on screen. */
export function LazyVideo({ src, poster, className = '', active = true }: { src: string; poster: string; className?: string; active?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useGSAP(() => {
    const v = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && active) { if (!v.src) v.src = src; v.play().catch(() => {}); }
      else v.pause();
    }, { rootMargin: '200px' });
    io.observe(v);
    return () => io.disconnect();
  }, [src, active]);
  return <video ref={ref} poster={poster} muted loop playsInline preload="none" className={className} aria-hidden />;
}
