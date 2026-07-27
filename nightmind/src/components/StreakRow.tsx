import { motion } from 'framer-motion'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

/**
 * Full-width --surface pill: glyph, caption over a bold statement, chevron.
 * The statement carries times, so it runs in the mono face.
 */
export function StreakRow({
  icon: Icon,
  caption,
  statement,
  onClick,
  mono = true,
  hue = 'purple',
}: {
  icon: LucideIcon
  caption: string
  statement: string
  onClick?: () => void
  mono?: boolean
  hue?: 'purple' | 'blue' | 'orange'
}) {
  const m = useMotionProfile()
  const tint = {
    purple: 'bg-purple-tint text-purple-bright',
    blue: 'bg-blue-tint text-blue',
    orange: 'bg-orange-tint text-orange',
  }[hue]

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={m.press}
      transition={m.t(120)}
      className="flex w-full items-center gap-3 rounded-tile bg-surface p-4 text-left"
    >
      <span className={cx('grid size-9 shrink-0 place-items-center rounded-chip', tint)}>
        <Icon size={17} strokeWidth={2.2} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block t-meta text-muted">{caption}</span>
        <span className={cx('block truncate t-body-strong text-ink', mono && 'mono')}>
          {statement}
        </span>
      </span>
      <ChevronRight size={20} className="shrink-0 text-muted" aria-hidden />
    </motion.button>
  )
}
