import type { LucideIcon } from 'lucide-react'
import { cx } from '../lib/cx'

type Hue = 'purple' | 'blue' | 'orange'


const CHIP: Record<Hue, string> = {
  purple: 'bg-recall',
  blue: 'bg-checks',
  orange: 'bg-lessons',
}

/**
 * 36px icon chip in the saturated hue → stat → muted label.
 * Three of these sit side by side inside a lesson sheet.
 */
export function MetricTile({
  icon: Icon,
  stat,
  label,
  hue,
  mono,
}: {
  icon: LucideIcon
  stat: string
  label: string
  hue: Hue
  mono?: boolean
}) {
  return (
    <div className="min-w-0 flex-1 rounded-tile bg-raised p-3 md:p-4">
      <div className={cx('grid size-8 place-items-center rounded-control', CHIP[hue])}>
        <Icon size={16} strokeWidth={2.4} className="text-on-fill" aria-hidden />
      </div>
      {/* Tabular value, secondary label — the reference's metric tile. */}
      <div className={cx('mt-2.5 t-stat text-ink', mono && 'mono')}>{stat}</div>
      <div className="t-meta text-faint">{label}</div>
    </div>
  )
}
