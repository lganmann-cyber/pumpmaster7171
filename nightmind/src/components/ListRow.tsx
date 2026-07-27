import { motion } from 'framer-motion'
import { ChevronRight, Lock, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

type Hue = 'purple' | 'blue' | 'orange'

const TINT: Record<Hue, string> = {
  purple: 'bg-purple-tint text-purple-bright',
  blue: 'bg-blue-tint text-blue',
  orange: 'bg-orange-tint text-orange',
}

type Props = {
  icon?: LucideIcon
  hue?: Hue
  title: string
  meta?: string
  metaMono?: boolean
  trailing?: ReactNode
  chevron?: boolean
  locked?: boolean
  onClick?: () => void
  surface?: 'sunken' | 'surface' | 'none'
  /** Long titles wrap to two lines instead of truncating. */
  wrap?: boolean
}

/** 40px tinted circle, title at 16/600, meta at 13/400 muted, trailing slot. */
export function ListRow({
  icon: Icon,
  hue = 'purple',
  title,
  meta,
  metaMono,
  trailing,
  chevron,
  locked,
  onClick,
  surface = 'sunken',
  wrap,
}: Props) {
  const m = useMotionProfile()
  const interactive = Boolean(onClick) && !locked
  const Tag = interactive ? motion.button : motion.div

  return (
    <Tag
      {...(interactive ? { type: 'button' as const, onClick, whileTap: m.press } : {})}
      transition={m.t(120)}
      aria-disabled={locked || undefined}
      className={cx(
        'flex w-full items-center gap-3 rounded-tile p-4 text-left',
        surface === 'sunken' && 'bg-surface',
        surface === 'surface' && 'bg-surface',
        locked && 'opacity-40',
      )}
    >
      {Icon ? (
        <span className={cx('grid size-9 shrink-0 place-items-center rounded-chip', TINT[hue])}>
          <Icon size={17} strokeWidth={2.2} aria-hidden />
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        <span
          className={cx('block t-body-strong text-ink', wrap ? 'line-clamp-2' : 'truncate')}
        >
          {title}
        </span>
        {meta ? (
          <span className={cx('mt-0.5 block truncate t-meta text-muted', metaMono && 'mono')}>
            {meta}
          </span>
        ) : null}
      </span>

      {locked ? <Lock size={18} className="text-muted" aria-hidden /> : trailing}
      {chevron && !locked ? <ChevronRight size={20} className="text-muted" aria-hidden /> : null}
    </Tag>
  )
}
