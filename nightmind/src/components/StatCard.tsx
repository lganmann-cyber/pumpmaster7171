import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'
import type { IconName } from '../lib/icons'

type Tone = 'primary' | 'secondary' | 'tertiary'

const TONE: Record<Tone, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
}

/**
 * The 2-up dashboard card: glyph and mono value on the top row, caps label
 * pinned to the bottom. Fixed 120px so a pair never sits unevenly.
 */
export function StatCard({
  icon,
  value,
  label,
  tone = 'primary',
  onClick,
}: {
  icon: IconName
  value: string
  label: string
  tone?: Tone
  onClick?: () => void
}) {
  const m = useMotionProfile()
  const Tag = onClick ? motion.button : motion.div
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick, whileTap: m.press } : {})}
      transition={m.t(120)}
      className="glass-card flex h-[120px] flex-col justify-between rounded-card p-md text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <Icon name={icon} size={24} className={TONE[tone]} />
        <span className={cx('t-stats-sm', TONE[tone])}>{value}</span>
      </div>
      <div className="t-label-caps tracking-wider text-on-variant uppercase">{label}</div>
    </Tag>
  )
}
