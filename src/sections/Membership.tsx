import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Minus } from 'lucide-react';
import { site } from '../data/siteData';
import { comparison, membershipMeta, plans, type Billing } from '../data/memberships';
import { SectionHead, litMove } from '../components/ui/primitives';
import ElectricBorder from '../components/reactbits/ElectricBorder';
import { useJoin } from '../components/layout/JoinModal';
import { theme } from '../config/theme';
import { useNearView, useQuality, useReducedMotion } from '../lib/device';

export default function Membership() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [selected, setSelected] = useState(plans.find((p) => p.featured)?.id ?? plans[0].id);
  const join = useJoin();
  const quality = useQuality();
  const reduced = useReducedMotion();
  const { ref, inView } = useNearView<HTMLDivElement>('200px');
  const electric = quality === 'high' && !reduced && inView; // one small WebGL border, desktop only, only while visible

  return (
    <section id="membership" className="relative bg-void py-24 md:py-36">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHead eyebrow={site.membership.eyebrow} title={site.membership.title} />
        <div className="gutter">
          <div role="radiogroup" aria-label="Billing period" className="relative inline-grid grid-cols-2 border hairline p-1">
            {membershipMeta.billing.map((b) => (
              <button key={b.id} type="button" role="radio" aria-checked={billing === b.id} onClick={() => setBilling(b.id)}
                className={`cursor-target relative z-[1] px-6 py-3 label transition-colors ${billing === b.id ? '!text-void' : '!text-bone'}`}>
                {billing === b.id && <motion.span layoutId="billing-pill" className="absolute inset-0 -z-[1] bg-bone" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="gutter mt-8 label !text-accent">{membershipMeta.demoNotice}</p>

      <div ref={ref} role="radiogroup" aria-label="Membership plan" className="gutter mt-8 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const on = plan.id === selected;
          const card = (
            <div role="radio" aria-checked={on} tabIndex={0} onClick={() => setSelected(plan.id)} onPointerMove={litMove}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(plan.id); } }}
              className={`lit cursor-target flex h-full cursor-pointer flex-col border p-6 transition-colors duration-500 md:p-8 ${on ? 'border-accent/70 bg-graphite' : 'hairline bg-carbon hover:border-bone/40'}`}>
              <div className="flex items-start justify-between">
                <h3 className="display display-md">{plan.name}</h3>
                <span className={`mt-2 grid h-6 w-6 place-items-center rounded-full border transition-colors ${on ? 'border-accent bg-accent text-void' : 'border-steel text-transparent'}`} aria-hidden><Check size={14} strokeWidth={3} /></span>
              </div>
              <p className="mt-3 min-h-12 text-titanium">{plan.summary}</p>
              <div className="mt-8 flex items-end gap-2">
                <span className="display relative block h-[1em] overflow-hidden text-[clamp(3.5rem,6vw,5.5rem)] tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={billing} className="block" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}>
                      {membershipMeta.currency}{plan.price[billing]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="label mb-2">/ month{billing === 'yearly' ? ', billed yearly' : ''}</span>
              </div>
              <p className="label mt-2 !text-accent">Demo price</p>
              <ul className="mt-8 grid gap-2.5 border-t hairline pt-6 text-sm">
                {comparison.map((row) => {
                  const v = row.values[plan.id];
                  return (
                    <li key={row.label} className={`flex items-center justify-between gap-4 ${v === false ? 'text-titanium/50' : 'text-bone/90'}`}>
                      <span>{row.label}</span>
                      <span className="shrink-0 text-right tabular-nums">{v === true ? <Check size={15} className="text-accent" aria-label="Included" /> : v === false ? <Minus size={15} aria-label="Not included" /> : v}</span>
                    </li>
                  );
                })}
              </ul>
              <button type="button" onClick={(e) => { e.stopPropagation(); setSelected(plan.id); join.open(plan.id); }}
                className={`btn cursor-target mt-8 justify-center ${on ? 'btn-primary' : 'btn-ghost'}`}>{site.membership.cta}</button>
            </div>
          );
          return on && electric
            ? <ElectricBorder key={plan.id} color={theme.colors.accent} glowColor={theme.colors.accentHot} speed={0.8} chaos={0.5} thickness={1.5} borderRadius={0} intro={false} className="h-full" style={{ borderRadius: 0 }}>{card}</ElectricBorder>
            : <div key={plan.id} className="h-full">{card}</div>;
        })}
      </div>
    </section>
  );
}
