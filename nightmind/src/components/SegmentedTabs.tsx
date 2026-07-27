import { motion } from 'framer-motion'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

export type TabItem<T extends string> = { id: T; label: string }

type Props<T extends string> = {
  items: TabItem<T>[]
  value: T
  onChange: (id: T) => void
  variant?: 'underline' | 'pill'
  ariaLabel: string
  /** Underline rows bleed off the right edge on purpose (§5.2) — never compress. */
  bleed?: boolean
  layoutId?: string
}

export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  variant = 'underline',
  ariaLabel,
  bleed,
  layoutId = 'tab-underline',
}: Props<T>) {
  const m = useMotionProfile()

  if (variant === 'pill') {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="inline-flex shrink-0 items-center gap-0.5 rounded-control bg-fill p-0.5"
      >
        {items.map((item) => {
          const active = item.id === value
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onChange(item.id)}
              className={cx(
                'relative min-h-[32px] rounded-control px-3.5 t-meta font-semibold',
                active ? 'text-ink' : 'text-muted',
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${layoutId}-pill`}
                  transition={m.t(180)}
                  className="absolute inset-0 rounded-control bg-pressed"
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cx(
        'no-scrollbar flex items-end gap-6 overflow-x-auto',
        bleed && '-mr-5 pr-10 md:-mr-8 md:pr-14',
      )}
    >
      {items.map((item) => {
        const active = item.id === value
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cx(
              'relative shrink-0 pb-[10px] t-label whitespace-nowrap',
              active ? 'text-ink' : 'text-muted',
            )}
          >
            {item.label}
            {active ? (
              <motion.span
                layoutId={layoutId}
                transition={m.t(240)}
                className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-accent-solid"
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
