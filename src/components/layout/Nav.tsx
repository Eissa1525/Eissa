import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { site } from '../../data/siteData';
import { useScroll } from '../../lib/scroll';

export default function Nav() {
  const bar = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const scroll = useScroll();

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        gsap.set(bar.current, { scaleX: self.progress });
        setSolid(self.scroll() > window.innerHeight * 0.6);
        // tuck the bar away when reading downward, bring it back on the way up
        gsap.to(header.current, { yPercent: self.direction === 1 && self.scroll() > 400 ? -110 : 0, duration: 0.45, ease: 'power3.out', overwrite: true });
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!open) return;
    scroll.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { scroll.start(); window.removeEventListener('keydown', onKey); };
  }, [open, scroll]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70] h-[2px]" aria-hidden><div ref={bar} className="h-full origin-left scale-x-0 bg-accent" /></div>
      <header ref={header} className={`fixed inset-x-0 top-0 z-[65] transition-colors duration-500 ${solid && !open ? 'bg-void/80 backdrop-blur-md' : ''}`}>
        <div className="gutter flex h-16 items-center justify-between md:h-20">
          <a href="#hero" className="cursor-target text-[1.05rem] font-extrabold tracking-tight" style={{ fontStretch: '75%' }} aria-label={`${site.brand.name} — top`}>
            {site.brand.left}<span className="text-accent">//</span>{site.brand.right}
          </a>
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {site.nav.map((n) => (
              <a key={n.href} href={n.href} className="label cursor-target !text-bone/70 transition-colors hover:!text-accent">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={site.navCta.href} className="btn btn-primary cursor-target !px-5 !py-3">{site.navCta.label}</a>
            <button type="button" className="grid h-11 w-11 place-items-center border hairline xl:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="fixed inset-0 z-[64] flex flex-col justify-end bg-void gutter pb-10 pt-24 xl:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
            <nav aria-label="Mobile" className="flex flex-col">
              {site.nav.map((n, i) => (
                <motion.a key={n.href} href={n.href} onClick={() => setOpen(false)} className="display flex items-baseline gap-4 border-b hairline py-3 text-[clamp(2.2rem,11vw,4rem)]"
                  initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <span className="label !text-accent">{String(i + 1).padStart(2, '0')}</span>{n.label}
                </motion.a>
              ))}
            </nav>
            <p className="label mt-8">{site.brand.tagline}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
