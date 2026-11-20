import { useRef } from 'react'
import { site } from '../../data/site'
import { useReveal } from '../../animations/useReveal'
import BriefForm from '../../components/BriefForm'
import ChannelCards from '../../components/ChannelCards'
import Icon from '../../components/icons/Icon'

export default function NewCase({ as = 'h2' }: { as?: 'h1' | 'h2' }) {
  const root = useRef<HTMLElement>(null)
  useReveal(root)
  const H = as
  return (
    <section ref={root} className="shell py-[16vh]" aria-labelledby="newcase-title">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <H id="newcase-title" data-reveal="lines" className="display text-[clamp(4rem,10vw,9.5rem)] leading-[0.82]">Open a case</H>
          <div className="h-px bg-line" />
          <p className="max-w-sm text-lead text-dim" data-reveal="fade">Tell me about the product that is hard to explain. A few lines are enough — every brief gets a personal reply.</p>
          <div className="hud flex flex-wrap items-center gap-x-6 gap-y-2" data-reveal="fade">
            <span className="flex items-center gap-2 text-faint"><span className="text-accent">//</span><span className="text-fg">New case</span></span>
            {site.replyPromise && <span className="flex items-center gap-2 text-accent"><i className="dot" />{site.replyPromise}</span>}
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-1.5 text-faint hover:text-accent">Or write to {site.contact.email}<Icon name="arrow-up-right" className="size-3.5" /></a>
            )}
          </div>
        </div>
        <div data-reveal="fade"><BriefForm /></div>
      </div>
      <div className="mt-16" data-reveal="fade"><ChannelCards /></div>
    </section>
  )
}
