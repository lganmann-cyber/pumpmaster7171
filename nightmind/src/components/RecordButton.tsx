import { motion } from 'framer-motion'
import { Mic, Square } from 'lucide-react'
import { useMotionProfile } from '../lib/motion'

/**
 * 88px at every size. Tap starts recording immediately — no modal, no picker.
 * Capture is the first thing on the screen and the fastest thing to reach.
 */
export function RecordButton({
  recording,
  onToggle,
}: {
  recording: boolean
  onToggle: () => void
}) {
  const m = useMotionProfile()
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={m.press}
      transition={m.t(120)}
      aria-pressed={recording}
      aria-label={recording ? 'Stop recording' : 'Start recording'}
      className="relative grid size-[88px] shrink-0 place-items-center rounded-full bg-purple text-inverse"
    >
      {m.full && recording ? (
        <motion.span
          className="absolute inset-0 rounded-full bg-purple"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.45 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      ) : null}
      <span className="relative">
        {recording ? (
          <Square size={30} strokeWidth={2} fill="currentColor" aria-hidden />
        ) : (
          <Mic size={32} strokeWidth={2} aria-hidden />
        )}
      </span>
    </motion.button>
  )
}
