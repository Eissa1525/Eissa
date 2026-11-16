import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '../data/siteData';
import { days, sessions, type Day } from '../data/schedule';
import { programs, type Program } from '../data/programs';
import { SectionHead } from '../components/ui/primitives';
import { useJoin } from '../components/layout/JoinModal';

const chip = (on: boolean) => `cursor-target shrink-0 border px-4 py-2.5 label transition-colors ${on ? 'border-accent bg-accent !text-void' : 'hairline !text-bone/80 hover:border-bone/50'}`;

export default function Schedule() {
  const [day, setDay] = useState<Day | 'All'>('Mon');
  const [cat, setCat] = useState<Program['id'] | 'all'>('all');
  const join = useJoin();
  const list = useMemo(() => sessions.filter((s) => (day === 'All' || s.day === day) && (cat === 'all' || s.category === cat)), [day, cat]);
  const name = (id: Program['id']) => programs.find((p) => p.id === id)!.name;

  return (
    <section id="schedule" className="relative bg-void py-24 md:py-36">
      <SectionHead eyebrow={site.schedule.eyebrow} title={site.schedule.title} />
      <p className="gutter mt-6 label !text-accent">{site.schedule.demoNotice}</p>

      <div className="gutter mt-10 grid gap-4">
        <div role="group" aria-label="Filter by day" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)]">
          {(['All', ...days] as const).map((d) => <button key={d} type="button" aria-pressed={day === d} onClick={() => setDay(d)} className={chip(day === d)}>{d}</button>)}
        </div>
        <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)]">
          <button type="button" aria-pressed={cat === 'all'} onClick={() => setCat('all')} className={chip(cat === 'all')}>All categories</button>
          {programs.map((p) => <button key={p.id} type="button" aria-pressed={cat === p.id} onClick={() => setCat(p.id)} className={chip(cat === p.id)}>{p.name}</button>)}
        </div>
      </div>

      <div className="gutter mt-10" aria-live="polite">
        <p className="label mb-3 tabular-nums">{list.length} session{list.length === 1 ? '' : 's'}</p>
        <ul className="border-t hairline">
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((s) => (
              <motion.li key={`${s.day}-${s.time}-${s.title}`} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 gap-y-1 border-b hairline py-4 transition-colors hover:bg-carbon md:grid-cols-[6rem_5rem_1fr_10rem_7rem_6rem_auto] md:px-3 md:py-5">
                <span className="display text-2xl tabular-nums md:text-3xl">{s.time}</span>
                <span className="label hidden md:block">{s.day}</span>
                <span className="min-w-0">
                  <span className="block truncate text-lg font-semibold" style={{ fontStretch: '80%' }}>{s.title}</span>
                  <span className="label md:hidden">{s.day} · {name(s.category)} · {s.duration} min</span>
                </span>
                <span className="label hidden !text-accent md:block">{name(s.category)}</span>
                <span className="hidden text-sm text-titanium md:block">{s.coach}</span>
                <span className="hidden text-sm tabular-nums text-titanium md:block">{s.duration} min</span>
                <button type="button" onClick={() => join.open()} className="cursor-target border hairline px-3 py-2 label !text-bone transition-colors hover:border-accent hover:!text-accent">Enquire</button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {list.length === 0 && <p className="py-10 text-titanium">No sessions match these filters. <button type="button" className="text-accent underline" onClick={() => { setDay('All'); setCat('all'); }}>Clear filters</button></p>}
      </div>
    </section>
  );
}
