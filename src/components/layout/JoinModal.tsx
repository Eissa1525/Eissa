import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { site } from '../../data/siteData';
import { plans } from '../../data/memberships';
import { programs } from '../../data/programs';
import { useScroll } from '../../lib/scroll';

const JoinCtx = createContext<{ open: (planId?: string) => void }>({ open: () => {} });
export const useJoin = () => useContext(JoinCtx);

type Errors = Partial<Record<'name' | 'email', string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function JoinProvider({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false);
  const [plan, setPlan] = useState(plans.find((p) => p.featured)?.id ?? plans[0].id);
  const open = useCallback((planId?: string) => { if (planId) setPlan(planId); setShown(true); }, []);
  return (
    <JoinCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>{shown && <Dialog plan={plan} setPlan={setPlan} close={() => setShown(false)} />}</AnimatePresence>
    </JoinCtx.Provider>
  );
}

function Dialog({ plan, setPlan, close }: { plan: string; setPlan: (p: string) => void; close: () => void }) {
  const scroll = useScroll();
  const panel = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    scroll.stop();
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>('input')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // keep focus inside the dialog
        const f = panel.current!.querySelectorAll<HTMLElement>('a,button,input,select,textarea');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { scroll.start(); window.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [close, scroll]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get('name') ?? '').trim();
    const email = String(d.get('email') ?? '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Please enter your name.';
    if (!EMAIL.test(email)) next.email = 'Please enter a valid email address.';
    setErrors(next);
    if (Object.keys(next).length) { panel.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus(); return; }
    const planName = plans.find((p) => p.id === d.get('plan'))?.name ?? '';
    const body = [`Name: ${name}`, `Email: ${email}`, `Plan: ${planName}`, `Focus: ${d.get('focus')}`, '', String(d.get('message') ?? '')].join('\n');
    const href = `mailto:${site.contact.email}?subject=${encodeURIComponent(`First session request — ${planName}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(href);
  };

  const field = 'w-full border-b border-steel bg-transparent py-3 text-bone outline-none transition-colors placeholder:text-titanium/50 focus:border-accent';
  return (
    <motion.div className="fixed inset-0 z-[95] grid place-items-end bg-black/70 backdrop-blur-sm md:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && close()} data-lenis-prevent>
      <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby="join-title"
        className="relative max-h-[92svh] w-full overflow-y-auto border hairline bg-carbon p-6 md:max-w-xl md:p-10"
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center border hairline hover:border-accent hover:text-accent"><X size={16} /></button>
        <p className="label mb-3 !text-accent">Demo form</p>
        <h2 id="join-title" className="display display-sm pr-12">{site.join.title}</h2>
        <p className="mt-4 text-sm text-titanium">{site.join.demoNotice}</p>
        {sent ? (
          <div className="mt-8 border-t hairline pt-6">
            <p className="text-bone">An email draft was handed to your mail app.</p>
            <p className="mt-2 text-sm text-titanium">Nothing was sent or saved by this site. If no draft appeared, <a className="text-accent underline" href={sent}>open it again</a> or write to {site.contact.email} (a placeholder address).</p>
            <button type="button" onClick={close} className="btn btn-ghost mt-8">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8 grid gap-6">
            <label className="grid gap-1">
              <span className="label">{site.join.fields.name}</span>
              <input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
              {errors.name && <span id="err-name" role="alert" className="text-sm text-accent-hot">{errors.name}</span>}
            </label>
            <label className="grid gap-1">
              <span className="label">{site.join.fields.email}</span>
              <input name="email" type="email" autoComplete="email" inputMode="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
              {errors.email && <span id="err-email" role="alert" className="text-sm text-accent-hot">{errors.email}</span>}
            </label>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="label">{site.join.fields.plan}</span>
                <select name="plan" value={plan} onChange={(e) => setPlan(e.target.value)} className={`${field} [&>option]:bg-carbon`}>
                  {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="label">{site.join.fields.focus}</span>
                <select name="focus" className={`${field} [&>option]:bg-carbon`}>
                  {programs.map((p) => <option key={p.id}>{p.name}</option>)}
                </select>
              </label>
            </div>
            <label className="grid gap-1">
              <span className="label">{site.join.fields.message}</span>
              <textarea name="message" rows={3} className={`${field} resize-none`} />
            </label>
            <button type="submit" className="btn btn-primary justify-center">{site.join.submit}</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
