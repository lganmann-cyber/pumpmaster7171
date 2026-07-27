import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store'
import { useMotionProfile } from '../lib/motion'
import { cx } from '../lib/cx'

/** Tap → profile. Profile lives here, not in the nav. */
export function Avatar({ onColor }: { onColor?: boolean }) {
  const name = useApp((s) => s.name)
  const navigate = useNavigate()
  const m = useMotionProfile()
  const initial = (name.trim()[0] ?? 'N').toUpperCase()

  return (
    <motion.button
      type="button"
      onClick={() => navigate('/profile')}
      whileTap={m.press}
      transition={m.t(120)}
      aria-label={name ? `${name} — open profile` : 'Open profile'}
      className={cx(
        'grid size-9 shrink-0 place-items-center rounded-full t-label font-semibold',
        onColor ? 'bg-white/22 text-on backdrop-blur-md' : 'bg-fill text-ink',
      )}
    >
      {initial}
    </motion.button>
  )
}
