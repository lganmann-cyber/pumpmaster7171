import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import type { AudioSession } from '../lib/types'
import { useMotionProfile } from '../lib/motion'
import { useTheme } from '../lib/theme'

/** Each session gets its own field, so the shelf reads as artwork, not tiles. */
const ART: Record<string, string> = {
  'sess-winddown': 'linear-gradient(150deg, #3a1d5c 0%, #16213e 55%, #0b1020 100%)',
  'sess-intention': 'linear-gradient(150deg, #5c2a6b 0%, #2b1b4d 55%, #10101f 100%)',
  'sess-wbtb': 'linear-gradient(150deg, #123a44 0%, #10233a 55%, #080f1c 100%)',
  'sess-return': 'linear-gradient(150deg, #1d3f2e 0%, #12263a 55%, #080f1c 100%)',
}
const AMBER = 'linear-gradient(150deg, #3a2412 0%, #241708 55%, #0d0805 100%)'

/**
 * The artwork shelf — horizontal snap-scroll of cinematic cards with frosted
 * overlays. It replaces a stack of full-width session rows, which is most of
 * why the evening screen felt crammed.
 */
export function SessionShelf({
  sessions,
  onOpen,
}: {
  sessions: AudioSession[]
  onOpen: (id: string) => void
}) {
  const m = useMotionProfile()
  const amber = useTheme() === 'nightshift'

  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:-mx-8 md:px-8">
      {sessions.map((s) => (
        <motion.button
          key={s.id}
          type="button"
          onClick={() => onOpen(s.id)}
          whileTap={m.press}
          transition={m.t(120)}
          className="w-[168px] shrink-0 snap-start text-left"
        >
          <div
            className="relative h-[200px] w-full overflow-hidden rounded-card"
            style={{ background: amber ? AMBER : (ART[s.id] ?? ART['sess-winddown']) }}
          >
            <span className="absolute top-3 left-3 rounded-full bg-black/40 px-2.5 py-1 t-eyebrow text-white backdrop-blur-md">
              {s.kind}
            </span>
            <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-white/22 backdrop-blur-md">
              <Play size={16} fill="white" className="ml-0.5 text-white" aria-hidden />
            </span>
          </div>
          <p className="mt-2 t-eyebrow text-accent">{Math.round(s.seconds / 60)} min</p>
          <p className="t-label text-ink">{s.title}</p>
          <p className="line-clamp-2 t-meta text-muted">{s.description}</p>
        </motion.button>
      ))}
    </div>
  )
}
