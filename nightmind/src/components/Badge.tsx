import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

type Variant = 'solid-on-color' | 'translucent' | 'accent-on-surface'
type Hue = 'purple' | 'blue' | 'orange'

const ACCENT: Record<Hue, { bg: string; fg: string }> = {
  purple: { bg: 'bg-purple-tint', fg: 'text-purple-bright' },
  blue: { bg: 'bg-blue-tint', fg: 'text-blue' },
  orange: { bg: 'bg-orange-tint', fg: 'text-orange' },
}

/** Sentence case only — no all-caps anywhere in this system. */
export function Badge({
  children,
  variant = 'accent-on-surface',
  hue = 'purple',
  className,
}: {
  children: ReactNode
  variant?: Variant
  hue?: Hue
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 t-eyebrow',
        variant === 'solid-on-color' && 'text-on',
        variant === 'translucent' && 'bg-black/40 text-on backdrop-blur-md',
        variant === 'accent-on-surface' && `${ACCENT[hue].bg} ${ACCENT[hue].fg}`,
        className,
      )}
      style={variant === 'solid-on-color' ? { background: 'var(--purple-badge)' } : undefined}
    >
      {children}
    </span>
  )
}
