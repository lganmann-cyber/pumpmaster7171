import { motion } from 'framer-motion'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { PrimaryButton } from './PrimaryButton'
import { useMotionProfile } from '../lib/motion'

type Props = {
  icon: LucideIcon
  eyebrow: string
  headline: string
  cta: string
  onCta: () => void
  onOverflow?: () => void
  meta?: string
}

/**
 * The one prominent action on a screen. It used to be a full-bleed purple slab,
 * which put a wall of saturated colour above the fold and made every screen
 * feel crammed. It is now a grouped card: tinted eyebrow, plain headline, and
 * the accent lives in the button alone.
 */
export function FeatureCard({
  icon: Icon,
  eyebrow,
  headline,
  cta,
  onCta,
  onOverflow,
  meta,
}: Props) {
  const m = useMotionProfile()
  return (
    <motion.section
      initial={m.full ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={m.t(320)}
      className="rounded-card bg-surface p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5 text-accent">
          <Icon size={15} strokeWidth={2.4} aria-hidden />
          <span className="t-eyebrow">{eyebrow}</span>
        </div>
        {onOverflow ? (
          <button
            type="button"
            aria-label="More options"
            onClick={onOverflow}
            className="-mt-1 -mr-1 grid size-11 place-items-center rounded-full text-muted"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        ) : null}
      </div>

      <h3 className="mt-2 max-w-[22ch] t-title3 text-ink">{headline}</h3>
      {meta ? <p className="mt-1 t-meta text-muted">{meta}</p> : null}

      <PrimaryButton onClick={onCta} className="mt-4">
        {cta}
      </PrimaryButton>
    </motion.section>
  )
}
