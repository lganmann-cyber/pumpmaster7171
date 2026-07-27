import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'
import { useColorSurface } from '../lib/onColor'

type Hue = 'purple' | 'blue' | 'orange'

/**
 * Contrasting pair, ~180px tall. Label 14/400 at 85%, value 26/700.
 * Everything here is 14px+ bold or 18px+, per the white-on-color rule in §10.
 */
export function StatCard({
  label,
  value,
  hue,
  icon: Icon,
  footnote,
  onClick,
  mono,
}: {
  label: string
  value: string
  hue: Hue
  icon?: LucideIcon
  footnote?: string
  onClick?: () => void
  mono?: boolean
}) {
  const m = useMotionProfile()
  const surface = useColorSurface(hue)
  const Tag = onClick ? motion.button : motion.div
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick, whileTap: m.press } : {})}
      transition={m.t(120)}
      className={cx(
        'flex min-h-[180px] flex-col justify-between rounded-card p-5 text-left',
        surface.className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="t-label font-semibold">{label}</span>
        {Icon ? <Icon size={20} strokeWidth={2} aria-hidden /> : null}
      </div>
      <div>
        <div className={cx('t-stat', mono && 'mono')}>{value}</div>
        {footnote ? <div className="mt-1 t-meta font-medium opacity-85">{footnote}</div> : null}
      </div>
    </Tag>
  )
}
