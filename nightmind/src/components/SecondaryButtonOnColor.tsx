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

/** Tinted button: accent at low opacity with an accent label. */
export function SecondaryButtonOnColor({ children, onClick, full, className }: Props) {
  const m = useMotionProfile()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={m.press}
      transition={m.t(120)}
      className={cx(
        'inline-flex min-h-[44px] items-center justify-center rounded-chip bg-purple-tint px-5',
        't-label text-accent',
        full && 'w-full',
        className,
      )}
    >
      {children}
    </motion.button>
  )
}
