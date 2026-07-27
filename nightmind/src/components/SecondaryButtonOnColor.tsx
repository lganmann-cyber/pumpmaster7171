import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

type Props = {
  children: ReactNode
  onClick?: () => void
  full?: boolean
  className?: string
}

/**
 * The pill that sits on a saturated card: light fill, purple label.
 * Both values come from --pill-bg / --pill-ink so Night Shift can swap the
 * whole thing for a raised amber surface without a second component.
 */
export function SecondaryButtonOnColor({ children, onClick, full, className }: Props) {
  const m = useMotionProfile()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={m.press}
      transition={m.t(120)}
      style={{ background: 'var(--pill-bg)', color: 'var(--pill-ink)' }}
      className={cx(
        'inline-flex min-h-[44px] items-center justify-center rounded-full px-5 t-label font-semibold',
        full && 'w-full',
        className,
      )}
    >
      {children}
    </motion.button>
  )
}
