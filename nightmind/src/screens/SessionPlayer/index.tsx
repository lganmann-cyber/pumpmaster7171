import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Pause, Play, Timer } from 'lucide-react'
import { useApp } from '../../store'
import { useMotionProfile } from '../../lib/motion'
import { formatDuration } from '../../lib/time'
import { cx } from '../../lib/cx'

const DIM_AFTER_MS = 8000
const TIMERS = [10, 20, 30]

/** Full-screen takeover, near-black regardless of theme. */
export function SessionPlayer() {
  const m = useMotionProfile()
  const sessions = useApp((s) => s.sessions)
  const activeId = useApp((s) => s.activeSessionId)
  const playing = useApp((s) => s.playing)
  const position = useApp((s) => s.positionSec)
  const sleepTimerMin = useApp((s) => s.sleepTimerMin)
  const { closeSession, togglePlay, seek, tick, setSleepTimer } = useApp.getState()

  const [dimmed, setDimmed] = useState(false)
  const idleTimer = useRef<number>()

  const wake = useCallback(() => {
    setDimmed(false)
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => setDimmed(true), DIM_AFTER_MS)
  }, [])

  useEffect(() => {
    wake()
    return () => window.clearTimeout(idleTimer.current)
  }, [wake])

  const session = sessions.find((s) => s.id === activeId)

  useEffect(() => {
    if (!playing || !session) return
    const id = window.setInterval(() => {
      const next = useApp.getState().positionSec + 1
      const timer = useApp.getState().sleepTimerMin
      if (timer && next >= timer * 60) {
        useApp.setState({ playing: false })
        tick(timer * 60)
        return
      }
      if (next >= session.seconds) {
        useApp.setState({ playing: false })
        tick(session.seconds)
      } else {
        tick(next)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [playing, session, tick])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSession()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSession])

  if (!session) return null
  const progress = Math.min(1, position / session.seconds)

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${session.title} session`}
      initial={m.full ? { opacity: 0, y: 24 } : { opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={m.t(320)}
      onPointerMove={wake}
      onPointerDown={wake}
      onKeyDown={wake}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'var(--player-bg)' }}
    >
      {/* Ambient bloom behind a slow-breathing circle */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute size-[min(78vw,420px)] rounded-full"
          style={{
            background: `radial-gradient(circle, var(--player-glow), transparent 68%)`,
          }}
          animate={m.full ? { scale: [1, 1.14, 1], opacity: [0.75, 1, 0.75] } : { opacity: 0.85 }}
          transition={
            m.full ? { duration: 11, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.1 }
          }
        />
        <motion.div
          aria-hidden
          className="size-[min(52vw,260px)] rounded-full border border-hairline"
          style={{ background: 'var(--purple-tint)' }}
          animate={m.full ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={
            m.full ? { duration: 11, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.1 }
          }
        />
      </div>

      <motion.div
        animate={{ opacity: dimmed ? 0.2 : 1 }}
        transition={m.t(600)}
        className="px-5 pb-10 md:px-8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 40px)' }}
      >
        <div className="mx-auto w-full max-w-[560px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="t-label text-purple-bright">{session.kind}</p>
              <h1 className="mt-1 t-title text-ink">{session.title}</h1>
              <p className="mt-2 max-w-[46ch] t-meta text-muted">{session.description}</p>
            </div>
            <button
              type="button"
              onClick={closeSession}
              aria-label="Close session"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-raised text-ink"
            >
              <ChevronDown size={22} aria-hidden />
            </button>
          </div>

          <label className="sr-only" htmlFor="scrub">
            Position
          </label>
          <input
            id="scrub"
            type="range"
            min={0}
            max={session.seconds}
            value={position}
            onChange={(e) => seek(Number(e.target.value))}
            className="mt-7 h-2 w-full appearance-none rounded-full accent-[var(--purple)]"
            style={{
              background: `linear-gradient(to right, var(--purple) ${progress * 100}%, var(--surface-raised) ${progress * 100}%)`,
            }}
          />
          <div className="mt-2 flex justify-between t-clock text-muted">
            <span>{formatDuration(position)}</span>
            <span>{formatDuration(session.seconds)}</span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer size={18} className="text-muted" aria-hidden />
              <span className="sr-only">Sleep timer</span>
              {TIMERS.map((min) => (
                <button
                  key={min}
                  type="button"
                  aria-pressed={sleepTimerMin === min}
                  onClick={() => setSleepTimer(sleepTimerMin === min ? null : min)}
                  className={cx(
                    'min-h-[44px] rounded-full px-3 t-clock',
                    sleepTimerMin === min ? 'bg-purple-tint text-purple-bright' : 'text-muted',
                  )}
                >
                  {min}m
                </button>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={togglePlay}
              whileTap={m.press}
              transition={m.t(120)}
              aria-label={playing ? 'Pause' : 'Play'}
              className="grid size-[72px] place-items-center rounded-full bg-purple text-inverse"
            >
              {playing ? (
                <Pause size={28} fill="currentColor" aria-hidden />
              ) : (
                <Play size={28} fill="currentColor" aria-hidden />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
