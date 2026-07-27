import { motion } from 'framer-motion'
import { useMotionProfile } from '../../lib/motion'

const BARS = 28

/** Live level meter while recording. Amber mode replaces it with a static bed. */
export function Waveform({ active }: { active: boolean }) {
  const m = useMotionProfile()
  return (
    <div className="flex h-12 items-center justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => {
        const base = 6 + ((i * 7) % 5) * 4
        return (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-purple"
            style={{ height: base }}
            animate={
              active && m.full
                ? { scaleY: [1, 1.1 + ((i * 13) % 9) / 6, 0.7, 1.6, 1] }
                : { scaleY: 1, opacity: active ? 1 : 0.35 }
            }
            transition={
              active && m.full
                ? { duration: 1.1 + (i % 5) * 0.13, repeat: Infinity, ease: 'easeInOut' }
                : m.t(120)
            }
          />
        )
      })}
    </div>
  )
}
