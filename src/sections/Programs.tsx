import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '../data/siteData';
import { programs } from '../data/programs';
import { LazyVideo, MagneticLink, Picture, SectionHead } from '../components/ui/primitives';
import GlareHover from '../components/reactbits/GlareHover';

const wipe = { initial: { clipPath: 'inset(0 0 100% 0)' }, animate: { clipPath: 'inset(0 0 0% 0)' }, exit: { clipPath: 'inset(100% 0 0 0)' } };

export default function Programs() {
  const [active, setActive] = useState(0);
  const p = programs[active];
  return (
    <section id="programs" className="relative bg-void py-24 md:py-36">
      <SectionHead eyebrow={site.programs.eyebrow} title={site.programs.title} />
      <div className="gutter mt-12 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        {/* category selector */}
        <div role="tablist" aria-label="Training programs" className="no-scrollbar -mx-[var(--gutter)] flex min-w-0 gap-6 overflow-x-auto px-[var(--gutter)] lg:col-span-5 lg:mx-0 lg:block lg:px-0">
          {programs.map((it, i) => (
            <button key={it.id} type="button" role="tab" id={`tab-${it.id}`} aria-selected={i === active} aria-controls="program-panel" onClick={() => setActive(i)}
              className="cursor-target group flex shrink-0 items-baseline gap-4 text-left lg:w-full lg:border-b lg:hairline lg:py-3">
              <span className={`label transition-colors ${i === active ? '!text-accent' : ''}`}>{it.index}</span>
              <span className={`display text-[clamp(2rem,6.4vw,6.2rem)] transition-all duration-500 ${i === active ? 'text-bone lg:translate-x-3' : 'outline-text group-hover:text-bone/40'}`}>{it.name}</span>
            </button>
          ))}
        </div>

        {/* panel */}
        <div id="program-panel" role="tabpanel" aria-labelledby={`tab-${p.id}`} className="grid min-w-0 gap-8 md:grid-cols-2 lg:col-span-7">
          <GlareHover width="100%" height="auto" background="transparent" borderRadius="0px" borderColor="transparent" glareColor="#ffffff" glareOpacity={0.16} glareSize={260} className="!block aspect-[4/5] w-full bg-graphite">
            <div className="relative h-full w-full overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.div key={p.id} className="absolute inset-0" {...wipe} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
                  {p.video
                    ? <LazyVideo src={p.video.src} poster={p.video.poster} className="h-full w-full object-cover [filter:grayscale(0.35)_contrast(1.08)_brightness(0.82)]" />
                    : <Picture image={p.image} sizes="(min-width:1024px) 28vw, (min-width:768px) 50vw, 100vw" className="h-full w-full object-cover [filter:grayscale(0.35)_contrast(1.08)_brightness(0.82)]" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
              <p className="label absolute bottom-4 left-4 !text-bone">{p.index} — {p.name}</p>
            </div>
          </GlareHover>

          <AnimatePresence mode="wait">
            <motion.div key={p.id} className="flex flex-col" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
              <h3 className="display display-sm">{p.line}</h3>
              <p className="mt-5 text-titanium">{p.body}</p>
              <ul className="mt-6 grid gap-2">
                {p.focus.map((f) => <li key={f} className="flex items-center gap-3 text-bone/85"><span className="h-px w-5 bg-accent" />{f}</li>)}
              </ul>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t hairline pt-5">
                {p.format.map((f) => <div key={f.label}><dt className="label">{f.label}</dt><dd className="mt-1 text-lg font-semibold" style={{ fontStretch: '80%' }}>{f.value}</dd></div>)}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
                <MagneticLink href={p.cta.href}>{p.cta.label}</MagneticLink>
                <MagneticLink href="#membership" variant="ghost" arrow={false}>Membership</MagneticLink>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
