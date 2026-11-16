import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { site } from '../data/siteData';
import { media } from '../data/assets';
import { Picture } from '../components/ui/primitives';
import ScrollVelocity from '../components/reactbits/ScrollVelocity';
import { useReducedMotion } from '../lib/device';

export default function Philosophy() {
  const root = useRef<HTMLElement>(null);
  const p = site.philosophy;
  const reduced = useReducedMotion();

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // statement lights up word by word as it is read
      gsap.fromTo(q('[data-word]'), { opacity: 0.14 }, { opacity: 1, stagger: 0.06, ease: 'none', scrollTrigger: { trigger: q('[data-statement]')[0], start: 'top 80%', end: 'bottom 45%', scrub: 0.5 } });
      // image masks open, then the photographs drift at different rates
      q('[data-mask]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        gsap.fromTo(el.querySelector('img'), { yPercent: -9, scale: 1.18 }, { yPercent: 9, scale: 1.18, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      gsap.to(q('[data-drift="a"]'), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to(q('[data-drift="b"]'), { yPercent: 16, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from(q('[data-col]'), { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: q('[data-cols]')[0], start: 'top 85%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section id="philosophy" ref={root} className="relative overflow-x-clip bg-void pb-24 pt-28 md:pb-40 md:pt-44">
      <div className="gutter grid gap-y-16 md:grid-cols-12 md:gap-x-8">
        <p className="label md:col-span-12"><span className="mr-3 inline-block h-px w-8 bg-accent align-middle" />{p.eyebrow}</p>

        <p data-statement className="md:col-span-8 text-[clamp(1.9rem,4.3vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.015em]" style={{ fontStretch: '72%' }}>
          {p.statement.split(' ').map((w, i) => <span key={i} data-word className="inline-block whitespace-pre">{w} </span>)}
        </p>

        <figure data-drift="a" className="md:col-span-4 md:col-start-9 md:row-span-2 md:mt-24">
          <div data-mask className="aspect-[3/4] overflow-hidden bg-graphite">
            <Picture image={media.img.philosophyA} sizes="(min-width:768px) 33vw, 100vw" className="h-full w-full object-cover" />
          </div>
          <figcaption className="label mt-3 flex justify-between"><span>Fig. 01</span><span>Load is honest</span></figcaption>
        </figure>

        <figure data-drift="b" className="md:col-span-5 md:col-start-2">
          <div data-mask className="aspect-[16/10] overflow-hidden bg-graphite">
            <Picture image={media.img.philosophyB} sizes="(min-width:768px) 42vw, 100vw" className="h-full w-full object-cover" />
          </div>
          <figcaption className="label mt-3 flex justify-between"><span>Fig. 02</span><span>The platform</span></figcaption>
        </figure>
      </div>

      <div data-cols className="gutter mt-20 grid gap-10 border-t hairline pt-10 md:mt-32 md:grid-cols-3 md:gap-8">
        {p.columns.map((c, i) => (
          <div key={c.title} data-col>
            <p className="label mb-4 !text-accent">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="display display-sm mb-4">{c.title}</h3>
            <p className="max-w-sm text-titanium">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-24 select-none md:mt-36" aria-hidden>
        <ScrollVelocity
          texts={[p.marquee.join(' // ') + ' //', p.marquee.slice().reverse().join(' // ') + ' //']}
          velocity={reduced ? 0 : 55} numCopies={4} outlineAlternate fadeEdges={false} gap={28}
          className="display" fontSize="clamp(3.5rem, 11vw, 11rem)" color="var(--iv-bone)"
        />
      </div>
    </section>
  );
}
