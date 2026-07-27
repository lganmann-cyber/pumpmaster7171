import type { LucideIcon } from 'lucide-react'
import { cx } from '../lib/cx'

type Hue = 'purple' | 'blue' | 'orange'

const TINT: Record<Hue, string> = {
  purple: 'bg-purple-tint',
  blue: 'bg-blue-tint',
  orange: 'bg-orange-tint',
}
const CHIP: Record<Hue, string> = {
  purple: 'bg-purple',
  blue: 'bg-blue',
  orange: 'bg-orange',
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
    <div className={cx('min-w-0 flex-1 rounded-tile p-3 md:p-4', TINT[hue])}>
      <div className={cx('grid size-9 place-items-center rounded-chip', CHIP[hue])}>
        <Icon size={18} strokeWidth={2} className="text-on-fill" aria-hidden />
      </div>
      {/* Three tiles to a 350px row: the stat steps down on phones and takes
          the full 26/700 back once there is room. */}
      <div
        className={cx(
          'mt-3 text-[18px] leading-tight font-bold tracking-tight text-ink md:t-stat',
          mono && 'mono',
        )}
      >
        {stat}
      </div>
      <div className="t-meta text-muted">{label}</div>
    </div>
  )
}
