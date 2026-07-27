import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

type Hue = 'purple' | 'blue' | 'orange'

const TINT: Record<Hue, string> = {
  purple: 'text-purple-bright',
  blue: 'text-blue',
  orange: 'text-orange',
}

/**
 * Metric tile — a grouped card, not a colour slab. A tinted glyph and label on
 * top, a big tabular value under it, an optional sub. Colour appears at glyph
 * scale only; the rings own the light.
 */
export function StatCard({
  label,
  value,
  hue,
  icon: Icon,
  footnote,
  onClick,
}: {
  label: string
  value: string
  hue: Hue
  icon?: LucideIcon
  footnote?: string
  onClick?: () => void
  /** kept for call-site compatibility — all numerals are tabular now */
  mono?: boolean
}) {
  const m = useMotionProfile()
  const Tag = onClick ? motion.button : motion.div
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick, whileTap: m.press } : {})}
      transition={m.t(120)}
      className={cx(
        'flex min-h-[92px] flex-col gap-2 rounded-tile bg-surface p-4 text-left',
        onClick && 'cursor-pointer',
      )}
    >
      <div className={cx('flex items-center gap-1.5', TINT[hue])}>
        {Icon ? <Icon size={15} strokeWidth={2.4} aria-hidden /> : null}
        <span className="t-meta font-semibold">{label}</span>
      </div>
      <div className="t-stat text-ink">{value}</div>
      {footnote ? <div className="t-meta text-faint">{footnote}</div> : null}
    </Tag>
  )
}
