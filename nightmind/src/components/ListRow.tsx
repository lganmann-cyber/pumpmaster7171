import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'
import type { IconName } from '../lib/icons'
import type { ReactNode } from 'react'

type Tone = 'primary' | 'secondary' | 'tertiary' | 'neutral'

const TILE: Record<Tone, string> = {
  primary: 'bg-primary-container/20 text-primary',
  secondary: 'bg-secondary-container/20 text-secondary',
  tertiary: 'bg-tertiary-container/20 text-tertiary',
  neutral: 'bg-primary-container/10 text-on-variant',
}

/**
 * The journal / lesson row: a 40px rounded-lg glyph tile, a bold body title,
 * mono meta beneath, and a trailing slot. High density, 1px outline.
 */
export function ListRow({
  icon,
  tone = 'primary',
  title,
  meta,
  trailing,
  chevron,
  locked,
  active,
  onClick,
}: {
  icon: IconName
  tone?: Tone
  title: string
  meta?: string
  trailing?: ReactNode
  chevron?: boolean
  locked?: boolean
  active?: boolean
  onClick?: () => void
}) {
  const m = useMotionProfile()
  const interactive = Boolean(onClick) && !locked
  const Tag = interactive ? motion.button : motion.div

  return (
    <Tag
      {...(interactive ? { type: 'button' as const, onClick, whileTap: m.press } : {})}
      transition={m.t(120)}
      aria-disabled={locked || undefined}
      className={cx(
        'flex w-full min-w-0 items-center gap-sm rounded-xl border p-4 text-left',
        active
          ? 'border-primary bg-container shadow-[0_0_20px_-4px_var(--primary)]'
          : 'border-outline-variant bg-low',
        locked && 'border-outline-variant/30 bg-container/50 opacity-60',
      )}
    >
      <span
        className={cx(
          'grid size-10 shrink-0 place-items-center rounded-lg',
          locked ? 'bg-highest text-on-variant' : TILE[tone],
        )}
      >
        <Icon name={locked ? 'lock' : icon} size={22} fill={locked || active} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate t-body-md font-bold text-on-surface">{title}</span>
        {meta ? (
          <span className="mt-1 block truncate t-stats-sm text-on-variant">{meta}</span>
        ) : null}
      </span>

      {trailing ? <span className="shrink-0">{trailing}</span> : null}
      {chevron && !locked ? (
        <span className="shrink-0 text-on-variant opacity-40">
          <Icon name="chevron_right" size={24} />
        </span>
      ) : null}
    </Tag>
  )
}
