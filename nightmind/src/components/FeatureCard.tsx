import { motion } from 'framer-motion'
import { MoreHorizontal, type LucideIcon } from 'lucide-react'
import { SecondaryButtonOnColor } from './SecondaryButtonOnColor'
import { useMotionProfile } from '../lib/motion'
import { useColorSurface } from '../lib/onColor'

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
 * Exactly one per screen, ever. Full-bleed --purple, icon + eyebrow top-left,
 * overflow top-right, --ink-inverse headline centred, light pill CTA at the
 * bottom.
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
  const surface = useColorSurface('purple')
  return (
    <motion.section
      initial={m.full ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={m.t(320)}
      className={`rounded-card p-5 ${surface.className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon size={20} strokeWidth={2} aria-hidden />
          <span className="t-label font-semibold">{eyebrow}</span>
        </div>
        <button
          type="button"
          aria-label="More options"
          onClick={onOverflow}
          className="-mr-2 -mt-2 grid size-11 place-items-center rounded-full"
        >
          <MoreHorizontal size={20} aria-hidden />
        </button>
      </div>

      <h3 className="mx-auto mt-7 mb-1 max-w-[15ch] text-center t-headline">{headline}</h3>
      {meta ? <p className="text-center t-label opacity-75">{meta}</p> : null}

      <SecondaryButtonOnColor full onClick={onCta} className="mt-6">
        {cta}
      </SecondaryButtonOnColor>
    </motion.section>
  )
}
