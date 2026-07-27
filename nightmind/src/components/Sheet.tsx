import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

/**
 * The sheet model: a 32px-radius container that slides up over a coloured
 * header and overlaps it, separating an active task from the dashboard.
 */
export function Sheet({
  children,
  className,
  overlap = 24,
}: {
  children: ReactNode
  className?: string
  overlap?: number
}) {
  const m = useMotionProfile()
  return (
    <motion.div
      initial={m.full ? { y: 40, opacity: 0 } : { opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={m.t(320)}
      style={{
        marginTop: -overlap,
        borderTopLeftRadius: 'var(--r-sheet)',
        borderTopRightRadius: 'var(--r-sheet)',
      }}
      className={cx('relative z-10 min-h-[60vh] bg-background px-margin pt-md md:px-lg', className)}
    >
      {children}
    </motion.div>
  )
}
