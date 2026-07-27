import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

export type MilestoneItem = {
  id: string
  label: string
  nights: number
  earned: boolean
  current?: boolean
}

/**
 * The milestone badge grid. Earned badges are coral on cream; unearned sit at
 * low contrast, so the row reads as a ladder rather than a scoreboard.
 */
export function MilestoneGrid({
  items,
  onSelect,
  selectedId,
}: {
  items: MilestoneItem[]
  onSelect?: (id: string) => void
  selectedId?: string
}) {
  const m = useMotionProfile()
  return (
    <ul className="grid grid-cols-4 gap-3">
      {items.map((item, i) => {
        const selected = item.id === selectedId
        return (
          <li key={item.id}>
            <motion.button
              type="button"
              onClick={() => onSelect?.(item.id)}
              whileTap={m.press}
              initial={m.full ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={m.t(300, i * 40)}
              aria-pressed={selected}
              className={cx(
                'flex w-full min-h-[92px] flex-col items-center justify-center gap-2 rounded-tile p-2',
                selected ? 'bg-surface ring-2 ring-accent' : 'bg-surface',
                !item.earned && 'opacity-45',
              )}
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <span
                className={cx(
                  'grid size-9 place-items-center rounded-full',
                  item.earned ? 'bg-accent-tint text-accent' : 'bg-sunken text-muted',
                )}
              >
                <Icon name={item.earned ? 'self_improvement' : 'lock'} size={18} fill={item.earned} />
              </span>
              <span className="t-meta text-center leading-tight text-ink">{item.label}</span>
            </motion.button>
          </li>
        )
      })}
    </ul>
  )
}
