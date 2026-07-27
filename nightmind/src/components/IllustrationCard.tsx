import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'
import { useTheme } from '../lib/theme'
import { AMBER_FILTER } from '../lib/art'
import type { IconName } from '../lib/icons'

/**
 * The featured card: a soft illustration on top, a badge over it, then the
 * copy and a read/act row beneath. Used for the daily focus and the Learn
 * feature slot.
 */
export function IllustrationCard({
  art,
  badge,
  eyebrow,
  title,
  body,
  meta,
  metaIcon = 'schedule',
  action,
  onClick,
}: {
  art: string
  badge?: string
  eyebrow?: string
  title: string
  body?: string
  meta?: string
  metaIcon?: IconName
  action?: string
  onClick?: () => void
}) {
  const m = useMotionProfile()
  const amber = useTheme() === 'nightshift'
  const Tag = onClick ? motion.button : motion.div

  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick, whileTap: m.press } : {})}
      transition={m.t(120)}
      className="card w-full overflow-hidden text-left"
    >
      <div className="relative h-[150px] w-full overflow-hidden">
        <img
          src={art}
          alt=""
          aria-hidden
          className="size-full object-cover"
          style={amber ? { filter: AMBER_FILTER } : undefined}
        />
        {badge ? (
          <span className="absolute top-3 left-3 rounded-field bg-accent px-2.5 py-1 t-eyebrow text-white">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 p-5">
        {eyebrow ? (
          <span className="flex items-center gap-1.5 t-eyebrow text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            {eyebrow}
          </span>
        ) : null}
        <h3 className="t-title">{title}</h3>
        {body ? <p className="t-body text-body">{body}</p> : null}
        {meta || action ? (
          <div className="mt-2 flex items-center justify-between gap-3">
            {meta ? (
              <span className="flex items-center gap-1.5 t-meta text-muted">
                <Icon name={metaIcon} size={14} />
                {meta}
              </span>
            ) : (
              <span />
            )}
            {action ? (
              <span className={cx('flex items-center gap-1 t-label text-accent')}>
                {action}
                <Icon name="chevron_right" size={16} />
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Tag>
  )
}
