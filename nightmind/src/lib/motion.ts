import { useEffect, useState } from 'react'
import type { Transition } from 'framer-motion'
import { useApp } from '../store'
import { useTheme } from './theme'

export const EASE = [0.32, 0.72, 0, 1] as const

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export type MotionProfile = {
  /** false when the user, the OS, or Night Shift has turned movement off */
  full: boolean
  /** Night Shift: opacity only, 100ms */
  amber: boolean
  t: (duration: number, delay?: number) => Transition
  /** press feedback for every tappable surface */
  press: { scale: number; opacity: number } | Record<string, never>
}

export function useMotionProfile(): MotionProfile {
  const setting = useApp((s) => s.settings.reducedMotion)
  const os = usePrefersReducedMotion()
  const theme = useTheme()
  const amber = theme === 'nightshift'
  const full = !setting && !os && !amber

  return {
    full,
    amber,
    t: (duration, delay = 0) =>
      full
        ? { duration: duration / 1000, delay: delay / 1000, ease: EASE as unknown as number[] }
        : { duration: amber ? 0.1 : 0, delay: 0 },
    press: full ? { scale: 0.96, opacity: 0.9 } : {},
  }
}
