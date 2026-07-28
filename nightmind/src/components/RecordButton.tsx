import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { useMotionProfile } from '../lib/motion'

/**
 * 88px at every size, primary fill, with the blurred halo and the live
 * waveform from the reference. Tap starts recording immediately.
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
    <div className="relative flex items-center justify-center">
      <div className="absolute size-28 rounded-full bg-accent/20 blur-xl" />
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={m.press}
        transition={m.t(120)}
        aria-pressed={recording}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
        className="relative grid size-[88px] place-items-center rounded-full bg-pill text-pill-ink"
      >
        <Icon name={recording ? 'stop_circle' : 'mic'} size={32} fill />
      </motion.button>

      {recording ? (
        <div className="absolute -right-24 flex h-8 items-end gap-1" aria-hidden>
          {[0.1, 0.3, 0.2, 0.4, 0.5].map((delay, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-accent"
              style={{ opacity: [0.4, 0.6, 1, 0.6, 0.4][i] }}
              animate={m.full ? { height: [8, 26, 12, 30, 8] } : { height: 16 }}
              transition={
                m.full
                  ? { duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }
                  : { duration: 0.1 }
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
