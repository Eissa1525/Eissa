import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { site } from '../../data/siteData';
import credits from '../../../ASSET_CREDITS.md?raw';

export default function Footer() {
  const [showCredits, setShowCredits] = useState(false);
  return (
    <footer className="relative z-[3] border-t hairline bg-void">
      <div className="gutter grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="display display-md">{site.brand.left}<span className="text-accent">//</span>{site.brand.right}</p>
          <p className="label mt-4">{site.brand.tagline}</p>
          <p className="mt-8 max-w-sm text-sm text-titanium">{site.footer.legal}</p>
        </div>
        <nav className="md:col-span-3" aria-label="Footer">
          <p className="label mb-5">Navigate</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
            {[...site.nav, { label: 'Join', href: '#join' }].map((n) => (
              <li key={n.href}><a href={n.href} className="cursor-target text-bone/80 transition-colors hover:text-accent">{n.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="label mb-5">Contact <span className="text-accent">(demo)</span></p>
          <address className="grid gap-1 not-italic text-bone/80">
            <a href={`mailto:${site.contact.email}`} className="hover:text-accent">{site.contact.email}</a>
            <span>{site.contact.phone}</span>
            <span className="mt-3 text-titanium">{site.contact.address.join(', ')}</span>
          </address>
          <dl className="mt-6 grid gap-1 text-sm">
            {site.contact.hours.map((h) => (
              <div key={h.label} className="flex justify-between border-b hairline py-2"><dt className="text-titanium">{h.label}</dt><dd className="tabular-nums">{h.value}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      <div className="gutter flex flex-col gap-3 border-t hairline py-6 label md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} {site.brand.name} — concept</span>
        <div className="flex gap-6">
          <button type="button" className="label cursor-target hover:!text-accent" onClick={() => setShowCredits(true)}>{site.footer.creditsLabel}</button>
          <a href="#hero" className="cursor-target hover:!text-accent">Back to top ↑</a>
        </div>
      </div>
      <AnimatePresence>
        {showCredits && (
          <motion.div className="fixed inset-0 z-[95] grid place-items-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && setShowCredits(false)} data-lenis-prevent>
            <div role="dialog" aria-modal="true" aria-label="Asset credits" className="relative max-h-[86svh] w-full max-w-3xl overflow-y-auto border hairline bg-carbon p-6 md:p-10">
              <button type="button" autoFocus onClick={() => setShowCredits(false)} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center border hairline hover:border-accent hover:text-accent"><X size={16} /></button>
              <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-bone/80">{credits}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
