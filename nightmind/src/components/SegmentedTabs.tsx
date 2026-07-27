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
  bleed?: boolean
  layoutId?: string
}

/**
 * Two forms from the reference: the underlined caps row (Tonight) and the
 * outlined pill toggle with a filled primary segment (Signs).
 */
export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  variant = 'underline',
  ariaLabel,
  bleed,
  layoutId = 'tabs',
}: Props<T>) {
  const m = useMotionProfile()

  if (variant === 'pill') {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex shrink-0 rounded-full border border-outline bg-low p-1"
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
                'relative rounded-full px-4 py-1.5 t-label-caps',
                active ? 'text-on-primary-container' : 'text-on-variant',
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${layoutId}-pill`}
                  transition={m.t(180)}
                  className="absolute inset-0 rounded-full bg-primary"
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
        'no-scrollbar flex gap-gutter overflow-x-auto py-2',
        bleed && '-mr-margin pr-margin md:-mr-lg md:pr-lg',
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
              'relative shrink-0 pb-2 t-label-caps whitespace-nowrap',
              active ? 'text-primary' : 'text-on-variant',
            )}
          >
            {item.label}
            {active ? (
              <motion.span
                layoutId={layoutId}
                transition={m.t(240)}
                className="absolute inset-x-0 bottom-0 h-[3px] bg-primary"
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
