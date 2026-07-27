import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { useMotionProfile } from '../lib/motion'

/**
 * The sheet-over-color pattern — the app's main depth cue. Slides up over a
 * saturated header and overlaps it by 24px. 320ms on [0.32, 0.72, 0, 1].
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
      style={{ marginTop: -overlap, borderTopLeftRadius: 'var(--r-sheet)', borderTopRightRadius: 'var(--r-sheet)' }}
      className={cx('relative z-10 min-h-[60vh] bg-surface px-5 pt-6 md:px-8', className)}
    >
      {children}
    </motion.div>
  )
}
