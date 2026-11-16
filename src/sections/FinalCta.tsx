import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { site } from '../data/siteData';
import { media } from '../data/assets';
import { MagneticLink, Picture } from '../components/ui/primitives';
import SplitText from '../components/reactbits/SplitText';
import { useJoin } from '../components/layout/JoinModal';

export default function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const join = useJoin();
  const f = site.finalCta;

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(q('[data-bg]'), { yPercent: -12, scale: 1.2 }, { yPercent: 12, scale: 1.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from(q('[data-fade]'), { opacity: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 45%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section id="join" ref={root} className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-void">
      <div data-bg className="absolute inset-0 will-change-transform" aria-hidden>
        <Picture image={media.img.mistBarbell} sizes="100vw" className="h-full w-full object-cover [filter:contrast(1.15)_brightness(0.7)]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_0%,rgba(5,5,6,.55)_55%,var(--iv-void)_100%)]" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-void to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-void via-void/70 to-transparent" aria-hidden />

      <div className="relative gutter pb-16 pt-40 md:pb-24">
        <h2 className="display display-xl" aria-label={f.headline.join(' ')}>
          <SplitText tag="span" text={f.headline[0]} className="block" splitType="chars" effect="rise" mask delay={28} duration={1.1} ease="power4.out" threshold={0.3} textAlign="left" />
          <SplitText tag="span" text={f.headline[1]} className="block text-accent" splitType="chars" effect="rise" mask delay={28} duration={1.1} ease="power4.out" threshold={0.3} textAlign="left" />
        </h2>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p data-fade className="max-w-md text-lg text-bone/85" style={{ fontStretch: '88%' }}>{f.sub}</p>
          <div data-fade><MagneticLink onClick={() => join.open()} className="!px-8 !py-5 !text-[.8rem]">{f.button}</MagneticLink></div>
        </div>
      </div>
    </section>
  );
}
