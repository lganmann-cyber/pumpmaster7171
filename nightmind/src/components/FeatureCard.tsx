import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { useMotionProfile } from '../lib/motion'
import type { IconName } from '../lib/icons'

/**
 * The 240px hero: a primary-container field with the dreamscape art blended
 * over it, headline and a white pill CTA anchored to the bottom.
 */
export function FeatureCard({
  eyebrow,
  headline,
  cta,
  ctaIcon = 'mic',
  onCta,
  art,
}: {
  eyebrow?: string
  headline: string
  cta: string
  ctaIcon?: IconName
  onCta: () => void
  art: string
}) {
  const m = useMotionProfile()
  return (
    <motion.section
      initial={m.full ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={m.t(320)}
      className="relative flex h-[240px] flex-col justify-end gap-md overflow-hidden rounded-card bg-primary-container p-lg"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
          style={{ backgroundImage: `url("${art}")` }}
        />
      </div>
      <div className="relative z-10 flex flex-col gap-sm">
        {eyebrow ? (
          <span className="t-label-caps text-on-primary-container uppercase opacity-70">
            {eyebrow}
          </span>
        ) : null}
        <h3 className="t-headline-md leading-tight text-on-primary-container">{headline}</h3>
        <motion.button
          type="button"
          onClick={onCta}
          whileTap={m.press}
          transition={m.t(120)}
          className="flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3"
        >
          <Icon name={ctaIcon} size={20} fill className="text-primary-container" />
          <span className="t-label-caps text-on-primary-container">{cta}</span>
        </motion.button>
      </div>
    </motion.section>
  )
}
